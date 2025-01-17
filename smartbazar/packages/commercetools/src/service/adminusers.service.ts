import axios from 'axios';
import { RegisterDto } from '@packages/commerce/dist/auth';
import { paginate } from '@packages/commerce/dist/common';
import { GetUsersDto } from '@packages/commerce/dist/users/dto';
import {
  mapAdminUser,
  mapAdminUsers,
  mapCreateAdminUser,
} from '../mappers/adminUsers.mapper';
import { mapToQueryOptions } from '../mappers/request-query.mapper';
import { getEnv } from '../utils/env';

const getAdminUsers = async (options: GetUsersDto) => {
  const queryOptions = mapToQueryOptions(options, 'AdminUsers_List');

  const pagination = paginate(
    0, // Meta.TotalCount,
    1, // Meta.Page,
    20, // Meta.PageSize,
    0, // Meta.TotalCount,
    ``,
  );

  return {
    ...pagination,
    data: mapAdminUsers([]),
  };
};

const createAdminUser = async (options: RegisterDto) => {
  const userData = mapCreateAdminUser(options);
  // const data = await AdminUsers.Create(userData);
  return {
    data: {},
  };
};

const getAdminUser = async (id: string) => {
  const { data } = await axios.get(
    `${getEnv('COMMERCETOOLS_API_URL')}/${getEnv(
      'COMMERCETOOLS_PROJECT_KEY',
    )}/customers/${id}`,
  );
  return mapAdminUser(data);
};

const updateAdminUser = async (id: string, user) => {
  // const data = await AdminUsers.Patch(id, user);
  return {
    data: {},
  };
};

const deleteAdminUser = async (id: string) => {
  // const data = await AdminUsers.Delete(id);
  return {};
};

export default {
  getAdminUsers,
  createAdminUser,
  getAdminUser,
  updateAdminUser,
  deleteAdminUser,
};
