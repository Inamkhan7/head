import { UserAddressInput } from '@packages/commerce/dist/orders';
import {
  UpdateAddressDto,
  Address,
  AddressType,
} from '@packages/commerce/dist/addresses';
import { add } from 'lodash';

export const mapAddress = (
  address,
  billingAddressIds,
  shippingAddressIds,
  defaultShippingAddressId,
  defaultBillingAddressId,
): Address => {
  const isBillingAddress = billingAddressIds.includes(address.id);
  const type = isBillingAddress ? AddressType.BILLING : AddressType.SHIPPING;
  const isDefault = isBillingAddress
    ? address.id === defaultBillingAddressId
    : address.id === defaultShippingAddressId;

  return {
    address: {
      city: address?.city,
      country: address?.country,
      phone: '+1 202-555-0156',
      state: address?.state,
      street_address: `${address?.streetName} ${address?.building}`,
      zip: address?.postalCode,
    },
    id: address.id,
    title: `${type} ${address?.streetName}`,
    default: isDefault,
    type,
  } as Address;
};

export const mapAddresses = (
  addresses,
  billingAddressIds,
  shippingAddressIds,
  defaultShippingAddressId,
  defaultBillingAddressId,
): Address[] =>
  addresses.map((address) =>
    mapAddress(
      address,
      billingAddressIds,
      shippingAddressIds,
      defaultShippingAddressId,
      defaultBillingAddressId,
    ),
  );

export const getBuyerAddress = (address: UpdateAddressDto) => ({
  AddressName: address.title,
  Billing: address.type === AddressType.BILLING,
  Shipping: address.type === AddressType.SHIPPING,
  Street1: address.address.street_address,
  Country: address.address.country,
  City: address.address.city,
  State: address.address.state,
  Zip: address.address.zip,
  Phone: address.address.phone,
  xp: {
    default: Boolean(address.default),
  },
});

export const getOCAddress = (address: UserAddressInput) => ({
  Country: address.country,
  City: address.city,
  Phone: address.phone,
  Street1: address.street_address,
  State: address.state,
  Zip: address.zip,
  ID: address.id,
});
