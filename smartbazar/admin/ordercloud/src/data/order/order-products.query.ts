import {
  QueryParamsType,
  ProductsQueryOptionsType,
} from '@ts-types/custom.types';
import {
  createQueryUrl,
  mapPaginatorData,
  stringifySearchQuery,
} from '@utils/data-mappers';
import { useQuery } from 'react-query';
import Product from '@repositories/product';
import { API_ENDPOINTS } from '@utils/api/endpoints';
const useProductsQueryForOrder = (
  params: ProductsQueryOptionsType,
  options: any = {}
) => {
  return useQuery<any, Error>([API_ENDPOINTS.PRODUCTS, params], fetchProducts, {
    ...options,
    keepPreviousData: true,
  });
};

export { useProductsQueryForOrder, fetchProducts };
// const ORDERCLOUD_API_ENDPOINT = process.env.NEXT_PUBLIC_REST_API_ENDPOINT_ORDERCLOUD;

const fetchProducts = async ({ queryKey }: QueryParamsType) => {
  const [_key, params] = queryKey;
  console.log(params , 'useProductsQuery')
  const {
    page,
    text,
    type,
    buyer,
    category,
    // catalogID, // Add catalogID to the parameters
    limit = 15,
    // orderBy = 'updated_at',
    sortedBy = 'DESC',
  } = params as ProductsQueryOptionsType;

  console.log(params , 'params')
  // Construct search string for other parameters, excluding catalogID
  const searchParams = stringifySearchQuery({
    text,
    type,
    buyer,
    category,
  });
  // let searchString = searchParams.trim().replace(/^text:/, '');
  // searchString = searchString.replace(/type\.slug:/g, 'catalogID=');
  console.log(searchParams, 'Adjusted search string'); 

  // Construct URL with catalogID as a separate query parameter
  // const url = createQueryUrl(API_ENDPOINTS.PRODUCTS, {
  //   search: searchParams,
  //   searchJoin: 'and',
  //   // buyer,
  //   category,
  //   limit,
  //   page,
  //   // catalogID, // Add catalogID as a query parameter
  //   // orderBy,
  //   sortedBy,
  // });
  let url = '';

  if (text) {
    // If only `text` has data, construct the specific URL format
    url = `${API_ENDPOINTS.PRODUCTS}/${text}`;
  } else {
    // Fallback to the default URL construction
    url = createQueryUrl(API_ENDPOINTS.PRODUCTS, {
      search: searchParams,
      searchJoin: 'and',
      category,
      limit,
      page,
      sortedBy,
    });
  }
  
  console.log(url, 'Generated URL');

  const {
    data: { data, ...rest },
  } = await Product.all(url);
  return { products: { data, paginatorInfo: mapPaginatorData({ ...rest }) } };
  
};

