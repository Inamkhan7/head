import { Injectable, Options } from '@nestjs/common';
import { CreateOrderDto } from '@packages/commerce/dist/orders/dto/create-order.dto';
import {
  GetOrdersDto,
  OrderPaginator,
} from '@packages/commerce/dist/orders/dto/get-orders.dto';
import { UpdateOrderDto } from '@packages/commerce/dist/orders/dto/update-order.dto';
import ordersJson from '../db/smartbazar/orders.json';
import orderStatusJson from '../db/smartbazar/order-statuses.json';
import orderFilesJson from './order-files.json';
import { plainToInstance } from 'class-transformer';
import {
  Order,
  OrderFiles,
} from '@packages/commerce/dist/orders/entities/order.entity';
import { OrderStatus } from '@packages/commerce/dist/orders/entities/order-status.entity';
import { paginate } from '@packages/commerce/dist/common/pagination/paginate';
import {
  GetOrderStatusesDto,
  OrderStatusPaginator,
} from '@packages/commerce/dist/orders/dto/get-order-statuses.dto';
import {
  CheckoutVerificationDto,
  VerifiedCheckoutData,
} from '@packages/commerce/dist/orders/dto/verify-checkout.dto';
import {
  CreateOrderStatusDto,
  UpdateOrderStatusDto,
} from '@packages/commerce/dist/orders/dto/create-order-status.dto';
import { GetOrderFilesDto } from '@packages/commerce/dist/orders/dto/get-downloads.dto';
import CommerceProvider from '../providers';

const orders = plainToInstance(Order, ordersJson);
const orderStatus = plainToInstance(OrderStatus, orderStatusJson);

const orderFiles = plainToInstance(OrderFiles, orderFilesJson);

@Injectable()
export class OrdersService {
  private orders: Order[] = orders;
  private orderStatus: OrderStatus[] = orderStatus;
  private orderFiles: OrderFiles[] = orderFiles;

  async create(createOrderInput: CreateOrderDto) {
    const _provider = await CommerceProvider.getProvider();
    const order = await _provider.Orders.createOrderFromShop(createOrderInput);
    return order;
  }

  async getOrders({
    limit,
    page,
    customer_id,
    tracking_number,
    search,
    shop_id,
  }: GetOrdersDto): Promise<OrderPaginator> {
    const _provider = await CommerceProvider.getProvider();
    if (!page) page = 1;
    return _provider.Orders.getOrderList({ page, limit, search });
  }

  async getOrderById(id: string) {
    const _provider = await CommerceProvider.getProvider();
    const order = await _provider.Orders.getOrderById(id);
    return order;
  }

  getOrderByTrackingNumber(tracking_number: string): Order {
    const parentOrder = this.orders.find(
      (p) => p.tracking_number === tracking_number,
    );
    if (!parentOrder) {
      return this.orders[0];
    }
    return parentOrder;
  }

  getOrderStatuses({
    limit,
    page,
    search,
    orderBy,
  }: GetOrderStatusesDto): OrderStatusPaginator {
    if (!page || page.toString() === 'undefined') page = 1;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const data: OrderStatus[] = this.orderStatus;

    // if (shop_id) {
    //   data = this.orders?.filter((p) => p?.shop?.id === shop_id);
    // }
    const results = data.slice(startIndex, endIndex);
    const url = `/order-status?search=${search}&limit=${limit}`;

    return {
      data: results,
      ...paginate(data.length, page, limit, results.length, url),
    };
  }

  getOrderStatus(slug: string) {
    return this.orderStatus.find((p) => p.name === slug);
  }

  update(id: number, updateOrderInput: UpdateOrderDto) {
    return this.orders[0];
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }

  verifyCheckout(input: CheckoutVerificationDto): VerifiedCheckoutData {
    return {
      total_tax: 0,
      shipping_charge: 0,
      unavailable_products: [],
      wallet_currency: 0,
      wallet_amount: 0,
    };
  }

  createOrderStatus(createOrderStatusInput: CreateOrderStatusDto) {
    return this.orderStatus[0];
  }

  updateOrderStatus(updateOrderStatusInput: UpdateOrderStatusDto) {
    return this.orderStatus[0];
  }

  async getOrderFileItems({ page, limit }: GetOrderFilesDto) {
    if (!page) page = 1;
    if (!limit) limit = 30;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = orderFiles.slice(startIndex, endIndex);

    const url = `/downloads?&limit=${limit}`;
    return {
      data: results,
      ...paginate(orderFiles.length, page, limit, results.length, url),
    };
  }

  async getDigitalFileDownloadUrl(digitalFileId: number) {
    const item: OrderFiles = this.orderFiles.find(
      (singleItem) => singleItem.digital_file_id === digitalFileId,
    );

    return item.file.url;
  }
}
