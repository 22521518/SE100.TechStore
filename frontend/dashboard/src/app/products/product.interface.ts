import {
  ICategory,
  IProduct,
  IProductAttribute,
  IProductImage
} from '@constant/interface.constant';

export interface ProductFormValues {
  product_id?: string;
  product_name: string;
  images?: IProductImage[];
  description: string;
  price: number;
  discount?: number | null;
  stock_quantity?: number;
  categories: ICategory[];
  attributes: IProductAttribute[];
}
