import { PaginationQuery } from '../validations/pagination-query';

export const BaseScopes = {
  byUser: (userId: number) => ({ where: { userId } }),
  byPagination: (query: PaginationQuery = { limit: 10, offset: 0 }) => query,
  byId: (id: number) => ({ where: { id } }),
  orderBy: (order: Array<[string, string]>) => ({ order }),
  subQueryFalse: { subQuery: false },
};
