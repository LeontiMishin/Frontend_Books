import { z } from "zod";

const currentYear = new Date().getFullYear();
const yearSchema = z.coerce.number().int().min(1000).max(currentYear);
const pageCountSchema = z.coerce.number().int().positive().max(10000);
const relationIdSchema = z.coerce.number().int().positive();
const genreIdsSchema = z.array(z.coerce.number().int().positive()).min(1);

type NormalizedCreateBookInput = {
  title: string;
  isbn: string;
  publishedYear: number;
  pageCount: number;
  language: string;
  description: string;
  coverImage?: string;
  authorId: number;
  publisherId: number;
  genres: number[];
};

type NormalizedUpdateBookInput = Partial<NormalizedCreateBookInput>;

const bookInputSchema = z.object({
  title: z.string().trim().min(1).max(150).optional(),
  isbn: z.string().trim().regex(/^(97(8|9))?\d{9}(\d|X)$/, "Invalid ISBN format").optional(),
  publishedYear: yearSchema.optional(),
  year: yearSchema.optional(),
  pageCount: pageCountSchema.optional(),
  pages: pageCountSchema.optional(),
  language: z.string().trim().min(2).max(50).optional(),
  description: z.string().trim().min(10).max(500).optional(),
  coverImage: z.string().trim().url().optional(),
  authorId: relationIdSchema.optional(),
  publisherId: relationIdSchema.optional(),
  genres: genreIdsSchema.optional(),
  genreIds: genreIdsSchema.optional()
});

export const createBookSchema = bookInputSchema
  .superRefine((value, context) => {
    if (value.publishedYear === undefined && value.year === undefined) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["publishedYear"],
        message: "publishedYear or year is required"
      });
    }

    if (value.pageCount === undefined && value.pages === undefined) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["pageCount"],
        message: "pageCount or pages is required"
      });
    }

    if (value.genres === undefined && value.genreIds === undefined) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["genres"],
        message: "genres or genreIds is required"
      });
    }

    const requiredFields: Array<keyof typeof value> = [
      "title",
      "isbn",
      "language",
      "description",
      "authorId",
      "publisherId"
    ];

    requiredFields.forEach((field) => {
      if (value[field] === undefined) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: [field],
          message: `${field} is required`
        });
      }
    });
  })
  .transform<NormalizedCreateBookInput>((value) => ({
    title: value.title!,
    isbn: value.isbn!,
    publishedYear: value.publishedYear ?? value.year!,
    pageCount: value.pageCount ?? value.pages!,
    language: value.language!,
    description: value.description!,
    coverImage: value.coverImage,
    authorId: value.authorId!,
    publisherId: value.publisherId!,
    genres: value.genres ?? value.genreIds!
  }));

export const updateBookSchema = bookInputSchema
  .transform<NormalizedUpdateBookInput>((value) => {
    const normalized: NormalizedUpdateBookInput = {};

    if (value.title !== undefined) {
      normalized.title = value.title;
    }

    if (value.isbn !== undefined) {
      normalized.isbn = value.isbn;
    }

    if (value.publishedYear !== undefined || value.year !== undefined) {
      normalized.publishedYear = value.publishedYear ?? value.year;
    }

    if (value.pageCount !== undefined || value.pages !== undefined) {
      normalized.pageCount = value.pageCount ?? value.pages;
    }

    if (value.language !== undefined) {
      normalized.language = value.language;
    }

    if (value.description !== undefined) {
      normalized.description = value.description;
    }

    if (value.coverImage !== undefined) {
      normalized.coverImage = value.coverImage;
    }

    if (value.authorId !== undefined) {
      normalized.authorId = value.authorId;
    }

    if (value.publisherId !== undefined) {
      normalized.publisherId = value.publisherId;
    }

    if (value.genres !== undefined || value.genreIds !== undefined) {
      normalized.genres = value.genres ?? value.genreIds;
    }

    return normalized;
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided"
  });

export const listBooksQuerySchema = z.object({
  title: z.string().trim().min(1).optional(),
  author: z.string().trim().min(1).optional(),
  publisher: z.string().trim().min(1).optional(),
  language: z.string().trim().min(1).optional(),
  genre: z.string().trim().min(1).optional(),
  year: z.coerce.number().int().min(1000).max(new Date().getFullYear()).optional(),
  sortBy: z.enum(["title", "publishedYear"]).optional().default("title"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("asc"),
  order: z.enum(["asc", "desc"]).optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10)
});

export const paramsWithBookIdSchema = z.object({
  bookId: z.coerce.number().int().positive()
});

export const paramsWithIdSchema = z.object({
  id: z.coerce.number().int().positive()
});

export type CreateBookInput = z.infer<typeof createBookSchema>;
export type UpdateBookInput = z.infer<typeof updateBookSchema>;
export type ListBooksQuery = z.infer<typeof listBooksQuerySchema>;
