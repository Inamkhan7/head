import { User as OC_User } from 'ordercloud-javascript-sdk';
import { RegisterDto } from '@packages/commerce/dist/auth';
import { User } from '@packages/commerce/dist/users';

export const mapAdminUser = (user: OC_User): User =>
  ({
    name: user.FirstName,
    email: user.Email,
    username: user.Username,
    password: user.Password,
    is_active: user.Active,
    address: null,
    id: user.ID,
  } as User);

export const mapAdminUsers = (users: OC_User[]): User[] =>
  users.map(mapAdminUser);

export const mapCreateAdminUser = (user: RegisterDto): OC_User => {
  return {
    Username: user.email,
    FirstName: user.name,
    LastName: user.name,
    Email: user.email,
    Password: user.password,
    Active: true,
  } as OC_User;
};
