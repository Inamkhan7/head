import { Injectable } from '@nestjs/common';
import { CreateNewSubscriberDto } from '@packages/commerce/dist/newsletters/dto/create-new-subscriber.dto';

@Injectable()
export class NewslettersService {
  async subscribeToNewsletter({ email }: CreateNewSubscriberDto) {
    return `Your email successfully subscribed`;
  }
}
