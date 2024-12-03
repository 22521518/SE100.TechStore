package com.example.electrohive.Activities;

import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.Toast;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.Observer;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.electrohive.Adapters.MessageAdapter;
import com.example.electrohive.Models.Message;
import com.example.electrohive.Models.SupportChat;
import com.example.electrohive.R;
import com.example.electrohive.ViewModel.SupportChatViewModel;

import java.util.ArrayList;
import java.util.List;

public class SupportChatPage extends AppCompatActivity {

    private SupportChatViewModel supportChatViewModel = SupportChatViewModel.getInstance();
    private RecyclerView recyclerView;

    private EditText messsageInput;

    private ImageButton sendButton;
    private MessageAdapter messageAdapter; // Assuming you have an adapter for RecyclerView

    private ImageButton scrollBottomButton;

    private int threshold = 800; // Define the threshold for scroll distance

    private int scrollOffset = 0;

    private List<Message> messagesList = new ArrayList<>();
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.support_chat_page);

        ImageButton backButton = findViewById(R.id.backbutton);
        backButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });

        scrollBottomButton = findViewById(R.id.scrollBottomButton);
        // Setup RecyclerView
        recyclerView = findViewById(R.id.message_listview);
        recyclerView.setLayoutManager(new LinearLayoutManager(this, LinearLayoutManager.VERTICAL, true));
        messageAdapter = new MessageAdapter(messagesList); // Assuming an adapter to display messages
        recyclerView.setAdapter(messageAdapter);

        // Observe the message log
        supportChatViewModel.fetchMessages().observe(this, new Observer<List<Message>>() {
            @Override
            public void onChanged(List<Message> messages) {
                messagesList = messages;
                messageAdapter.updateMessages(messagesList); // Update the adapter with new messages
            }
        });

        // Example for sending a message
        sendButton = findViewById(R.id.sendButton);
        messsageInput =  findViewById(R.id.messageInput);

        // Send message on button click
        sendButton.setOnClickListener(v -> {
            String messageText = messsageInput.getText().toString().trim(); // Get text and trim spaces
            if (!messageText.isEmpty()) { // Check for empty input
                sendMessage(messageText); // Send the message
                messsageInput.setText(""); // Clear input field after sending
            }
        });

        // Add a scroll listener to the RecyclerView to detect when the user scrolls to the bottom
        recyclerView.addOnScrollListener(new RecyclerView.OnScrollListener() {
            @Override
            public void onScrolled(RecyclerView recyclerView, int dx, int dy) {
                super.onScrolled(recyclerView, dx, dy);

                LinearLayoutManager layoutManager = (LinearLayoutManager) recyclerView.getLayoutManager();
                if (layoutManager != null) {
                    int totalItemCount = layoutManager.getItemCount();
                    int lastVisibleItemPosition = layoutManager.findLastVisibleItemPosition();

                    // Check if the last visible item is the last item in the list
                    if (lastVisibleItemPosition == totalItemCount - 1) {
                        // Last item is in view, fetch more messages
                        fetchMoreMessages();
                    }

                    // Calculate scroll distance from the first item

                    scrollOffset += -dy;
                    // If the scroll distance from the first item is greater than 200, show the button
                    if (scrollOffset >  threshold) {
                        scrollBottomButton.setVisibility(View.VISIBLE);
                    } else {
                        // Otherwise, hide the button
                        scrollBottomButton.setVisibility(View.GONE);
                    }
                }
            }
        });

        // Scroll button click listener
        scrollBottomButton.setOnClickListener(v -> {
            recyclerView.smoothScrollToPosition(0); // Scroll to the bottom
        });

    }

    // Method to fetch more messages when scrolled to the top
    private void fetchMoreMessages() {
        // Example of fetching more messages
        supportChatViewModel.fetchMoreMessages();
    }


    // Method to send a message
    private void sendMessage(String messageText) {
        supportChatViewModel.sendUserMessage(messageText).observe(this, new Observer<Boolean>() {
            @Override
            public void onChanged(Boolean isSuccess) {
                if (isSuccess) {
                    // Handle success (e.g., show a toast)
                } else {
                    Toast.makeText(SupportChatPage.this, "Failed to send message. Try again.", Toast.LENGTH_SHORT).show();
                }
            }
        });
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        supportChatViewModel.onCleared(); // Disconnect from socket when the activity is destroyed
    }
}
