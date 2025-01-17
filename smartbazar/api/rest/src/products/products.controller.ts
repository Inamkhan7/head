import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from '@packages/commerce/dist/products/dto/create-product.dto';
import { UpdateProductDto } from '@packages/commerce/dist/products/dto/update-product.dto';
import { ProductPaginator } from '@packages/commerce/dist/products/dto/get-products.dto';
import { Product } from '@packages/commerce/dist/products';
import { GetPopularProductsDto } from '@packages/commerce/dist/products/dto/get-popular-products.dto';
import { GetQueryDto } from '@packages/commerce/dist/common/dto/core-get-arguments.dto';
import { PriceSchedule } from 'ordercloud-javascript-sdk';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  async getProducts(@Query() query: GetQueryDto): Promise<ProductPaginator> {
    return this.productsService.getProducts(query);
  }

  @Get('priceschedule/:slug') // Endpoint for fetching price schedule by ID
  async getPriceScheduleById(@Param('slug') id: string): Promise<PriceSchedule> {
    return this.productsService.getPriceSchedule(id);
  }

  @Get(':slug')
  async getProductBySlug(@Param('slug') slug: string): Promise<Product> {
    return this.productsService.getProductBySlug(slug);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}

@Controller('popular-products')
export class PopularProductsController {
  constructor(private readonly productsService: ProductsService) {}
  @Get()
  async getProducts(@Query() query: GetPopularProductsDto): Promise<Product[]> {
    return this.productsService.getPopularProducts(query);
  }
}
