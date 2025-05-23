import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Prisma } from '@prisma/client';
import { PrismaDbService } from 'src/databases/prisma-db/prisma-db.service';
import { ProductAttribute } from './entities/product-attribute.entity';
import mongoose from 'mongoose';
import { CloudinaryDbService } from 'src/databases/cloudinary-db/cloudinary-db.service';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prismaDbService: PrismaDbService,
    @InjectModel(ProductAttribute.name)
    private readonly productAttributeModel: mongoose.Model<ProductAttribute>,
    private readonly cloudinaryDbService: CloudinaryDbService,
  ) {}

  async create(
    createProductDto: Prisma.ProductsCreateInput,
    attributes: ProductAttribute[],
    images: Express.Multer.File[],
  ) {
    try {
      if (!Array.isArray(attributes)) {
        throw new BadRequestException('Attributes must be an array');
      }
      if (!Array.isArray(images)) {
        throw new BadRequestException('Images must be an array');
      }

      // Start a transaction to ensure atomicity
      return await this.prismaDbService.$transaction(async (prisma) => {
        // Create the product
        const product = await prisma.products.create({
          data: {
            ...createProductDto,
          },
          include: { categories: true },
        });

        if (!product) {
          throw new BadRequestException('Failed to create product');
        }

        let productWithImage = null;

        // Upload images to Cloudinary
        if (images && images.length > 0) {
          const imageUrl = await Promise.all(
            images.map(
              async (img) =>
                await this.cloudinaryDbService.upload(
                  img,
                  'products/' + product.product_id,
                ),
            ),
          );

          productWithImage = await prisma.products.update({
            where: { product_id: product.product_id },
            data: {
              images: [...imageUrl],
            },
          });
        }

        // If attributes are provided, create them and link to the product
        if (attributes.length > 0) {
          await this.productAttributeModel.insertMany(
            attributes.map((attr) => ({
              ...attr,
              product_id: product.product_id,
            })),
          );
        }

        return {
          ...(productWithImage || product),
          attributes,
        };
      });
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Failed to create product',
      );
    }
  }

  async findAll(limit: number, offset: number, product_name_id: string) {
    try {
      // Fetch products and their categories
      const productsData = await this.prismaDbService.products.findMany({
        where: {
          OR: [
            {
              product_name: {
                contains: product_name_id,
                mode: 'insensitive',
              },
            },
            {
              product_id: {
                contains: product_name_id,
                mode: 'insensitive',
              },
            },
          ],
        },
        include: { categories: true, product_feedbacks: true },
        ...(offset ? { skip: offset } : {}),
        ...(limit ? { take: limit } : {}),
      });

      // Fetch all product attributes
      const productAttributes = await this.productAttributeModel.find(
        {},
        {
          product_id: true,
          name: true,
          detail: true,
        },
      );

      // Group attributes by product_id for faster lookup
      const attributeMap = new Map();
      productAttributes.forEach((attr) => {
        if (!attributeMap.has(attr.product_id)) {
          attributeMap.set(attr.product_id, []);
        }
        attributeMap.get(attr.product_id).push(attr);
      });

      // Combine products with their corresponding attributes
      const products = productsData.map(({ product_feedbacks, ...rest }) => ({
        ...rest,
        average_rating:
          product_feedbacks.length === 0
            ? 0
            : product_feedbacks.reduce((acc, curr) => acc + curr.rating, 0) /
              product_feedbacks.length,
        attributes: attributeMap.get(rest.product_id) || [],
      }));

      return products;
    } catch (error) {
      // Customize error handling if needed
      throw new BadRequestException(
        error.message || 'Failed to fetch products',
      );
    }
  }

  async findOne(id: string) {
    try {
      const product = await this.prismaDbService.products.findUnique({
        where: { product_id: id },
        include: {
          categories: true,
          product_feedbacks: true,
        },
      });

      if (!product) {
        throw new BadRequestException('Product not found');
      }

      const attributes = await this.productAttributeModel.find(
        {
          product_id: id,
        },
        {
          name: true,
          detail: true,
        },
      );
      return {
        ...product,
        attributes,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async update(
    id: string,
    updateProductDto: Prisma.ProductsUpdateInput,
    attributes: ProductAttribute[],
    images: Express.Multer.File[], // Assume these are local file paths or base64 strings,
    oldImages: string[],
  ) {
    try {
      // Fetch the current product to get existing images
      const currentProduct = await this.prismaDbService.products.findUnique({
        where: { product_id: id },
        select: { images: true }, // Only fetch the images field
      });

      if (!currentProduct) {
        throw new Error('Product not found');
      }

      // Exclude old images from the current images list
      const deleteProductImages = currentProduct.images.filter(
        (image) => !oldImages.includes(image),
      );

      await Promise.all(
        deleteProductImages?.map(async (img) => {
          console.log('Deleting image:', img);
          // Delete the existing images from Cloudinary
          await this.cloudinaryDbService.delete(img);
        }),
      );

      let updatedImage = [];
      if (images && images.length > 0) {
        updatedImage = await Promise.all(
          images
            ?.filter((img) => img)
            .map(
              async (img) =>
                await this.cloudinaryDbService.upload(img, 'products/' + id),
            ),
        );
      }

      // Update the product
      const product = await this.prismaDbService.products.update({
        where: { product_id: id },
        data: {
          ...updateProductDto,
          images: [...updatedImage, ...oldImages], // Update with the combined list of images
        },
        include: {
          categories: true,
        },
      });

      // Update attributes if provided
      if (attributes && attributes.length > 0) {
        // Delete existing attributes
        await this.productAttributeModel.deleteMany({ product_id: id });

        // Insert new attributes
        await this.productAttributeModel.insertMany(
          attributes.map((attr) => ({
            ...attr,
            product_id: id,
          })),
        );
      }

      return product; // Return the updated product with categories
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Failed to update product',
      );
    }
  }

  async remove(id: string) {
    try {
      // Start a transaction to ensure atomicity
      return await this.prismaDbService.$transaction(async (prisma) => {
        // Delete the product
        await prisma.products.delete({
          where: { product_id: id },
        });

        // Delete the product's attributes
        await this.productAttributeModel.deleteMany({ product_id: id });

        return { message: 'Product deleted successfully' };
      });
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Failed to delete product',
      );
    }
  }

  async increaseStock(product_id: string, quantity: number) {
    try {
      return await this.prismaDbService.products.update({
        where: { product_id },
        data: {
          stock_quantity: {
            increment: quantity,
          },
        },
      });
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Failed to increase stock quantity',
      );
    }
  }

  async decreaseStock(product_id: string, quantity: number) {
    try {
      return await this.prismaDbService.products.update({
        where: { product_id },
        data: {
          stock_quantity: {
            decrement: quantity,
          },
        },
      });
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Failed to decrease stock quantity',
      );
    }
  }

  async removeAll() {
    try {
      // Start a transaction to ensure atomicity
      return await this.prismaDbService.$transaction(async (prisma) => {
        // Delete all products
        await prisma.products.deleteMany();

        // Delete all product attributes
        await this.productAttributeModel.deleteMany();

        return { message: 'All products deleted successfully' };
      });
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Failed to delete all products',
      );
    }
  }
}
