import { Buyer } from '@packages/commerce/dist/buyers';

export const mapBuyer = (buyer) => ({
  id: buyer.id,
  name: buyer.name['en-US'],
  is_active: true,
});

export const mapBuyers = (buyers): Buyer[] => {
  return buyers?.map((buyer, index) => {
    return mapBuyer(buyer);
  }) as Buyer[];
};
