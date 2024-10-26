import { EMPLOY_STATUS, ORDER_STATUS } from '@constant/enum.constant';
import {
  IAccount,
  IAddress,
  ICustomer,
  IInboxMessage,
  IInboxRoom,
  IOrder,
  IOrderItem,
  IPermission,
  IProduct,
  IProductAttribute,
  IProductFeedback,
  IRole,
  ISender,
  IStaff,
  IVoucher
} from '@constant/interface.constant';
export function generateRandomAttribute(loops: number): IProductAttribute[] {
  const attributes: IProductAttribute[] = [];

  for (let i = 0; i < loops; i++) {
    attributes.push({
      id: i + 1,
      name: `Attribute ${i + 1}`,
      detail: `Value ${i + 1}`
    });
  }
  return attributes;
}

export function generateRandomProduct(): IProduct {
  return {
    product_name: `Product Name ${Math.random().toString(36).substr(2, 5)}`, // Random product name
    images: [],
    description: `This is a random product description for ${Math.random()
      .toString(36)
      .substr(2, 5)}.`,
    price: parseFloat((Math.random() * 100 + 5).toFixed(2)), // Random price between 5 and 105
    discount: parseFloat((Math.random() * 20).toFixed(2)), // Random discount
    stock_quantity: Math.floor(Math.random() * 100), // Random stock quantity
    categories: [],
    attributes: generateRandomAttribute(5) // Random attributes
  };
}

export function generateProductFeedback(loop: number): IProductFeedback[] {
  const feedbacks: IProductFeedback[] = [];

  for (let i = 0; i < loop; i++) {
    feedbacks.push({
      feedback_id: `feedback-${i + 1}`,
      product_id: `product-${i + 1}`,
      customer_id: `customer-${i + 1}`,
      rating: Math.floor(Math.random() * 5) + 1,
      feedback: `Feedback from customer ${i + 1}`,
      created_at: new Date()
    });
  }

  return feedbacks;
}

const getRandomItem = (arr: string[]) =>
  arr[Math.floor(Math.random() * arr.length)];

export const generateRandomAddresses = (count: number): IAddress[] => {
  const streets = [
    'Main St',
    'Oak St',
    'Maple Ave',
    'Pine Rd',
    'Cedar Blvd',
    'Elm St',
    'Park Ave',
    '5th Ave',
    'Sunset Blvd',
    'River Rd'
  ];
  const cities = [
    'New York',
    'Los Angeles',
    'Chicago',
    'Houston',
    'Phoenix',
    'Philadelphia',
    'San Antonio',
    'San Diego',
    'Dallas',
    'San Jose'
  ];
  const states = ['NY', 'CA', 'IL', 'TX', 'AZ', 'PA', 'TX', 'CA', 'TX', 'CA'];

  const randomAddresses: IAddress[] = [];

  for (let i = 0; i < count; i++) {
    const address = `${Math.floor(Math.random() * 9999) + 1} ${getRandomItem(
      streets
    )}`;
    const city = getRandomItem(cities);
    const state = getRandomItem(states);

    randomAddresses.push({ address, city, state });
  }

  return randomAddresses;
};

export function generateRandomAccountList(
  loops: number = 10,
  title: string = 'example'
): IAccount[] {
  const accounts: IAccount[] = [];
  for (let i = 0; i < loops; i++) {
    accounts.push({
      email: `${title}  ${i + Math.floor(Math.random() * 1000)}@example.com`
    });
  }
  return accounts;
}

export function generateRandomCustomer(id?: string): ICustomer {
  return {
    customer_id: id || `customer-${Math.floor(Math.random() * 1000)}`,
    username: `user_${Math.random().toString(36).substr(2, 5)}`,
    full_name: `Full Name ${Math.random().toString(36).substr(2, 5)}`,
    phone_number: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
    date_joined: new Date().toISOString(),
    account: {
      email: `customer${Math.floor(Math.random() * 1000)}@example.com`
    }
  };
}

function generateRandomOrderItem(order_id: string): IOrderItem {
  const quantity = Math.floor(Math.random() * 10) + 1;
  const unit_price = Math.random() * 100 * 1000;

  return {
    order_id: order_id,
    product_id: `product-${Math.floor(Math.random() * 100)}`,
    product: {
      product_id: `product-${Math.floor(Math.random() * 100)}`,
      product_name: `Product ${Math.floor(Math.random() * 100)}`,
      categories: [
        {
          category_id: Math.floor(Math.random() * 100),
          category_name: `Category ${Math.floor(Math.random() * 100)}`,
          description: `Description for category ${Math.floor(
            Math.random() * 100
          )}`
        }
      ],
      description: `Description for product ${Math.floor(Math.random() * 100)}`,
      price: Math.random() * 100 * 1000,
      attributes: [
        {
          id: Math.floor(Math.random() * 100),
          name: `Attribute ${Math.floor(Math.random() * 100)}`,
          detail: `Value ${Math.floor(Math.random() * 100)}`
        }
      ]
    },
    quantity: quantity,
    unit_price: unit_price,
    total_price: unit_price * quantity
  };
}

export function generateRandomOrder(loops: number): IOrder[] {
  const orders: IOrder[] = [];
  const orderStatuses = [
    ORDER_STATUS.PENDING,
    ORDER_STATUS.CONFIRMED,
    ORDER_STATUS.SHIPPED,
    ORDER_STATUS.DELIVERED,
    ORDER_STATUS.CANCELLED
  ];
  for (let i = 0; i < loops; i++) {
    const order_id = `order-${i + 1}`;
    const order_items: IOrderItem[] = [];
    const itemCount = Math.floor(Math.random() * 5) + 1;
    for (let i = 0; i < itemCount; i++) {
      order_items.push(generateRandomOrderItem(order_id));
    }

    const total_price = order_items.reduce(
      (sum, item) => sum + item.total_price,
      0
    );

    orders.push({
      order_id: order_id,
      customer_id: `customer-${Math.floor(Math.random() * 100)}`,
      customer: generateRandomCustomer(),
      order_status:
        orderStatuses[Math.floor(Math.random() * orderStatuses.length)],
      total_price: parseFloat(total_price.toFixed(2)),
      voucher_code:
        Math.random() > 0.5
          ? `voucher-${Math.floor(Math.random() * 50)}`
          : null,
      created_at: new Date().toISOString(),
      shipping_address: {
        shipping_status:
          orderStatuses[Math.floor(Math.random() * orderStatuses.length)],
        delivery_date: new Date().toISOString(),
        address: generateRandomAddresses(1)[0]
      },
      order_items: order_items
    });
  }

  return orders;
}

export function getRandomEmployeeStatus(): EMPLOY_STATUS {
  const statuses = Object.values(EMPLOY_STATUS);
  const randomIndex = Math.floor(Math.random() * statuses.length);
  return statuses[randomIndex] as EMPLOY_STATUS;
}

function generateRandomPermission(): IPermission {
  return {
    permission_id: `permission-${Math.floor(Math.random() * 1000)}`,
    permission_name: `Permission ${Math.floor(Math.random() * 100)}`,
    description: `Description for permission ${Math.floor(Math.random() * 100)}`
  };
}

function generateRandomRole(permissionCount: number): IRole {
  const permissions: IPermission[] = [];

  for (let i = 0; i < 2; i++) {
    permissions.push(generateRandomPermission());
  }

  return {
    role_id: `role-${Math.floor(Math.random() * 1000)}`,
    role_name: `Role ${Math.floor(Math.random() * 100)}`,
    description: `Description for role ${Math.floor(Math.random() * 100)}`,
    permissions: permissions
  };
}

export function generateRandomRoleList(loops: number): IRole[] {
  const roles: IRole[] = [];

  for (let i = 0; i < loops; i++) {
    roles.push(generateRandomRole(2));
  }

  return roles;
}

function generateRandomStaff(permissionCount: number): IStaff {
  const hasRole = 1;
  return {
    staff_id: `staff-${Math.floor(Math.random() * 1000)}`,
    full_name: `Staff Full Name ${Math.random().toString(36).substr(2, 5)}`,
    phone_number: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
    employee_status: getRandomEmployeeStatus(),
    hire_date: new Date().toISOString(),
    account: {
      email: `staff${Math.floor(Math.random() * 1000)}@example.com`
    },
    role: hasRole ? generateRandomRole(permissionCount) : undefined
  };
}

export function generateRandomStaffList(
  staffCount: number,
  permissionCount: number = 1
): IStaff[] {
  const staffList: IStaff[] = [];

  for (let i = 0; i < staffCount; i++) {
    staffList.push({
      staff_id: `staff-${i}`,
      full_name: `Staff Full Name ${Math.random().toString(36).substr(2, 5)}`,
      phone_number: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      employee_status: getRandomEmployeeStatus(),
      hire_date: new Date().toISOString(),
      account: {
        email: `staff${Math.floor(Math.random() * 1000)}@example.com`
      },
      role: generateRandomRole(permissionCount)
    });
  }

  return staffList;
}

export function generateRandomVoucher(loops: number): IVoucher[] {
  const vouchers: IVoucher[] = [];

  for (let i = 0; i < loops; i++) {
    const discountAmount = parseFloat((Math.random() * 50 + 5).toFixed(2));
    const validFrom = new Date();
    const validTo = new Date(validFrom);
    validTo.setMonth(validTo.getMonth() + Math.floor(Math.random() * 12) + 1);
    vouchers.push({
      voucher_code: `voucher_code-${i}-${Math.floor(Math.random() * 1000)}`,
      voucher_name: `voucher-${i}-${Math.floor(Math.random() * 1000)}`,
      description: `Discount of ${discountAmount}% on all items.`,
      discount_amount: discountAmount,
      valid_from: validFrom.toISOString(),
      valid_to: validTo.toISOString(),
      is_active: Math.random() > 0.5
    });
  }

  return vouchers;
}

function generateRandomSender(seen: boolean, id?: string): ISender {
  return {
    sender_id: id || `sender-${Math.floor(Math.random() * 1000)}`,
    sender_name: `Sender Name ${Math.random().toString(36).substr(2, 5)}`,
    is_seen: true
  };
}

function generateRandomMessage(seen: boolean = true): IInboxMessage {
  return {
    sender: generateRandomSender(
      seen,
      Math.random() > 0.5 ? '--admin' : '--customer'
    ),
    message_id: `message-${Math.floor(Math.random() * 1000)}`,
    message: `This is a random message with id ${Math.floor(
      Math.random() * 1000
    )}`,
    created_at: new Date().toISOString()
  };
}

function generateRandomMessages(
  messageCount: number,
  randomSeen: boolean = false
): IInboxMessage[] {
  const messages: IInboxMessage[] = [];

  for (let i = 0; i < messageCount; i++) {
    messages.push(
      generateRandomMessage(i == messageCount - 1 ? !randomSeen : true)
    );
  }

  return messages;
}

export function generateRandomInboxRoom(loops: number): IInboxRoom[] {
  const rooms: IInboxRoom[] = [];

  for (let i = 0; i < loops; i++) {
    const messageCount = 20;
    rooms.push({
      room_id: `room-${i + 1}`,
      room_name: `Room Name ${Math.random().toString(36).substr(2, 5)}`,
      customer: generateRandomCustomer(
        Math.random() > 0.5 ? '--admin' : '--customer'
      ),
      messages: generateRandomMessages(messageCount)
    });
  }

  return rooms;
}
