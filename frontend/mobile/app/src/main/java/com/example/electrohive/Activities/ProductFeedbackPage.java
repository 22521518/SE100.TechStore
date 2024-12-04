package com.example.electrohive.Activities;

import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.ProgressBar;
import android.widget.RatingBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.Observer;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.electrohive.Adapters.ProductFeedbackAdapter;
import com.example.electrohive.Models.ProductFeedback;
import com.example.electrohive.R;
import com.example.electrohive.ViewModel.FeedbackViewModel;
import com.skydoves.powerspinner.OnSpinnerItemSelectedListener;
import com.skydoves.powerspinner.PowerSpinnerView;

import java.util.ArrayList;
import java.util.List;

public class ProductFeedbackPage extends AppCompatActivity {
    private ProgressBar loadingSpinner;
    private FeedbackViewModel feedbackViewModel;
    private PowerSpinnerView feedback_filter_spinner;
    private ProductFeedbackAdapter productFeedbackAdapter;
    private RecyclerView feedbackListView;
    private List<ProductFeedback> productFeedbackList = new ArrayList<>();

    private EditText feedbackInput;
    private TextView sendFeedbackButton;
    private RatingBar feedbackRating;

    private String productId;
    private String rating_filter = "All";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.product_feedback_page);

        // Initialize Views
        ImageButton backButton = findViewById(R.id.backbutton);
        feedback_filter_spinner = findViewById(R.id.feedback_filter_spinner);
        loadingSpinner = findViewById(R.id.loading_spinner);
        feedbackListView = findViewById(R.id.feedback_listview);
        feedbackInput = findViewById(R.id.textArea);
        sendFeedbackButton = findViewById(R.id.send_feedback_button);
        feedbackRating = findViewById(R.id.feedback_rating);
        feedbackRating.setRating(1); // Ensure the default rating is 1

        feedbackRating.setOnRatingBarChangeListener((ratingBar, rating, fromUser) -> {
            if (rating < 1) {
                ratingBar.setRating(1); // Enforce the minimum rating programmatically
            }
        });

        // Back Button
        backButton.setOnClickListener(v -> finish());

        // Get Product ID from Intent
        productId = getIntent().getStringExtra("PRODUCT_ID");

        feedbackViewModel = new FeedbackViewModel();
        // Feedback Spinner
        feedback_filter_spinner.setItems(R.array.rating_filter);
        feedback_filter_spinner.selectItemByIndex(0);
        feedback_filter_spinner.setOnSpinnerItemSelectedListener(new OnSpinnerItemSelectedListener<String>() {
            @Override
            public void onItemSelected(int oldIndex, @Nullable String oldItem, int newIndex, String newItem) {
                rating_filter = newItem;
                fetchFeedbacks();
            }
        });

        loadingSpinner.setVisibility(View.VISIBLE);
        // RecyclerView Setup

        productFeedbackAdapter = new ProductFeedbackAdapter(ProductFeedbackPage.this, productFeedbackList);
        feedbackListView.setLayoutManager(new LinearLayoutManager(ProductFeedbackPage.this));
        feedbackListView.setAdapter(productFeedbackAdapter);

        fetchFeedbacks();

        // Add Feedback Button
        sendFeedbackButton.setOnClickListener(v -> addFeedback());
    }

    private void fetchFeedbacks() {


        feedbackViewModel.getProductFeedback(productId, rating_filter).observe(this, apiResponse -> {
            // Check if the response is not null and the request was successful
            if (apiResponse != null && apiResponse.isSuccess()) {
                List<ProductFeedback> productFeedbacks = apiResponse.getData();  // Get the actual feedback list

                if (productFeedbacks != null) {
                    productFeedbackAdapter.updateFeedbackList(productFeedbacks); // Update adapter with feedback data
                } else {
                    Log.d("FeedbackPage", "No feedback found.");
                    productFeedbackAdapter.updateFeedbackList(new ArrayList<>()); // Handle empty feedback list scenario
                }

            } else {
                // Handle failure scenario (success = false)
                String errorMessage = apiResponse != null ? apiResponse.getMessage() : "Failed to fetch feedback.";
                Log.d("FeedbackPage", errorMessage);

                productFeedbackAdapter.updateFeedbackList(new ArrayList<>()); // Handle failure by passing empty list
            }

            // Hide the loading spinner once data has been processed
            loadingSpinner.setVisibility(View.GONE);
        });



    }

    private void addFeedback() {
        // Get User Input
        String feedbackText = feedbackInput.getText().toString().trim();
        int rating = (int) feedbackRating.getRating();

        // Validate Input
        if (TextUtils.isEmpty(feedbackText)) {
            Toast.makeText(this, "Please enter your feedback.", Toast.LENGTH_SHORT).show();
            return;
        }

        if (rating < 1) {
            Toast.makeText(this, "Rating must be at least 1 star.", Toast.LENGTH_SHORT).show();
            return;
        }

        // Show Loading Spinner
        loadingSpinner.setVisibility(View.VISIBLE);

        // Add Feedback
        feedbackViewModel.addProductFeedback(productId, feedbackText, rating).observe(this, apiResponse -> {
            // Hide the loading spinner after the response is processed
            loadingSpinner.setVisibility(View.GONE);

            // Check if the response is not null and was successful
            if (apiResponse != null && apiResponse.isSuccess()) {
                Toast.makeText(this, "Thank you for your feedback!", Toast.LENGTH_SHORT).show();

                // Clear the feedback input fields
                feedbackInput.setText("");
                feedbackRating.setRating(1);

                // Refresh the feedback list to show the new feedback
                fetchFeedbacks();

            } else {
                // Handle failure scenario (either response is null or success is false)
                String errorMessage = apiResponse != null ? apiResponse.getMessage() : "Failed to submit feedback. Please try again.";
                Toast.makeText(this, errorMessage, Toast.LENGTH_SHORT).show();
            }
        });

    }
}
