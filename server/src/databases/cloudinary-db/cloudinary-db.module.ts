import { Module } from '@nestjs/common';
import { CloudinaryDbService } from './cloudinary-db.service';

@Module({
  providers: [CloudinaryDbService],
  exports: [CloudinaryDbService],
})
export class CloudinaryDbModule {}
