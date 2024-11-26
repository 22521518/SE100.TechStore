import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductAttributeSchema } from './entities/product-attribute.entity';
import { CloudinaryDbModule } from 'src/databases/cloudinary-db/cloudinary-db.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'ProductAttribute', schema: ProductAttributeSchema },
    ]),
    CloudinaryDbModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
