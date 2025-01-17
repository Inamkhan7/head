import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CreateShippingDto } from '@packages/commerce/dist/shippings/dto/create-shipping.dto';
import { GetShippingsDto } from '@packages/commerce/dist/shippings/dto/get-shippings.dto';
import { UpdateShippingDto } from '@packages/commerce/dist/shippings/dto/update-shipping.dto';
import { Shipping } from '@packages/commerce/dist/shippings/entities/shipping.entity';
import shippingsJson from './shippings.json';

const shippings = plainToInstance(Shipping, shippingsJson);

@Injectable()
export class ShippingsService {
  private shippings: Shipping[] = shippings;

  create(createShippingDto: CreateShippingDto) {
    return this.shippings[0];
  }

  getShippings({}: GetShippingsDto) {
    return this.shippings;
  }

  findOne(id: string) {
    return this.shippings.find((shipping) => shipping.id === id);
  }

  update(id: string, updateShippingDto: UpdateShippingDto) {
    return this.shippings[0];
  }

  remove(id: string) {
    return `This action removes a #${id} shipping`;
  }
}
