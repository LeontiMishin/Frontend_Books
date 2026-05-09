import { z } from "zod";

const ratingSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5)
]);

const queryRatingSchema = z
  .coerce
  .number()
  .int()
  .min(1)
  .max(5)
  .transform((value) => value as z.infer<typeof ratingSchema>);

const reviewInputSchema = z.object({
  userName: z.string().trim().min(2).max(100).optional(),
  username: z.string().trim().min(2).max(100).optional(),
  rating: ratingSchema.optional(),
  comment: z.string().trim().min(3).max(500).optional()
});

type NormalizedCreateReviewInput = {
  userName: string;
  rating: z.infer<typeof ratingSchema>;
  comment: string;
};

type NormalizedUpdateReviewInput = Partial<NormalizedCreateReviewInput>;

export const createReviewSchema = reviewInputSchema
  .superRefine((value, context) => {
    if (!value.userName && !value.username) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["userName"],
        message: "userName or username is required"
      });
    }

    if (value.rating === undefined) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["rating"],
        message: "rating is required"
      });
    }

    if (value.comment === undefined) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["comment"],
        message: "comment is required"
      });
    }
  })
  .transform<NormalizedCreateReviewInput>((value) => ({
    userName: value.userName ?? value.username!,
    rating: value.rating!,
    comment: value.comment!
  }));

export const updateReviewSchema = reviewInputSchema
  .transform<NormalizedUpdateReviewInput>((value) => {
    const normalized: NormalizedUpdateReviewInput = {};

    if (value.userName !== undefined || value.username !== undefined) {
      normalized.userName = value.userName ?? value.username;
    }

    if (value.rating !== undefined) {
      normalized.rating = value.rating;
    }

    if (value.comment !== undefined) {
      normalized.comment = value.comment;
    }

    return normalized;
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided"
  });

export const reviewParamsSchema = z.object({
  id: z.coerce.number().int().positive()
});

export const reviewListQuerySchema = z.object({
  rating: queryRatingSchema.optional(),
  sortBy: z.enum(["createdAt"]).optional().default("createdAt"),
  order: z.enum(["asc", "desc"]).optional().default("desc")
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;
export type ReviewListQuery = z.infer<typeof reviewListQuerySchema>;
