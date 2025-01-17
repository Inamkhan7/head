import { PickType } from '@nestjs/swagger';
import { Address } from '../../addresses/entities/address.entity';

export class CreateAddressDto extends PickType(Address, [
  'title',
  'type',
  'default',
  'address',
]) {
  'customer_id': number;
}
