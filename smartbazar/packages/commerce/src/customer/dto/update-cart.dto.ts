import { UserAddressInput } from '../../orders/dto/create-order.dto';

export class UpdateCartDto {
  billing_address?: UserAddressInput;
  shipping_address?: UserAddressInput;
}
