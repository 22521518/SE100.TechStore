export type ISender = {
  sender_id: string;
  sender_name: string;
};

export type IInboxMessage = {
  sender: ISender;
  message_id?: string;
  message: string;
  created_at: Date | string;
  is_seen: boolean;
};

export type ICustomer = {
  customer_id: string;
  account_id: string;
  username: string;
  full_name: string;
  phone_number: string;
  // date_joined?: Date | string;
  // account?: IAccount;
  // product_feedbacks?: IProductFeedback[];
  // orders?: IOrder[];
  // addresses?: IAddress[];

  image?: string;
  male?: boolean;
  birth_date?: Date | string;
};
