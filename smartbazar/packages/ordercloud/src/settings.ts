import { ApiRole } from 'ordercloud-javascript-sdk/dist/models/ApiRole';

export const ANONYMOUS_SCOPE: ApiRole[] = [
  'BuyerReader',
  'BuyerUserReader',
  'CatalogReader',
  'CategoryReader',
  'MeAddressAdmin',
  'MeAdmin',
  'MeCreditCardAdmin',
  'MeXpAdmin',
  'OrderReader',
  'OverrideShipping',
  'OverrideTax',
  'OverrideUnitPrice',
  'PasswordReset',
  'ProductReader',
  'Shopper',
];
export const ADMIN_SCOPE: ApiRole[] = ['FullAccess'];
export const CLIENT_SCOPE: ApiRole[] = [
  'BuyerReader',
  'BuyerUserReader',
  'CatalogReader',
  'CategoryReader',
  'MeAddressAdmin',
  'MeAdmin',
  'MeCreditCardAdmin',
  'MeXpAdmin',
  'OrderReader',
  'OverrideShipping',
  'OverrideTax',
  'OverrideUnitPrice',
  'PasswordReset',
  'ProductReader',
  'Shopper',
];
