import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Product } from '@packages/commerce/dist/products';
import { paginate, GetQueryDto } from '@packages/commerce/dist/common';
import { ProductPaginator } from '@packages/commerce/dist/customer/dto/get-products.dto';
import { GetPopularProductsDto } from '@packages/commerce/dist/customer/dto/get-popular-products.dto';
import CommerceProvider from '../providers';
import { UpdateAddressDto } from '@packages/commerce/dist/addresses/dto/update-address.dto';
import { CreateOrderDto } from '@packages/commerce/dist/orders/dto/create-order.dto';
import { Setting } from '@packages/commerce/dist/settings/entities/setting.entity';
import settingsJson from '../settings/settings.json';

const settings = plainToInstance(Setting, settingsJson);

@Injectable()
export class CustomerService {
  private settings: Setting = settings;

  async getProducts(options: GetQueryDto): Promise<ProductPaginator> {
    const _provider = await CommerceProvider.getProvider();
    return _provider.Me.getProducts(options);
  }

  async getProduct(id: string) {
    const _provider = await CommerceProvider.getProvider();
    return _provider.Me.getProduct(id);
  }

  async getProductsById(ids: string[]) {
    const _provider = await CommerceProvider.getProvider();
    return _provider.Me.getProductsById(ids);
  }

  async getPopularProducts({
    limit,
    type_slug,
  }: GetPopularProductsDto): Promise<Product[]> {
    return Promise.resolve([]);
  }

  async getCatalogs(options?: GetQueryDto) {
    const _provider = await CommerceProvider.getProvider();
    return _provider.Me.getCatalogs(options);
  }

  async getCatalog(id: string) {
    const _provider = await CommerceProvider.getProvider();
    return _provider.Me.getCatalog(id);
  }

  async getCategories(options: GetQueryDto) {
    const _provider = await CommerceProvider.getProvider();
    const data = await _provider.Me.getCategories(options);
    return { data };
  }

  async getCategory(catalogId: string, categoryId: string) {
    const _provider = await CommerceProvider.getProvider();
    const data = await _provider.Me.getCategory(catalogId, categoryId);
    return data;
  }

  async saveAddress(address: UpdateAddressDto) {
    const _provider = await CommerceProvider.getProvider();

    if (address.id) {
      const response = await _provider.Me.updateAddress(address.id, address);
      return response;
    }

    const response = await _provider.Me.addAddress(address);
    return response;
  }

  async deleteAddress(addressID: string) {
    const _provider = await CommerceProvider.getProvider();
    const response = await _provider.Me.deleteAddress(addressID);
    return response;
  }

  async getOrders() {
    const _provider = await CommerceProvider.getProvider();
    const data = await _provider.Me.getOrders();
    const limit = 15;
    const page = 1;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = data.slice(startIndex, endIndex);
    const url = `/orders?limit=${limit}`;

    return {
      data,
      ...paginate(data.length, page, limit, results.length, url),
    };
  }

  async getOrderById(id: string) {
    const _provider = await CommerceProvider.getProvider();
    return _provider.Me.getOrderById(id);
  }

  async getCart() {
    const _provider = await CommerceProvider.getProvider();
    return _provider.Cart.getCart();
  }

  async deleteCart() {
    const _provider = await CommerceProvider.getProvider();
    return _provider.Cart.deleteCart();
  }

  async addCartItem(item) {
    const _provider = await CommerceProvider.getProvider();
    return _provider.Cart.addCartItem(item);
  }

  async updateCartItem(id, item) {
    const _provider = await CommerceProvider.getProvider();
    return _provider.Cart.updateCartItem(id, item);
  }

  async deleteCartItem(id) {
    const _provider = await CommerceProvider.getProvider();
    return _provider.Cart.deleteCartItem(id);
  }

  async updateCart(cart) {
    const _provider = await CommerceProvider.getProvider();
    return _provider.Cart.updateCart(cart);
  }

  async submitCart() {
    const _provider = await CommerceProvider.getProvider();
    return _provider.Cart.submitCart();
  }

  async createOrder(createOrderInput: CreateOrderDto) {
    const _provider = await CommerceProvider.getProvider();
    return _provider.Orders.createOrderFromShop(createOrderInput);
  }

  async getSettings({ search }) {
    if (search) {
      const _provider = await CommerceProvider.getProvider();
      const catalogs = await _provider.Me.getCatalogs({ search });
      this.settings.options.logo = catalogs[0]?.logo;
      this.settings.options.homeUrl = catalogs[0]?.id;
    } else {
      this.settings.options.logo = undefined;
      this.settings.options.homeUrl = '/';
    }

    return this.settings;
  }
}
