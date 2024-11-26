export class Order {}
export enum ORDER_STATUS {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export type ShippingAddress = {
  city: string;
  district: string;
  ward: string;
  address: string;

  full_name: string;
  phone_number: string;
};
