package com.example.electrohive.Models;

import com.example.electrohive.Models.Enum.SHIPPING_STATUS;

import java.util.Date;

public class ShippingAddress {

    private String shippingId;
    private SHIPPING_STATUS shippingStatus;
    private Object deliveryDate;  // Can be String or Date
    private Address address;    // Assuming Address class is already defined as in the previous example

    // Constructor
    public ShippingAddress(String shippingId,SHIPPING_STATUS shippingStatus, Object deliveryDate, Address address) {
        this.shippingId = shippingId;
        this.shippingStatus = shippingStatus;
        this.deliveryDate = deliveryDate;
        this.address = address;
    }

    // Getters and Setters
    public SHIPPING_STATUS getShippingStatus() {
        return shippingStatus;
    }

    public void setShippingStatus(SHIPPING_STATUS shippingStatus) {
        this.shippingStatus = shippingStatus;
    }

    public Object getDeliveryDate() {
        return deliveryDate;
    }

    public void setDeliveryDate(Date deliveryDate) {
        this.deliveryDate = deliveryDate;
    }

    public Address getAddress() {
        return address;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    // Optionally, toString method for better printing
    @Override
    public String toString() {
        return "ShippingAddress{" +
                "shippingStatus=" + shippingStatus +
                ", deliveryDate=" + deliveryDate +
                ", address=" + address +
                '}';
    }
}

// Enum for ORDER_STATUS

