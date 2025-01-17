import { Specs } from 'ordercloud-javascript-sdk';
import {
  CreateAttributeDto,
  UpdateAttributeDto,
} from '@packages/commerce/dist/attributes';
import {
  mapSpecToAttribute,
  mapSpecsToAttributes,
  mapAttibuteToSpec,
  mapAttributeValueToOption,
} from '../mappers/specs.mapper';

const getAll = async () => {
  const response = await Specs.List();
  return mapSpecsToAttributes(response);
};

const createSpec = async (createAttributeDto: CreateAttributeDto) => {
  const spec = mapAttibuteToSpec(createAttributeDto);
  const response = await Specs.Create(spec);
  return mapSpecToAttribute(response);
};

export const getById = async (id: string) => {
  const response = await Specs.Get(id);
  return mapSpecToAttribute(response);
};

export const updateSpec = async (
  id: string,
  updateAttributeDto: UpdateAttributeDto,
) => {
  const spec = mapAttibuteToSpec(updateAttributeDto);
  const specResponse = await Specs.Patch(id, spec);

  if (updateAttributeDto.values) {
    const updateList = [];
    const createList = [];
    const deleteList = [];

    updateAttributeDto.values.forEach((val) => {
      if (specResponse.Options.find((op) => op.ID === val.id)) {
        updateList.push(val);
      }
      createList.push(val);
    });

    specResponse.Options.forEach((op) => {
      if (!updateAttributeDto.values.find((val) => val.id === op.ID)) {
        deleteList.push(op);
      }
    });

    const updateRequests = updateList.map((value) => {
      const option = mapAttributeValueToOption(value);
      return Specs.PatchOption(specResponse.ID, value.ID, option);
    });

    const createRequests = createList.map((value) => {
      const option = mapAttributeValueToOption(value);
      return Specs.CreateOption(specResponse.ID, option);
    });

    const deleteRequests = deleteList.map((value) => {
      return Specs.DeleteOption(specResponse.ID, value.ID);
    });

    const updateResponses = await Promise.all(updateRequests);
    const createResponses = await Promise.all(createRequests);
    await Promise.all(deleteRequests);

    return mapSpecToAttribute({
      ...specResponse,
      Options: [...updateResponses, ...createResponses],
    });
  }

  return mapSpecToAttribute(specResponse);
};

export const deleteSpec = async (id: string) => {
  return Specs.Delete(id);
};

export default {
  getAll,
  createSpec,
  updateSpec,
  deleteSpec,
  getById,
};
