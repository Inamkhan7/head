import { kebabCase } from 'lodash';
import { ListPage } from 'ordercloud-javascript-sdk/dist/models/ListPage';
import { Spec } from 'ordercloud-javascript-sdk/dist/models/Spec';
import { SpecOption } from 'ordercloud-javascript-sdk/dist/models/SpecOption';
import {
  AttributeValueDto,
  CreateAttributeDto,
  UpdateAttributeDto,
} from '@packages/commerce/dist/attributes';

export const mapOptionToAttibuteValue = (option: SpecOption) => ({
  id: option.ID,
  attribute_id: option.xp.attribute_id,
  meta: option.xp.meta,
  value: option.Value,
});

export const mapOptionsToAttibuteValues = (options: SpecOption[]) =>
  options.map(mapOptionToAttibuteValue);

export const mapSpecToAttribute = <TSpec extends Spec>(
  item: TSpec,
  index = -1,
) => ({
  id: item.ID,
  name: item.Name,
  shop: {},
  key: index + 1,
  shop_id: item.xp.shop_id,
  values: mapOptionsToAttibuteValues(item.Options),
});

export const mapSpecsToAttributes = <TSpec extends Spec>(
  response: ListPage<TSpec>,
) => response.Items?.map(mapSpecToAttribute);

export const mapAttibuteToSpec = (
  input: CreateAttributeDto | UpdateAttributeDto,
) => ({
  Name: input.name,
  xp: {
    slug: kebabCase(input.name),
    shop_id: input.shop_id,
  },
});

export const mapAttributeValueToOption = (
  input: AttributeValueDto,
): SpecOption => ({
  ID: input.id,
  Value: input.value,
  xp: {
    meta: input.meta,
  },
});
