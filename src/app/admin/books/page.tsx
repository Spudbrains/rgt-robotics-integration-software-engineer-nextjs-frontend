'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import { Book, CreateBookRequest } from '../../types/book';
import { bookApi } from '../../services/api';
import BookCard from '../../components/BookCard';
import SearchBar from '../../components/SearchBar';
import Pagination from '../../components/Pagination';
import Link from 'next/link';

interface BookFormData extends CreateBookRequest {
  id?: string;
}

function AdminBooksContent() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const [isInitialized, setIsInitialized] = useState(false);

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState<BookFormData>({
    title: '',
    author: '',
    isbn: '',
    price: 0,
    stock: 0,
    description: '',
    genre: '',
    imageUrl: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const urlPage = parseInt(searchParams.get('page') || '0');
    const urlSearch = searchParams.get('search') || '';
    setCurrentPage(urlPage);
    setSearchQuery(urlSearch);
    setIsInitialized(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      const response = await bookApi.getBooks({
        page: currentPage,
        limit: 10,
        search: searchQuery || undefined,
      });
      setBooks(response.books);
      setTotalPages(response.totalPages);
      setTotalBooks(response.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch books');
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery]);

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

  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      isbn: '',
      price: 0,
      stock: 0,
      description: '',
      genre: '',
      imageUrl: '',
    });
    setEditingBook(null);
  };

  const handleAddBook = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEditBook = (book: Book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      price: book.price,
      stock: book.stock,
      description: book.description || '',
      genre: book.genre || '',
      imageUrl: book.imageUrl || '',
    });
    setShowForm(true);
  };

  const handleDeleteBook = async (bookId: string) => {
    if (!confirm('Are you sure you want to delete this book?')) return;

    try {
      await bookApi.deleteBook(bookId);
      
      // Update local state immediately
      setBooks(prevBooks => prevBooks.filter(book => book.id !== bookId));
      setTotalBooks(prevTotal => prevTotal - 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete book');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      if (editingBook) {
        const updatedBook = await bookApi.updateBook(editingBook.id, formData);
        
        // Update local state immediately for edits
        setBooks(prevBooks => 
          prevBooks.map(book => 
            book.id === editingBook.id 
              ? { ...book, ...formData, id: book.id, createdAt: book.createdAt, updatedAt: updatedBook.updatedAt }
              : book
          )
        );
      } else {
        const newBook = await bookApi.createBook(formData);
        
        // Add new book to local state
        setBooks(prevBooks => [newBook, ...prevBooks]);
        setTotalBooks(prevTotal => prevTotal + 1);
      }
      setShowForm(false);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save book');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value,
    }));
  };
  
  // The rest of the return statement...
  return (
    <div className="min-h-screen bg-gray-50 py-4">
      {/* Main container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
            <p className="text-gray-600">Manage your bookstore inventory</p>
          </div>
          <div className="flex space-x-4">
            <Link
              href="/admin/sales"
              className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
            >
              View Sales Analytics
            </Link>
            <button
              onClick={handleAddBook}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Add New Book
            </button>
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6">{editingBook ? 'Edit Book' : 'Add New Book'}</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Title */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                        <input type="text" name="title" id="title" required value={formData.title} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black" />
                    </div>

                    {/* Author */}
                    <div>
                        <label htmlFor="author" className="block text-sm font-medium text-gray-700">Author</label>
                        <input type="text" name="author" id="author" required value={formData.author} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black" />
                    </div>
                </div>

                {/* ISBN */}
                <div>
                    <label htmlFor="isbn" className="block text-sm font-medium text-gray-700">ISBN</label>
                    <input type="text" name="isbn" id="isbn" required value={formData.isbn} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Price */}
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                        <input type="number" name="price" id="price" required value={formData.price} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black" />
                    </div>

                    {/* Stock */}
                    <div>
                        <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock</label>
                        <input type="number" name="stock" id="stock" required value={formData.stock} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black" />
                    </div>
                </div>

                {/* Genre */}
                <div>
                    <label htmlFor="genre" className="block text-sm font-medium text-gray-700">Genre</label>
                    <input type="text" name="genre" id="genre" value={formData.genre} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black" />
                </div>

                {/* Image URL */}
                <div>
                    <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Image URL</label>
                    <input type="text" name="imageUrl" id="imageUrl" value={formData.imageUrl} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black" />
                </div>

                {/* Description */}
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea name="description" id="description" value={formData.description} onChange={handleInputChange} rows={4} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"></textarea>
                </div>
                
                {error && <p className="text-red-500 text-sm">{error}</p>}

                <div className="flex justify-end space-x-4">
                  <button type="button" onClick={() => setShowForm(false)} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300">
                    {submitting ? 'Saving...' : 'Save Book'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar onSearch={handleSearch} className="max-w-md" />
        </div>
        
        {error && !showForm && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Loading or Content */}
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
                  <div key={book.id} className="relative">
                    <BookCard book={book} />
                    <div className="absolute top-2 right-2 space-x-2">
                      <button onClick={() => handleEditBook(book)} className="bg-white p-1.5 rounded-full shadow-md hover:bg-gray-100">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z" /></svg>
                      </button>
                      <button onClick={() => handleDeleteBook(book.id)} className="bg-white p-1.5 rounded-full shadow-md hover:bg-gray-100">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900">No books found</h3>
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

export default function AdminBooksPage() {
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
      <AdminBooksContent />
    </Suspense>
  );
}

