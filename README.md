# Frontend - Books

React + TypeScript frontend for the library information system assignment.

## Authors and task distribution

- Author: Leonti Mishin
- Work format: individual assignment
- Task distribution: all frontend tasks in this repository were completed by one student

## Link to the backend repository

- Backend repository: `https://github.com/LeontiMishin/REST_API_and_Books`

## Technologies used

- React
- TypeScript
- Vite
- Axios
- React Router v6
- Tailwind CSS

## Functionality

- Books list view with filters, sorting, pagination, create and delete actions
- Book detail view with average rating, reviews list, review creation, edit and delete actions
- Create and edit book forms with typed API integration
- Loading and error states for all requests
- API access centralized in `src/api.ts`

## Installation instructions

1. Install dependencies:

```bash
npm install
```

2. Create environment file:

```bash
cp .env.example .env
```

3. Set API URL in `.env`:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

## Run commands

Development server:

```bash
npm run dev
```

Production build:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Project structure

```text
src/
  api.ts
  components/
  pages/
```

## Screenshots of application views

Replace the placeholder images below with real screenshots before submission.

### Books list view

![Books list placeholder](./docs/....svg)

### Book detail view

![Book detail placeholder](./docs/....svg)
