import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { CreateSettingDto } from '@packages/commerce/dist/settings/dto/create-setting.dto';
import { UpdateSettingDto } from '@packages/commerce/dist/settings/dto/update-setting.dto';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Post()
  create(@Body() createSettingDto: CreateSettingDto) {
    return this.settingsService.create(createSettingDto);
  }

  @Get()
  findAll() {
    return this.settingsService.findAll();
  }
}
