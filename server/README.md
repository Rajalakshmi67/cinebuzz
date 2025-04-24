# CineBuzz Backend Server

This is the backend server for the CineBuzz application, providing API endpoints for user authentication (signup and signin).

## Setup Instructions

1. Configure environment variables:
   - Rename `.env.example` to `.env` or create a new `.env` file
   - Update the MongoDB URI with your actual connection string
   - Set a secure JWT secret key

```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster0.example.mongodb.net/cinebuzz
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d
```

2. Install dependencies:
```
npm install
```

3. Start the server:
```
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication

- **POST /api/auth/signup** - Register a new user
  - Required fields: `name`, `email`, `password`
  - Returns: User object with JWT token

- **POST /api/auth/signin** - Login a user
  - Required fields: `email`, `password`
  - Returns: User object with JWT token

- **GET /api/auth/me** - Get current user profile
  - Requires: Authentication token in header
  - Returns: User object

## Authentication

The API uses JWT (JSON Web Token) for authentication. For protected routes, include the token in the Authorization header:

```
Authorization: Bearer <your_token_here>
``` 