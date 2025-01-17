import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CreateSettingDto } from '@packages/commerce/dist/settings/dto/create-setting.dto';
import { UpdateSettingDto } from '@packages/commerce/dist/settings/dto/update-setting.dto';
import { Setting } from '@packages/commerce/dist/settings/entities/setting.entity';
import settingsJson from './settings.json';

const settings = plainToInstance(Setting, settingsJson);
@Injectable()
export class SettingsService {
  private settings: Setting = settings;
  create(createSettingDto: CreateSettingDto) {
    return this.settings;
  }

  findAll() {
    return this.settings;
  }

  findOne(id: number) {
    return `This action returns a #${id} setting`;
  }

  update(id: number, updateSettingDto: UpdateSettingDto) {
    return this.settings;
  }

  remove(id: number) {
    return `This action removes a #${id} setting`;
  }
}
