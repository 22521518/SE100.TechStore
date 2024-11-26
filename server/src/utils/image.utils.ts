import { InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';

type TImage = {
  name: string;
  url: string;
};

export async function convertImagesInDirectory(
  directoryPath: string,
): Promise<Express.Multer.File[]> {
  const imageFiles: Express.Multer.File[] = [];

  // Get all image files from the directory
  const imageFileNames = fs.readdirSync(directoryPath).filter(
    (file) => /\.(jpg|jpeg|png|gif)$/.test(file.toLowerCase()), // Filter only image files
  );

  // Process each image file
  for (const imageFileName of imageFileNames) {
    const imagePath = path.join(directoryPath, imageFileName);

    try {
      // Read image file as a buffer
      const imageBuffer = fs.readFileSync(imagePath);

      // Resize and compress the image with sharp
      const compressedBuffer = await sharp(imageBuffer)
        .resize(500) // Resize to a width of 500px (you can adjust this)
        .jpeg({ quality: 80 }) // Convert to jpeg format and compress
        .toBuffer()
        .catch((err) => {
          throw new Error('Failed to compress image: ' + err.message);
        });

      // Create a mock Express.Multer.File object
      const multerFile = {
        fieldname: 'image',
        originalname: imageFileName, // Use the image filename as the original name
        encoding: 'base64', // Multer uses '7bit' encoding for files
        mimetype: 'image/jpeg', // Assuming JPEG format after compression, change if necessary
        buffer: compressedBuffer, // The compressed image buffer
        size: compressedBuffer.length, // The size of the image in bytes
      };

      imageFiles.push(multerFile as Express.Multer.File); // Add the image file to the array
    } catch (err) {
      console.error(`Error processing file ${imageFileName}:`, err.message);
    }
  }

  return imageFiles;
}

export async function handleImageJpgBaseString({ name, url }: TImage) {
  const base64Data = url.replace(/^data:image\/\w+;base64,/, '');
  const imageBuffer = Buffer.from(base64Data, 'base64');

  const compressedBuffer = await sharp(imageBuffer)
    .resize(500) // Resize if needed
    .jpeg({ quality: 80 }) // Adjust format and quality
    .toBuffer()
    .then((data) => data)
    .catch((err) => {
      throw new InternalServerErrorException(
        'Failed to compress image: ' + err,
      );
    });

  // Create a mock Express.Multer.File object
  return {
    fieldname: 'image',
    originalname: name,
    encoding: 'base64',
    mimetype: 'image/jpeg', // or whatever type you expect
    buffer: compressedBuffer,
    size: compressedBuffer.length,
  };
}
