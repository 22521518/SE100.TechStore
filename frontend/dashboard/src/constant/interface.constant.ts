import { EMPLOY_STATUS, ORDER_STATUS } from './enum.constant';

export interface IProduct {
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

export interface IProductImage {
  name: string;
  url: string;
}

export interface IProductAttribute {
  id: number;
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
  created_at: string | Date;
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
  customer_id?: string | null;
  customer?: ICustomer;
  order_status: ORDER_STATUS;
  total_price: number;
  voucher_code?: string | null;
  created_at: Date | string;
  shipping_address?: IShippingAddress;
  order_items: IOrderItem[];
}

export interface IOrderItem {
  order_id: string;
  product_id: string;
  product?: IProduct;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface IShippingAddress {
  shipping_status: ORDER_STATUS;
  delivery_date?: Date | string;
  address: IAddress;
}

export interface IPermission {
  permission_id: string;
  permission_name: string;
  description: string;
}

export interface IRole {
  role_id: string;
  role_name: string;
  description: string;
  permissions?: IPermission[];
}

export interface IStaff {
  staff_id?: string;
  full_name: string;
  phone_number: string;
  employee_status?: EMPLOY_STATUS;
  hire_date: Date | string;
  account: IAccount;
  role?: IRole;
}

export interface IAccountWithPassword {
  email: string;
  password: string;
}

export interface IStaffInfo {
  full_name: string;
  phone_number: string;
  employee_status?: EMPLOY_STATUS;
  hire_date: Date | string;
  account: IAccountWithPassword;
  role?: IRole | undefined;
}

export interface IVoucherWithoutCode {
  voucher_name: string;
  description: string;
  discount_amount: number;
  valid_from: Date | string;
  valid_to: Date | string;
  is_active?: boolean;
}

export interface IVoucher extends IVoucherWithoutCode {
  voucher_code: string;
}

export interface IInboxRoom {
  room_id: string;
  room_name: string;
  customer: ICustomer;
  messages: IInboxMessage[];
}

export interface ISender {
  sender_id: string;
  sender_name: string;
  is_seen: boolean;
}
export interface IInboxMessage {
  sender: ISender;
  message_id: string;
  message: string;
  created_at: Date | string;
}
