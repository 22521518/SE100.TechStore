package com.example.electrohive.Models;

import java.util.List;

public class SupportChat {
    private String customerId;
    private String roomId;
    private Customer customer; // Assuming you already have a Customer class
    private List<Message> messages;

    // Constructors
    public SupportChat() {}

    public SupportChat(String customerId, String roomId, Customer customer, List<Message> messages) {
        this.customerId = customerId;
        this.roomId = roomId;
        this.customer = customer;
        this.messages = messages;
    }

    // Getters and Setters
    public String getCustomerId() {
        return customerId;
    }

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }

    public String getRoomId() {
        return roomId;
    }

    public void setRoomId(String roomId) {
        this.roomId = roomId;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public List<Message> getMessages() {
        return messages;
    }

    public void setMessages(List<Message> messages) {
        this.messages = messages;
    }
}