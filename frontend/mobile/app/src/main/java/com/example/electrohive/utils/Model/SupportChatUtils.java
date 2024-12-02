package com.example.electrohive.utils.Model;

import com.example.electrohive.Models.SupportChat;
import com.example.electrohive.Models.Message;
import com.example.electrohive.Models.Sender;
import com.example.electrohive.Models.Customer;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

public class SupportChatUtils {
    public static SupportChat parseSupportChat(JsonObject supportChatJson) {
        // Extract basic fields
        String customerId = supportChatJson.get("customer_id").getAsString();
        String roomId = supportChatJson.get("room_id").getAsString();

        // Parse Customer object (assuming you have the Customer class and its parser)
        JsonObject customerJson = supportChatJson.getAsJsonObject("customer");
        Customer customer = CustomerUtils.parseCustomer(customerJson);

        // Parse Messages array
        JsonArray messagesArray = supportChatJson.getAsJsonArray("messages");
        List<Message> messages = new ArrayList<>();
        for (JsonElement messageElement : messagesArray) {
            JsonObject messageJson = messageElement.getAsJsonObject();
            messages.add(parseMessage(messageJson));
        }

        // Construct and return the SupportChat object
        return new SupportChat(customerId, roomId, customer, messages);
    }


    public static Message parseMessage(JsonObject messageJson) {
        String messageId = messageJson.get("message_id").getAsString();
        String message = messageJson.get("message").getAsString();
        String createdAtString = messageJson.get("created_at").getAsString();
        boolean isSeen = messageJson.get("is_seen").getAsBoolean();

        // Parse created_at to LocalDateTime
//        LocalDateTime createdAt = LocalDateTime.parse(createdAtString, DateTimeFormatter.ISO_DATE_TIME);

        // Parse Sender
        JsonObject senderJson = messageJson.getAsJsonObject("sender");
        Sender sender = parseSender(senderJson);

        // Create and return the Message object
        return new Message(messageId, message, isSeen, sender);
    }

    private static Sender parseSender(JsonObject senderJson) {
        String senderId = senderJson.get("sender_id").getAsString();
        String name = senderJson.get("name").getAsString();

        // Create and return the Sender object
        return new Sender(senderId, name);
    }
}
