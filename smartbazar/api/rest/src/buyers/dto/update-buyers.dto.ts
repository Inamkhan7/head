import { PartialType } from '@nestjs/swagger';
import { CreateBuyerDto } from './create-buyers.dto';

export class UpdateUserDto extends PartialType(CreateBuyerDto) {}
