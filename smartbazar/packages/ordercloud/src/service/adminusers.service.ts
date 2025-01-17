import { AdminUsers } from 'ordercloud-javascript-sdk';
import { RegisterDto } from '@packages/commerce/dist/auth';
import { paginate } from '@packages/commerce/dist/common';
import { GetUsersDto } from '@packages/commerce/dist/users/dto';
import {
  mapAdminUsers,
  mapCreateAdminUser,
} from '../mappers/adminUsers.mapper';
import { mapToQueryOptions } from '../mappers/request-query.mapper';

const getAdminUsers = async (options: GetUsersDto) => {
  const queryOptions = mapToQueryOptions(options, 'AdminUsers_List');
  const { Items, Meta } = await AdminUsers.List(queryOptions);
  const pagination = paginate(
    Meta.TotalCount,
    Meta.Page,
    Meta.PageSize,
    Meta.TotalCount,
    ``,
  );
  return {
    ...pagination,
    data: mapAdminUsers(Items),
  };
};

const createAdminUser = async (options: RegisterDto) => {
  const userData = mapCreateAdminUser(options);
  const data = await AdminUsers.Create(userData);
  return {
    data: data,
  };
};

const getAdminUser = async (id: string) => {
  const data = await AdminUsers.Get(id);
  return {
    data: data,
  };
};

const updateAdminUser = async (id: string, user) => {
  const data = await AdminUsers.Patch(id, user);
  return {
    data: data,
  };
};

const deleteAdminUser = async (id: string) => {
  const data = await AdminUsers.Delete(id);
  console.log(data);
  return data;
};

export default {
  getAdminUsers,
  createAdminUser,
  getAdminUser,
  updateAdminUser,
  deleteAdminUser,
};
