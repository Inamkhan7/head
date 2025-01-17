import { kebabCase } from 'lodash';
import {
  Category,
  UpdateCategoryDto,
  CreateCategoryDto,
} from '@packages/commerce/dist/categories';
import { Catalog } from '@packages/commerce/dist/catalogs';

export const mapCategory = (
  category,
  children,
  catalogType: Catalog,
  parent: Category = null,
): Category =>
  ({
    id: category.ID,
    name: category.Name,
    details: category.Description,
    slug: category.ID,
    icon: category.xp?.icon,
    image: category.xp?.image,
    parent_id: category.ParentID,
    type: catalogType,
    parent,
    children: children.map((item) => mapCategory(item, [], catalogType)),
  } as Category);

export const mapCategories = (categories, catalogs: Catalog[]): Category[] => {
  const mappedCategies: Category[] = categories
    .map((category) => {
      const collection = category.Items.reduce(
        (config, item) =>
          item.ParentID
            ? {
                ...config,
                childs: [...config.childs, item],
                catalogs: [
                  ...config.catalogs,
                  catalogs.find((catalog) => catalog.id === item.xp?.catalogID),
                ],
              }
            : {
                ...config,
                parents: [...config.parents, item],
                catalogs: [
                  ...config.catalogs,
                  catalogs.find((catalog) => catalog.id === item.xp?.catalogID),
                ],
              },
        { parents: [], childs: [], catalogs: [] },
      );

      return collection.parents.map((item, index) =>
        mapCategory(
          item,
          collection.childs.filter((child) => child.ParentID === item.ID),
          collection.catalogs[index],
        ),
      );
    })
    .flat();

  return mappedCategies.map((mc) => ({
    ...mc,
    children: mc.children.map((c) => ({
      ...c,
      parent: mc,
    })),
  }));
};

export const mapToCategory = (
  category: CreateCategoryDto | UpdateCategoryDto,
  catalogID: string,
) => ({
  ID: kebabCase(category.name),
  Name: category.name,
  Description: category?.details,
  ParentID: category.parent?.id,
  Active: true,
  xp: {
    image: category.image,
    icon: category.icon,
    catalogID,
  },
});
