import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { BookForm, BookFormValues } from '../components/BookForm';
import { ErrorState } from '../components/ErrorState';
import { LoadingSpinner } from '../components/LoadingSpinner';
import {
  Author,
  BookMutationInput,
  Genre,
  Publisher,
  createBook,
  getAuthors,
  getBookById,
  getErrorMessage,
  getGenres,
  getPublishers,
  updateBook,
} from '../api';

interface BookFormPageProps {
  mode: 'create' | 'edit';
}

const initialFormValues: BookFormValues = {
  title: '',
  isbn: '',
  year: '',
  pageCount: '',
  language: '',
  description: '',
  authorId: '',
  publisherId: '',
  genreIds: [],
  fallbackGenreIds: '',
};

function parseIdsFromCsv(value: string): number[] {
  return value
    .split(',')
    .map((part) => Number(part.trim()))
    .filter((part) => Number.isFinite(part) && part > 0);
}

export function BookFormPage({ mode }: BookFormPageProps) {
  const params = useParams();
  const navigate = useNavigate();
  const bookId = Number(params.id);
  const isEdit = mode === 'edit';
  const [values, setValues] = useState<BookFormValues>(initialFormValues);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [lookupErrors, setLookupErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(isEdit);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadData() {
      setLoading(isEdit);
      setLookupErrors([]);

      const lookupResults = await Promise.allSettled([
        getAuthors(controller.signal),
        getPublishers(controller.signal),
        getGenres(controller.signal),
      ]);

      if (controller.signal.aborted) {
        return;
      }

      const nextLookupErrors: string[] = [];
      const [authorsResult, publishersResult, genresResult] = lookupResults;

      if (authorsResult.status === 'fulfilled') {
        setAuthors(authorsResult.value);
      } else {
        nextLookupErrors.push(`Authors lookup unavailable: ${getErrorMessage(authorsResult.reason)}`);
      }

      if (publishersResult.status === 'fulfilled') {
        setPublishers(publishersResult.value);
      } else {
        nextLookupErrors.push(`Publishers lookup unavailable: ${getErrorMessage(publishersResult.reason)}`);
      }

      if (genresResult.status === 'fulfilled') {
        setGenres(genresResult.value);
      } else {
        nextLookupErrors.push(`Genres lookup unavailable: ${getErrorMessage(genresResult.reason)}`);
      }

      setLookupErrors(nextLookupErrors);

      if (!isEdit) {
        setLoading(false);
        return;
      }

      try {
        const book = await getBookById(bookId, controller.signal);

        if (controller.signal.aborted) {
          return;
        }

        setValues({
          title: book.title,
          isbn: book.isbn,
          year: book.year ? String(book.year) : '',
          pageCount: book.pageCount ? String(book.pageCount) : '',
          language: book.language,
          description: book.description,
          authorId: book.author?.id ? String(book.author.id) : '',
          publisherId: book.publisher?.id ? String(book.publisher.id) : '',
          genreIds: book.genres.map((genre) => genre.id),
          fallbackGenreIds: book.genres.map((genre) => genre.id).join(', '),
        });
      } catch (loadError) {
        if (!controller.signal.aborted) {
          setSubmitError(getErrorMessage(loadError));
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    if (isEdit && (!Number.isFinite(bookId) || bookId <= 0)) {
      setSubmitError('Invalid book id.');
      setLoading(false);
      return undefined;
    }

    void loadData();

    return () => controller.abort();
  }, [bookId, isEdit]);

  const heading = useMemo(() => (isEdit ? 'Edit book record' : 'Create book record'), [isEdit]);

  function handleChange<K extends keyof BookFormValues>(field: K, value: BookFormValues[K]) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function handleToggleGenre(genreId: number) {
    setValues((current) => {
      const nextGenreIds = current.genreIds.includes(genreId)
        ? current.genreIds.filter((item) => item !== genreId)
        : [...current.genreIds, genreId];

      return {
        ...current,
        genreIds: nextGenreIds,
        fallbackGenreIds: nextGenreIds.join(', '),
      };
    });
  }

  function buildPayload(): BookMutationInput {
    const genreIds = genres.length > 0 ? values.genreIds : parseIdsFromCsv(values.fallbackGenreIds);

    return {
      title: values.title.trim(),
      isbn: values.isbn.trim(),
      year: Number(values.year),
      pageCount: Number(values.pageCount),
      language: values.language.trim(),
      description: values.description.trim(),
      authorId: values.authorId ? Number(values.authorId) : null,
      publisherId: values.publisherId ? Number(values.publisherId) : null,
      genreIds,
    };
  }

  async function handleSubmit() {
    try {
      setSubmitting(true);
      setSubmitError(null);

      const payload = buildPayload();

      if (!payload.title || !payload.isbn || !payload.language) {
        throw new Error('Title, ISBN and language are required.');
      }

      if (!Number.isFinite(payload.year) || !Number.isFinite(payload.pageCount)) {
        throw new Error('Year and page count must be valid numbers.');
      }

      if (!payload.authorId || !payload.publisherId) {
        throw new Error('Author and publisher are required.');
      }

      if (payload.genreIds.length === 0) {
        throw new Error('Select at least one genre.');
      }

      const book = isEdit ? await updateBook(bookId, payload) : await createBook(payload);
      navigate(book.id > 0 ? `/books/${book.id}` : '/books');
    } catch (error) {
      setSubmitError(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <LoadingSpinner label={isEdit ? 'Loading book form...' : 'Preparing form...'} />;
  }

  if (isEdit && submitError && values.title === '') {
    return <ErrorState title="Unable to load book" message={submitError} />;
  }

  return (
    <section className="space-y-6">
      <Link to={isEdit && Number.isFinite(bookId) ? `/books/${bookId}` : '/books'} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-slate-900">
        <span aria-hidden="true">&lt;</span>
        {isEdit ? 'Back to details' : 'Back to books'}
      </Link>

      <div className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-card">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-700">Book form</p>
        <h1
          className="mt-3 text-4xl font-semibold text-slate-900"
          style={{ fontFamily: '"Iowan Old Style", "Palatino Linotype", Georgia, serif' }}
        >
          {heading}
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          Use typed fields below to create a new book or update an existing record in the REST API.
        </p>
      </div>

      <BookForm
        mode={mode}
        values={values}
        authors={authors}
        publishers={publishers}
        genres={genres}
        lookupErrors={lookupErrors}
        submitError={submitError}
        submitting={submitting}
        onChange={handleChange}
        onToggleGenre={handleToggleGenre}
        onSubmit={handleSubmit}
      />
    </section>
  );
}
