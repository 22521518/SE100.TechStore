import { Injectable, OnModuleInit } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import sharp from 'sharp';

@Injectable()
export class CloudinaryDbService implements OnModuleInit {
  async onModuleInit() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async upload(
    file: Express.Multer.File,
    folder: string = 'samples',
    type: 'image' | 'video' = 'image',
  ): Promise<string> {
    const resizedBuffer = await sharp(file.buffer).resize(800, 600).toBuffer();

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: type,
          folder: folder,
        },
        (error, result: UploadApiResponse) => {
          if (error) return reject(error);
          resolve(result.secure_url); // Return the URL of the uploaded image
        },
      );
      uploadStream.end(resizedBuffer);
    });
  }

  async delete(publicId: string) {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      console.log('Destroy result:', result);
      return result;
    } catch (error) {
      console.error('Error deleting resource:', error);
      throw new Error(
        `Could not delete resource with public ID ${publicId}: ${error.message}`,
      );
    }
  }
}
