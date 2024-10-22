import { ORDER_STATUS } from './enum.constant';

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
  feedback_id: string;
  customer_id?: string;
  product_id?: string;
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

export interface IOrder {
  order_id: string;
  customer_id: string | null;
  order_status: ORDER_STATUS;
  total_price: number;
  voucher_code?: string | null;
  created_at: Date | string;
  order_items: IOrderItem[];
}

export interface IOrderItem {
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}
