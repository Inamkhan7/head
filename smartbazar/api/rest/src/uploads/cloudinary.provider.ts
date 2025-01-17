import { v2 } from 'cloudinary';

export const CloudinaryProvider = {
  provide: 'Cloudinary',
  useFactory: () => {
    return v2.config({
      cloud_name: process.env.CLOUDINARY_APP_NAME,
      api_key: process.env.CLOUDINARY_APP_KEY,
      api_secret: process.env.CLOUDINARY_APP_SECRET,
      secure: true,
    });
  },
};
