import {
  EMPLOY_STATUS,
  ORDER_STATUS,
  PAYMENT_METHOD,
  PAYMENT_STATUS
} from './enum.constant';

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

export interface IProductReceive {
  product_id?: string;
  product_name: string;
  images: string[];
  description: string;
  price: number;
  discount?: number | null;
  stock_quantity?: number;
  categories: ICategory[];
  attributes: IProductAttribute[];
  product_feedbacks?: IProductFeedback[];
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
  customer?: ICustomer;
  product_id?: string;
  rating: number;
  feedback: string;
  created_at: string | Date;
}

export interface ICustomer {
  customer_id: string;
  account_id: string;
  username: string;
  full_name: string;
  phone_number: string;
  date_joined?: Date | string;
  account?: IAccount;
  product_feedbacks?: IProductFeedback[];
  orders?: IOrder[];
  addresses?: IAddress[];

  image?: string;
  male?: boolean;
  birth_date?: Date | string;
}

export interface IAccount {
  email: string;
}

export interface IAddress {
  address_id?: string;
  customer_id?: string;
  is_primary?: boolean;

  city: string;
  address: string;
  district?: string; // quận
  ward?: string; // phường

  full_name?: string;
  phone_number?: string;
}

//voucher: 17/11/2024
export interface IOrder {
  order_id: string;
  customer_id?: string | null;
  customer?: ICustomer;
  order_status: ORDER_STATUS;
  payment_status: PAYMENT_STATUS;
  total_price: number;
  voucher?: IVoucher;
  created_at: Date | string;
  shipping_address?: IShippingAddress;
  order_items: IOrderItem[];
  payment_method?: PAYMENT_METHOD;
}

//total_price: 17/11/2024
export interface IOrderItem {
  order_id: string;
  product_id: string;
  product?: IProduct;
  quantity: number;
  unit_price: number;
}

export interface IShippingAddress {
  shipping_id?: string;
  address_id?: string;
  order_id?: string;
  created_at: Date | string;
  shipping_status: ORDER_STATUS;
  delivery_date?: Date | string;

  city: string;
  address: string;
  district?: string; // quận
  ward?: string; // phường

  full_name?: string;
  phone_number?: string;
}

export interface IPermission {
  permission_id: string;
  permission_name: string;
  description: string;
}

export interface IRole {
  role_id?: number;
  role_name: string;
  description: string;
  role_permissions?: IPermission[];
  staff?: IStaff[];
}

export interface IStaff {
  staff_id?: string;
  account_id?: string;
  full_name: string;
  images?: string;
  male?: boolean;
  birth_date?: Date | string;
  phone_number: string;
  employee_status?: EMPLOY_STATUS;
  hire_date: Date | string;
  role?: IRole;
  account?: IAccount;
}

export interface IAccountWithPassword {
  email: string;
  password: string;
}

// staff: 17/11/2024
export interface IStaffInfo {
  full_name: string;
  phone_number: string;
  employee_status?: EMPLOY_STATUS;
  hire_date: Date | string;
  account: IAccountWithPassword;
  role?: IRole;
  images?: string;
  male?: boolean;
  birth_date?: Date | string;
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
  room_id?: string;
  customer_id?: string;
  customer: ICustomer;
  messages: IInboxMessage[];
}

export interface IInboxRoomCard {
  room_id?: string;
  customer_id?: string;
  customer: ICustomer;
  latestMessage: IInboxMessage;
}

export interface ISender {
  sender_id: string;
  sender_name: string;
}

export interface IInboxMessage {
  sender: ISender;
  message_id?: string;
  message: string;
  created_at: Date | string;
  is_seen: boolean;
}

export interface IImportation {
  importation_id?: number;
  supplier_id?: number;
  import_date?: Date | string;
  total_price: number;
  remarks?: string;
  import_items: IImportationItem[];
  supplier?: ISupplier;
}

export interface IImportationItem {
  import_item_id?: number;
  import_id?: number;
  product_id: string;
  product?: IProduct;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface ISupplier {
  supplier_id?: number;
  supplier_name: string;
  contact_number: string;
  email: string;
  description: string;
  created_at?: Date | string;
}
