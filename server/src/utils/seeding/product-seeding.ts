import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import sharp from 'sharp';
import { convertImagesInDirectory } from '../image.utils';
import seed from './seed.util';

const prisma = new PrismaClient();

async function upload(
  file: Express.Multer.File,
  folder: string = 'samples',
  type: 'image' | 'video' = 'image',
): Promise<string> {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

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

export async function getFileNamesFromDirectory(
  rootPath: string,
): Promise<string[]> {
  try {
    const filesAndDirs = fs.readdirSync(rootPath);

    const fileNames = filesAndDirs.filter((file) =>
      fs.statSync(path.join(rootPath, file)).isFile(),
    );

    for (const file of filesAndDirs) {
      const fullPath = path.join(rootPath, file as string);
      const images = await convertImagesInDirectory(fullPath);
      console.log(fullPath);

      await prisma.$transaction(async (prisma) => {
        const currentProduct = await prisma.products.findFirst({
          where: { product_name: file as string },
          select: { images: true, product_id: true }, // Only fetch the images field
        });

        const updatedImage = await Promise.all(
          images.map(
            async (img) =>
              await upload(img, 'products/' + currentProduct.product_id),
          ),
        );

        await prisma.products.update({
          where: { product_id: currentProduct.product_id },
          data: {
            images: updatedImage,
          },
        });
      });
    }
    return fileNames;
  } catch (err) {
    console.error('Error reading directory:', err);
    throw new Error('Unable to read directory or file names.');
  }
}

export async function seedProducts() {
  seed('data/seed-2-product.sql');
  getFileNamesFromDirectory(process.env.IMAGE_DIRECTORY);
}
