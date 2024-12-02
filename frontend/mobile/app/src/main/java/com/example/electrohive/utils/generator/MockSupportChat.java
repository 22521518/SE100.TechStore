package com.example.electrohive.utils.generator;

import com.example.electrohive.Models.Customer;
import com.example.electrohive.Models.Message;
import com.example.electrohive.Models.Sender;
import com.example.electrohive.Models.SupportChat;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class MockSupportChat {
    public static SupportChat createMockSupportChatData() {
        // Generate sample Customer
        Customer customer = MockCustomer.createMockCustomerData();

        // Generate sample Messages
        List<Message> messages = createMockMessageData(5); // Generate 5 sample messages

        // Create and return a SupportChat object
        return new SupportChat(
                customer.getCustomerId(),  // Use customer's ID as customer_id
                "123", // Random room ID
                customer,
                messages
        );
    }



    private static List<Message> createMockMessageData(int count) {
        List<Message> messages = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            messages.add(new Message(
                    UUID.randomUUID().toString(), // Random message ID
                    "This is sample message #" + (i + 1),// Messages 5 minutes apart
                    false, // Not seen
                    createMockSenderData() // Generate sender for each message
            ));
        }
        return messages;
    }

    private static Sender createMockSenderData() {
        // Randomly select either "1" or "2" as the sender ID
        String senderId = Math.random() < 0.5 ? "1" : "2";

        // Create and return the Sender object
        return new Sender(
                senderId,           // Sender ID: either "1" or "2"
                "Sample Sender"     // Fixed sample name
        );
    }

}
