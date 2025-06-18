'use client';

import { Book } from '../types/book';
import Link from 'next/link';

interface BookCardProps {
  book: Book;
  showStock?: boolean;
  onSell?: (bookId: string) => void;
}

export default function BookCard({ book, showStock = true, onSell }: BookCardProps) {
  const handleSell = () => {
    if (onSell && book.stock > 0) {
      onSell(book.id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* Book Image */}
      <div className="h-48 bg-gray-200 flex items-center justify-center">
        {book.imageUrl ? (
          <img
            src={book.imageUrl}
            alt={book.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-gray-400 text-4xl">📚</div>
        )}
      </div>

      {/* Book Info */}
      <div className="p-4">
        <Link href={`/pages/books/${book.id}`} className="block">
          <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200 line-clamp-2">
            {book.title}
          </h3>
        </Link>
        
        <p className="text-sm text-gray-600 mt-1">by {book.author}</p>
        
        {book.genre && (
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-2">
            {book.genre}
          </span>
        )}

        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-green-600">
            ${book.price.toFixed(2)}
          </span>
          
          {showStock && (
            <span className={`text-sm px-2 py-1 rounded-full ${
              book.stock > 0 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {book.stock > 0 ? `${book.stock} in stock` : 'Out of stock'}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex gap-2">
          <Link
            href={`/pages/books/${book.id}`}
            className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm"
          >
            View Details
          </Link>
          
          {onSell && book.stock > 0 && (
            <button
              onClick={handleSell}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-200 text-sm"
            >
              Buy Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 