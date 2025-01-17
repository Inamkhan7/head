export const createQueryString = (props: { [key: string]: any }) => {
  const query = [];

  Object.keys(props).forEach((key) => {
    if (props[key]) {
      query.push(`${key}=${props[key]}`);
    }
  });

  return query.join('&');
};
