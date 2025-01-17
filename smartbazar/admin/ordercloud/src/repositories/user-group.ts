import {
  CreateUserGroupInput,
  UpdateUserGroupInput,
} from "@ts-types/generated";
import http from '@utils/api/http';
import Base from "./base";

class UserGroup extends Base<CreateUserGroupInput, UpdateUserGroupInput> {
  // Method for creating a user group
  // create = async (url: string, variables: CreateUserGroupInput) => {
  //   return this.http<CreateUserGroupInput>(url, "post", variables);
  // };
  register = async (url: string, variables: CreateUserGroupInput) => {
    return this.http<CreateUserGroupInput>(url, 'post', variables);
  };

  // Method for updating a user group
  update = async (url: string, variables: UpdateUserGroupInput) => {
    return this.http<UpdateUserGroupInput>(url, "put", variables);
  };

  // Method for fetching all user groups
  getAll = async (url: string) => {
    return this.http(url, "get");
  };

  // Method for fetching a single user group by ID
  get = async (url: string, id: string) => {
    return this.http(`${url}/${id}`, "get");
  };

  // Method for deleting a user group
  // delete = async (url: string, id: string) => {
  //   return this.http(`${url}/${id}`, "delete");
  // };
}

export default new UserGroup();
