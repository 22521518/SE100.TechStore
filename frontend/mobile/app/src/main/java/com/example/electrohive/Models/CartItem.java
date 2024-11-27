package com.example.electrohive.Models;

import java.io.Serializable;

public class CartItem implements Serializable {
    private String customerId;
    private String productId;
    private int quantity;
    private Product product;

    private Boolean checked;

    // Constructors
    public CartItem() {}

    public CartItem(String customerId, String productId, int quantity, Product product) {
        this.customerId = customerId;
        this.productId = productId;
        this.quantity = quantity;
        this.product = product;
        this.checked=false;
    }

    // Getters and Setters
    public String getCustomerId() {
        return customerId;
    }

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }

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

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public boolean getChecked() {
        return checked;
    }

    public void setChecked(boolean checked) {
        this.checked = checked;
    }

    // Helper Methods
    public double getTotalPrice() {
        if (product != null) {
            return quantity * product.getRetailPrice();
        }
        return 0.0;
    }

    // Optional: toString method for better debugging
    @Override
    public String toString() {
        return "CartItem{" +
                "customerId='" + customerId + '\'' +
                ", productId='" + productId + '\'' +
                ", quantity=" + quantity +
                ", product=" + product +
                '}';
    }
}
