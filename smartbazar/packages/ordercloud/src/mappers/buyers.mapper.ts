import { Buyer as OCBuyer } from 'ordercloud-javascript-sdk';
import { Buyer } from '@packages/commerce/dist/buyers'
import { CreateBuyerDto } from '@packages/commerce/src/buyers';

export const mapBuyer = (
  buyer: OCBuyer,
) => ({
  id: buyer.ID,
  name:buyer.Name,
  is_active: buyer.Active,
});

export const mapInputBuyer = (buyer:CreateBuyerDto):OCBuyer => ({
  ID: buyer.id,
  Name:buyer.name,
  DefaultCatalogID: buyer.defaultCatalog,
  Active: buyer.active
});

export const mapBuyers = (
  buyers: OCBuyer[]
): Buyer[] => {
  return buyers.map((buyer, index) => {
    return mapBuyer(buyer);
  }) as Buyer[];
};