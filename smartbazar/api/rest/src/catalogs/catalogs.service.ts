import { Injectable } from '@nestjs/common';
import { CreateCatalogDto } from '@packages/commerce/dist/catalogs/dto/create-catalog.dto';
import { UpdateCatalogDto } from '@packages/commerce/dist/catalogs/dto/update-catalog.dto';
import CommerceProvider from '../providers';
import { GetQueryDto } from '@packages/commerce/dist/common/dto/core-get-arguments.dto';

@Injectable()
export class CatalogsService {
  async getTypeBySlug(slug: string) {
    const _provider = await CommerceProvider.getProvider();
    return _provider.Catalogs.getCatalog(slug);
  }

  async create(createTypeDto: CreateCatalogDto) {
    const _provider = await CommerceProvider.getProvider();
    return _provider.Catalogs.createCatalog(createTypeDto);
  }

  async findAll(options?: GetQueryDto) {
    const _provider = await CommerceProvider.getProvider();
    return _provider.Catalogs.getCatalogs(options);
  }

  async findOne(id: string) {
    const _provider = await CommerceProvider.getProvider();
    return _provider.Catalogs.getCatalog(id);
  }

  async update(id: string, updateTypeDto: UpdateCatalogDto) {
    const _provider = await CommerceProvider.getProvider();
    return _provider.Catalogs.updateCatalog(id, updateTypeDto);
  }

  async remove(id: string) {
    const _provider = await CommerceProvider.getProvider();
    return _provider.Catalogs.deleteCatalog(id);
  }
}
