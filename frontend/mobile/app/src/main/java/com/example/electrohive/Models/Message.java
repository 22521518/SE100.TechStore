package com.example.electrohive.Models;

import java.time.LocalDateTime;

public class Message {
    private String messageId;
    private String message;
    private Boolean isSeen;
    private Sender sender;

    private Boolean is_customer = false;

    // Constructors
    public Message() {}

    public Message(String messageId, String message, Boolean isSeen, Sender sender) {
        this.messageId = messageId;
        this.message = message;
        this.isSeen = isSeen;
        this.sender = sender;
    }

    // Getters and Setters
    public String getMessageId() {
        return messageId;
    }

    public void setMessageId(String messageId) {
        this.messageId = messageId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setIs_customer(Boolean is_customer) {
        this.is_customer = is_customer;
    }

    public void setIs_customer(String customer_id) {
        this.is_customer = sender.getSenderId().equals(customer_id);
    }
    public Boolean getIs_customer(){
        return is_customer;
    }



    public boolean isSeen() {
        return isSeen;
    }

    public void setSeen(boolean seen) {
        isSeen = seen;
    }

    public Sender getSender() {
        return sender;
    }

    public void setSender(Sender sender) {
        this.sender = sender;
    }
}

