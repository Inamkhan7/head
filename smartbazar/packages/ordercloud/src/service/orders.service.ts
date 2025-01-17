import {
  Orders,
  Order as OCOrder,
  LineItems,
  LineItem,
  OrderDirection,
  Address,
} from 'ordercloud-javascript-sdk';
import {
  CreateOrderDto,
  OrderPaginator,
  Order,
} from '@packages/commerce/dist/orders';
import { Product } from '@packages/commerce/dist/products';
import {
  getOCAddress,
  mapAddress,
  mapAddresses,
} from '../mappers/address.mapper';
import { mapLineItemToOrderProduct } from '../mappers/lineItems.mappes';
import { mapOrder, mapOrders, mapAdminOrders } from '../mappers/orders.mapper';
import { GetQueryDto, paginate } from '@packages/commerce';
import { mapToQueryOptions } from '../mappers/request-query.mapper';

type LineItemPartial = Partial<LineItem> & {
  ProductID: string;
  Quantity: number;
};

const createOrder = (
  orderDirection: OrderDirection,
  billingAddress: Address,
  shippingAddress: Address,
): Promise<OCOrder> => {
  return Orders.Create(orderDirection, {
    BillingAddress: billingAddress,
    BillingAddressID: billingAddress.ID,
    ShippingAddressID: shippingAddress.ID,
  });
};

const addLineItem = (
  orderDirection: OrderDirection,
  orderId: string,
  lineItem: LineItemPartial,
) => {
  return LineItems.Create(orderDirection, orderId, lineItem);
};

const createOrderFromShop = async (order: CreateOrderDto) => {
  try {
    const BillingAddress = getOCAddress(order.billing_address);
    const ShippingAddress = getOCAddress(order.shipping_address);
    // const ShippingCost = 15;
    // const TaxCost = order.sales_tax;
    const orderDirection: OrderDirection = 'Outgoing';
    const ocOrder = await Orders.Create(orderDirection, {
      // BillingAddress,
      BillingAddressID: BillingAddress.ID,
      ShippingAddressID: ShippingAddress.ID,
      // ShippingCost,
      // TaxCost,
    });

    const lineItemsRequest = order.products.map((product) => {
      const lineItem: LineItemPartial = {
        ProductID: product.product_id,
        Quantity: product.order_quantity,
      };

      return addLineItem(orderDirection, ocOrder.ID, lineItem);
    });

    const lineItems = await Promise.all(lineItemsRequest);
    const submittedOrder = await Orders.Submit(orderDirection, ocOrder.ID);
    const addresses = mapAddresses([ShippingAddress, BillingAddress]);
    const mappedOrderProducts = lineItems.reduce(
      (products: Product[], item): Product[] => [
        ...products,
        mapLineItemToOrderProduct(item),
      ],
      [],
    );
    return mapOrders([submittedOrder], addresses, [mappedOrderProducts])[0];
  } catch (err) {
    console.error('ORDER error:', err);
  }
};

const getOrderProducts = (orderDirection: OrderDirection, orderId: string) => {
  return LineItems.List(orderDirection, orderId);
};

const getOrderList = async (options: GetQueryDto): Promise<OrderPaginator> => {
  const queryOptions = mapToQueryOptions(options, 'Orders_List');
  const { Items, Meta } = await Orders.List('Incoming', queryOptions);

  const pagination = paginate(
    Meta.TotalCount,
    Meta.Page,
    Meta.PageSize,
    Meta.TotalCount,
    `/orders?search=${options.search}&limit=${options.limit}`,
  );

  return {
    ...pagination,
    data: mapAdminOrders(Items) as Order[],
  };
};

const getOrderById = async (orderId: string) => {
  const order = await Orders.Get('Incoming', orderId);
  const lineItems = await LineItems.List('Incoming', orderId);

  const mappedOrderProducts = lineItems.Items.reduce(
    (products: Product[], item): Product[] => [
      ...products,
      mapLineItemToOrderProduct(item),
    ],
    [],
  );
  const mappedShippingAddress = mapAddress(lineItems.Items[0].ShippingAddress);
  const mappedBillingAddress = mapAddress(order.BillingAddress);

  return mapOrder(
    order,
    mappedOrderProducts,
    mappedShippingAddress,
    mappedBillingAddress,
  );
};

export default {
  createOrder,
  addLineItem,
  getOrderById,
  getOrderList,
  createOrderFromShop,
  getOrderProducts,
};
