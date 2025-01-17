import {
  CreateAttributeDto,
  UpdateAttributeDto,
} from '@packages/commerce/dist/attributes';

const getAll = async () => Promise.resolve([]);

const createSpec = async (createAttributeDto: CreateAttributeDto) => null;

export const getById = async (id: string) => null;

export const updateSpec = async (
  id: string,
  updateAttributeDto: UpdateAttributeDto,
) => null;

export const deleteSpec = async (id: string) => null;
export default {
  getAll,
  createSpec,
  updateSpec,
  deleteSpec,
  getById,
};
