import { Module } from '@nestjs/common';
import { StaffService } from './staff.service';
import { StaffController } from './staff.controller';
import { CloudinaryDbModule } from 'src/databases/cloudinary-db/cloudinary-db.module';

@Module({
  imports: [CloudinaryDbModule],
  controllers: [StaffController],
  providers: [StaffService],
  exports: [StaffService],
})
export class StaffModule {}
