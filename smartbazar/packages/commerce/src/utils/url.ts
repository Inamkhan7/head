export const toQueryString = <T>(queryParams: T) =>
  Object.keys(queryParams)
    .reduce((query, ok) => {
      if (
        ok !== 'page' &&
        (queryParams[ok] !== undefined || queryParams[ok] !== null)
      ) {
        return query.concat(`${ok}=${queryParams[ok]}`);
      }
      return query;
    }, [])
    .join('&');
