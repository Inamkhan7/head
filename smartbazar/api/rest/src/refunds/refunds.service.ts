import { Injectable } from '@nestjs/common';
import { CreateRefundDto } from '@packages/commerce/dist/refunds/dto/create-refund.dto';
import { UpdateRefundDto } from '@packages/commerce/dist/refunds/dto/update-refund.dto';

@Injectable()
export class RefundsService {
  create(createRefundDto: CreateRefundDto) {
    return 'This action adds a new refund';
  }

  findAll() {
    return {
      data: [],
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} refund`;
  }

  update(id: number, updateRefundDto: UpdateRefundDto) {
    return `This action updates a #${id} refund`;
  }

  remove(id: number) {
    return `This action removes a #${id} refund`;
  }
}
