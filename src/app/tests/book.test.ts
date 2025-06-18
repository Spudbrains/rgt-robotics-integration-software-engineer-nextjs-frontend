import { Book, CreateBookRequest } from '../types/book';

// Mock book data for testing
export const mockBook: Book = {
  id: '1',
  title: 'Test Book',
  author: 'Test Author',
  isbn: '1234567890123',
  price: 29.99,
  stock: 10,
  description: 'A test book for testing purposes',
  genre: 'Fiction',
  imageUrl: 'https://example.com/book.jpg',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

export const mockCreateBookRequest: CreateBookRequest = {
  title: 'New Test Book',
  author: 'New Test Author',
  isbn: '9876543210987',
  price: 19.99,
  stock: 5,
  description: 'A new test book',
  genre: 'Non-Fiction',
  imageUrl: 'https://example.com/new-book.jpg',
};

// Test suite for Book interface
describe('Book Interface', () => {
  test('should have all required properties', () => {
    expect(mockBook).toHaveProperty('id');
    expect(mockBook).toHaveProperty('title');
    expect(mockBook).toHaveProperty('author');
    expect(mockBook).toHaveProperty('isbn');
    expect(mockBook).toHaveProperty('price');
    expect(mockBook).toHaveProperty('stock');
    expect(mockBook).toHaveProperty('createdAt');
    expect(mockBook).toHaveProperty('updatedAt');
  });

  test('should have correct data types', () => {
    expect(typeof mockBook.id).toBe('string');
    expect(typeof mockBook.title).toBe('string');
    expect(typeof mockBook.author).toBe('string');
    expect(typeof mockBook.isbn).toBe('string');
    expect(typeof mockBook.price).toBe('number');
    expect(typeof mockBook.stock).toBe('number');
    expect(typeof mockBook.createdAt).toBe('string');
    expect(typeof mockBook.updatedAt).toBe('string');
  });

  test('should have optional properties', () => {
    expect(mockBook.description).toBeDefined();
    expect(mockBook.genre).toBeDefined();
    expect(mockBook.imageUrl).toBeDefined();
  });
});

// Test suite for CreateBookRequest interface
describe('CreateBookRequest Interface', () => {
  test('should have all required properties', () => {
    expect(mockCreateBookRequest).toHaveProperty('title');
    expect(mockCreateBookRequest).toHaveProperty('author');
    expect(mockCreateBookRequest).toHaveProperty('isbn');
    expect(mockCreateBookRequest).toHaveProperty('price');
    expect(mockCreateBookRequest).toHaveProperty('stock');
  });

  test('should not have id property', () => {
    expect(mockCreateBookRequest).not.toHaveProperty('id');
  });

  test('should have correct data types', () => {
    expect(typeof mockCreateBookRequest.title).toBe('string');
    expect(typeof mockCreateBookRequest.author).toBe('string');
    expect(typeof mockCreateBookRequest.isbn).toBe('string');
    expect(typeof mockCreateBookRequest.price).toBe('number');
    expect(typeof mockCreateBookRequest.stock).toBe('number');
  });
});

// Test suite for book validation
describe('Book Validation', () => {
  test('should validate book with all required fields', () => {
    const validBook: Book = {
      id: '1',
      title: 'Valid Book',
      author: 'Valid Author',
      isbn: '1234567890123',
      price: 25.00,
      stock: 5,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    };

    expect(validBook.id).toBeTruthy();
    expect(validBook.title.length).toBeGreaterThan(0);
    expect(validBook.author.length).toBeGreaterThan(0);
    expect(validBook.isbn.length).toBeGreaterThan(0);
    expect(validBook.price).toBeGreaterThan(0);
    expect(validBook.stock).toBeGreaterThanOrEqual(0);
  });

  test('should handle zero stock', () => {
    const bookWithZeroStock: Book = {
      ...mockBook,
      stock: 0,
    };

    expect(bookWithZeroStock.stock).toBe(0);
  });

  test('should handle decimal prices', () => {
    const bookWithDecimalPrice: Book = {
      ...mockBook,
      price: 19.99,
    };

    expect(bookWithDecimalPrice.price).toBe(19.99);
  });
});

// Test suite for book operations
describe('Book Operations', () => {
  test('should calculate total value', () => {
    const totalValue = mockBook.price * mockBook.stock;
    expect(totalValue).toBe(299.9);
  });

  test('should check if book is in stock', () => {
    const isInStock = mockBook.stock > 0;
    expect(isInStock).toBe(true);
  });

  test('should check if book is out of stock', () => {
    const outOfStockBook: Book = {
      ...mockBook,
      stock: 0,
    };
    const isOutOfStock = outOfStockBook.stock === 0;
    expect(isOutOfStock).toBe(true);
  });

  test('should format price correctly', () => {
    const formattedPrice = `$${mockBook.price.toFixed(2)}`;
    expect(formattedPrice).toBe('$29.99');
  });
}); 