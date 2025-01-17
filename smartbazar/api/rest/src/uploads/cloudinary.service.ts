import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import toStream from 'buffer-to-stream';

@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream((error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
      toStream(file.buffer).pipe(upload);
    });
  }

  getOptimizedData(uploadResponse: UploadApiResponse | UploadApiErrorResponse) {
    const optimizedUrl = uploadResponse.secure_url.replace(
      /upload\//,
      'upload/q_auto:eco/',
    );

    return {
      ...uploadResponse,
      id: uploadResponse.public_id,
      original: optimizedUrl,
      thumbnail: optimizedUrl,
    };
  }
}
