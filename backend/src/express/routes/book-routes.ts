import { Router } from "express";
import {
  createBookHandler,
  createReviewHandler,
  deleteBookHandler,
  deleteReviewHandler,
  getAverageRatingHandler,
  getBookByIdHandler,
  getBookReviewsHandler,
  getReviewByIdHandler,
  listAuthorsHandler,
  listBooksHandler,
  listGenresHandler,
  listPublishersHandler,
  updateBookHandler,
  updateReviewHandler
} from "../../controllers/book-controller";

export const bookRoutes = Router();

/**
 * @openapi
 * /authors:
 *   get:
 *     summary: List authors for book form lookups
 *     tags: [Lookups]
 *     responses:
 *       200:
 *         description: Array of authors
 */
bookRoutes.get("/authors", listAuthorsHandler);

/**
 * @openapi
 * /publishers:
 *   get:
 *     summary: List publishers for book form lookups
 *     tags: [Lookups]
 *     responses:
 *       200:
 *         description: Array of publishers
 */
bookRoutes.get("/publishers", listPublishersHandler);

/**
 * @openapi
 * /genres:
 *   get:
 *     summary: List genres for book form lookups
 *     tags: [Lookups]
 *     responses:
 *       200:
 *         description: Array of genres
 */
bookRoutes.get("/genres", listGenresHandler);

/**
 * @openapi
 * components:
 *   schemas:
 *     ErrorDetail:
 *       type: object
 *       properties:
 *         field:
 *           type: string
 *         message:
 *           type: string
 *       required:
 *         - field
 *         - message
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *         details:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ErrorDetail'
 *       required:
 *         - error
 *         - details
 *     Pagination:
 *       type: object
 *       properties:
 *         currentPage:
 *           type: integer
 *         totalPages:
 *           type: integer
 *         totalItems:
 *           type: integer
 *         itemsPerPage:
 *           type: integer
 *         hasNextPage:
 *           type: boolean
 *         hasPreviousPage:
 *           type: boolean
 *       required:
 *         - currentPage
 *         - totalPages
 *         - totalItems
 *         - itemsPerPage
 *         - hasNextPage
 *         - hasPreviousPage
 *     Author:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         birthYear:
 *           type: integer
 *         nationality:
 *           type: string
 *         biography:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *     Genre:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *     Publisher:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         country:
 *           type: string
 *         foundedYear:
 *           type: integer
 *         website:
 *           type: string
 *           format: uri
 *         createdAt:
 *           type: string
 *           format: date-time
 *     Review:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         bookId:
 *           type: integer
 *         userName:
 *           type: string
 *         rating:
 *           type: integer
 *           enum: [1, 2, 3, 4, 5]
 *         comment:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *     ReviewCreate:
 *       type: object
 *       required:
 *         - userName
 *         - rating
 *         - comment
 *       properties:
 *         userName:
 *           type: string
 *         rating:
 *           type: integer
 *           enum: [1, 2, 3, 4, 5]
 *         comment:
 *           type: string
 *     ReviewUpdate:
 *       type: object
 *       properties:
 *         userName:
 *           type: string
 *         rating:
 *           type: integer
 *           enum: [1, 2, 3, 4, 5]
 *         comment:
 *           type: string
 *     Book:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         isbn:
 *           type: string
 *         publishedYear:
 *           type: integer
 *         pageCount:
 *           type: integer
 *         language:
 *           type: string
 *         description:
 *           type: string
 *         coverImage:
 *           type: string
 *           format: uri
 *         authorId:
 *           type: integer
 *         publisherId:
 *           type: integer
 *         genres:
 *           type: array
 *           items:
 *             type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         author:
 *           $ref: '#/components/schemas/Author'
 *         publisher:
 *           $ref: '#/components/schemas/Publisher'
 *         genreDetails:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Genre'
 *         reviews:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Review'
 *     BookCreate:
 *       type: object
 *       required:
 *         - title
 *         - isbn
 *         - publishedYear
 *         - pageCount
 *         - language
 *         - description
 *         - authorId
 *         - publisherId
 *         - genres
 *       properties:
 *         title:
 *           type: string
 *         isbn:
 *           type: string
 *         publishedYear:
 *           type: integer
 *         pageCount:
 *           type: integer
 *         language:
 *           type: string
 *         description:
 *           type: string
 *         coverImage:
 *           type: string
 *           format: uri
 *         authorId:
 *           type: integer
 *         publisherId:
 *           type: integer
 *         genres:
 *           type: array
 *           items:
 *             type: integer
 *     BookUpdate:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         isbn:
 *           type: string
 *         publishedYear:
 *           type: integer
 *         pageCount:
 *           type: integer
 *         language:
 *           type: string
 *         description:
 *           type: string
 *         coverImage:
 *           type: string
 *           format: uri
 *         authorId:
 *           type: integer
 *         publisherId:
 *           type: integer
 *         genres:
 *           type: array
 *           items:
 *             type: integer
 */

/**
 * @openapi
 * /books:
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookCreate'
 *     responses:
 *       201:
 *         description: Created book
 *       400:
 *         description: Validation failed
 *       409:
 *         description: ISBN already exists
 */
bookRoutes.post("/books", createBookHandler);

/**
 * @openapi
 * /books:
 *   get:
 *     summary: List books with filters, sorting and pagination
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *       - in: query
 *         name: publisher
 *         schema:
 *           type: string
 *       - in: query
 *         name: language
 *         schema:
 *           type: string
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [title, publishedYear]
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Paginated list of books
 *       400:
 *         description: Validation failed
 */
bookRoutes.get("/books", listBooksHandler);

/**
 * @openapi
 * /books/{id}:
 *   get:
 *     summary: Get a book by ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Book object
 *       404:
 *         description: Book not found
 */
bookRoutes.get("/books/:id", getBookByIdHandler);

/**
 * @openapi
 * /books/{id}:
 *   put:
 *     summary: Update a book by ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookUpdate'
 *     responses:
 *       200:
 *         description: Updated book
 *       400:
 *         description: Validation failed
 *       404:
 *         description: Book not found
 *       409:
 *         description: ISBN already exists
 */
bookRoutes.put("/books/:id", updateBookHandler);

/**
 * @openapi
 * /books/{id}:
 *   delete:
 *     summary: Delete a book by ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deletion result
 *       404:
 *         description: Book not found
 */
bookRoutes.delete("/books/:id", deleteBookHandler);

/**
 * @openapi
 * /books/{bookId}/reviews:
 *   post:
 *     summary: Create a review for a book
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReviewCreate'
 *     responses:
 *       201:
 *         description: Created review
 *       400:
 *         description: Validation failed
 *       404:
 *         description: Book not found
 *   get:
 *     summary: Get reviews for a book
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: rating
 *         schema:
 *           type: integer
 *           enum: [1, 2, 3, 4, 5]
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt]
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *     responses:
 *       200:
 *         description: Array of reviews
 *       404:
 *         description: Book not found
 */
bookRoutes.post("/books/:bookId/reviews", createReviewHandler);
bookRoutes.get("/books/:bookId/reviews", getBookReviewsHandler);

/**
 * @openapi
 * /reviews/{id}:
 *   get:
 *     summary: Get a review by ID
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Review object
 *       404:
 *         description: Review not found
 *   put:
 *     summary: Update a review by ID
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReviewUpdate'
 *     responses:
 *       200:
 *         description: Updated review
 *       400:
 *         description: Validation failed
 *       404:
 *         description: Review not found
 *   delete:
 *     summary: Delete a review by ID
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Review deleted
 *       404:
 *         description: Review not found
 */
bookRoutes.get("/reviews/:id", getReviewByIdHandler);
bookRoutes.put("/reviews/:id", updateReviewHandler);
bookRoutes.delete("/reviews/:id", deleteReviewHandler);

/**
 * @openapi
 * /books/{id}/average-rating:
 *   get:
 *     summary: Get average rating for a book
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Average rating result
 *       404:
 *         description: Book not found
 */
bookRoutes.get("/books/:id/average-rating", getAverageRatingHandler);
