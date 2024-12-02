package com.example.electrohive.Models;

public class Sender {
    private String senderId;
    private String name;

    // Constructors
    public Sender() {}

    public Sender(String senderId, String name) {
        this.senderId = senderId;
        this.name = name;
    }

    // Getters and Setters
    public String getSenderId() {
        return senderId;
    }

    public void setSenderId(String senderId) {
        this.senderId = senderId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}

