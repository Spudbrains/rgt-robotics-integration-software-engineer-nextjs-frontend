'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="text-2xl">📚</div>
              <span className="text-xl font-bold text-gray-900">Bookstore</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            <Link
              href="/books"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/books')
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              Browse Books
            </Link>
            
            <Link
              href="/admin/books"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/admin/books')
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
              }`}
            >
              Manage Books
            </Link>
          </div>

          {/* Right side - could add user menu, search, etc. */}
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              {isActive('/books') && 'Customer View'}
              {isActive('/admin/books') && 'Admin Panel'}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 