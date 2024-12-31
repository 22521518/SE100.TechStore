package com.example.electrohive.Repository;

import android.util.Log;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.example.electrohive.Models.Customer;
import com.example.electrohive.Models.Enum.SOCKET_INBOX_CHANNEL;
import com.example.electrohive.Models.Enum.SOCKET_JOIN_CHANNEL;
import com.example.electrohive.Models.Message;
import com.example.electrohive.Models.Sender;
import com.example.electrohive.api.SupportChatService;
import com.example.electrohive.utils.PreferencesHelper;
import com.example.electrohive.utils.RetrofitClient;
import com.google.gson.JsonObject;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import io.socket.client.IO;
import io.socket.client.Socket;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class SupportChatRepository {
    private static final String TAG = "SupportChatRepository"; // Tag for logging
    private final SupportChatService supportChatService;
    private final Socket socket;
    private final MutableLiveData<List<Message>> messageList = new MutableLiveData<>(new ArrayList<>());
    private boolean isMoreMessagesAvailable = true;
    private boolean isLoading = false;
    private int skip = 0;

    public SupportChatRepository() {
        supportChatService = RetrofitClient.getClient().create(SupportChatService.class);

        try {
            socket = IO.socket("https://se100-techstore.onrender.com");

            // Listen for connection events
            socket.on(Socket.EVENT_CONNECT, args -> {
                String socketId = socket.id();
                Log.d("SupportChatRepository", "Socket connected with ID: " + socketId);

                socket.onAnyOutgoing(event -> Log.d(TAG, "Event: " + event.toString() + ", Data: " + Arrays.toString(event)));
                socket.onAnyIncoming(event -> Log.d(TAG, "Event: " + event.toString() + ", Data: " + Arrays.toString(event)));

                JSONObject roomId = new JSONObject();
                JSONObject joinId = new JSONObject();
                try {
                    roomId.put("socket_id", socketId); // Use the ID here
                    roomId.put("user_id", PreferencesHelper.getCustomerData().getCustomerId());
                    joinId.put("room_id", PreferencesHelper.getCustomerData().getCustomerId());

                } catch (JSONException e) {
                    Log.e(TAG, "Error creating room ID JSON object", e);
                }

                socket.emit(SOCKET_JOIN_CHANNEL.CUSTOMER_JOIN.toString(), roomId);
                socket.emit(SOCKET_INBOX_CHANNEL.JOIN_ROOM.toString(), joinId);

                // Fetch messages after connection is established
                fetchMoreMessages();
                listenForIncomingMessages();
                listenForOldMessages();
            });

            socket.on(Socket.EVENT_CONNECT_ERROR, args ->
                    Log.e("SupportChatRepository", "Socket connection error: " + Arrays.toString(args))
            );
            socket.on(Socket.EVENT_DISCONNECT, args ->
                    Log.d("SupportChatRepository", "Socket disconnected")
            );

            socket.connect(); // Connect the socket

        } catch (URISyntaxException e) {
            Log.e("SupportChatRepository", "Socket initialization failed", e);
            throw new RuntimeException("Socket initialization failed", e);
        }
    }

    public LiveData<Boolean> sendMessage(Customer customer, JsonObject messagePayload) {
        MutableLiveData<Boolean> status = new MutableLiveData<>();

        // Send the message to the API first
        supportChatService.postMessage(customer.getCustomerId(), "application/json", messagePayload).enqueue(new Callback<JsonObject>() {
            @Override
            public void onResponse(Call<JsonObject> call, Response<JsonObject> response) {
                if (response.isSuccessful() && response.body() != null) {
                    // Get the JsonObject response body
                    JsonObject responseBody = response.body();

                    // On successful API call, prepare the WebSocket payload as JSONObject
                    JSONObject socketPayload = new JSONObject();
                    try {


                        JSONObject customerJson = new JSONObject();
                        customerJson.put("customer_id",customer.getCustomerId());
                        customerJson.put("account_id",customer.getAccountId());
                        customerJson.put("username",customer.getUsername());
                        customerJson.put("full_name",customer.getFullName());
                        customerJson.put("phone_number",customer.getPhoneNumber());
                        customerJson.put("image",customer.getImage());
                        customerJson.put("male",customer.getMale());
                        customerJson.put("birth_date",customer.getBirthDate());


                        socketPayload.put("room_id", customer.getCustomerId());
                        socketPayload.put("customer", customerJson);

                        String rawMessage = responseBody.toString();
                        JSONObject messageJson = new JSONObject(rawMessage); // Parse the string back to JSON
                        socketPayload.put("message", messageJson);


                        Log.d("socket payload",socketPayload.toString());
                        // Emit the message via WebSocket
                        socket.emit(SOCKET_INBOX_CHANNEL.ADD_MESSAGE.toString(), socketPayload);

                        // Create Message object and update the UI
                        Message message = new Message(
                                responseBody.get("message_id").getAsString(),
                                responseBody.get("message").getAsString(),
                                true,
                                new Sender(
                                        responseBody.getAsJsonObject("sender").get("sender_id").getAsString(),
                                        responseBody.getAsJsonObject("sender").get("sender_name").getAsString()
                                )
                        );

                        message.setIs_customer(true);

                        // Update the message list
                        List<Message> currentMessages = messageList.getValue();
                        currentMessages.add(0, message); // Add new messages to the top
                        messageList.postValue(currentMessages);

                        // Update the status to true
                        status.postValue(true);
                        Log.d(TAG, "Message sent successfully: " + messagePayload);
                    } catch (Exception e) {
                        Log.e(TAG, "Error processing the response or creating socket payload", e);
                        status.postValue(false);
                    }
                } else {
                    // Update the status to false if API call fails
                    status.postValue(false);
                    Log.d(TAG, "Message failed to send: " + response.message());
                }
            }

            @Override
            public void onFailure(Call<JsonObject> call, Throwable t) {
                // Update the status to false on failure
                status.postValue(false);
                Log.e(TAG, "Message sending failed", t);
            }
        });

        return status;
    }

    public void fetchMoreMessages() {
        if (isLoading || !isMoreMessagesAvailable) return;

        isLoading = true;

        JSONObject payload = new JSONObject();
        try {
            payload.put("room_id", PreferencesHelper.getCustomerData().getCustomerId());
            payload.put("skip", skip);
        } catch (JSONException e) {
            Log.e(TAG, "Error creating fetch payload", e);
        }

        socket.emit(SOCKET_INBOX_CHANNEL.GET_MORE_MESSAGES.toString(), payload);
    }

    private void listenForIncomingMessages() {
        socket.on(SOCKET_INBOX_CHANNEL.GET_MESSAGES.toString(), args -> {
            if (args.length > 0 && args[0] instanceof JSONObject) {
                try {
                    JSONObject data = ((JSONObject) args[0]).getJSONObject("message");
                    String messageText = data.getString("message");
                    boolean isSeen = data.getBoolean("is_seen");
                    JSONObject sender = data.getJSONObject("sender");

                    Message message = new Message(
                            PreferencesHelper.getCustomerData().getCustomerId(),
                            messageText,
                            isSeen,
                            new Sender(
                                    sender.getString("sender_id"),
                                    sender.getString("sender_name")
                            )
                    );
                    message.setIs_customer(PreferencesHelper.getCustomerData().getCustomerId());

                    List<Message> currentMessages = messageList.getValue();
                    currentMessages.add(0, message); // Add new messages to the top
                    messageList.postValue(currentMessages);
                    Log.d(TAG, "Incoming message received: " + messageText);
                } catch (Exception e) {
                    Log.e(TAG, "Error processing incoming message", e);
                }
            }
        });
    }

    private void listenForOldMessages() {
        socket.on(SOCKET_INBOX_CHANNEL.GET_MORE_MESSAGES.toString(), args -> {
            if (args.length > 0 && args[0] instanceof JSONObject) {
                try {
                    JSONObject data = (JSONObject) args[0];
                    JSONArray messagesArray = data.getJSONArray("messages");

                    if (messagesArray.length() > 0) {
                        List<Message> oldMessages = new ArrayList<>();
                        for (int i = 0; i < messagesArray.length(); i++) {
                            JSONObject messageJson = messagesArray.getJSONObject(i);
                            String message_id = messageJson.getString("message_id");
                            String messageText = messageJson.getString("message");
                            boolean isSeen = messageJson.getBoolean("is_seen");
                            JSONObject sender = messageJson.getJSONObject("sender");

                            Message message = new Message(
                                    message_id,
                                    messageText,
                                    isSeen,
                                    new Sender(
                                            sender.getString("sender_id"),
                                            sender.getString("name")
                                    )
                            );

                            message.setIs_customer(PreferencesHelper.getCustomerData().getCustomerId());
                            oldMessages.add(message);
                        }

                        List<Message> currentMessages = messageList.getValue();
                        currentMessages.addAll(oldMessages); // Append old messages to the bottom
                        messageList.postValue(currentMessages);

                        // Update state
                        isMoreMessagesAvailable = messagesArray.length() >= 20;
                        skip += messagesArray.length() > 0 ? 1 : 0;
                        Log.d(TAG, "Fetched old messages: " + oldMessages.size());
                    } else {
                        isMoreMessagesAvailable = false;
                        Log.d(TAG, "No more messages available");
                    }
                } catch (Exception e) {
                    Log.e(TAG, "Error processing old messages", e);
                } finally {
                    isLoading = false;
                }
            }
        });
    }

    public LiveData<List<Message>> getMessageLog() {
        return messageList;
    }

    public void disconnectSocket() {
        if (socket != null) {
            socket.disconnect();
            socket.off(SOCKET_INBOX_CHANNEL.GET_MESSAGES.toString());
            socket.off(SOCKET_INBOX_CHANNEL.GET_MORE_MESSAGES.toString());
            Log.d(TAG, "Socket disconnected.");
        }
    }
}
