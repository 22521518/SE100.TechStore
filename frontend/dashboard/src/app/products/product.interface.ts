import {
  IProductCategory,
  IProductAttribute
} from '@constant/constant.interface';

export interface ProductFormValues {
  product_name: string;
  images: string[];
  price: number;
  discount: number;
  categories: IProductCategory[];
  description: string;
  stock_quantity: number;
  attributes: IProductAttribute[];
}
