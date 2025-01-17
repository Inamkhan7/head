export const mapBcCategoryToShopCategory = (bcCategory) => ({
  id: bcCategory.id,
  name: bcCategory.name,
  slug: bcCategory.id,
  image: bcCategory.image,
});

export const mapBcCategoriesToShopCategories = (bcCategories) =>
  bcCategories.map((item) => mapBcCategoryToShopCategory(item));
