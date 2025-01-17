import { RegisterDto } from '@packages/commerce/dist/auth';
import { User } from '@packages/commerce/dist/users';
import { mapAddresses } from './address.mapper';

export const mapAdminUser = (user): User =>
  ({
    id: user.id,
    name: user.firstName,
    email: user.email,
    username: user.email,
    is_active: true,
    profile: {
      contact: '+1 202-555-0156',
    },
    address: mapAddresses(
      user.addresses,
      user.billingAddressIds,
      user.shippingAddressIds,
      user.defaultShippingAddressId,
      user.defaultBillingAddressId,
    ),
  } as User);

export const mapAdminUsers = (users): User[] => users.map(mapAdminUser);

export const mapCreateAdminUser = (user: RegisterDto) => {
  return {
    Username: user.email,
    FirstName: user.name,
    LastName: user.name,
    Email: user.email,
    Password: user.password,
    Active: true,
  };
};
