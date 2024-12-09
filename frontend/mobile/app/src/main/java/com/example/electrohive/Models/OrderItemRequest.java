package com.example.electrohive.Models;

public class OrderItemRequest {
    private String productId;
    private int quantity;
    private double unitPrice;
    private double totalPrice;

    // Constructor
    public OrderItemRequest(String productId, int quantity, double unitPrice, double totalPrice) {
        this.productId = productId;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.totalPrice = totalPrice;
    }

    // Getters and Setters

    public String getProductId() {
        return productId;
    }

    public void setProductId(String productId) {
        this.productId = productId;
    }


    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public double getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(double unitPrice) {
        this.unitPrice = unitPrice;
    }

    public double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(double totalPrice) {
        this.totalPrice = totalPrice;
    }

    // Optionally, toString method for better printing
    @Override
    public String toString() {
        return "OrderItem{" +
                "product_id='" + productId + '\'' +
                ", quantity=" + quantity +
                ", unit_price=" + unitPrice +
                ", total_price=" + totalPrice +
                '}';
    }
}
