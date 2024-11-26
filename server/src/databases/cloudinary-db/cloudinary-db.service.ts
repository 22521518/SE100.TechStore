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

  async delete(url: string) {
    try {
      const publicId = this.transformCloudinaryUrl(url);
      const result = await cloudinary.uploader.destroy(publicId);
      console.log('Destroy result:', result);
      return result;
    } catch (error) {
      console.error('Error deleting URL:', this.transformCloudinaryUrl(url));
      console.error('Error deleting resource:', error);
      throw new Error(
        `Could not delete resource with url ${url}: ${error.message}`,
      );
    }
  }

  private transformCloudinaryUrl(url: string): string {
    const basePattern =
      /https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/[^/]+\//;
    const cleanedUrl = url.replace(basePattern, ''); // Remove the base part

    // Remove the file extension
    const withoutExtension = cleanedUrl.replace(/\.[^/.]+$/, ''); // Remove everything after the last "."

    return withoutExtension;
  }
}
