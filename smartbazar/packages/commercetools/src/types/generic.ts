export type CommerceToolsResponse<T> = {
  limit: number;
  offset: number;
  count: number;
  total: number;
  results: T;
};
