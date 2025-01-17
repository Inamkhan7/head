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
import { ShippingsService } from './shippings.service';
import { CreateShippingDto } from '@packages/commerce/dist/shippings/dto/create-shipping.dto';
import { UpdateShippingDto } from '@packages/commerce/dist/shippings/dto/update-shipping.dto';
import { GetShippingsDto } from '@packages/commerce/dist/shippings/dto/get-shippings.dto';

@Controller('shippings')
export class ShippingsController {
  constructor(private readonly shippingsService: ShippingsService) {}

  @Post()
  create(@Body() createShippingDto: CreateShippingDto) {
    return this.shippingsService.create(createShippingDto);
  }

  @Get()
  findAll(@Query() query: GetShippingsDto) {
    return this.shippingsService.getShippings(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shippingsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateShippingDto: UpdateShippingDto,
  ) {
    return this.shippingsService.update(id, updateShippingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shippingsService.remove(id);
  }
}
