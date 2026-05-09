# Book API

## Description

Book API is a full-stack TypeScript project for managing books, authors, publishers, genres, and reviews.

This repository contains:

- `backend/` - REST API built with Node.js, Express, Prisma, PostgreSQL, Zod, and Swagger
- `frontend/` - React application built with Vite, TypeScript, Tailwind CSS, Axios, and React Router

The backend supports two data sources:

- `mock` - runs without a database using local mock data
- `postgres` - uses Prisma with PostgreSQL

## Author

- Author: Leonti Mishin
- Work format: individual assignment
- Task distribution: all backend and frontend tasks in this repository were completed by one student

## Features

- CRUD operations for books
- Filtering by title, language, year, author, publisher, and genre
- Pagination and sorting
- Book details page
- Reviews for books
- Average rating calculation
- Create and edit book forms
- Review creation and deletion
- Validation using Zod
- Unified error handling
- Swagger API documentation
- Typed Axios API layer on frontend
- AbortController support for React data loading
- Easy switching between mock and PostgreSQL data sources

## Technologies Used

### Backend

- TypeScript
- Node.js
- Express
- Prisma ORM
- PostgreSQL
- Zod
- Swagger / OpenAPI

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Axios
- React Router v6
- AbortController

## Project Structure

```text
Frontend_Books/
├─ backend/
│  ├─ dist/
│  ├─ prisma/
│  │  ├─ migrations/
│  │  ├─ schema.prisma
│  │  └─ seed.ts
│  ├─ src/
│  │  ├─ config/
│  │  ├─ controllers/
│  │  ├─ data/
│  │  ├─ express/
│  │  ├─ lib/
│  │  ├─ middleware/
│  │  ├─ models/
│  │  ├─ services/
│  │  ├─ utils/
│  │  ├─ validators/
│  │  ├─ app.ts
│  │  └─ server.ts
│  ├─ .env.example
│  ├─ package.json
│  ├─ package-lock.json
│  └─ tsconfig.json
├─ frontend/
│  ├─ dist/
│  ├─ docs/
│  ├─ src/
│  │  ├─ components/
│  │  ├─ pages/
│  │  ├─ api.ts
│  │  ├─ App.tsx
│  │  ├─ main.tsx
│  │  └─ index.css
│  ├─ .env.example
│  ├─ index.html
│  ├─ package.json
│  ├─ tsconfig.json
│  └─ vite.config.ts
├─ .gitignore
└─ README.md
```

## Running the Project Locally

Install dependencies separately in both folders.

### Backend Setup

1. Install dependencies

```bash
cd backend
npm install
```

2. Create `.env`

```bash
cp .env.example .env
```

3. Configure backend environment

Example local config:

```env
PORT=3000
CORS_ORIGIN=http://localhost:5173
DATA_SOURCE=mock
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/books_db?schema=public"
```

### Backend Run Commands

Run with mock data:

```bash
cd backend
npm run dev:mock
```

Run with PostgreSQL:

```bash
cd backend
npm run dev:postgres
```

Build backend:

```bash
cd backend
npm run build
```

After starting the backend locally:

- API: [http://localhost:3000/api/v1/books](http://localhost:3000/api/v1/books)
- Swagger: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
- Health: [http://localhost:3000/health](http://localhost:3000/health)

### Prisma Setup

Use these commands only when running with PostgreSQL:

```bash
cd backend
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed
```

### Frontend Setup

1. Install dependencies

```bash
cd frontend
npm install
```

2. Create `.env`

```bash
cp .env.example .env
```

3. Configure frontend environment

For local backend:

```env
VITE_API_URL=/api/v1
VITE_API_PROXY_TARGET=http://localhost:3000
```

### Frontend Run Commands

Development mode:

```bash
cd frontend
npm run dev
```

Production build:

```bash
cd frontend
npm run build
```

Preview production build:

```bash
cd frontend
npm run preview
```

After starting the frontend locally:

- App: [http://localhost:5173/books](http://localhost:5173/books)

## API Features

- `GET /api/v1/books` - list books with filters, sorting, and pagination
- `POST /api/v1/books` - create book
- `GET /api/v1/books/:id` - book details
- `PUT /api/v1/books/:id` - update book
- `DELETE /api/v1/books/:id` - delete book
- `GET /api/v1/books/:bookId/reviews` - list reviews
- `POST /api/v1/books/:bookId/reviews` - create review
- `DELETE /api/v1/reviews/:id` - delete review
- `GET /api/v1/books/:id/average-rating` - average rating
- `GET /api/v1/authors` - authors lookup
- `GET /api/v1/publishers` - publishers lookup
- `GET /api/v1/genres` - genres lookup

## Frontend Features

### `/books`

- Books list as cards
- Filtering by title, year, and language
- Sorting by title and year
- Pagination
- Add book page
- View and delete actions
- Loading and error states

### `/books/:id`

- Full book details
- Average rating
- Reviews list
- Add review form
- Edit book page
- Delete actions
- Back to list button

## Error Handling

Example error response:

```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "isbn",
      "message": "Book with this ISBN already exists"
    }
  ]
}
```

Handled errors:

- Zod validation errors
- Prisma errors `P2002`, `P2003`, `P2025`
- Not found errors
- Internal server errors

## Screenshots

Books page:
![Books page](frontend/docs/books-page.png)

Book detail page + review:
![Book detail page + review](frontend/docs/book-detail-page.png)

Book form:
![Book form](frontend/docs/book-form.png)

Swagger:
![Swagger](frontend/docs/swagger.png)
