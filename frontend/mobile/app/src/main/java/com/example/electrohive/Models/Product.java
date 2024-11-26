package com.example.electrohive.Models;

import java.util.List;

public class Product {
    private String productId;
    private String productName;
    private List<ProductImage> images; // Assuming ProductImage class is defined
    private String description;
    private float price;
    private float discount; // Can be null
    private Integer stockQuantity; // Can be null
    private List<Category> categories; // Assuming Category class is defined

    private List<ProductFeedback> productFeedbacks;
    private float averageRating;
    private List<ProductAttribute> attributes; // Assuming ProductAttribute class is defined

    // Constructor
    public Product(String productId, String productName, List<ProductImage> images, String description, float price,
                   float discount, Integer stockQuantity, List<Category> categories, List<ProductAttribute> attributes) {
        this.productId = productId;
        this.productName = productName;
        this.images = images;
        this.description = description;
        this.price = price;
        this.discount = discount;
        this.stockQuantity = stockQuantity;
        this.categories = categories;
        this.attributes = attributes;
    }


    public void setProductFeedbacks(List<ProductFeedback> productFeedbackList) {
        this.productFeedbacks = productFeedbackList;
    }

    public List<ProductFeedback> getProductFeedbacks(){
        return this.productFeedbacks;
    }

    // Getters and Setters
    public String getProductId() {
        return productId;
    }

    public void setAverageRating(float rating) {
        this.averageRating = rating;
    }

    public float getAverageRating() {
        return averageRating;
    }

    public void setProductId(String productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public List<ProductImage> getImages() {
        return images;
    }

    public void setImages(List<ProductImage> images) {
        this.images = images;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getPrice() {
        return price;
    }

    public double getRetailPrice() {
        return price*(1-discount/100);
    }


    public void setPrice(float price) {
        this.price = price;
    }

    public float getDiscount() {
        return discount;
    }

    public void setDiscount(float discount) {
        this.discount = discount;
    }

    public Integer getStockQuantity() {
        return stockQuantity;
    }

    public void setStockQuantity(Integer stockQuantity) {
        this.stockQuantity = stockQuantity;
    }

    public List<Category> getCategories() {
        return categories;
    }

    public void setCategories(List<Category> categories) {
        this.categories = categories;
    }

    public List<ProductAttribute> getAttributes() {
        return attributes;
    }

    public void setAttributes(List<ProductAttribute> attributes) {
        this.attributes = attributes;
    }

    // Optionally, toString method for better printing
    @Override
    public String toString() {
        return "Product{" +
                "productId='" + productId + '\'' +
                ", productName='" + productName + '\'' +
                ", images=" + images +
                ", description='" + description + '\'' +
                ", price=" + price +
                ", discount=" + discount +
                ", stockQuantity=" + stockQuantity +
                ", categories=" + categories +
                ", attributes=" + attributes +
                '}';
    }
}




