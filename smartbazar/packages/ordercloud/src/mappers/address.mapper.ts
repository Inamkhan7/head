import { BuyerAddress, Address as OCAddress } from 'ordercloud-javascript-sdk';
import { UserAddressInput } from '@packages/commerce/dist/orders';
import {
  UpdateAddressDto,
  Address,
  AddressType,
} from '@packages/commerce/dist/addresses';

export const mapAddress = (address?: BuyerAddress): Address => {
  if (address) {
    return {
      id: address.ID,
      title: address.AddressName,
      default: address.xp?.default,
      type: address.Billing ? AddressType.BILLING : AddressType.SHIPPING,
      address: {
        street_address: address.Street1,
        country: address.Country,
        city: address.City,
        state: address.State,
        zip: address.Zip,
        phone: address.Phone,
      },
    } as Address;
  }
};

export const mapAddresses = (addresses: BuyerAddress[]): Address[] =>
  addresses.map(mapAddress);

export const getBuyerAddress = (address: UpdateAddressDto): BuyerAddress => ({
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

export const getOCAddress = (address: UserAddressInput): OCAddress => ({
  Country: address.country,
  City: address.city,
  Phone: address.phone,
  Street1: address.street_address,
  State: address.state,
  Zip: address.zip,
  ID: address.id,
});
