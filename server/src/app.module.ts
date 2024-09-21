import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaDbModule } from './prisma-db/prisma-db.module';
import { AccountsModule } from './accounts/accounts.module';

@Module({
  imports: [PrismaDbModule, AccountsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
