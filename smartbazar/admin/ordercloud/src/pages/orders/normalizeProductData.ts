import { Product, ProductType } from "@ts-types/generated";

export const normalizeProductData = (data: any): Product => {
  const priceSchedule:any = data.PriceSchedule?.PriceBreaks?.[0];
  return {
    id: data.ID || data.slug,
    slug: data.ID || data.slug,
    name: data.Name || data.name || data.xp?.name,
    price: data.price || data.xp?.price || priceSchedule?.Price,
    sale_price: data.sale_price || data.xp?.SalePrice || priceSchedule?.SalePrice,
    max_price: data.PriceSchedule?.PriceBreaks?.reduce(
      (max:any, breakPoint:any) => Math.max(max, breakPoint.Price),
      0
    ),
    min_price: data.PriceSchedule?.PriceBreaks?.reduce(
      (min:any, breakPoint:any) => Math.min(min, breakPoint.Price),
      Infinity
    ),
    quantity: data.Inventory?.QuantityAvailable || 0,
    product_type: data.productType || data.xp?.productType || ProductType.Simple,
    // image: { original: data.image || productPlaceholder||  },
    PriceSchedule: data.PriceSchedule || null,
  };
};
