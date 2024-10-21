export interface IProduct {
  product_id?: string;
  product_name: string;
  images?: string[];
  description: string;
  price: number;
  discount?: number | null;
  stock_quantity?: number;
  categories: ICategory[];
  attributes: IProductAttribute[];
}

export interface IProductAttribute {
  id: string;
  name: string;
  detail: string;
}

export interface ICategory {
  category_id?: number;
  category_name: string;
  description: string;
}

export interface IProductFeedback {
  product_id: string;
  customer_id: string;
  rating: number;
  feedback: string;
  created_at: string;
}

export interface ICustomer {
  customer_id: string;
  username: string;
  full_name: string;
  phone_number: string;
  date_joined?: Date | string;
  account: IAccount;
}

export interface IAccount {
  email: string;
}

export interface IAddress {
  address: string;
  city: string;
  state: string;
}
