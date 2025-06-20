export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  price: number;
  stock: number;
  description?: string;
  publishedDate?: string;
  genre?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  totalSales?: number;
}

export interface BookListResponse {
  books: Book[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateBookRequest {
  title: string;
  author: string;
  isbn: string;
  price: number;
  stock: number;
  description?: string;
  publishedDate?: string;
  genre?: string;
  imageUrl?: string;
}

export interface UpdateBookRequest extends Partial<CreateBookRequest> {
  id: string;
}

export interface BookSearchParams {
  page?: number;
  limit?: number;
  search?: string;
  genre?: string;
  sortBy?: 'title' | 'author' | 'price' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface Sale {
  id: string;
  bookId: string;
  book: Book;
  quantity: number;
  totalPrice: number;
  saleDate: string;
}

export interface SalesResponse {
  sales: Sale[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SalesSearchParams {
  page?: number;
  limit?: number;
  bookId?: string;
} 