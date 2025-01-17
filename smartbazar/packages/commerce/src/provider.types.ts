import { AuthResponse, LoginDto } from '../src/auth';
import { User } from '../src/users';
import {
  Attribute,
  UpdateAttributeDto,
  CreateAttributeDto,
} from '../src/attributes';
import { CreateCatalogDto, UpdateCatalogDto, Catalog } from '../src/catalogs';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  Category,
} from '../src/categories';
import { GetQueryDto } from './common';

export type AuthService = {
  login: (loginInput: LoginDto) => Promise<AuthResponse>;
  me: () => Promise<User>;
};

export type SpecsService = {
  createSpec: (createAttributeDto: CreateAttributeDto) => Promise<Attribute>;
  getAll: () => Promise<Attribute[]>;
  getById: (id: string) => Promise<Attribute>;
  updateSpec: (
    id: string,
    updateAttributeDto: UpdateAttributeDto,
  ) => Promise<Attribute>;
  deleteSpec: (id: string) => Promise<void>;
};

export type CatalogsService = {
  getCatalogs: (options?: GetQueryDto) => Promise<Catalog[]>;
  getCatalog: (id: string) => Promise<Catalog>;
  createCatalog: (catalog: CreateCatalogDto) => Promise<Catalog>;
  updateCatalog: (id: string, catalog: UpdateCatalogDto) => Promise<Catalog>;
  deleteCatalog: (id: string) => Promise<void>;
};

export type CategoriesService = {
  getCategories: (search?: GetQueryDto) => Promise<Category[]>;
  getCategory: (catalogId: string, id: string) => Promise<Category>;
  createCategory: (
    catalogId: string,
    category: CreateCategoryDto,
  ) => Promise<Category>;
  deleteCategory: (catalogId: string, categoryId: string) => Promise<void>;
  updateCategory: (
    catalogId: string,
    categoryId: string,
    category: UpdateCategoryDto,
  ) => Promise<Category>;
};

export type Provider = {
  Auth: AuthService;
  Specs: SpecsService;
  Catalogs: CatalogsService;
  Categories: CatalogsService;
};

export type ProviderCollection = {
  [key: string]: Provider;
};
