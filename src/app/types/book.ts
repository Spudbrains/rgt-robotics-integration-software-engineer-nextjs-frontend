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