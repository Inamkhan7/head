import { Injectable } from '@nestjs/common';
import { CreateAttributeDto } from '@packages/commerce/dist/attributes/dto/create-attribute.dto';
import { UpdateAttributeDto } from '@packages/commerce/dist/attributes/dto/update-attribute.dto';
import CommerceProvider from '../providers';
@Injectable()
export class AttributesService {
  async create(createAttributeDto: CreateAttributeDto) {
    const _provider = await CommerceProvider.getProvider();
    return _provider.Specs.createSpec(createAttributeDto);
  }

  async findAll() {
    const _provider = await CommerceProvider.getProvider();
    return _provider.Specs.getAll();
  }

  async findOne(id: string) {
    const _provider = await CommerceProvider.getProvider();
    return _provider.Specs.getById(id);
  }

  async update(id: string, updateAttributeDto: UpdateAttributeDto) {
    const _provider = await CommerceProvider.getProvider();
    return _provider.Specs.updateSpec(id, updateAttributeDto);
  }

  async remove(id: string) {
    const _provider = await CommerceProvider.getProvider();
    return _provider.Specs.deleteSpec(id);
  }
}
