import { PartialType } from '@nestjs/swagger';
import { CreateBuyerDto } from './create-buyer.dto';

export class UpdateOrderDto extends PartialType(CreateBuyerDto) {}
