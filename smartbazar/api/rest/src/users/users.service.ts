import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CreateUserDto } from '@packages/commerce/dist/users/dto/create-user.dto';
import {
  GetUsersDto,
  UserPaginator,
} from '@packages/commerce/dist/users/dto/get-users.dto';
import { UpdateUserDto } from '@packages/commerce/dist/users/dto/update-user.dto';
import { User } from '@packages/commerce/dist/users/entities/user.entity';
import usersJson from './users.json';
import { paginate } from '@packages/commerce/dist/common/pagination/paginate';
import CommerceProvider from '../providers';

const users = plainToInstance(User, usersJson);

const options = {
  keys: ['name', 'type.slug', 'categories.slug', 'status'],
  threshold: 0.3,
};
@Injectable()
export class UsersService {
  private users: User[] = users;

  create(createUserDto: CreateUserDto) {
    return this.users[0];
  }

  async getUsers({ text, limit, page }: GetUsersDto): Promise<UserPaginator> {
    const _provider = await CommerceProvider.getProvider();
    return _provider.AdminUsers.getAdminUsers({ text, limit, page });
  }

  async findOne(id: string) {
    const _provider = await CommerceProvider.getProvider();
    return _provider.AdminUsers.getAdminUser(id);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const _provider = await CommerceProvider.getProvider();
    return _provider.AdminUsers.updateAdminUser(id, updateUserDto);
  }

  async remove(id: string) {
    const _provider = await CommerceProvider.getProvider();
    return _provider.AdminUsers.deleteAdminUser(id);
  }
}
