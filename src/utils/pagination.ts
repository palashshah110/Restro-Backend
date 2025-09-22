export interface PaginationOptions {
  page: number;
  limit: number;
  sort?: string;
}

export const getPaginationOptions = (query: any): PaginationOptions => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
  const sort = query.sort || '-createdAt';

  return { page, limit, sort };
};

export const paginate = async (
  model: any,
  filter: any = {},
  options: PaginationOptions,
  populate?: string | string[] | { path: string; select?: string } | { path: string; select?: string }[]
) => {
  const { page, limit, sort } = options;
  const skip = (page - 1) * limit;

  let query = model.find(filter).sort(sort).skip(skip).limit(limit);
  
  if (populate) {
    query = query.populate(populate);
  }

  const [data, total] = await Promise.all([
    query.exec(),
    model.countDocuments(filter)
  ]);

  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    data,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: total,
      itemsPerPage: limit,
      hasNextPage,
      hasPrevPage
    }
  };
};