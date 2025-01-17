import {
  Controller,
  Get,
  Param,
  Query,
  Put,
  Body,
  Post,
  Delete,
} from '@nestjs/common';
import { Product } from '@packages/commerce/dist/products';
import { UpdateAddressDto } from '@packages/commerce/dist/addresses/dto/update-address.dto';
import { Catalog } from '@packages/commerce/dist/catalogs/entities/catalog.entity';
import { CustomerService } from './customer.service';
import {
  GetProductsDto,
  ProductPaginator,
} from '@packages/commerce/dist/customer/dto/get-products.dto';
import { AllowAnonymous } from '../auth/auth.decorator';
import { CreateOrderDto } from '@packages/commerce/dist/orders/dto/create-order.dto';
import { AddCartItemDto } from '@packages/commerce/dist/customer/dto/add-cart-item.dto';
import { GetCategoriesDto } from '@packages/commerce/dist/customer/dto/get-categories.dto';
import { GetQueryDto } from '@packages/commerce/dist/common';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get('/products')
  @AllowAnonymous()
  async getProducts(@Query() query: GetQueryDto): Promise<ProductPaginator> {
    return this.customerService.getProducts(query);
  }

  @Get('/products/:id')
  @AllowAnonymous()
  async getProductBySlug(@Param('id') id: string): Promise<Product> {
    return this.customerService.getProduct(id);
  }

  @Get('/products/exactly/:id')
  @AllowAnonymous()
  async getProductById(@Param('id') id: string): Promise<Product> {
    return this.customerService.getProductsById(id.split(','));
  }

  @Get('/catalogs')
  @AllowAnonymous()
  async getCatalogs(@Query() query: GetQueryDto): Promise<Catalog[]> {
    return this.customerService.getCatalogs(query);
  }

  @Get('/catalogs/:id')
  @AllowAnonymous()
  async getCatalog(@Param('id') id: string): Promise<Catalog> {
    return this.customerService.getCatalog(id);
  }

  @Get('/catalogs/:id/:categoryId')
  @AllowAnonymous()
  async getCategory(
    @Param('id') id: string,
    @Param('categoryId') categoryId: string,
  ) {
    return this.customerService.getCategory(id, categoryId);
  }

  @Get('/categories')
  @AllowAnonymous()
  async getCategories(@Query() query: GetCategoriesDto) {
    return this.customerService.getCategories(query);
  }

  @Put('/address')
  @AllowAnonymous()
  async saveAddress(@Body() address: UpdateAddressDto) {
    return this.customerService.saveAddress(address);
  }

  @Delete('/address/:id')
  @AllowAnonymous()
  async deleteAddress(@Param('id') id: string) {
    return this.customerService.deleteAddress(id);
  }

  @Get('/orders')
  @AllowAnonymous()
  async getOrders() {
    return this.customerService.getOrders();
  }

  @Get('/orders/:id')
  @AllowAnonymous()
  async getOrderById(@Param('id') id: string) {
    return this.customerService.getOrderById(id);
  }

  @Get('/cart')
  async getCart() {
    return this.customerService.getCart();
  }

  @Put('/cart')
  async updateCart(@Body() cart) {
    return this.customerService.updateCart(cart);
  }

  @Post('/cart')
  async submitCart() {
    return this.customerService.submitCart();
  }

  @Delete('/cart')
  async deleteCart() {
    return this.customerService.deleteCart();
  }

  @Post('/cart/items')
  async addCartitem(@Body() cartItem: AddCartItemDto) {
    return this.customerService.addCartItem(cartItem);
  }

  @Put('/cart/items/:id')
  async updateCartitem(
    @Param('id') id: string,
    @Body() cartItem: AddCartItemDto,
  ) {
    return this.customerService.updateCartItem(id, cartItem);
  }

  @Delete('/cart/items/:id')
  async deleteCartitem(@Param('id') id: string) {
    return this.customerService.deleteCartItem(id);
  }

  @Post('/orders')
  async create(@Body() createOrderDto: CreateOrderDto) {
    return this.customerService.createOrder(createOrderDto);
  }

  @Get('/settings')
  @AllowAnonymous()
  getSettings(@Query() query) {
    return this.customerService.getSettings(query);
  }
}
