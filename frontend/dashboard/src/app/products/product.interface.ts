import {
  ICategory,
  IProductAttribute,
  IImage
} from '@constant/interface.constant';

export interface ProductFormValues {
  product_id?: string;
  product_name: string;
  images?: IImage[];
  description: string;
  price: number;
  discount?: number | null;
  stock_quantity?: number;
  categories: ICategory[];
  attributes: IProductAttribute[];
}
