import { defaultOrderCloudModel } from "../models/orderCloud.model";

const generateOrderCloudSchema = (data) => {
  const schema = { ...defaultOrderCloudModel };
  schema.Objects.Buyers = data.shops;
  schema.Objects.Catalogs = data.shops.map((shop) => ({
    ID: shop.ID,
    Name: shop.ID,
    Description: "Default catalog",
    Active: true,
  }));
  return schema;
};

export default generateOrderCloudSchema;
