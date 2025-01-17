import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { TaxesService } from './taxes.service';
import { CreateTaxDto } from '@packages/commerce/dist/taxes/dto/create-tax.dto';
import { UpdateTaxDto } from '@packages/commerce/dist/taxes/dto/update-tax.dto';
import { GetTaxesDto } from '@packages/commerce/dist/taxes/dto/get-taxes.dto';

@Controller('taxes')
export class TaxesController {
  constructor(private readonly taxesService: TaxesService) {}

  @Post()
  create(@Body() createTaxDto: CreateTaxDto) {
    return this.taxesService.create(createTaxDto);
  }

  @Get()
  findAll(@Query() getTaxesDto: GetTaxesDto) {
    return this.taxesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taxesService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateTaxDto: UpdateTaxDto) {
    return this.taxesService.update(id, updateTaxDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taxesService.remove(id);
  }
}
