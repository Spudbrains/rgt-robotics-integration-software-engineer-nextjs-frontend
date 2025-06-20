'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import { Book, BookListResponse } from '../types/book';
import { bookApi } from '../services/api';
import BookCard from '../components/BookCard';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';

function BookListContent() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  
  // Use local state for pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'title' | 'author' | 'price' | 'createdAt'>('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // State to ensure initialization runs only once, robustly.
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize state from URL parameters on mount only
  useEffect(() => {
    const urlPage = parseInt(searchParams.get('page') || '0', 10);
    const urlSearch = searchParams.get('search') || '';
    const urlSortBy = (searchParams.get('sortBy') as 'title' | 'author' | 'price' | 'createdAt') || 'title';
    const urlSortOrder = (searchParams.get('sortOrder') as 'asc' | 'desc') || 'asc';
    
    setCurrentPage(urlPage);
    setSearchQuery(urlSearch);
    setSortBy(urlSortBy);
    setSortOrder(urlSortOrder);
    setIsInitialized(true);
  }, []); // Correct: Empty dependency array ensures this runs only once on mount.

  const updateURL = useCallback((params: Record<string, string>) => {
    const newSearchParams = new URLSearchParams(window.location.search);
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newSearchParams.set(key, value);
      } else {
        newSearchParams.delete(key);
      }
    });
    const newURL = `${pathname}?${newSearchParams.toString()}`;
    window.history.replaceState({ ...window.history.state, as: newURL, url: newURL }, '', newURL);
  }, [pathname]);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response: BookListResponse = await bookApi.getBooks({
        page: currentPage,
        limit: 10,
        search: searchQuery || undefined,
        sortBy,
        sortOrder,
      });
      setBooks(response.books);
      setTotalPages(response.totalPages);
      setTotalBooks(response.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch books');
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, sortBy, sortOrder]);

  // Data fetching effect
  useEffect(() => {
    if (isInitialized) {
      fetchBooks();
    }
  }, [isInitialized, fetchBooks]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateURL({ page: page.toString() });
  };
  
  const handleSearch = useCallback((query: string) => {
    setCurrentPage(0);
    setSearchQuery(query);
    updateURL({ search: query, page: '0' });
  }, [updateURL]);

  const handleSortChange = (newSortBy: typeof sortBy) => {
    if (sortBy === newSortBy) {
      const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
      setSortOrder(newSortOrder);
      updateURL({ sortOrder: newSortOrder });
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
      updateURL({ sortBy: newSortBy, sortOrder: 'asc' });
    }
  };

  const handleSell = async (bookId: string) => {
    try {
      await bookApi.sellBook(bookId, 1);
      fetchBooks(); // Re-fetch to update stock
    } catch (err) {
      console.error('Error selling book:', err);
      setError(err instanceof Error ? err.message : 'Failed to sell book');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bookstore</h1>
          <p className="text-gray-600">Discover your next favorite book</p>
        </div>

        <div className="mb-6 space-y-4">
          <SearchBar onSearch={handleSearch} className="max-w-md" />
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

        {loading ? (
           <div className="flex items-center justify-center h-64">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
           </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600">
              Showing {books.length} of {totalBooks} books
            </div>

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

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
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

