import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  Injectable,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';

@Injectable()
@Controller('attachments')
export class UploadsController {
  constructor(private cloudinary: CloudinaryService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('attachment[]'))
  async uploadFile(@UploadedFiles() attachment: Array<Express.Multer.File>) {
    const data = await this.cloudinary.uploadImage(attachment[0]);
    const { id, original, thumbnail } = this.cloudinary.getOptimizedData(data);
    return [
      {
        id,
        original,
        thumbnail,
      },
    ];
  }
}
