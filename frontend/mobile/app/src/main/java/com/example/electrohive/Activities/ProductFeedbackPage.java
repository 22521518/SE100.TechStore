package com.example.electrohive.Activities;

import android.os.Bundle;
import android.text.TextUtils;
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


        feedbackViewModel.getProductFeedback(productId, rating_filter).observe(this, new Observer<List<ProductFeedback>>() {
            @Override
            public void onChanged(List<ProductFeedback> productFeedbacks) {
                if (productFeedbacks != null) {
                    productFeedbackAdapter.updateFeedbackList(productFeedbacks);
                }
                loadingSpinner.setVisibility(View.GONE);
            }

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
        feedbackViewModel.addProductFeedback(productId, feedbackText, rating).observe(this, feedback -> {
            loadingSpinner.setVisibility(View.GONE);

            if (feedback!=null) {
                Toast.makeText(this, "Thank you for your feedback!", Toast.LENGTH_SHORT).show();
                feedbackInput.setText("");
                feedbackRating.setRating(1);
                fetchFeedbacks(); // Refresh the feedback list
            } else {
                Toast.makeText(this, "Failed to submit feedback. Please try again.", Toast.LENGTH_SHORT).show();
            }
        });
    }
}
