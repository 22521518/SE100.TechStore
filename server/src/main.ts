import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { PayloadTooLargeFilter } from './common/filters/payload-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
  });

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalFilters(new PayloadTooLargeFilter());

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
