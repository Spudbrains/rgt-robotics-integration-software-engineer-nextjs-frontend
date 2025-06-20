'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Book, BookListResponse } from '../types/book';
import { bookApi } from '../services/api';
import BookCard from '../components/BookCard';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';

function BookListContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  
  // Get state from URL parameters
  const currentPage = parseInt(searchParams.get('page') || '0');
  const searchQuery = searchParams.get('search') || '';
  const sortBy = (searchParams.get('sortBy') as 'title' | 'author' | 'price' | 'createdAt') || 'title';
  const sortOrder = (searchParams.get('sortOrder') as 'asc' | 'desc') || 'asc';

  // Debug URL parameters on every render
  console.log('Books: URL Parameters on render:', {
    page: searchParams.get('page'),
    search: searchParams.get('search'),
    sortBy: searchParams.get('sortBy'),
    sortOrder: searchParams.get('sortOrder'),
    currentPage,
    searchQuery,
    sortBy: sortBy,
    sortOrder: sortOrder
  });

  // Track URL parameter changes
  useEffect(() => {
    console.log('Books: URL parameters changed:', {
      page: searchParams.get('page'),
      search: searchParams.get('search'),
      sortBy: searchParams.get('sortBy'),
      sortOrder: searchParams.get('sortOrder')
    });
  }, [searchParams]);

  const updateURL = useCallback((params: Record<string, string>) => {
    console.log('Books: updateURL called with params:', params);
    const newSearchParams = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newSearchParams.set(key, value);
      } else {
        newSearchParams.delete(key);
      }
    });
    const newURL = `${pathname}?${newSearchParams.toString()}`;
    console.log('Books: Navigating to new URL:', newURL);
    
    // Use replace with scroll: false to prevent auto-scroll
    router.replace(newURL, { scroll: false });
  }, [searchParams, router, pathname]);

  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching books with params:', { currentPage, searchQuery, sortBy, sortOrder });
      
      const response: BookListResponse = await bookApi.getBooks({
        page: currentPage,
        limit: 10,
        search: searchQuery || undefined,
        sortBy,
        sortOrder,
      });

      console.log('Received response:', response);
      console.log('Setting books, totalPages, totalBooks:', {
        booksCount: response.books.length,
        totalPages: response.totalPages,
        total: response.total
      });

      setBooks(response.books);
      setTotalPages(response.totalPages);
      setTotalBooks(response.total);
      
      // Restore scroll position after content update
      setTimeout(() => {
        const savedScrollY = sessionStorage.getItem('scrollY');
        if (savedScrollY) {
          window.scrollTo(0, parseInt(savedScrollY));
        }
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch books');
      console.error('Error fetching books:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, sortBy, sortOrder]);

  useEffect(() => {
    console.log('Books: useEffect triggered - fetching books for page:', currentPage);
    fetchBooks();
  }, [fetchBooks]);

  const handleSearch = (query: string) => {
    updateURL({ search: query, page: '0' }); // Reset to first page when searching
  };

  const handlePageChange = (page: number) => {
    console.log('Books: handlePageChange called with page:', page);
    console.log('Books: Current URL params before update:', {
      page: searchParams.get('page'),
      search: searchParams.get('search'),
      sortBy: searchParams.get('sortBy'),
      sortOrder: searchParams.get('sortOrder')
    });
    
    // Save current scroll position before navigation
    sessionStorage.setItem('scrollY', window.scrollY.toString());
    
    updateURL({ page: page.toString() });
  };

  // Save scroll position on scroll
  useEffect(() => {
    const handleScroll = () => {
      sessionStorage.setItem('scrollY', window.scrollY.toString());
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSell = async (bookId: string) => {
    try {
      await bookApi.sellBook(bookId, 1);
      // Refresh the book list to update stock
      fetchBooks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sell book');
      console.error('Error selling book:', err);
    }
  };

  const handleSortChange = (newSortBy: typeof sortBy) => {
    if (sortBy === newSortBy) {
      const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
      updateURL({ sortOrder: newSortOrder });
    } else {
      updateURL({ sortBy: newSortBy, sortOrder: 'asc' });
    }
  };

  if (loading && books.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bookstore</h1>
          <p className="text-gray-600">Discover your next favorite book</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <SearchBar onSearch={handleSearch} className="max-w-md" />
          
          {/* Sort Options */}
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            {[
              { key: 'title', label: 'Title' },
              { key: 'author', label: 'Author' },
              { key: 'price', label: 'Price' },
              { key: 'createdAt', label: 'Date Added' },
            ].map((option) => (
              <button
                key={option.key}
                onClick={() => handleSortChange(option.key as typeof sortBy)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  sortBy === option.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {option.label}
                {sortBy === option.key && (
                  <span className="ml-1">
                    {sortOrder === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-4 text-sm text-gray-600">
          Showing {books.length} of {totalBooks} books
        </div>

        {/* Books Grid */}
        {books.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onSell={handleSell}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📚</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No books found</h3>
            <p className="text-gray-600">
              {searchQuery ? 'Try adjusting your search terms.' : 'No books available at the moment.'}
            </p>
          </div>
        )}

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}

export default function BookListPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    }>
      <BookListContent />
    </Suspense>
  );
}

