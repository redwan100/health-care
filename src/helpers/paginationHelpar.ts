type TOptions = {
  page?: number;
  limit?: number;
  sortOrder?: string;
  sortBy?: string;
};

type TOptionsResult = {
  page: number;
  limit: number;
  sortOrder: string;
  sortBy: string;
  skip: number;
};

const calculatePagination = (options: TOptions): TOptionsResult => {
  const page: number = Number(options?.page) || 1;
  const limit: number = Number(options.limit) || 10;
  const skip = (Number(page) - 1) * limit;
  const sortBy = options.sortBy || "createdAt";
  const sortOrder = options.sortOrder || "desc";

  return {
    page,
    limit,
    skip,
    sortOrder,
    sortBy,
  };
};

export const paginationHelper = {
  calculatePagination,
};
