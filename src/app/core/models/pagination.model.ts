export interface PaginationLinks {
  next?: number;
  prev?: number;
  first?: number;
  last?: number;
}

export interface PaginationMeta {
  page: number;
  perPage: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  links?: PaginationLinks;
}

