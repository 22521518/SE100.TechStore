package com.example.electrohive.Models;

import java.util.Date;

public class ProductFeedback {
    private String feedbackId;
    private String customerId;
    private Customer customer; // Assuming Customer class is defined
    private String productId;
    private int rating;
    private String feedback;
    private Object createdAt; // Can be Date or String

    // Constructor
    public ProductFeedback(String feedbackId, int rating, String feedback) {
        this.feedbackId = feedbackId;
        this.rating = rating;
        this.feedback = feedback;
    }

    // Getters and Setters
    public String getFeedbackId() {
        return feedbackId;
    }

    public void setFeedbackId(String feedbackId) {
        this.feedbackId = feedbackId;
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

    public String getProductId() {
        return productId;
    }

    public void setProductId(String productId) {
        this.productId = productId;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }

    public Object getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Object createdAt) {
        this.createdAt = createdAt;
    }

    // Optionally, toString method for better printing
    @Override
    public String toString() {
        return "ProductFeedback{" +
                "feedbackId='" + feedbackId + '\'' +
                ", customerId='" + customerId + '\'' +
                ", customer=" + customer +
                ", productId='" + productId + '\'' +
                ", rating=" + rating +
                ", feedback='" + feedback + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}
