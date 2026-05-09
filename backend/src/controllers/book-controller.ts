import type { NextFunction, Request, Response } from "express";
import {
  createBook,
  createReview,
  deleteBook,
  deleteReview,
  getAverageRating,
  getBookById,
  getBookReviews,
  getReviewById,
  listAuthors,
  listBooks,
  listGenres,
  listPublishers,
  updateBook,
  updateReview
} from "../services/book-service";
import {
  createBookSchema,
  listBooksQuerySchema,
  paramsWithBookIdSchema,
  paramsWithIdSchema,
  updateBookSchema
} from "../validators/book-schemas";
import {
  createReviewSchema,
  reviewListQuerySchema,
  reviewParamsSchema,
  updateReviewSchema
} from "../validators/review-schemas";

export const createBookHandler = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const body = createBookSchema.parse(request.body);
    const book = await createBook(body);

    response.status(201).json({ data: book });
  } catch (error) {
    next(error);
  }
};

export const listBooksHandler = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const query = listBooksQuerySchema.parse(request.query);
    const result = await listBooks(query);

    response.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getBookByIdHandler = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const params = paramsWithIdSchema.parse(request.params);
    const book = await getBookById(params.id);

    response.status(200).json({ data: book });
  } catch (error) {
    next(error);
  }
};

export const listAuthorsHandler = async (
  _request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authors = await listAuthors();
    response.status(200).json({ data: authors });
  } catch (error) {
    next(error);
  }
};

export const listPublishersHandler = async (
  _request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const publishers = await listPublishers();
    response.status(200).json({ data: publishers });
  } catch (error) {
    next(error);
  }
};

export const listGenresHandler = async (
  _request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const genres = await listGenres();
    response.status(200).json({ data: genres });
  } catch (error) {
    next(error);
  }
};

export const updateBookHandler = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const params = paramsWithIdSchema.parse(request.params);
    const body = updateBookSchema.parse(request.body);
    const book = await updateBook(params.id, body);

    response.status(200).json({ data: book });
  } catch (error) {
    next(error);
  }
};

export const deleteBookHandler = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const params = paramsWithIdSchema.parse(request.params);
    await deleteBook(params.id);

    response.status(200).json({
      data: {
        message: "Book deleted successfully"
      }
    });
  } catch (error) {
    next(error);
  }
};

export const createReviewHandler = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const params = paramsWithBookIdSchema.parse(request.params);
    const body = createReviewSchema.parse(request.body);
    const review = await createReview(params.bookId, body);

    response.status(201).json({ data: review });
  } catch (error) {
    next(error);
  }
};

export const getBookReviewsHandler = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const params = paramsWithBookIdSchema.parse(request.params);
    const query = reviewListQuerySchema.parse(request.query);
    const bookReviews = await getBookReviews(params.bookId, query);

    response.status(200).json({ data: bookReviews });
  } catch (error) {
    next(error);
  }
};

export const getAverageRatingHandler = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const params = paramsWithIdSchema.parse(request.params);
    const averageRating = await getAverageRating(params.id);

    response.status(200).json({ data: averageRating });
  } catch (error) {
    next(error);
  }
};

export const getReviewByIdHandler = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const params = reviewParamsSchema.parse(request.params);
    const review = await getReviewById(params.id);

    response.status(200).json({ data: review });
  } catch (error) {
    next(error);
  }
};

export const updateReviewHandler = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const params = reviewParamsSchema.parse(request.params);
    const body = updateReviewSchema.parse(request.body);
    const review = await updateReview(params.id, body);

    response.status(200).json({ data: review });
  } catch (error) {
    next(error);
  }
};

export const deleteReviewHandler = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const params = reviewParamsSchema.parse(request.params);
    await deleteReview(params.id);

    response.status(200).json({
      data: {
        message: "Review deleted successfully"
      }
    });
  } catch (error) {
    next(error);
  }
};
