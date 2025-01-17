const genericSearchMap = {
  'type.slug': (ops, val) => ({ ...ops, catalogID: val }),
  'categories.slug': (ops, val) => ({ ...ops, categoryID: val }),
  name: (ops, val) => ({ ...ops, search: val }),
};

const Catalogs_List = {
  ...genericSearchMap,
  'type.slug': (ops, val) => ({ ...ops, search: val, searchOn: 'ID' }),
  'type.group': (ops, val) => ({ ...ops, 'xp.settings.group': val }),
};

const Me_ListCatalogs = {
  ...genericSearchMap,
  'type.slug': (ops, val) => ({ ...ops, search: val, searchOn: 'ID' }),
  'type.group': (ops, val) => ({ ...ops, 'xp.settings.group': val }),
  types: (ops, val) => ({
    ...ops,
    ID: val,
  }),
};

const Me_ListProducts = {
  ...genericSearchMap,
  'categories.slug': (ops, val) => ({ ...ops, 'xp.categories': val }),
  types: (ops, val) => ({
    ...ops,
    'xp.catalogID': val,
  }),
};

const Me_ListCategories = {
  ...genericSearchMap,
  'type.catalogs': (ops, val) => ({
    ...ops,
    groups: val.split('|').map((catalogID) => ({ catalogID })),
  }),
};

export const SEARCH_MAP = {
  Any: genericSearchMap,
  AdminUsers_List: genericSearchMap,
  Catalogs_List,
  Me_ListProducts,
  Products_List: genericSearchMap,
  Me_ListCatalogs,
  Me_ListCategories,
  Orders_List: genericSearchMap,
  Buyers_List: genericSearchMap,
};
