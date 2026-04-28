import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { BookDetailPage } from './pages/BookDetailPage';
import { BookFormPage } from './pages/BookFormPage';
import { BooksPage } from './pages/BooksPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/books" replace />} />
        <Route path="/books" element={<BooksPage />} />
        <Route path="/books/new" element={<BookFormPage mode="create" />} />
        <Route path="/books/:id" element={<BookDetailPage />} />
        <Route path="/books/:id/edit" element={<BookFormPage mode="edit" />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
