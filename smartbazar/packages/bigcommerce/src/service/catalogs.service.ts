import {
  UpdateCatalogDto,
  CreateCatalogDto,
} from '@packages/commerce/dist/catalogs';
import { GetQueryDto } from '@packages/commerce/dist/common';

const getCatalogs = async (options?: GetQueryDto) => Promise.resolve([]);

const getCatalog = async (id: string) => Promise.resolve({});

const createCatalog = async (catalog: CreateCatalogDto) => null;

const updateCatalog = async (id: string, catalog: UpdateCatalogDto) => null;

const deleteCatalog = (id: string) => null;

export default {
  getCatalogs,
  getCatalog,
  createCatalog,
  updateCatalog,
  deleteCatalog,
};
