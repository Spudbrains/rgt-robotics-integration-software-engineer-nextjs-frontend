import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import BookCard from '../components/BookCard'
import SearchBar from '../components/SearchBar'
import Pagination from '../components/Pagination'
import { mockBook } from './book.test'

// Mock the API module
jest.mock('../services/api', () => ({
  bookApi: {
    sellBook: jest.fn(),
  },
}))

describe('BookCard Component', () => {
  const mockOnSell = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders book information correctly', () => {
    render(<BookCard book={mockBook} onSell={mockOnSell} />)

    expect(screen.getByText(mockBook.title)).toBeInTheDocument()
    expect(screen.getByText(`by ${mockBook.author}`)).toBeInTheDocument()
    expect(screen.getByText(`$${mockBook.price.toFixed(2)}`)).toBeInTheDocument()
    expect(screen.getByText(`${mockBook.stock} in stock`)).toBeInTheDocument()
  })

  test('shows out of stock when stock is 0', () => {
    const outOfStockBook = { ...mockBook, stock: 0 }
    render(<BookCard book={outOfStockBook} onSell={mockOnSell} />)

    expect(screen.getByText('Out of stock')).toBeInTheDocument()
  })

  test('calls onSell when buy button is clicked', () => {
    render(<BookCard book={mockBook} onSell={mockOnSell} />)

    const buyButton = screen.getByText('Buy Now')
    fireEvent.click(buyButton)

    expect(mockOnSell).toHaveBeenCalledWith(mockBook.id)
  })

  test('does not show buy button when stock is 0', () => {
    const outOfStockBook = { ...mockBook, stock: 0 }
    render(<BookCard book={outOfStockBook} onSell={mockOnSell} />)

    expect(screen.queryByText('Buy Now')).not.toBeInTheDocument()
  })

  test('renders genre tag when available', () => {
    render(<BookCard book={mockBook} onSell={mockOnSell} />)

    expect(screen.getByText(mockBook.genre!)).toBeInTheDocument()
  })

  test('does not render genre tag when not available', () => {
    const bookWithoutGenre = { ...mockBook, genre: undefined }
    render(<BookCard book={bookWithoutGenre} onSell={mockOnSell} />)

    expect(screen.queryByText('Fiction')).not.toBeInTheDocument()
  })
})

describe('SearchBar Component', () => {
  const mockOnSearch = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders search input', () => {
    render(<SearchBar onSearch={mockOnSearch} />)

    expect(screen.getByPlaceholderText('Search books by title or author...')).toBeInTheDocument()
  })

  test('calls onSearch with debounced input', async () => {
    jest.useFakeTimers()
    render(<SearchBar onSearch={mockOnSearch} />)

    const searchInput = screen.getByPlaceholderText('Search books by title or author...')
    fireEvent.change(searchInput, { target: { value: 'test search' } })

    // Fast-forward timers to trigger debounced search
    jest.runAllTimers()

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('test search')
    })

    jest.useRealTimers()
  })

  test('uses custom placeholder when provided', () => {
    const customPlaceholder = 'Custom search placeholder'
    render(<SearchBar onSearch={mockOnSearch} placeholder={customPlaceholder} />)

    expect(screen.getByPlaceholderText(customPlaceholder)).toBeInTheDocument()
  })
})

describe('Pagination Component', () => {
  const mockOnPageChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders pagination controls', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    )

    expect(screen.getByText('Previous')).toBeInTheDocument()
    expect(screen.getByText('Next')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  test('does not render when totalPages is 1', () => {
    const { container } = render(
      <Pagination
        currentPage={1}
        totalPages={1}
        onPageChange={mockOnPageChange}
      />
    )

    expect(container.firstChild).toBeNull()
  })

  test('calls onPageChange when page number is clicked', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    )

    const page2Button = screen.getByText('2')
    fireEvent.click(page2Button)

    expect(mockOnPageChange).toHaveBeenCalledWith(2)
  })

  test('calls onPageChange when next button is clicked', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    )

    const nextButton = screen.getByText('Next')
    fireEvent.click(nextButton)

    expect(mockOnPageChange).toHaveBeenCalledWith(2)
  })

  test('calls onPageChange when previous button is clicked', () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    )

    const previousButton = screen.getByText('Previous')
    fireEvent.click(previousButton)

    expect(mockOnPageChange).toHaveBeenCalledWith(1)
  })

  test('disables previous button on first page', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    )

    const previousButton = screen.getByText('Previous')
    expect(previousButton).toBeDisabled()
  })

  test('disables next button on last page', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    )

    const nextButton = screen.getByText('Next')
    expect(nextButton).toBeDisabled()
  })

  test('shows ellipsis for large page counts', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    )

    expect(screen.getByText('...')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
  })
}) 