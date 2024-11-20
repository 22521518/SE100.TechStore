import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
const prisma = new PrismaClient();

export default async function main(seed_name_file: string) {
  const filePath = path.resolve(__dirname, '../../' + seed_name_file);
  const seedSql = fs.readFileSync(filePath, { encoding: 'utf8' });

  // Split SQL file into individual statements based on semicolon (;) as delimiter
  const sqlStatements = seedSql
    .split(';')
    .map((statement) => statement.trim())
    .filter((statement) => statement.length > 0); // Remove empty statements

  try {
    for (const statement of sqlStatements) {
      console.log(`Executing: ${statement}`);
      await prisma.$executeRawUnsafe(statement);
    }
    console.log('Seed data successfully inserted.');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await prisma.$disconnect();
  }
}
