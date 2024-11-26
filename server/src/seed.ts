import {
  getFileNamesFromDirectory,
  seedProducts,
} from './utils/seeding/product-seeding';
import seed from './utils/seeding/seed.util';

// seed('data/seed-1-customer.sql');
// seed('data/seed-2-product.sql');
// // seedProducts();
// seed('data/seed-3-order.sql');
// seed('data/seed-4-product-feedback.sql');
getFileNamesFromDirectory(process.env.IMAGE_DIRECTORY);
