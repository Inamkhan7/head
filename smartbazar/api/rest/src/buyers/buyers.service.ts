import { Injectable } from '@nestjs/common';
import { BuyerPaginator } from '@packages/commerce/dist/buyers/dto/get-buyers.dto';
import { CreateBuyerDto } from '@packages/commerce/dist/buyers';
import CommerceProvider from '../providers';
import { GetQueryDto } from '@packages/commerce';

const options = {
  keys: ['name', 'type.slug', 'categories.slug', 'status'],
  threshold: 0.3,
};

@Injectable()
export class BuyersService {
  async getBuyers(options: GetQueryDto): Promise<BuyerPaginator> {
    const _provider = await CommerceProvider.getProvider();
    return _provider.Buyers.getBuyers(options);
  }
  async createBuyer(createBuyerInput: CreateBuyerDto) {
    const _provider = await CommerceProvider.getProvider();
    await _provider.Buyers.createBuyer(createBuyerInput);
  }
}
