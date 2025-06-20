import { Book, BookListResponse, CreateBookRequest, BookSearchParams } from '../types/book';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

console.log('API_BASE_URL:', API_BASE_URL);
console.log('process.env.NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorMessage = await response.text().catch(() => 'An error occurred');
    throw new ApiError(response.status, errorMessage);
  }
  return response.json();
}

export const bookApi = {
  // Get all books with pagination and search
  async getBooks(params: BookSearchParams = {}): Promise<BookListResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.search) searchParams.append('search', params.search);
    if (params.genre) searchParams.append('genre', params.genre);
    if (params.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params.sortOrder) searchParams.append('sortOrder', params.sortOrder);

    const url = `${API_BASE_URL}/books?${searchParams.toString()}`;
    
    // Debug logging
    console.log('API Request - URL:', url);
    console.log('API Request - Params:', params);
    
    const response = await fetch(url);
    const data = await handleResponse<BookListResponse>(response);
    
    // Debug logging
    console.log('API Response - Data:', data);
    console.log('API Response - Current Page:', data.page);
    console.log('API Response - Total Pages:', data.totalPages);
    
    return data;
  },

  // Get a single book by ID
  async getBook(id: string): Promise<Book> {
    const response = await fetch(`${API_BASE_URL}/books/${id}`);
    return handleResponse<Book>(response);
  },

  // Create a new book
  async createBook(bookData: CreateBookRequest): Promise<Book> {
    const response = await fetch(`${API_BASE_URL}/books`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookData),
    });
    return handleResponse<Book>(response);
  },

  // Update an existing book
  async updateBook(id: string, bookData: Partial<CreateBookRequest>): Promise<Book> {
    const response = await fetch(`${API_BASE_URL}/books/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookData),
    });
    return handleResponse<Book>(response);
  },

  // Delete a book
  async deleteBook(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/books/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const errorMessage = await response.text().catch(() => 'An error occurred');
      throw new ApiError(response.status, errorMessage);
    }
  },

  // Update book stock
  async updateStock(id: string, stock: number): Promise<Book> {
    const response = await fetch(`${API_BASE_URL}/books/${id}/stock`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ stock }),
    });
    return handleResponse<Book>(response);
  },

  // Sell a book (decrease stock)
  async sellBook(id: string, quantity: number = 1): Promise<Book> {
    const response = await fetch(`${API_BASE_URL}/books/${id}/sell`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quantity }),
    });
    return handleResponse<Book>(response);
  },
}; 