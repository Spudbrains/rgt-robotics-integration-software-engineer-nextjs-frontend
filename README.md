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
├── books/              # Book-related pages
│   ├── page.tsx        # Book list page
│   └── [id]/           # Book detail page
│       └── page.tsx    # Individual book page
├── admin/              # Admin pages
│   └── books/          # Book management
│       └── page.tsx    # Admin book management
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

## 🐧 Ubuntu 18.04 Setup Guide

This guide will help you set up the development environment on a freshly installed Ubuntu 18.04 system.

### Step 1: Update System Packages
```bash
sudo apt update
sudo apt upgrade -y
```

### Step 2: Install Essential Build Tools
```bash
sudo apt install -y build-essential curl wget git unzip
```

### Step 3: Install Node.js 18.x (LTS)

**Option A: Using NodeSource Repository (Recommended)**
```bash
# Add NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# Install Node.js
sudo apt install -y nodejs

# Verify installation
node --version
npm --version
```

**Option B: Using Node Version Manager (nvm)**
```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload shell configuration
source ~/.bashrc

# Install Node.js 18 LTS
nvm install 18
nvm use 18
nvm alias default 18

# Verify installation
node --version
npm --version
```

### Step 4: Install Git (if not already installed)
```bash
sudo apt install -y git
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Step 5: Install Code Editor (Optional but Recommended)

**VS Code:**
```bash
# Download and install VS Code
wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > packages.microsoft.gpg
sudo install -o root -g root -m 644 packages.microsoft.gpg /etc/apt/trusted.gpg.d/
sudo sh -c 'echo "deb [arch=amd64,arm64,armhf signed-by=/etc/apt/trusted.gpg.d/packages.microsoft.gpg] https://packages.microsoft.com/repos/code stable main" > /etc/apt/sources.list.d/vscode.list'
sudo apt update
sudo apt install -y code
```

### Step 6: Clone and Setup the Project
```bash
# Clone the repository
git clone <repository-url>
cd rgt-robotics-integration-software-engineer-nextjs-frontend

# Install project dependencies
npm install
```

### Step 7: Configure Environment Variables
```bash
# Create environment file
cp .env.example .env.local 2>/dev/null || touch .env.local

# Edit the environment file
nano .env.local
```

Add the following content to `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Step 8: Install Additional Development Tools (Optional)

**Install Chrome/Chromium for testing:**
```bash
# Install Chromium
sudo apt install -y chromium-browser

# Or install Google Chrome
wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
sudo sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
sudo apt update
sudo apt install -y google-chrome-stable
```

**Install additional useful tools:**
```bash
# Install additional development tools
sudo apt install -y htop tree jq

# Install Docker (optional, for containerized development)
sudo apt install -y apt-transport-https ca-certificates curl gnupg lsb-release
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io
sudo usermod -aG docker $USER
```

### Step 9: Run the Application
```bash
# Start the development server
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Step 10: Run Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Troubleshooting Common Issues

**1. Permission Denied Errors:**
```bash
# Fix npm permissions
sudo chown -R $USER:$USER ~/.npm
sudo chown -R $USER:$USER ~/.config
```

**2. Port Already in Use:**
```bash
# Find process using port 3000
sudo lsof -i :3000

# Kill the process
sudo kill -9 <PID>
```

**3. Node.js Version Issues:**
```bash
# If using nvm, ensure correct version is active
nvm use 18
nvm alias default 18
```

**4. Network/Firewall Issues:**
```bash
# Allow port 3000 through firewall
sudo ufw allow 3000
sudo ufw allow 3001
```

**5. Memory Issues (for low RAM systems):**
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
```

### System Requirements

- **Minimum:**
  - 2GB RAM
  - 10GB free disk space
  - Ubuntu 18.04 LTS

- **Recommended:**
  - 4GB+ RAM
  - 20GB+ free disk space
  - Ubuntu 18.04 LTS or newer

### Next Steps

After completing the setup:
1. Ensure your backend API is running on port 3001
2. Test the application by navigating to different pages
3. Run the test suite to verify everything is working
4. Check the browser console for any errors
5. Review the API integration documentation below

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
- Redirects to `/books`
- Loading screen during redirect

### `/books` (Book List)
- Display all books in a grid layout
- Search and filtering capabilities
- Pagination (10 books per page)
- Sort by various criteria
- Purchase functionality

### `/books/[id]` (Book Detail)
- Comprehensive book information
- Purchase button
- Link to admin management
- Responsive layout

### `/admin/books` (Admin Management)
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
