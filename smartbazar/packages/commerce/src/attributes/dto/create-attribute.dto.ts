import { PickType } from '@nestjs/swagger';
import { Attribute } from '../../attributes/entities/attribute.entity';

export class CreateAttributeDto extends PickType(Attribute, [
  'name',
  'shop_id',
]) {
  values: AttributeValueDto[];
}
export class AttributeValueDto {
  id: string;
  value: string;
  meta?: string;
}
