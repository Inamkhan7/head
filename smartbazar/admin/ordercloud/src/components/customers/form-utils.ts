import { BuyerInput } from "@ts-types/custom.types";

export function getBuyerDetails(buyer: BuyerInput) {
  if (!Object.keys(buyer).length) {
    return {
      id: "",
      name: "",
      defaultCatalog: "",
      Active:false
    };
  }
  const buyerData = buyer;
  return {
    id: buyerData.id,
    name: buyerData.name,
    defaultCatalog: buyerData.defaultCatalog,
    active:buyerData.active
  };
}

export function getBuyerInputValues(values: any, initialValues: any) {
  return {
    id: values.id,
    name: values.name,
    defaultCatalog: values.catalogID,
    active:values.active
  };
}
