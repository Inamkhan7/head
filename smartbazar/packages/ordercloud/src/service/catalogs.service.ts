import { Buyers, Catalogs } from 'ordercloud-javascript-sdk';
import {
  CreateCatalogDto,
  UpdateCatalogDto,
} from '@packages/commerce/dist/catalogs';
import { GetQueryDto } from '@packages/commerce/dist/common';
import {
  mapCatalogsToTypes,
  mapCatalogToType,
  mapTypeToCatalog,
} from '../mappers/catalogs.mapper';
import { mapToQueryOptions } from '../mappers/request-query.mapper';
import { mapPaginationOptions } from '../utils/pagination';

const getCatalogs = async (options?: GetQueryDto) => {
  const queryOptions = mapToQueryOptions(options, 'Catalogs_List');
  const { Meta, Items } = await Catalogs.List(queryOptions);
  return {
    ...mapPaginationOptions('types', Meta, options),
    data: mapCatalogsToTypes(Items),
  };
};

const getCatalog = async (id: string) => {
  const response = await Catalogs.Get(id);
  return mapCatalogToType(response);
};

const createCatalog = async (catalog: CreateCatalogDto) => {
  const buyers = await Buyers.List();
  const data = mapTypeToCatalog(catalog);
  const response = await Catalogs.Create(data);
  await Catalogs.SaveAssignment({
    CatalogID: response.ID,
    BuyerID: buyers.Items[0].ID,
    ViewAllCategories: true,
    ViewAllProducts: true,
  });
  return mapCatalogToType(response);
};

const updateCatalog = async (id: string, catalog: UpdateCatalogDto) => {
  const data = mapTypeToCatalog(catalog);
  const response = await Catalogs.Patch(id, data);
  return mapCatalogToType(response);
};

const deleteCatalog = async (id: string) => {
  const buyers = await Buyers.List();
  await Catalogs.DeleteAssignment(id, { buyerID: buyers.Items[0].ID });
  return Catalogs.Delete(id);
};

export default {
  getCatalogs,
  getCatalog,
  createCatalog,
  updateCatalog,
  deleteCatalog,
};
