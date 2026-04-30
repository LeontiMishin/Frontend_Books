import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ReviewForm } from '../components/ReviewForm';
import {
  Book,
  Review,
  createReview,
  deleteBook,
  deleteReview,
  getAverageRating,
  getBookById,
  getErrorMessage,
  getReviews,
  ReviewMutationInput,
} from '../api';

export function BookDetailPage() {
  const params = useParams();
  const navigate = useNavigate();
  const bookId = Number(params.id);
  const [book, setBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [bookLoading, setBookLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [ratingLoading, setRatingLoading] = useState(true);
  const [bookError, setBookError] = useState<string | null>(null);
  const [reviewsError, setReviewsError] = useState<string | null>(null);
  const [ratingError, setRatingError] = useState<string | null>(null);
  const [mutationError, setMutationError] = useState<string | null>(null);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [deletingReviewId, setDeletingReviewId] = useState<number | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadBookDetails() {
      setBookLoading(true);
      setReviewsLoading(true);
      setRatingLoading(true);
      setBookError(null);
      setReviewsError(null);
      setRatingError(null);

      const results = await Promise.allSettled([
        getBookById(bookId, controller.signal),
        getReviews(bookId, controller.signal),
        getAverageRating(bookId, controller.signal),
      ]);

      if (controller.signal.aborted) {
        return;
      }

      const [bookResult, reviewsResult, ratingResult] = results;

      if (bookResult.status === 'fulfilled') {
        setBook(bookResult.value);
      } else {
        setBookError(getErrorMessage(bookResult.reason));
      }

      if (reviewsResult.status === 'fulfilled') {
        setReviews(reviewsResult.value);
      } else {
        setReviewsError(getErrorMessage(reviewsResult.reason));
      }

      if (ratingResult.status === 'fulfilled') {
        setAverageRating(ratingResult.value);
      } else {
        setRatingError(getErrorMessage(ratingResult.reason));
      }

      setBookLoading(false);
      setReviewsLoading(false);
      setRatingLoading(false);
    }

    if (!Number.isFinite(bookId) || bookId <= 0) {
      setBookError('Invalid book id.');
      setBookLoading(false);
      setReviewsLoading(false);
      setRatingLoading(false);
      return undefined;
    }

    void loadBookDetails();

    return () => controller.abort();
  }, [bookId, refreshKey]);

  async function handleDeleteBook() {
    if (!book) {
      return;
    }

    const confirmed = window.confirm(`Delete "${book.title}"?`);
    if (!confirmed) {
      return;
    }

    try {
      await deleteBook(book.id);
      navigate('/books');
    } catch (deleteError) {
      setMutationError(getErrorMessage(deleteError));
    }
  }

  async function handleSubmitReview(input: ReviewMutationInput) {
    try {
      setMutationError(null);
      setReviewSubmitting(true);
      await createReview(bookId, input);
      setRefreshKey((current) => current + 1);
    } catch (submitError) {
      setMutationError(getErrorMessage(submitError));
      throw submitError;
    } finally {
      setReviewSubmitting(false);
    }
  }

  async function handleDeleteReview(reviewId: number) {
    const confirmed = window.confirm('Delete this review?');
    if (!confirmed) {
      return;
    }

    try {
      setDeletingReviewId(reviewId);
      setMutationError(null);
      await deleteReview(reviewId);
      setRefreshKey((current) => current + 1);
    } catch (deleteError) {
      setMutationError(getErrorMessage(deleteError));
    } finally {
      setDeletingReviewId(null);
    }
  }

  if (bookLoading) {
    return <LoadingSpinner label="Loading book details..." />;
  }

  if (bookError) {
    return <ErrorState title="Book request failed" message={bookError} />;
  }

  if (!book) {
    return <EmptyState title="Book not found" description="The requested book could not be loaded." />;
  }

  return (
    <section className="space-y-6">
      <Link to="/books" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-slate-900">
        <span aria-hidden="true">&lt;</span>
        Back to list
      </Link>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <article className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-card md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-700">Book details</p>
              <h1
                className="mt-3 text-4xl font-semibold text-slate-900"
                style={{ fontFamily: '"Iowan Old Style", "Palatino Linotype", Georgia, serif' }}
              >
                {book.title}
              </h1>
              <p className="mt-3 text-sm text-slate-600">
                {book.author?.name || 'Unknown author'} • {book.publisher?.name || 'Unknown publisher'}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to={`/books/${book.id}/edit`}
                className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
              >
                Edit
              </Link>
              <button
                type="button"
                onClick={handleDeleteBook}
                className="inline-flex items-center gap-2 rounded-full bg-red-50 px-5 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100"
              >
                Delete
              </button>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <DetailRow label="ISBN" value={book.isbn || 'Missing'} />
            <DetailRow label="Year" value={book.year ? String(book.year) : 'Missing'} />
            <DetailRow label="Pages" value={book.pageCount ? String(book.pageCount) : 'Missing'} />
            <DetailRow label="Language" value={book.language || 'Missing'} />
            <DetailRow label="Author" value={book.author?.name || 'Missing'} />
            <DetailRow label="Publisher" value={book.publisher?.name || 'Missing'} />
            <DetailRow
              label="Genres"
              value={book.genres.length > 0 ? book.genres.map((genre) => genre.name).join(', ') : 'Missing'}
              fullWidth
            />
            <DetailRow label="Description" value={book.description || 'No description'} fullWidth />
          </div>
        </article>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6 shadow-card">
            <div className="flex items-center gap-3 text-amber-900">
              <span className="text-lg leading-none">*</span>
              <p className="text-sm font-semibold uppercase tracking-[0.3em]">Average rating</p>
            </div>
            {ratingLoading ? <p className="mt-4 text-sm text-slate-600">Loading rating...</p> : null}
            {!ratingLoading && ratingError ? <p className="mt-4 text-sm text-red-700">{ratingError}</p> : null}
            {!ratingLoading && !ratingError ? (
              <p className="mt-4 text-5xl font-semibold text-slate-900">{averageRating.toFixed(1)}</p>
            ) : null}
          </div>

          <ReviewForm onSubmit={handleSubmitReview} submitting={reviewSubmitting} error={mutationError} />
        </aside>
      </div>

      <section className="space-y-4">
        <div className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-card">
          <h2
            className="text-2xl font-semibold text-slate-900"
            style={{ fontFamily: '"Iowan Old Style", "Palatino Linotype", Georgia, serif' }}
          >
            Reviews
          </h2>
          <p className="mt-2 text-sm text-slate-600">Latest reader feedback loaded from the REST API.</p>
        </div>

        {reviewsLoading ? <LoadingSpinner label="Loading reviews..." /> : null}
        {!reviewsLoading && reviewsError ? <ErrorState title="Reviews request failed" message={reviewsError} /> : null}
        {!reviewsLoading && !reviewsError && reviews.length === 0 ? (
          <EmptyState title="No reviews yet" description="Be the first reader to leave a rating and comment." />
        ) : null}

        {!reviewsLoading && !reviewsError && reviews.length > 0 ? (
          <div className="grid gap-4">
            {reviews.map((review) => (
              <article key={review.id} className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-card">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <p className="text-lg font-semibold text-slate-900">{review.username}</p>
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
                        {review.rating}/5
                      </span>
                    </div>
                    {review.createdAt ? (
                      <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-500">{new Date(review.createdAt).toLocaleString()}</p>
                    ) : null}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteReview(review.id)}
                    disabled={deletingReviewId === review.id}
                    className="rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {deletingReviewId === review.id ? 'Deleting...' : 'Delete review'}
                  </button>
                </div>

                <p className="mt-4 text-sm leading-7 text-slate-700">{review.comment}</p>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </section>
  );
}

interface DetailRowProps {
  label: string;
  value: string;
  fullWidth?: boolean;
}

function DetailRow({ label, value, fullWidth = false }: DetailRowProps) {
  return (
    <div className={`rounded-[1.5rem] bg-amber-50/70 p-5 ${fullWidth ? 'md:col-span-2' : ''}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">{label}</p>
      <p className="mt-3 text-sm leading-7 text-slate-800">{value}</p>
    </div>
  );
}
