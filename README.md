# ShopKart 🛒

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![License](https://img.shields.io/badge/license-ISC-blue)
![React](https://img.shields.io/badge/React-18.x-blue?logo=react)
![Node](https://img.shields.io/badge/Node-16.x+-success?logo=nodedotjs)
![MongoDB](https://img.shields.io/badge/MongoDB-8.x-brightgreen?logo=mongodb)

ShopKart is a modern, responsive full-stack e-commerce web application. Built with the MERN-like stack (React, Node.js, Express, MongoDB), it provides a robust platform for browsing products, managing a personalized wishlist, and secure user authentication.

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation & Setup](#installation--setup)
- [API Reference](#-api-reference)
- [Project Structure](#-project-structure)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

- **Secure Authentication**: Robust user registration and login using JSON Web Tokens (JWT) and bcrypt for password hashing.
- **Product Catalog**: Dynamic rendering of products with detailed views.
- **Wishlist Management**: Authenticated users can curate and manage a personalized list of favorite items.
- **Responsive UI**: A mobile-first design philosophy ensuring seamless experiences across devices.
- **RESTful Architecture**: Clean, scalable backend API with isolated routes, controllers, and middlewares.

---

## 🛠 Tech Stack

### Frontend
- **Core**: React 18, React Router DOM
- **Build Tool**: Vite (Lightning-fast HMR and optimized builds)
- **State Management**: React Hooks
- **Network Requests**: Axios
- **Styling**: Modern CSS / ThemeProvider architecture

### Backend
- **Core**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security & Utils**: bcryptjs, cors, cookie-parser, dotenv

---

## 🚀 Getting Started

The project is structured as a monorepo containing both the `frontend` and `backend` directories.

### Prerequisites

Ensure you have the following installed on your local machine:
- [Node.js](https://nodejs.org/en/) (v16.x or higher recommended)
- [npm](https://www.npmjs.com/) (v8.x or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (Local instance or an Atlas URI)

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd shopkart
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   ```
   *Environment Variables:*
   Copy the example environment file and update it with your credentials:
   ```bash
   cp .env.example .env
   ```
   Ensure your `.env` contains:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/shopkart
   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRES_IN=1d
   NODE_ENV=development
   ```
   *Start the Backend Server:*
   ```bash
   npm run dev
   ```
   The backend will run on `http://localhost:5000`.

3. **Frontend Setup:**
   Open a new terminal window:
   ```bash
   cd frontend
   npm install
   ```
   *Start the Frontend Development Server:*
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:5173`.

---

## 🔌 API Reference

The backend exposes a secure REST API. All endpoints requiring authentication expect a valid JWT cookie.

### Authentication
- `POST /customers/register` - Create a new account
  - Body: `{ fullName, email, password, phone }`
- `POST /customers/login` - Authenticate a user
  - Body: `{ email, password }`
- `GET /customers/me` - Retrieve current user profile (Protected)
- `POST /customers/logout` - Clear authentication cookies (Protected)

### Products
- `GET /products` - Retrieve all available products
- `GET /products/:id` - Retrieve details of a specific product

### Wishlist
- Includes endpoints for fetching, adding, and removing items from a user's wishlist (Protected routes under `/wishlist`).

---

## 📂 Project Structure

```
shopkart/
├── backend/                # Node.js + Express backend
│   ├── controllers/        # Business logic for routes
│   ├── middlewares/        # Custom Express middlewares (Auth, etc.)
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API endpoint definitions
│   ├── utils/              # Helper functions
│   ├── index.js            # Server entry point
│   └── package.json
│
└── frontend/               # React + Vite frontend
    ├── src/
    │   ├── components/     # Reusable UI components
    │   ├── pages/          # View-level components (Home, Login, etc.)
    │   ├── services/       # Axios API handlers
    │   ├── theme/          # UI theming providers
    │   ├── App.jsx         # Root component & Routing
    │   └── main.jsx        # Application entry point
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## 🌍 Deployment

### Backend
The Node.js backend can be deployed to services like Render, Railway, or Heroku. Ensure you configure the `MONGO_URI` and `JWT_SECRET` in the platform's environment variables.

### Frontend
The React application can be easily built and deployed to Vercel, Netlify, or AWS S3.
1. Build the production assets:
   ```bash
   cd frontend
   npm run build
   ```
2. Deploy the generated `dist/` folder.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📝 License

This project is licensed under the **ISC License**.
