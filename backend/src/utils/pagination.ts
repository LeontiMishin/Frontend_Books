import type { PaginatedResponse, PaginationMeta } from "../models/entities";

export const createPaginatedResponse = <T>(
  items: T[],
  page: number,
  limit: number,
  totalItems: number
): PaginatedResponse<T> => {
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));

  const pagination: PaginationMeta = {
    currentPage: page,
    totalPages,
    totalItems,
    itemsPerPage: limit,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1
  };

  return {
    data: items,
    pagination
  };
};
