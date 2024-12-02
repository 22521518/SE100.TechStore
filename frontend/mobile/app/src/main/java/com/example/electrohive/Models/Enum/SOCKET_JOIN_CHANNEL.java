package com.example.electrohive.Models.Enum;

public enum SOCKET_JOIN_CHANNEL {
    STAFF_JOIN("STAFF_JOIN"),
    STAFF_LEAVE("STAFF_LEAVE"),
    CUSTOMER_JOIN("CUSTOMER_JOIN"),
    CUSTOMER_LEAVE("CUSTOMER_LEAVE");

    private final String eventName;

    SOCKET_JOIN_CHANNEL(String eventName) {
        this.eventName = eventName;
    }

    @Override
    public String toString() {
        return eventName;
    }
}
