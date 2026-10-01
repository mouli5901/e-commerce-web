# ShopKart

ShopKart is a modern, full-stack e-commerce web application. It features a responsive frontend interface built with React and Vite, paired with a robust backend API powered by Node.js, Express, and MongoDB. The application provides complete user authentication and product browsing capabilities, along with wishlist functionality.

## Features

- **User Authentication**: Secure user registration and login using JWT (JSON Web Tokens) and bcrypt for password hashing.
- **Product Catalog**: Browse and view detailed information for various products.
- **Wishlist Management**: Add and manage favorite items in a personalized wishlist.
- **Responsive Design**: Built to work seamlessly across desktop and mobile devices.
- **RESTful API**: A well-structured backend providing secure endpoints for users, products, and wishlists.
- **Modern Frontend**: Leveraging React 18, Vite for fast builds, and React Router for seamless navigation.

## Tech Stack

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS (or similar, depending on setup in index.css) / Custom CSS

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (with Mongoose ODM)
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs
- **CORS & Cookies**: cors, cookie-parser

## Prerequisites

Before you begin, ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/en/) (v16.x or higher)
- [npm](https://www.npmjs.com/) (v8.x or higher)
- [MongoDB](https://www.mongodb.com/) (local instance running or MongoDB Atlas URI)

## Installation & Setup

The project is structured as a monorepo containing both `frontend` and `backend` directories. Follow the steps below to run both environments locally.

### 1. Clone the repository

```bash
git clone <repository-url>
cd shopkart
```

### 2. Backend Setup

Open a new terminal window and navigate to the backend directory:

```bash
cd backend
```

Install the dependencies:

```bash
npm install
```

Set up environment variables:
Create a `.env` file in the `backend` directory based on the provided `.env.example`:

```bash
cp .env.example .env
```

Make sure the following variables are correctly configured in your `.env` file:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/shopkart
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=1d
NODE_ENV=development
```

Start the backend development server:

```bash
npm run dev
```
The backend server will run on `http://localhost:5000`.

### 3. Frontend Setup

Open another terminal window and navigate to the frontend directory:

```bash
cd frontend
```

Install the dependencies:

```bash
npm install
```

Start the frontend development server:

```bash
npm run dev
```
The frontend application will be available at `http://localhost:5173`.

## API Endpoints

The backend provides several key REST API endpoints.

**Authentication:**
- `POST /customers/register` - Register a new customer
- `POST /customers/login` - Login customer
- `GET /customers/me` - Get current customer profile
- `POST /customers/logout` - Logout customer

**Products:**
- `GET /products` - Get list of products
- `GET /products/:id` - Get specific product details

**Wishlist:**
- Provides standard CRUD operations for managing a user's wishlist (requires authentication).

## Project Structure

```
shopkart/
├── backend/                # Node.js + Express backend
│   ├── controllers/        # Request handlers
│   ├── middlewares/        # Custom middlewares (e.g., auth)
│   ├── models/             # Mongoose database models
│   ├── routes/             # API route definitions
│   ├── utils/              # Utility functions
│   ├── index.js            # Entry point for backend server
│   └── package.json        # Backend dependencies
│
└── frontend/               # React + Vite frontend
    ├── src/                # Source code
    │   ├── components/     # Reusable React components
    │   ├── pages/          # Application pages (Home, Login, etc.)
    │   ├── services/       # API call handlers
    │   ├── theme/          # UI theming config
    │   ├── App.jsx         # Main application component
    │   └── main.jsx        # React DOM rendering entry point
    ├── index.html          # HTML template
    ├── vite.config.js      # Vite configuration
    └── package.json        # Frontend dependencies
```

## License

This project is licensed under the ISC License.
