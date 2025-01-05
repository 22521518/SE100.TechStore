package com.example.electrohive.Adapters;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.RatingBar;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.example.electrohive.Models.ProductFeedback;
import com.example.electrohive.R;
import com.google.android.material.imageview.ShapeableImageView;

import java.util.List;

public class ProductFeedbackAdapter extends RecyclerView.Adapter<ProductFeedbackAdapter.FeedbackViewHolder> {

    private Context context;
    private List<ProductFeedback> feedbackList;

    public ProductFeedbackAdapter(Context context, List<ProductFeedback> feedbackList) {
        this.context = context;
        this.feedbackList = feedbackList;
    }

    @NonNull
    @Override
    public FeedbackViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.product_feedback_item, parent, false);
        return new FeedbackViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull FeedbackViewHolder holder, int position) {
        ProductFeedback feedback = feedbackList.get(position);

        // Set username
        if (feedback.getCustomer() != null) {
            holder.username.setText(feedback.getCustomer().getUsername());
        } else {
            holder.username.setText("Customer");
        }

        // Set rating
        holder.ratingBar.setRating(feedback.getRating());

        // Set feedback content
        holder.feedbackContent.setText(feedback.getFeedback());

        // Load profile image with Glide
        if (feedback.getCustomer() != null && feedback.getCustomer().getImage() != null) {
            Glide.with(context)
                    .load(feedback.getCustomer().getImage())
                    .placeholder(R.drawable.ic_user_icon)
                    .error(R.drawable.ic_user_icon)
                    .into(holder.profileImage);
        } else {
            holder.profileImage.setImageResource(R.drawable.ic_user_icon); // Default image
        }
    }

    @Override
    public int getItemCount() {
        return feedbackList.size();
    }

    public static class FeedbackViewHolder extends RecyclerView.ViewHolder {
        ShapeableImageView profileImage;
        TextView username;
        RatingBar ratingBar;
        TextView feedbackContent;

        public FeedbackViewHolder(@NonNull View itemView) {
            super(itemView);
            profileImage = itemView.findViewById(R.id.feedback_profile_image);
            username = itemView.findViewById(R.id.feedback_username);
            ratingBar = itemView.findViewById(R.id.feedback_rating);
            feedbackContent = itemView.findViewById(R.id.feedback_feedback);
        }
    }

    public void updateFeedbackList(List<ProductFeedback> newFeedbackList) {
        if (newFeedbackList != null) {
            this.feedbackList.clear();
            this.feedbackList.addAll(newFeedbackList);
            notifyDataSetChanged();
        } else {
            // Handle the case where products are null or empty
            this.feedbackList.clear();
            notifyDataSetChanged();
        }
    }
}
