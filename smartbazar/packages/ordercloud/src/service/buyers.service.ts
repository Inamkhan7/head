import { GetQueryDto, paginate } from '@packages/commerce';
import { mapToQueryOptions } from '../mappers/request-query.mapper';
import { Buyer, Buyers } from 'ordercloud-javascript-sdk';
import { mapBuyers, mapInputBuyer } from '../mappers/buyers.mapper';
import { mapPaginationOptions } from '../utils';
import { CreateBuyerDto } from '@packages/commerce/src/buyers';

export const createBuyer = (buyer: CreateBuyerDto) => {
  Buyers.Create(mapInputBuyer(buyer) as Buyer); 
  
}

export const getBuyer = () => ({
  BuyerID: process.env?.BUYER_ID,
  UserGroupID: `${process.env?.BUYER_ID}-shoppers`,
});

const getBuyers = async (options: GetQueryDto) => {
  const queryOptions = mapToQueryOptions(options, 'Buyers_List');
  const { Items, Meta } = await Buyers.List(queryOptions);
  return {
    ...mapPaginationOptions('buyers', Meta, options),
    data: mapBuyers(Items) as Buyer[],
  };
};

export default {
  createBuyer,
  getBuyer,
  getBuyers
};
