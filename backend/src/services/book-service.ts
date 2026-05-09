import { dataSourceMode } from "../config/data-source";
import type { CreateBookInput, ListBooksQuery, UpdateBookInput } from "../validators/book-schemas";
import type { CreateReviewInput, ReviewListQuery, UpdateReviewInput } from "../validators/review-schemas";

type ServiceModule = typeof import("./book-service.mock");

const service: ServiceModule =
  dataSourceMode === "postgres"
    ? (require("./book-service.prisma") as ServiceModule)
    : (require("./book-service.mock") as ServiceModule);

export const listBooks = (query: ListBooksQuery) => service.listBooks(query);
export const listAuthors = () => service.listAuthors();
export const listPublishers = () => service.listPublishers();
export const listGenres = () => service.listGenres();
export const getBookById = (id: number) => service.getBookById(id);
export const createBook = (input: CreateBookInput) => service.createBook(input);
export const updateBook = (id: number, input: UpdateBookInput) => service.updateBook(id, input);
export const deleteBook = (id: number) => service.deleteBook(id);
export const createReview = (bookId: number, input: CreateReviewInput) =>
  service.createReview(bookId, input);
export const getBookReviews = (bookId: number, query?: ReviewListQuery) =>
  service.getBookReviews(bookId, query);
export const getAverageRating = (bookId: number) => service.getAverageRating(bookId);
export const getReviewById = (id: number) => service.getReviewById(id);
export const updateReview = (id: number, input: UpdateReviewInput) =>
  service.updateReview(id, input);
export const deleteReview = (id: number) => service.deleteReview(id);
