import axios from 'axios';
import { GetQueryDto } from '@packages/commerce';
import { mapToQueryOptions } from '../mappers/request-query.mapper';
import { mapBuyers } from '../mappers/buyers.mapper';
import { mapPaginationOptions } from '../utils';
import { getEnv } from '../utils/env';
import { ChannelsResponse } from '../types/channel';
import { getBaseUrl } from '../utils/helpers';

export const createBuyer = (buyer) => null;

export const getBuyer = () => ({
  BuyerID: process.env?.BUYER_ID,
  UserGroupID: `${process.env?.BUYER_ID}-shoppers`,
});

const getBuyers = async (options: GetQueryDto) => {
  // const queryOptions = mapToQueryOptions(options, 'Buyers_List');
  const response = await axios.get<ChannelsResponse>(
    `${getBaseUrl()}/channels`,
  );
  return {
    ...mapPaginationOptions('channels', {}, options),
    data: mapBuyers(response.data.results),
  };
};

export default {
  createBuyer,
  getBuyer,
  getBuyers,
};
