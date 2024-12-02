package com.example.electrohive.Adapters;


import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.cardview.widget.CardView;
import androidx.recyclerview.widget.RecyclerView;

import com.example.electrohive.Models.Message;
import com.example.electrohive.R;

import java.util.List;

public class MessageAdapter extends RecyclerView.Adapter<MessageAdapter.MessageViewHolder> {

    private List<Message> messages;

    // Constructor
    public MessageAdapter(List<Message> messages) {
        this.messages = messages;
    }

    // ViewHolder to hold references to UI elements
    public static class MessageViewHolder extends RecyclerView.ViewHolder {
        TextView chatTextView;

        LinearLayout chatItem;

        public MessageViewHolder(@NonNull View itemView) {
            super(itemView);
            // Find the TextView for the message
            chatTextView = itemView.findViewById(R.id.chatText);
            chatItem = itemView.findViewById(R.id.chatItem);
        }
    }

    @NonNull
    @Override
    public MessageViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        // Inflate the layout for each message item (message_item.xml)
        View itemView = LayoutInflater.from(parent.getContext()).inflate(R.layout.support_chat_item, parent, false);
        return new MessageViewHolder(itemView);
    }

    @Override
    public void onBindViewHolder(@NonNull MessageViewHolder holder, int position) {
        // Get the message at the current position
        Message message = messages.get(position);

        // Set the message content into the TextView
        holder.chatTextView.setText(message.getMessage());

        if (message.getIs_customer()) {
            // Align to the right
            holder.chatItem.setGravity(Gravity.END);
            // Optionally, change the background color or style
        } else {
            // Align to the left (default)
            holder.chatItem.setGravity(Gravity.START);
            // Optionally, change the background color or style
        }
    }

    @Override
    public int getItemCount() {
        return messages.size();
    }

    // Method to update the message list when new data is available
    public void updateMessages(List<Message> newMessages) {
        this.messages = newMessages;
        notifyDataSetChanged();  // Notify the adapter that the data has changed
    }
}
