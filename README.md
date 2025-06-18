# Bookstore Frontend Application

A modern, responsive web application for managing an online bookstore built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

### Customer Features
- **Book List Page**: Browse books with pagination (10 per page)
- **Search & Filter**: Search books by title or author
- **Sorting**: Sort by title, author, price, or date added
- **Book Details**: View comprehensive book information
- **Purchase**: Buy books directly from the interface
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

### Admin Features
- **Book Management**: Add, edit, and delete books
- **Stock Management**: Update book inventory levels
- **Search & Filter**: Find books quickly in the admin interface
- **Form Validation**: Comprehensive input validation
- **Real-time Updates**: Immediate feedback on all operations

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Testing**: Jest & React Testing Library
- **API**: RESTful API integration
- **State Management**: React Hooks
- **Routing**: Next.js App Router

## 📁 Project Structure

```
src/app/
├── components/          # Reusable UI components
│   ├── BookCard.tsx    # Book display card
│   ├── SearchBar.tsx   # Search functionality
│   └── Pagination.tsx  # Page navigation
├── pages/              # Application pages
│   ├── books/          # Book-related pages
│   │   ├── index.tsx   # Book list page
│   │   └── [id].tsx    # Book detail page
│   └── admin/          # Admin pages
│       └── books.tsx   # Book management
├── services/           # API service functions
│   └── api.ts         # Book API integration
├── types/              # TypeScript type definitions
│   └── book.ts        # Book-related interfaces
├── tests/              # Test files
│   ├── book.test.ts   # Unit tests
│   └── components.test.tsx # Component tests
└── styles/             # Global styles
    └── globals.css    # Tailwind CSS imports
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd rgt-robotics-integration-software-engineer-nextjs-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 API Integration

The frontend expects a RESTful API with the following endpoints:

### Book Endpoints
- `GET /api/books` - Get all books with pagination and search
- `GET /api/books/:id` - Get a specific book
- `POST /api/books` - Create a new book
- `PUT /api/books/:id` - Update a book
- `DELETE /api/books/:id` - Delete a book
- `PATCH /api/books/:id/stock` - Update book stock
- `POST /api/books/:id/sell` - Sell a book (decrease stock)

### Query Parameters
- `page` - Page number for pagination
- `limit` - Number of items per page
- `search` - Search term for title/author
- `genre` - Filter by genre
- `sortBy` - Sort field (title, author, price, createdAt)
- `sortOrder` - Sort direction (asc, desc)

## 🧪 Testing

This project uses **Jest** and **React Testing Library** for unit and component testing.

### Test Scripts
- Run all tests:
  ```bash
  npm test
  ```
- Run tests in watch mode:
  ```bash
  npm run test:watch
  ```
- Run tests with coverage report:
  ```bash
  npm run test:coverage
  ```

### Test Files
- `src/app/tests/book.test.ts` – Unit tests for types and logic
- `src/app/tests/components.test.tsx` – Component tests for UI components

### Configuration
- Jest is configured via `jest.config.js` and `jest.setup.js` for Next.js and React Testing Library compatibility.

## 🎨 Styling

This project uses Tailwind CSS for styling. The design is:
- **Responsive**: Mobile-first approach
- **Accessible**: WCAG compliant color contrasts
- **Modern**: Clean, professional interface
- **Consistent**: Unified design system

## 🔧 Configuration

### Tailwind CSS
The project uses the latest Tailwind CSS v4 with the new `@import "tailwindcss"` syntax.

### TypeScript
Strict TypeScript configuration with comprehensive type definitions for all data structures.

### Next.js
- App Router for modern routing
- Server-side rendering capabilities
- Optimized for performance

## 📱 Pages

### `/` (Home)
- Redirects to `/pages/books`
- Loading screen during redirect

### `/pages/books` (Book List)
- Display all books in a grid layout
- Search and filtering capabilities
- Pagination (10 books per page)
- Sort by various criteria
- Purchase functionality

### `/pages/books/[id]` (Book Detail)
- Comprehensive book information
- Purchase button
- Link to admin management
- Responsive layout

### `/pages/admin/books` (Admin Management)
- Full CRUD operations for books
- Modal forms for add/edit
- Delete confirmation
- Search and pagination
- Stock management

## 🔒 Security Features

- Input validation on all forms
- XSS protection through React
- CSRF protection via Next.js
- Secure API communication
- Error handling and user feedback

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
The application can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- DigitalOcean App Platform
- Self-hosted servers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is created for the Robotics Integration Software Engineer position at RGT Robotics.

## 🆘 Support

For questions or issues:
1. Check the documentation
2. Review existing issues
3. Create a new issue with detailed information

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**
