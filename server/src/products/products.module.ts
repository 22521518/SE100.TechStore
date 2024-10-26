import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductAttributeSchema } from './schemas/product-attribute.schema';
import { CloudinaryDbModule } from 'src/cloudinary-db/cloudinary-db.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'ProductAttribute', schema: ProductAttributeSchema },
    ]),
    CloudinaryDbModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
