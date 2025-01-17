import { kebabCase } from 'lodash';
import {
  AttributeValueDto,
  CreateAttributeDto,
  UpdateAttributeDto,
} from '@packages/commerce/dist/attributes';

export const mapOptionToAttibuteValue = (option) => ({
  id: option.ID,
  attribute_id: option.xp.attribute_id,
  meta: option.xp.meta,
  value: option.Value,
});

export const mapOptionsToAttibuteValues = (options) =>
  options.map(mapOptionToAttibuteValue);

export const mapSpecToAttribute = (item, index = -1) => ({
  id: item.ID,
  name: item.Name,
  shop: {},
  key: index + 1,
  shop_id: item.shop_id,
  values: mapOptionsToAttibuteValues(item.Options),
});

export const mapSpecsToAttributes = (response) =>
  response.Items?.map(mapSpecToAttribute);

export const mapAttibuteToSpec = (
  input: CreateAttributeDto | UpdateAttributeDto,
) => ({
  Name: input.name,
  xp: {
    slug: kebabCase(input.name),
    shop_id: input.shop_id,
  },
});

export const mapAttributeValueToOption = (input: AttributeValueDto) => ({
  ID: input.id,
  Value: input.value,
  xp: {
    meta: input.meta,
  },
});
