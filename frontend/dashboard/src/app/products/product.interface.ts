import { ICategory, IProductAttribute } from '@constant/interface.constant';

export interface ProductFormValues {
  product_name: string;
  images: string[];
  price: number;
  discount: number;
  categories: ICategory[];
  description: string;
  stock_quantity: number;
  attributes: IProductAttribute[];
}
