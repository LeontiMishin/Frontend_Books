import { authors, books, genres, publishers, reviews } from "../data/mock-data";
import { AppError } from "../middleware/error-handler";
import type { Author, Book, BookWithRelations, Genre, Publisher, Review } from "../models/entities";
import { createPaginatedResponse } from "../utils/pagination";
import type { CreateBookInput, ListBooksQuery, UpdateBookInput } from "../validators/book-schemas";
import type { CreateReviewInput, ReviewListQuery, UpdateReviewInput } from "../validators/review-schemas";

type StoredBook = (typeof books)[number];
type StoredReview = (typeof reviews)[number];

const generateId = (existingItems: Array<{ id: number }>): number => {
  const maxId = existingItems.reduce((currentMax, item) => Math.max(currentMax, item.id), 0);
  return maxId + 1;
};

const isActiveBook = (book: StoredBook): boolean => book.deletedAt === null;
const isActiveReview = (review: StoredReview): boolean => review.deletedAt === null;

const findAuthorFullNameById = (authorId: number): string => {
  const author = authors.find((item) => item.id === authorId);
  return author ? `${author.firstName} ${author.lastName}` : "";
};

const findPublisherNameById = (publisherId: number): string => {
  const publisher = publishers.find((item) => item.id === publisherId);
  return publisher?.name ?? "";
};

const hasGenreName = (book: Book, genreName: string): boolean =>
  book.genres.some((genreId) => {
    const genre = genres.find((item) => item.id === genreId);
    return genre?.name.toLowerCase() === genreName.toLowerCase();
  });

const mapReview = (review: StoredReview): Review => ({
  id: review.id,
  bookId: review.bookId,
  userName: review.userName,
  rating: review.rating,
  comment: review.comment,
  createdAt: review.createdAt
});

const mapBookWithRelations = (book: StoredBook): BookWithRelations => ({
  id: book.id,
  title: book.title,
  isbn: book.isbn,
  publishedYear: book.publishedYear,
  pageCount: book.pageCount,
  language: book.language,
  description: book.description,
  coverImage: book.coverImage,
  authorId: book.authorId,
  publisherId: book.publisherId,
  genres: book.genres,
  createdAt: book.createdAt,
  updatedAt: book.updatedAt,
  author: authors.find((author) => author.id === book.authorId) ?? null,
  publisher: publishers.find((publisher) => publisher.id === book.publisherId) ?? null,
  genreDetails: genres.filter((genre) => book.genres.includes(genre.id)),
  reviews: reviews
    .filter((review) => review.bookId === book.id && isActiveReview(review))
    .map((review) => mapReview(review))
});

const assertRelationsExist = (authorId: number, publisherId: number, genreIds: number[]): void => {
  const authorExists = authors.some((author) => author.id === authorId);
  const publisherExists = publishers.some((publisher) => publisher.id === publisherId);
  const invalidGenreIds = genreIds.filter((genreId) => !genres.some((genre) => genre.id === genreId));

  if (!authorExists) {
    throw new AppError(400, "Validation failed", [
      { field: "authorId", message: "Author does not exist" }
    ]);
  }

  if (!publisherExists) {
    throw new AppError(400, "Validation failed", [
      { field: "publisherId", message: "Publisher does not exist" }
    ]);
  }

  if (invalidGenreIds.length > 0) {
    throw new AppError(400, "Validation failed", [
      { field: "genres", message: `Invalid genre ids: ${invalidGenreIds.join(", ")}` }
    ]);
  }
};

export const listBooks = async (query: ListBooksQuery) => {
  const sortDirection = query.order ?? query.sortOrder ?? "asc";

  const filteredBooks = books
    .filter((book) => isActiveBook(book))
    .filter((book) => {
      const titleMatch = query.title
        ? book.title.toLowerCase().includes(query.title.toLowerCase())
        : true;
      const authorMatch = query.author
        ? findAuthorFullNameById(book.authorId).toLowerCase().includes(query.author.toLowerCase())
        : true;
      const publisherMatch = query.publisher
        ? findPublisherNameById(book.publisherId).toLowerCase().includes(query.publisher.toLowerCase())
        : true;
      const languageMatch = query.language
        ? book.language.toLowerCase() === query.language.toLowerCase()
        : true;
      const genreMatch = query.genre ? hasGenreName(book, query.genre) : true;
      const yearMatch = query.year ? book.publishedYear === query.year : true;

      return titleMatch && authorMatch && publisherMatch && languageMatch && genreMatch && yearMatch;
    })
    .sort((leftBook, rightBook) => {
      const direction = sortDirection === "desc" ? -1 : 1;

      if (query.sortBy === "publishedYear") {
        return (leftBook.publishedYear - rightBook.publishedYear) * direction;
      }

      return leftBook.title.localeCompare(rightBook.title) * direction;
    });

  const startIndex = (query.page - 1) * query.limit;
  const endIndex = startIndex + query.limit;
  const pageItems = filteredBooks.slice(startIndex, endIndex).map((book) => mapBookWithRelations(book));

  return createPaginatedResponse(pageItems, query.page, query.limit, filteredBooks.length);
};

export const listAuthors = async (): Promise<Author[]> =>
  [...authors].sort((leftAuthor, rightAuthor) => {
    return `${leftAuthor.lastName} ${leftAuthor.firstName}`.localeCompare(
      `${rightAuthor.lastName} ${rightAuthor.firstName}`
    );
  });

export const listPublishers = async (): Promise<Publisher[]> =>
  [...publishers].sort((leftPublisher, rightPublisher) =>
    leftPublisher.name.localeCompare(rightPublisher.name)
  );

export const listGenres = async (): Promise<Genre[]> =>
  [...genres].sort((leftGenre, rightGenre) => leftGenre.name.localeCompare(rightGenre.name));

export const getBookById = async (id: number): Promise<BookWithRelations> => {
  const book = books.find((item) => item.id === id && isActiveBook(item));

  if (!book) {
    throw new AppError(404, "Book not found");
  }

  return mapBookWithRelations(book);
};

export const createBook = async (input: CreateBookInput): Promise<BookWithRelations> => {
  assertRelationsExist(input.authorId, input.publisherId, input.genres);

  const duplicateIsbn = books.some((book) => book.isbn === input.isbn);
  if (duplicateIsbn) {
    throw new AppError(409, "Validation failed", [
      { field: "isbn", message: "Book with this ISBN already exists" }
    ]);
  }

  const now = new Date();
  const newBook: StoredBook = {
    id: generateId(books),
    ...input,
    createdAt: now,
    updatedAt: now,
    deletedAt: null
  };

  books.push(newBook);

  return mapBookWithRelations(newBook);
};

export const updateBook = async (id: number, input: UpdateBookInput): Promise<BookWithRelations> => {
  const bookIndex = books.findIndex((book) => book.id === id && isActiveBook(book));

  if (bookIndex === -1) {
    throw new AppError(404, "Book not found");
  }

  const currentBook = books[bookIndex];
  const nextAuthorId = input.authorId ?? currentBook.authorId;
  const nextPublisherId = input.publisherId ?? currentBook.publisherId;
  const nextGenres = input.genres ?? currentBook.genres;

  assertRelationsExist(nextAuthorId, nextPublisherId, nextGenres);

  if (input.isbn) {
    const duplicateIsbn = books.some((book) => book.id !== id && book.isbn === input.isbn);
    if (duplicateIsbn) {
      throw new AppError(409, "Validation failed", [
        { field: "isbn", message: "Book with this ISBN already exists" }
      ]);
    }
  }

  const updatedBook: StoredBook = {
    ...currentBook,
    ...input,
    updatedAt: new Date()
  };

  books[bookIndex] = updatedBook;

  return mapBookWithRelations(updatedBook);
};

export const deleteBook = async (id: number): Promise<void> => {
  const bookIndex = books.findIndex((book) => book.id === id && isActiveBook(book));

  if (bookIndex === -1) {
    throw new AppError(404, "Book not found");
  }

  const deletedAt = new Date();

  books[bookIndex] = {
    ...books[bookIndex],
    deletedAt
  };

  for (let index = 0; index < reviews.length; index += 1) {
    if (reviews[index].bookId === id && isActiveReview(reviews[index])) {
      reviews[index] = {
        ...reviews[index],
        deletedAt
      };
    }
  }
};

export const createReview = async (bookId: number, input: CreateReviewInput): Promise<Review> => {
  const bookExists = books.some((book) => book.id === bookId && isActiveBook(book));

  if (!bookExists) {
    throw new AppError(404, "Book not found");
  }

  const review: StoredReview = {
    id: generateId(reviews),
    bookId,
    ...input,
    createdAt: new Date(),
    deletedAt: null
  };

  reviews.push(review);

  return mapReview(review);
};

export const getBookReviews = async (bookId: number, query?: ReviewListQuery): Promise<Review[]> => {
  const bookExists = books.some((book) => book.id === bookId && isActiveBook(book));

  if (!bookExists) {
    throw new AppError(404, "Book not found");
  }

  const sortDirection = query?.order === "asc" ? 1 : -1;

  return reviews
    .filter((review) => {
      const bookMatch = review.bookId === bookId;
      const ratingMatch = query?.rating ? review.rating === query.rating : true;
      const activeMatch = isActiveReview(review);

      return bookMatch && ratingMatch && activeMatch;
    })
    .sort((leftReview, rightReview) => {
      return (leftReview.createdAt.getTime() - rightReview.createdAt.getTime()) * sortDirection;
    })
    .map((review) => mapReview(review));
};

export const getAverageRating = async (
  bookId: number
): Promise<{ bookId: number; averageRating: number; reviewCount: number }> => {
  const bookReviews = await getBookReviews(bookId);
  const reviewCount = bookReviews.length;

  if (reviewCount === 0) {
    return {
      bookId,
      averageRating: 0,
      reviewCount: 0
    };
  }

  const totalRating = bookReviews.reduce((sum, review) => sum + review.rating, 0);

  return {
    bookId,
    averageRating: Number((totalRating / reviewCount).toFixed(2)),
    reviewCount
  };
};

export const getReviewById = async (id: number): Promise<Review> => {
  const review = reviews.find((item) => item.id === id && isActiveReview(item));

  if (!review) {
    throw new AppError(404, "Review not found");
  }

  return mapReview(review);
};

export const updateReview = async (id: number, input: UpdateReviewInput): Promise<Review> => {
  const reviewIndex = reviews.findIndex((review) => review.id === id && isActiveReview(review));

  if (reviewIndex === -1) {
    throw new AppError(404, "Review not found");
  }

  const updatedReview: StoredReview = {
    ...reviews[reviewIndex],
    ...input
  };

  reviews[reviewIndex] = updatedReview;

  return mapReview(updatedReview);
};

export const deleteReview = async (id: number): Promise<void> => {
  const reviewIndex = reviews.findIndex((review) => review.id === id && isActiveReview(review));

  if (reviewIndex === -1) {
    throw new AppError(404, "Review not found");
  }

  reviews[reviewIndex] = {
    ...reviews[reviewIndex],
    deletedAt: new Date()
  };
};
