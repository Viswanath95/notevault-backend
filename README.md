NoteVault — Backend

A RESTful API for the NoteVault notes app, built with Express.js and MongoDB (Mongoose). Provides JWT-based authentication and full CRUD for notes, including search and pagination.


Features

JWT Authentication — Register and login with hashed passwords (bcrypt)
Protected Routes — All note routes require a valid Bearer token
Notes CRUD — Create, read, update, and delete notes scoped to the logged-in user
Search — Case-insensitive search across note title and content
Pagination — Paginated note listing for infinite scroll support
Validation — Request validation via express-validator
Centralized Error Handling — Consistent error responses via a custom HttpError model

Tech Stack

Layer            Technology
Runtime           Node.js
Framework         Express.js
Database          MongoDB
ODM               Mongoose
Auth              JSON Web Tokens (jsonwebtoken)
PasswordHashing   bcrypt
Validation        express-validator
Dev Tooling       nodemon

Project Structure

.
├── controllers/
│   ├── authController.js      # register, login
│   └── noteController.js      # CRUD, search, pagination
├── middleware/
│   ├── auth.js                 # JWT verification
│   └── validate.js             # express-validator error handler
├── models/
│   ├── User.js
│   ├── Note.js
│   └── http-error.js
├── routes/
│   ├── auth-routes.js
│   └── note-routes.js
├── validators/
│   ├── userValidator.js
│   └── noteValidator.js
├── app.js
└── .env

Getting Started

Prerequisites

Node.js 18+
MongoDB instance (local or Atlas)

Installation

bashgit clone https://github.com/Viswanath95/notevault-backend.git
cd notevault-backend
npm install

Environment Variables

Create a .env file in the root directory:

envPORT=5000
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=notevault
JWT_KEY=your_jwt_secret_key

Run the server

bashnpm start

The API will be available at http://localhost:5000/api.

API Reference

Auth

Method             Endpoint               Description
POST               /api/auth/register     Register a new user, returns JWT
POST               /api/auth/login        Login, returns JWT

Register / Login response

json{
  "success": true,
  "user": { "id": "...", "name": "...", "email": "..." },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}

Notes

All note routes require an Authorization: Bearer <token> header.

Method         Endpoint                      Description
GET            /api/notes?page=1&limit=6     Get paginated notes for the logged-in user
GET            /api/notes/search?q=keyword   Search notes by title or content
POST           /api/notes                    Create a new note
PUT            /api/notes/:id                Update a note (title, content, colour, isPinned)
DELETE         /api/notes/:id                Delete a note

Get notes response

json{
  "success": true,
  "notes": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 6,
    "total": 14,
    "totalPages": 3,
    "hasNextPage": true
  }
}


Data Models

User

js{
  name: String,
  email: String,
  passwordHash: String,
  createdAt: Date
}

Note

js{
  userId: ObjectId,
  title: String,
  content: String,
  colour: String,
  isPinned: Boolean,
  createdAt: Date,
  updatedAt: Date
}


Error Responses

All errors follow a consistent shape via the HttpError model:

json{
  "message": "Invalid credentials, could not log you in."
}

Status          Meaning
400             Bad request / validation error
401 / 403       Authentication failed
404             Resource not found
409             Conflict (e.g. email already in use)
500             Server error
