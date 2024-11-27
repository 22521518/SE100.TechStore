import { Injectable } from '@nestjs/common';

@Injectable()
export class MomoPaymentStore {
  private customerPaymentList: CustomerPayment[] = [];

  getPayments() {
    return this.customerPaymentList;
  }

  getPaymentByCustomer(customerId: string) {
    return this.customerPaymentList.find((cp) => cp.customerId === customerId);
  }

  getPaymentByOrder(orderId: string) {
    return this.customerPaymentList.find((cp) => cp.orderId === orderId);
  }

  addPayment(payment: CustomerPayment) {
    this.customerPaymentList.push(payment);
  }

  async removePaymentByCustomer(
    customerId: string,
    callback?: (orderId: string) => void,
  ) {
    const cps = this.customerPaymentList.find(
      (cp) => cp.customerId === customerId,
    );
    this.customerPaymentList = this.customerPaymentList.filter(
      (cp) => cp.customerId !== customerId,
    );
    if (callback && cps) callback(cps.orderId);
  }

  removePaymentByOrder(orderId: string, callback?: (orderId: string) => void) {
    this.customerPaymentList = this.customerPaymentList.filter(
      (cp) => cp.orderId !== orderId,
    );
    if (callback) callback(orderId);
  }
}

export type CustomerPayment = {
  orderId: string;
  customerId: string;
};
