package com.example.electrohive.ViewModel;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.ViewModel;

import com.example.electrohive.Models.Message;
import com.example.electrohive.Models.SupportChat;
import com.example.electrohive.Repository.SupportChatRepository;
import com.example.electrohive.utils.PreferencesHelper;
import com.google.gson.JsonObject;

import org.json.JSONObject;

import java.util.Date;
import java.util.List;

public class SupportChatViewModel extends ViewModel {
    private final SupportChatRepository repository;

    private static SupportChatViewModel instance;
    private final String customerId; // Cached customer ID for reuse

    public SupportChatViewModel() {
        repository = new SupportChatRepository();
        customerId = PreferencesHelper.getCustomerData() != null
                ? PreferencesHelper.getCustomerData().getCustomerId()
                : ""; // Fallback to empty string if customer data is unavailable
    }

    public static synchronized SupportChatViewModel getInstance() {
        if(instance == null) {
            instance =  new SupportChatViewModel();
        }
        return instance;
    }


    public LiveData<List<Message>> fetchMessages() {
        if (customerId.isEmpty()) {
            throw new IllegalStateException("Customer ID is not available.");
        }
        return repository.getMessageLog();
    }

    public LiveData<Boolean> sendUserMessage(String message) {
        if (customerId.isEmpty()) {
            throw new IllegalStateException("Customer ID is not available.");
        }

        JsonObject messagePayload = createMessagePayload(message);
        return repository.sendMessage(customerId, messagePayload);
    }

    private JsonObject createMessagePayload(String message) {
        try {
            // Create the main JSON object for the message payload
            JsonObject messagePayload = new JsonObject();

            // Sender details
            JsonObject senderPayload = new JsonObject();
            senderPayload.addProperty("sender_id", customerId);
            senderPayload.addProperty("sender_name", PreferencesHelper.getCustomerData() != null
                    ? PreferencesHelper.getCustomerData().getUsername()
                    : "Unknown");

            // Add sender object to the main message payload
            messagePayload.add("sender", senderPayload);

            // Message content
            messagePayload.addProperty("message", message);

            return messagePayload;

        } catch (Exception e) {
            // Handle any exceptions during JSON creation
            e.printStackTrace();
            return null;
        }
    }


    public void fetchMoreMessages() {
        if (customerId.isEmpty()) {
            throw new IllegalStateException("Customer ID is not available.");
        }
        repository.fetchMoreMessages();
    }

    @Override
    public void onCleared() {
        super.onCleared();
        repository.disconnectSocket();
    }
}
