import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { GetQueryDto } from '@packages/commerce';
import { BuyersService } from './buyers.service';
import { CreateBuyerDto } from '@packages/commerce/dist/buyers';
// import { UpdateUserDto } from './dto/update-buyers.dto';
// import { CreateProfileDto } from './dto/create-profile.dto';
// import { UpdateProfileDto } from './dto/update-profile.dto';
import { GetBuyerDto } from '@packages/commerce/dist/buyers/dto/get-buyers.dto';

@Controller('buyers')
export class BuyersController {
  constructor(private readonly buyersService: BuyersService) {}
  @Post()
  createBuyer(@Body() createBuyerDto: CreateBuyerDto) {
    return this.buyersService.createBuyer(createBuyerDto);
  }

  @Get()
  getAllBuyers(@Query() query: GetQueryDto) {
    return this.buyersService.getBuyers(query);
  }

  // @Get(':id')
  // getUser(@Param('id') id: string) {
  //   return this.usersService.findOne(id);
  // }

  // @Put(':id')
  // updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(id, updateUserDto);
  // }

  // @Delete(':id')
  // removeUser(@Param('id') id: string) {
  //   return this.usersService.remove(id);
  // }

  // @Post(':id/active')
  // activeUser(@Param('id') id: number) {
  //   console.log(id);
  // return this.usersService.getUsers(updateUserInput.id);
  // }
  // @Post(':id/ban')
  // banUser(@Param('id') id: number) {
  //   console.log(id);
  //   // return this.usersService.getUsers(updateUserInput.id);
  // }
}

// @Controller('profiles')
// export class ProfilesController {
//   constructor(private readonly usersService: UsersService) {}

//   @Post()
//   createProfile(@Body() createProfileDto: CreateProfileDto) {
//     console.log(createProfileDto);
//   }
//   @Put(':id')
//   updateProfile(@Body() updateProfileDto: UpdateProfileDto) {
//     console.log(updateProfileDto);
//   }
//   @Delete(':id')
//   deleteProfile(@Param('id') id: string) {
//     return this.usersService.remove(id);
//   }
// }
