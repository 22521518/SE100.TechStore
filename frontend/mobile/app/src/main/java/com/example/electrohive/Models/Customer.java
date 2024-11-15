package com.example.electrohive.Models;

import java.util.Date;
import java.util.List;

public class Customer {
    private String customerId;
    private String accountId;
    private String username;
    private String fullName;
    private String phoneNumber;
    private Object dateJoined;  // Can be Date or String
    private Account account;     // Assuming Account class is defined
    private List<ProductFeedback> productFeedbacks; // Assuming ProductFeedback class is defined
    private List<Order> orders;  // Assuming Order class is defined
    private List<Address> addresses; // Assuming Address class is defined
    private String image;
    private Boolean male;
    private Object birthDate;  // Can be Date or String

    // Constructor
    public Customer(String customerId, String accountId, String username, String fullName, String phoneNumber) {
        this.customerId = customerId;
        this.accountId = accountId;
        this.username = username;
        this.fullName = fullName;
        this.phoneNumber = phoneNumber;
    }

    // Getters and Setters
    public String getCustomerId() {
        return customerId;
    }

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }

    public String getAccountId() {
        return accountId;
    }

    public void setAccountId(String accountId) {
        this.accountId = accountId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public Object getDateJoined() {
        return dateJoined;
    }

    public void setDateJoined(Object dateJoined) {
        this.dateJoined = dateJoined;
    }

    public Account getAccount() {
        return account;
    }

    public void setAccount(Account account) {
        this.account = account;
    }

    public List<ProductFeedback> getProductFeedbacks() {
        return productFeedbacks;
    }

    public void setProductFeedbacks(List<ProductFeedback> productFeedbacks) {
        this.productFeedbacks = productFeedbacks;
    }

    public List<Order> getOrders() {
        return orders;
    }

    public void setOrders(List<Order> orders) {
        this.orders = orders;
    }

    public List<Address> getAddresses() {
        return addresses;
    }

    public void setAddresses(List<Address> addresses) {
        this.addresses = addresses;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public Boolean getMale() {
        return male;
    }

    public void setMale(Boolean male) {
        this.male = male;
    }

    public Object getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(Object birthDate) {
        this.birthDate = birthDate;
    }

    // Optionally, toString method for better printing
    @Override
    public String toString() {
        return "Customer{" +
                "customerId='" + customerId + '\'' +
                ", accountId='" + accountId + '\'' +
                ", username='" + username + '\'' +
                ", fullName='" + fullName + '\'' +
                ", phoneNumber='" + phoneNumber + '\'' +
                ", dateJoined=" + dateJoined +
                ", account=" + account +
                ", productFeedbacks=" + productFeedbacks +
                ", orders=" + orders +
                ", addresses=" + addresses +
                ", image='" + image + '\'' +
                ", male=" + male +
                ", birthDate=" + birthDate +
                '}';
    }
}
