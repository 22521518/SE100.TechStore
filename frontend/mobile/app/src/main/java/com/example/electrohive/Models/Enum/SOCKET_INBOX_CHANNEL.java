package com.example.electrohive.Models.Enum;

public enum SOCKET_INBOX_CHANNEL {
    JOIN_ROOM("JOIN_ROOM"),
    LEAVE_ROOM("LEAVE_ROOM"),
    GET_MORE_MESSAGES("GET_MORE_MESSAGES"),
    ADD_MESSAGE("ADD_MESSAGE"),
    GET_MESSAGES("GET_MESSAGES"),
    DELETE_MESSAGE("DELETE_MESSAGE"),
    GET_CONVERSATIONS("GET_CONVERSATIONS");

    private final String eventName;

    SOCKET_INBOX_CHANNEL(String eventName) {
        this.eventName = eventName;
    }

    @Override
    public String toString() {
        return eventName;
    }
}
