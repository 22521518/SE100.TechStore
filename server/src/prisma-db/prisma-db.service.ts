import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

export function getKeysOf<T>(): (keyof T)[] {
  return Object.keys({} as T) as (keyof T)[];
}
@Injectable()
export class PrismaDbService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
