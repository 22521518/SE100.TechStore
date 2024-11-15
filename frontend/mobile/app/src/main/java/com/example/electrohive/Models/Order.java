package com.example.electrohive.Models;

import com.example.electrohive.Models.Enum.ORDER_STATUS;
import com.example.electrohive.Models.Enum.PAYMENT_METHOD;

import java.util.Date;
import java.util.List;

public class Order {
    private String orderId;
    private String customerId;
    private Customer customer;  // Assuming Customer class is defined
    private ORDER_STATUS orderStatus;
    private double totalPrice;
    private String voucherCode;
    private Object createdAt;   // Can be Date or String
    private ShippingAddress shippingAddress;  // Assuming ShippingAddress class is defined
    private List<OrderItem> orderItems;  // Assuming OrderItem class is defined
    private PAYMENT_METHOD paymentMethod;  // Assuming PAYMENT_METHOD enum is defined

    // Constructor
    public Order(String orderId, String customerId, Customer customer, ORDER_STATUS orderStatus,
                 double totalPrice, String voucherCode, Object createdAt,
                 ShippingAddress shippingAddress, List<OrderItem> orderItems,
                 PAYMENT_METHOD paymentMethod) {
        this.orderId = orderId;
        this.customerId = customerId;
        this.customer = customer;
        this.orderStatus = orderStatus;
        this.totalPrice = totalPrice;
        this.voucherCode = voucherCode;
        this.createdAt = createdAt;
        this.shippingAddress = shippingAddress;
        this.orderItems = orderItems;
        this.paymentMethod = paymentMethod;
    }


    // Getters and Setters
    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getCustomerId() {
        return customerId;
    }

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public ORDER_STATUS getOrderStatus() {
        return orderStatus;
    }

    public void setOrderStatus(ORDER_STATUS orderStatus) {
        this.orderStatus = orderStatus;
    }

    public double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public String getVoucherCode() {
        return voucherCode;
    }

    public void setVoucherCode(String voucherCode) {
        this.voucherCode = voucherCode;
    }

    public Object getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Object createdAt) {
        this.createdAt = createdAt;
    }

    public ShippingAddress getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(ShippingAddress shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public List<OrderItem> getOrderItems() {
        return orderItems;
    }

    public void setOrderItems(List<OrderItem> orderItems) {
        this.orderItems = orderItems;
    }

    public PAYMENT_METHOD getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(PAYMENT_METHOD paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    // Optionally, toString method for better printing
    @Override
    public String toString() {
        return "Order{" +
                "orderId='" + orderId + '\'' +
                ", customerId='" + customerId + '\'' +
                ", customer=" + customer +
                ", orderStatus=" + orderStatus +
                ", totalPrice=" + totalPrice +
                ", voucherCode='" + voucherCode + '\'' +
                ", createdAt=" + createdAt +
                ", shippingAddress=" + shippingAddress +
                ", orderItems=" + orderItems +
                ", paymentMethod=" + paymentMethod +
                '}';
    }
}

// Enum for ORDER_STATUS


// Enum for PAYMENT_METHOD
