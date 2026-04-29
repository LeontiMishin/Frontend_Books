import axios from 'axios';

export interface NamedEntity {
  id: number;
  name: string;
}

export interface Author extends NamedEntity {
  firstName?: string;
  lastName?: string;
}

export interface Publisher extends NamedEntity {}

export interface Genre extends NamedEntity {}

export interface Book {
  id: number;
  title: string;
  isbn: string;
  year: number;
  pageCount: number;
  language: string;
  description: string;
  author: Author | null;
  publisher: Publisher | null;
  genres: Genre[];
}

export interface Review {
  id: number;
  username: string;
  rating: number;
  comment: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface BooksQueryParams {
  title?: string;
  year?: string;
  language?: string;
  sortBy?: 'title' | 'year';
  sortOrder?: 'asc' | 'desc';
  page: number;
  limit: number;
}

export interface BookMutationInput {
  title: string;
  isbn: string;
  year: number;
  pageCount: number;
  language: string;
  description: string;
  authorId: number | null;
  publisherId: number | null;
  genreIds: number[];
}

export interface ReviewMutationInput {
  username: string;
  rating: number;
  comment: string;
}

export interface PaginatedBooksResponse {
  items: Book[];
  meta: PaginationMeta;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function readString(record: Record<string, unknown>, keys: string[], fallback = ''): string {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string') {
      return value;
    }
  }
  return fallback;
}

function readNumber(record: Record<string, unknown>, keys: string[], fallback = 0): number {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }
    if (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value))) {
      return Number(value);
    }
  }
  return fallback;
}

function normalizeNamedEntity(value: unknown): NamedEntity | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = readNumber(value, ['id'], 0);
  const name = readString(value, ['name', 'title', 'label'], '');

  if (id === 0 && name === '') {
    return null;
  }

  return { id, name };
}

function normalizeAuthor(value: unknown): Author | null {
  if (!isRecord(value)) {
    return null;
  }

  const base = normalizeNamedEntity(value);
  if (!base) {
    return null;
  }

  return {
    ...base,
    firstName: readString(value, ['firstName'], ''),
    lastName: readString(value, ['lastName'], ''),
  };
}

function normalizeGenres(value: unknown): Genre[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((genre) => normalizeNamedEntity(genre))
    .filter((genre): genre is Genre => genre !== null);
}

function normalizeBook(value: unknown): Book {
  const record = isRecord(value) ? value : {};

  return {
    id: readNumber(record, ['id']),
    title: readString(record, ['title']),
    isbn: readString(record, ['isbn']),
    year: readNumber(record, ['year', 'publicationYear', 'publishedYear']),
    pageCount: readNumber(record, ['pageCount', 'pages', 'numberOfPages']),
    language: readString(record, ['language']),
    description: readString(record, ['description', 'summary']),
    author: normalizeAuthor(record.author),
    publisher: normalizeNamedEntity(record.publisher),
    genres: normalizeGenres(record.genres),
  };
}

function normalizeReview(value: unknown): Review {
  const record = isRecord(value) ? value : {};

  return {
    id: readNumber(record, ['id']),
    username: readString(record, ['username', 'user', 'name']),
    rating: readNumber(record, ['rating']),
    comment: readString(record, ['comment', 'content', 'text']),
    createdAt: readString(record, ['createdAt'], ''),
    updatedAt: readString(record, ['updatedAt'], ''),
  };
}

function extractSingleValue(payload: unknown): unknown {
  if (isRecord(payload) && 'data' in payload) {
    return extractSingleValue(payload.data);
  }

  return payload;
}

function extractArray(payload: unknown, candidateKeys: string[]): unknown[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (!isRecord(payload)) {
    return [];
  }

  for (const key of candidateKeys) {
    const value = payload[key];
    if (Array.isArray(value)) {
      return value;
    }
  }

  if ('data' in payload) {
    return extractArray(payload.data, candidateKeys);
  }

  return [];
}

function normalizePagination(payload: unknown, fallbackPage: number, fallbackLimit: number, itemCount: number): PaginationMeta {
  const record = isRecord(payload) ? payload : {};
  const nestedData = isRecord(record.data) ? record.data : null;
  const meta = isRecord(record.meta)
    ? record.meta
    : isRecord(record.pagination)
      ? record.pagination
      : nestedData && isRecord(nestedData.meta)
        ? nestedData.meta
        : nestedData && isRecord(nestedData.pagination)
          ? nestedData.pagination
          : record;
  const page = readNumber(meta, ['page', 'currentPage'], fallbackPage);
  const limit = readNumber(meta, ['limit', 'pageSize'], fallbackLimit);
  const total = readNumber(meta, ['total', 'totalItems', 'count'], itemCount);
  const totalPages = readNumber(meta, ['totalPages', 'pageCount'], Math.max(1, Math.ceil(total / Math.max(limit, 1))));

  return {
    page,
    limit,
    total,
    totalPages,
  };
}

function buildBookMutationPayload(input: BookMutationInput) {
  return {
    title: input.title,
    isbn: input.isbn,
    year: input.year,
    pages: input.pageCount,
    language: input.language,
    description: input.description,
    authorId: input.authorId,
    publisherId: input.publisherId,
    genreIds: input.genreIds,
  };
}

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data;

    if (typeof responseData === 'string' && responseData.trim() !== '') {
      return responseData;
    }

    if (isRecord(responseData)) {
      const message = readString(responseData, ['message', 'error'], '');
      if (message) {
        return message;
      }
    }

    if (error.message) {
      return error.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Unexpected error occurred.';
}

export async function getBooks(params: BooksQueryParams, signal?: AbortSignal): Promise<PaginatedBooksResponse> {
  const response = await api.get<unknown>('/books', {
    params: {
      title: params.title || undefined,
      year: params.year || undefined,
      language: params.language || undefined,
      publicationYear: params.year || undefined,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
      order: params.sortOrder,
      page: params.page,
      limit: params.limit,
    },
    signal,
  });

  const items = extractArray(response.data, ['items', 'books', 'results', 'rows']).map((item) => normalizeBook(item));
  const meta = normalizePagination(response.data, params.page, params.limit, items.length);

  return { items, meta };
}

export async function getBookById(id: number, signal?: AbortSignal): Promise<Book> {
  const response = await api.get<unknown>(`/books/${id}`, { signal });
  return normalizeBook(extractSingleValue(response.data));
}

export async function createBook(input: BookMutationInput): Promise<Book> {
  const response = await api.post<unknown>('/books', buildBookMutationPayload(input));
  return normalizeBook(extractSingleValue(response.data));
}

export async function updateBook(id: number, input: BookMutationInput): Promise<Book> {
  const response = await api.put<unknown>(`/books/${id}`, buildBookMutationPayload(input));
  return normalizeBook(extractSingleValue(response.data));
}

export async function deleteBook(id: number): Promise<void> {
  await api.delete(`/books/${id}`);
}

export async function getAverageRating(id: number, signal?: AbortSignal): Promise<number> {
  const response = await api.get<unknown>(`/books/${id}/average-rating`, { signal });
  const rawValue = extractSingleValue(response.data);

  if (typeof rawValue === 'number') {
    return rawValue;
  }

  if (isRecord(rawValue)) {
    return readNumber(rawValue, ['averageRating', 'average', 'rating'], 0);
  }

  return 0;
}

export async function getReviews(bookId: number, signal?: AbortSignal): Promise<Review[]> {
  const response = await api.get<unknown>(`/books/${bookId}/reviews`, { signal });
  return extractArray(response.data, ['reviews', 'items', 'results', 'data']).map((review) => normalizeReview(review));
}

export async function createReview(bookId: number, input: ReviewMutationInput): Promise<Review> {
  const response = await api.post<unknown>(`/books/${bookId}/reviews`, input);
  return normalizeReview(extractSingleValue(response.data));
}

export async function deleteReview(reviewId: number): Promise<void> {
  await api.delete(`/reviews/${reviewId}`);
}

export async function getGenres(signal?: AbortSignal): Promise<Genre[]> {
  const response = await api.get<unknown>('/genres', { signal });
  return extractArray(response.data, ['genres', 'items', 'results', 'data'])
    .map((genre) => normalizeNamedEntity(genre))
    .filter((genre): genre is Genre => genre !== null);
}

export async function getAuthors(signal?: AbortSignal): Promise<Author[]> {
  const response = await api.get<unknown>('/authors', { signal });
  return extractArray(response.data, ['authors', 'items', 'results', 'data'])
    .map((author) => normalizeAuthor(author))
    .filter((author): author is Author => author !== null);
}

export async function getPublishers(signal?: AbortSignal): Promise<Publisher[]> {
  const response = await api.get<unknown>('/publishers', { signal });
  return extractArray(response.data, ['publishers', 'items', 'results', 'data'])
    .map((publisher) => normalizeNamedEntity(publisher))
    .filter((publisher): publisher is Publisher => publisher !== null);
}
