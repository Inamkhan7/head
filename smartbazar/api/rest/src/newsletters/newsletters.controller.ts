import { Body, Controller, Post } from '@nestjs/common';
import { NewslettersService } from './newsletters.service';
import { CreateNewSubscriberDto } from '@packages/commerce/dist/newsletters/dto/create-new-subscriber.dto';

@Controller('subscribe-to-newsletter')
export class NewslettersController {
  constructor(private newslettersService: NewslettersService) {}

  @Post()
  async subscribeToNewsletter(@Body() body: CreateNewSubscriberDto) {
    return this.newslettersService.subscribeToNewsletter(body);
  }
}
