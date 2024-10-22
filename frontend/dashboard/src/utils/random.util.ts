import { ORDER_STATUS } from '@constant/enum.constant';
import {
  IAddress,
  IOrder,
  IOrderItem,
  IProductFeedback
} from '@constant/interface.constant';

export function generateProductFeedback(loop: number): IProductFeedback[] {
  const feedbacks: IProductFeedback[] = [];

  for (let i = 0; i < loop; i++) {
    feedbacks.push({
      feedback_id: `feedback-${i + 1}`,
      product_id: `product-${i + 1}`,
      customer_id: `customer-${i + 1}`,
      rating: Math.floor(Math.random() * 5) + 1, // Random rating between 1 and 5
      feedback: `Feedback from customer ${i + 1}`,
      created_at: new Date().toISOString()
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

function generateRandomOrderItem(order_id: string): IOrderItem {
  const quantity = Math.floor(Math.random() * 10) + 1;
  const unit_price = Math.random() * 100 * 1000;

  return {
    order_id: order_id,
    product_id: `product-${Math.floor(Math.random() * 100)}`,
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
      order_status:
        orderStatuses[Math.floor(Math.random() * orderStatuses.length)],
      total_price: parseFloat(total_price.toFixed(2)),
      voucher_code:
        Math.random() > 0.5
          ? `voucher-${Math.floor(Math.random() * 50)}`
          : null,
      created_at: new Date().toISOString(),
      order_items: order_items
    });
  }

  return orders;
}
