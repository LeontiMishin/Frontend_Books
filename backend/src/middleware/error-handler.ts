import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly details?: Array<{ field: string; message: string }>;

  public constructor(
    statusCode: number,
    message: string,
    details?: Array<{ field: string; message: string }>
  ) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

export const errorHandler = (
  error: Error,
  _request: Request,
  response: Response,
  _next: NextFunction
): void => {
  const prismaCode =
    error.name === "PrismaClientKnownRequestError" &&
    "code" in error &&
    typeof error.code === "string"
      ? error.code
      : null;

  if (error instanceof ZodError) {
    response.status(400).json({
      error: "Validation failed",
      details: error.issues.map((issue) => ({
        field: issue.path.join(".") || "body",
        message: issue.message
      }))
    });
    return;
  }

  if (error instanceof AppError) {
    response.status(error.statusCode).json({
      error: error.message,
      details: error.details ?? []
    });
    return;
  }

  if (prismaCode === "P2002") {
    response.status(409).json({
      error: "Validation failed",
      details: [
        {
          field: "unique",
          message: "Unique constraint failed"
        }
      ]
    });
    return;
  }

  if (prismaCode === "P2003") {
    response.status(400).json({
      error: "Validation failed",
      details: [
        {
          field: "relation",
          message: "Related entity does not exist"
        }
      ]
    });
    return;
  }

  if (prismaCode === "P2025") {
    response.status(404).json({
      error: "Resource not found",
      details: []
    });
    return;
  }

  response.status(500).json({
    error: "Internal server error",
    details: []
  });
};
