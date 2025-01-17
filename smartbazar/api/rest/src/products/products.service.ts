import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CreateProductDto } from '@packages/commerce/dist/products/dto/create-product.dto';
import { ProductPaginator } from '@packages/commerce/dist/products/dto/get-products.dto';
import { UpdateProductDto } from '@packages/commerce/dist/products/dto/update-product.dto';
import { Product } from '@packages/commerce/dist/products';
import productsJson from '../db/smartbazar/products.json';
import Fuse from 'fuse.js';
import { GetPopularProductsDto } from '@packages/commerce/dist/products/dto/get-popular-products.dto';
import CommerceProvider from '../providers';
import { GetQueryDto } from '@packages/commerce/dist/common/dto/core-get-arguments.dto';
import { PriceSchedule } from 'ordercloud-javascript-sdk';
const products = plainToInstance(Product, productsJson) as unknown as Product[];

const options = {
  keys: [
    'name',
    'type.slug',
    'categories.slug',
    'status',
    'shop_id',
    'author.slug',
    'tags',
    'manufacturer.slug',
  ],
  threshold: 0.3,
};
const fuse = new Fuse(products, options);

@Injectable()
export class ProductsService {
  private products = products;

  async create(createProductDto: CreateProductDto) {
    const _provider = await CommerceProvider.getProvider();
    return _provider.Products.createProduct(createProductDto);
  }

  async getProducts(options: GetQueryDto): Promise<ProductPaginator> {
    const _provider = await CommerceProvider.getProvider();
    return _provider.Products.getProducts(options);
  }

  async getPriceSchedule(priceScheduleID: string): Promise<PriceSchedule> {
    const _provider = await CommerceProvider.getProvider();
    return _provider.Products.getPriceSchedule(priceScheduleID);
  }


  async getProductBySlug(slug: string): Promise<Product> {
    const _provider = await CommerceProvider.getProvider();
    const product = await _provider.Products.getProduct(slug);
    return {
      ...product,
    };
  }

  getPopularProducts({ limit, type_slug }: GetPopularProductsDto): Product[] {
    let data: any = this.products;
    if (type_slug) {
      data = fuse.search(type_slug)?.map(({ item }) => item);
    }
    return data?.slice(0, limit);
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const _provider = await CommerceProvider.getProvider();
    return _provider.Products.updateProduct(id, updateProductDto);
  }

  async remove(id: string) {
    const _provider = await CommerceProvider.getProvider();
    return _provider.Products.deleteProduct(id);
  }
}
