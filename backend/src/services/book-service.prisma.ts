import { Prisma, type Genre as PrismaGenre, type Review as PrismaReview } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { AppError } from "../middleware/error-handler";
import type { Author, BookWithRelations, Genre, Publisher, Review } from "../models/entities";
import { createPaginatedResponse } from "../utils/pagination";
import type { CreateBookInput, ListBooksQuery, UpdateBookInput } from "../validators/book-schemas";
import type { CreateReviewInput, ReviewListQuery, UpdateReviewInput } from "../validators/review-schemas";

const bookInclude = {
  author: true,
  publisher: true,
  genres: true,
  reviews: {
    where: {
      deletedAt: null
    }
  }
} satisfies Prisma.BookInclude;

type PrismaBookWithRelations = Prisma.BookGetPayload<{
  include: typeof bookInclude;
}>;

const mapReview = (review: PrismaReview): Review => ({
  id: review.id,
  bookId: review.bookId,
  userName: review.userName,
  rating: review.rating as Review["rating"],
  comment: review.comment,
  createdAt: review.createdAt
});

const mapBook = (book: PrismaBookWithRelations): BookWithRelations => ({
  id: book.id,
  title: book.title,
  isbn: book.isbn,
  publishedYear: book.publishedYear,
  pageCount: book.pageCount,
  language: book.language,
  description: book.description,
  coverImage: book.coverImage ?? undefined,
  authorId: book.authorId,
  publisherId: book.publisherId,
  genres: book.genres.map((genre: PrismaGenre) => genre.id),
  createdAt: book.createdAt,
  updatedAt: book.updatedAt,
  author: {
    ...book.author,
    biography: book.author.biography ?? undefined
  },
  publisher: {
    ...book.publisher,
    website: book.publisher.website ?? undefined
  },
  genreDetails: book.genres,
  reviews: book.reviews.map((review) => mapReview(review))
});

const assertRelationsExist = async (
  authorId: number,
  publisherId: number,
  genreIds: number[]
): Promise<void> => {
  const [authorCount, publisherCount, genreCount] = await prisma.$transaction([
    prisma.author.count({ where: { id: authorId } }),
    prisma.publisher.count({ where: { id: publisherId } }),
    prisma.genre.count({ where: { id: { in: genreIds } } })
  ]);

  if (authorCount === 0) {
    throw new AppError(400, "Validation failed", [
      { field: "authorId", message: "Author does not exist" }
    ]);
  }

  if (publisherCount === 0) {
    throw new AppError(400, "Validation failed", [
      { field: "publisherId", message: "Publisher does not exist" }
    ]);
  }

  if (genreCount !== genreIds.length) {
    throw new AppError(400, "Validation failed", [
      { field: "genres", message: "One or more genres do not exist" }
    ]);
  }
};

const getSortDirection = (query: ListBooksQuery): Prisma.SortOrder =>
  (query.order ?? query.sortOrder ?? "asc") === "desc" ? "desc" : "asc";

const buildWhereClause = (query: ListBooksQuery): Prisma.BookWhereInput => ({
  deletedAt: null,
  ...(query.title
    ? {
        title: {
          contains: query.title,
          mode: Prisma.QueryMode.insensitive
        }
      }
    : {}),
  ...(query.language
    ? {
        language: {
          equals: query.language,
          mode: Prisma.QueryMode.insensitive
        }
      }
    : {}),
  ...(query.year ? { publishedYear: query.year } : {}),
  ...(query.author
    ? {
        author: {
          OR: [
            {
              firstName: {
                contains: query.author,
                mode: Prisma.QueryMode.insensitive
              }
            },
            {
              lastName: {
                contains: query.author,
                mode: Prisma.QueryMode.insensitive
              }
            }
          ]
        }
      }
    : {}),
  ...(query.publisher
    ? {
        publisher: {
          name: {
            contains: query.publisher,
            mode: Prisma.QueryMode.insensitive
          }
        }
      }
    : {}),
  ...(query.genre
    ? {
        genres: {
          some: {
            name: {
              equals: query.genre,
              mode: Prisma.QueryMode.insensitive
            }
          }
        }
      }
    : {})
});

export const listBooks = async (query: ListBooksQuery) => {
  const where = buildWhereClause(query);
  const orderBy: Prisma.BookOrderByWithRelationInput =
    query.sortBy === "publishedYear"
      ? { publishedYear: getSortDirection(query) }
      : { title: getSortDirection(query) };

  const [totalItems, items] = await prisma.$transaction([
    prisma.book.count({ where }),
    prisma.book.findMany({
      where,
      include: bookInclude,
      orderBy,
      skip: (query.page - 1) * query.limit,
      take: query.limit
    })
  ]);

  return createPaginatedResponse(
    items.map((book) => mapBook(book)),
    query.page,
    query.limit,
    totalItems
  );
};

export const listAuthors = async (): Promise<Author[]> =>
  (
    await prisma.author.findMany({
      orderBy: [{ lastName: "asc" }, { firstName: "asc" }]
    })
  ).map((author) => ({
    ...author,
    biography: author.biography ?? undefined
  }));

export const listPublishers = async (): Promise<Publisher[]> =>
  (
    await prisma.publisher.findMany({
      orderBy: { name: "asc" }
    })
  ).map((publisher) => ({
    ...publisher,
    website: publisher.website ?? undefined
  }));

export const listGenres = async (): Promise<Genre[]> =>
  prisma.genre.findMany({
    orderBy: { name: "asc" }
  });

export const getBookById = async (id: number): Promise<BookWithRelations> => {
  const book = await prisma.book.findFirst({
    where: { id, deletedAt: null },
    include: bookInclude
  });

  if (!book) {
    throw new AppError(404, "Book not found");
  }

  return mapBook(book);
};

export const createBook = async (input: CreateBookInput): Promise<BookWithRelations> => {
  await assertRelationsExist(input.authorId, input.publisherId, input.genres);

  const book = await prisma.book.create({
    data: {
      title: input.title,
      isbn: input.isbn,
      publishedYear: input.publishedYear,
      pageCount: input.pageCount,
      language: input.language,
      description: input.description,
      coverImage: input.coverImage,
      author: { connect: { id: input.authorId } },
      publisher: { connect: { id: input.publisherId } },
      genres: { connect: input.genres.map((id) => ({ id })) }
    },
    include: bookInclude
  });

  return mapBook(book);
};

export const updateBook = async (id: number, input: UpdateBookInput): Promise<BookWithRelations> => {
  const existingBook = await prisma.book.findFirst({
    where: { id, deletedAt: null },
    include: { genres: true }
  });

  if (!existingBook) {
    throw new AppError(404, "Book not found");
  }

  const nextAuthorId = input.authorId ?? existingBook.authorId;
  const nextPublisherId = input.publisherId ?? existingBook.publisherId;
  const nextGenreIds = input.genres ?? existingBook.genres.map((genre) => genre.id);

  await assertRelationsExist(nextAuthorId, nextPublisherId, nextGenreIds);

  const book = await prisma.book.update({
    where: { id },
    data: {
      title: input.title,
      isbn: input.isbn,
      publishedYear: input.publishedYear,
      pageCount: input.pageCount,
      language: input.language,
      description: input.description,
      coverImage: input.coverImage,
      author: { connect: { id: nextAuthorId } },
      publisher: { connect: { id: nextPublisherId } },
      genres: { set: nextGenreIds.map((genreId) => ({ id: genreId })) }
    },
    include: bookInclude
  });

  return mapBook(book);
};

export const deleteBook = async (id: number): Promise<void> => {
  const deletedAt = new Date();
  const [deleted] = await prisma.$transaction([
    prisma.book.updateMany({
      where: { id, deletedAt: null },
      data: { deletedAt }
    }),
    prisma.review.updateMany({
      where: { bookId: id, deletedAt: null },
      data: { deletedAt }
    })
  ]);

  if (deleted.count === 0) {
    throw new AppError(404, "Book not found");
  }
};

export const createReview = async (bookId: number, input: CreateReviewInput): Promise<Review> => {
  const bookExists = await prisma.book.count({ where: { id: bookId, deletedAt: null } });

  if (bookExists === 0) {
    throw new AppError(404, "Book not found");
  }

  const review = await prisma.review.create({
    data: {
      book: { connect: { id: bookId } },
      userName: input.userName,
      rating: input.rating,
      comment: input.comment
    }
  });

  return mapReview(review);
};

export const getBookReviews = async (bookId: number, query?: ReviewListQuery): Promise<Review[]> => {
  const bookExists = await prisma.book.count({ where: { id: bookId, deletedAt: null } });

  if (bookExists === 0) {
    throw new AppError(404, "Book not found");
  }

  const bookReviews = await prisma.review.findMany({
    where: {
      bookId,
      deletedAt: null,
      ...(query?.rating ? { rating: query.rating } : {})
    },
    orderBy: { createdAt: query?.order === "asc" ? "asc" : "desc" }
  });

  return bookReviews.map((review) => mapReview(review));
};

export const getAverageRating = async (
  bookId: number
): Promise<{ bookId: number; averageRating: number; reviewCount: number }> => {
  const bookExists = await prisma.book.count({ where: { id: bookId, deletedAt: null } });

  if (bookExists === 0) {
    throw new AppError(404, "Book not found");
  }

  const result = await prisma.review.aggregate({
    where: { bookId, deletedAt: null },
    _avg: { rating: true },
    _count: { rating: true }
  });

  return {
    bookId,
    averageRating: Number((result._avg.rating ?? 0).toFixed(2)),
    reviewCount: result._count.rating
  };
};

export const getReviewById = async (id: number): Promise<Review> => {
  const review = await prisma.review.findFirst({
    where: { id, deletedAt: null }
  });

  if (!review) {
    throw new AppError(404, "Review not found");
  }

  return mapReview(review);
};

export const updateReview = async (id: number, input: UpdateReviewInput): Promise<Review> => {
  const existingReview = await prisma.review.findFirst({
    where: { id, deletedAt: null }
  });

  if (!existingReview) {
    throw new AppError(404, "Review not found");
  }

  const review = await prisma.review.update({
    where: { id },
    data: {
      userName: input.userName,
      rating: input.rating,
      comment: input.comment
    }
  });

  return mapReview(review);
};

export const deleteReview = async (id: number): Promise<void> => {
  const deleted = await prisma.review.updateMany({
    where: { id, deletedAt: null },
    data: { deletedAt: new Date() }
  });

  if (deleted.count === 0) {
    throw new AppError(404, "Review not found");
  }
};
