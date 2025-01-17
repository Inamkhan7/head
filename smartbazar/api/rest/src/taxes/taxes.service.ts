import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CreateTaxDto } from '@packages/commerce/dist/taxes/dto/create-tax.dto';
import { UpdateTaxDto } from '@packages/commerce/dist/taxes/dto/update-tax.dto';
import { Tax } from '@packages/commerce/dist/taxes/entities/tax.entity';
import taxesJson from './taxes.json';

const taxes = plainToInstance(Tax, taxesJson);

@Injectable()
export class TaxesService {
  private taxes: Tax[] = taxes;

  create(createTaxDto: CreateTaxDto) {
    return this.taxes[0];
  }

  findAll() {
    return this.taxes;
  }

  findOne(id: string) {
    return this.taxes.find((tax) => tax.id === id);
  }

  update(id: string, updateTaxDto: UpdateTaxDto) {
    return this.taxes[0];
  }

  remove(id: string) {
    return `This action removes a #${id} tax`;
  }
}
