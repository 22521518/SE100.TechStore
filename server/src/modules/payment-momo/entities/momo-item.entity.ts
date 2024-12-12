export class EPaymentOrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  currency: string = 'VND';
  totalPrice: number;
  imageUrl: string;

  constructor(
    id: string,
    name: string,
    imageUrl: string,
    price: number,
    quantity: number,
    totalPrice: number,
  ) {
    this.id = id;
    this.name = name;
    this.imageUrl = imageUrl;
    this.price = price;
    this.quantity = quantity;
    this.totalPrice = totalPrice;
  }
}
