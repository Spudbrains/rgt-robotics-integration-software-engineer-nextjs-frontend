'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Book } from '../../types/book';
import { bookApi } from '../../services/api';
import Link from 'next/link';
import Image from 'next/image';

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = params.id as string;
  
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selling, setSelling] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        setError(null);
        const bookData = await bookApi.getBook(bookId);
        setBook(bookData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch book details');
        console.error('Error fetching book:', err);
      } finally {
        setLoading(false);
      }
    };

    if (bookId) {
      fetchBook();
    }
  }, [bookId]);

  const handleSell = async () => {
    if (!book || book.stock <= 0) return;

    try {
      setSelling(true);
      await bookApi.sellBook(book.id, 1);
      // Update the book data to reflect the new stock
      const updatedBook = await bookApi.getBook(book.id);
      setBook(updatedBook);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sell book');
      console.error('Error selling book:', err);
    } finally {
      setSelling(false);
    }
  };

  const handleBackToList = () => {
    router.push('/books');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-gray-50 py-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="text-red-400 text-6xl mb-4">❌</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Book not found</h3>
            <p className="text-gray-600 mb-6">{error || 'The book you are looking for does not exist.'}</p>
            <button
              onClick={handleBackToList}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Back to Book List
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={handleBackToList}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Book List
        </button>

        {/* Book Details */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Book Image */}
            <div className="md:w-1/3">
              <div className="h-96 md:h-full bg-gray-200 flex items-center justify-center">
                {book.imageUrl ? (
                  <Image
                    src={book.imageUrl}
                    alt={book.title}
                    width={384}
                    height={512}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-400 text-8xl">📚</div>
                )}
              </div>
            </div>

            {/* Book Information */}
            <div className="md:w-2/3 p-6">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
                <p className="text-xl text-gray-600 mb-4">by {book.author}</p>
                
                {book.genre && (
                  <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full mb-4">
                    {book.genre}
                  </span>
                )}

                <div className="flex items-center justify-between mb-6">
                  <div className="text-3xl font-bold text-green-600">
                    ${book.price.toFixed(2)}
                  </div>
                  <div className={`text-lg px-4 py-2 rounded-full ${
                    book.stock > 0 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {book.stock > 0 ? `${book.stock} in stock` : 'Out of stock'}
                  </div>
                </div>

                {book.description && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-700 leading-relaxed">{book.description}</p>
                  </div>
                )}

                {/* Book Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <span className="text-sm font-medium text-gray-500">ISBN</span>
                    <p className="text-gray-900">{book.isbn}</p>
                  </div>
                  {book.publishedDate && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Published</span>
                      <p className="text-gray-900">{new Date(book.publishedDate).toLocaleDateString()}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-sm font-medium text-gray-500">Added</span>
                    <p className="text-gray-900">{new Date(book.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Last Updated</span>
                    <p className="text-gray-900">{new Date(book.updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleSell}
                  disabled={book.stock <= 0 || selling}
                  className="flex-1 bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {selling ? 'Processing...' : book.stock > 0 ? 'Buy Now' : 'Out of Stock'}
                </button>
                
                <Link
                  href={`/admin/books`}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors font-medium text-center"
                >
                  Manage Books
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
