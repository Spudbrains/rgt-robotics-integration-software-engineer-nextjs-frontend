'use client';

import { Book } from '../types/book';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

interface BookCardProps {
  book: Book;
  showStock?: boolean;
  onSell?: (bookId: string) => void;
}

export default function BookCard({ book, showStock = true, onSell }: BookCardProps) {
  const [imageError, setImageError] = useState(false);

  const handleSell = () => {
    if (onSell && book.stock > 0) {
      onSell(book.id);
    }
  };

  const handleImageError = () => {
    console.error('Failed to load image:', book.imageUrl);
    setImageError(true);
  };
  
  const placeholderImage = `https://via.placeholder.com/300x200.png?text=${encodeURIComponent(book.title)}`;
  const imageUrl = imageError ? placeholderImage : (book.imageUrl || placeholderImage);

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* Book Image */}
      <div className="h-48 bg-gray-200 flex items-center justify-center">
        <Image
          src={imageUrl}
          alt={book.title}
          width={300}
          height={200}
          className="w-full h-full object-cover"
          onError={handleImageError}
          placeholder="blur"
          blurDataURL="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
        />
      </div>

      {/* Book Info */}
      <div className="p-4">
        <Link href={`/books/${book.id}`} className="block">
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

        {/* Sales Information */}
        {book.totalSales !== undefined && book.totalSales > 0 && (
          <div className="mt-2 flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span>{book.totalSales} sold</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-4 flex gap-2">
          <Link
            href={`/books/${book.id}`}
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