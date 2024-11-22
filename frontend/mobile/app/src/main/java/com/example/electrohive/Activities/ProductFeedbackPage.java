package com.example.electrohive.Activities;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ImageButton;
import android.widget.ProgressBar;
import android.widget.Spinner;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.Observer;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.electrohive.Adapters.ProductFeedbackAdapter;
import com.example.electrohive.Models.ProductFeedback;
import com.example.electrohive.R;
import com.example.electrohive.ViewModel.FeedbackViewModel;

import java.util.ArrayList;
import java.util.List;

public class ProductFeedbackPage extends AppCompatActivity {
    private ProgressBar loadingSpinner;
    private FeedbackViewModel feedbackViewModel;

    private Spinner feedback_filter_spinner;

    private ProductFeedbackAdapter productFeedbackAdapter;

    private RecyclerView feedbackListView;
    private List<ProductFeedback> productFeedbackList = new ArrayList<>();

    private  String productId;

    private String rating_filter = "All"  ;
    @Override
    protected void  onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.product_feedback_page);

        ImageButton backButton = findViewById(R.id.backbutton);
        backButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });

        Intent intent = getIntent();
        productId = intent.getStringExtra("PRODUCT_ID");

        feedback_filter_spinner = findViewById(R.id.feedback_filter_spinner);

        loadingSpinner = findViewById(R.id.loading_spinner);

        // Price Range Spinner
        ArrayAdapter<CharSequence> priceRangeAdapter = ArrayAdapter.createFromResource(
                this,
                R.array.rating_filter,
                android.R.layout.simple_spinner_item
        );
        priceRangeAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        feedback_filter_spinner.setAdapter(priceRangeAdapter);

        // Set listener for price range spinner
        feedback_filter_spinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                rating_filter = parent.getItemAtPosition(position).toString();
                // Trigger the search again with the updated price range
                fetchFeedbacks();
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {
                // Optional: handle no selection
            }
        });

        feedbackListView = findViewById(R.id.feedback_listview);
        feedbackViewModel = new FeedbackViewModel();
        productFeedbackAdapter = new ProductFeedbackAdapter(
                ProductFeedbackPage.this,
                productFeedbackList
        );
        feedbackListView.setLayoutManager(new LinearLayoutManager(ProductFeedbackPage.this));
        feedbackListView.setAdapter(productFeedbackAdapter);

        fetchFeedbacks();
    }

    private void fetchFeedbacks() {
        loadingSpinner.setVisibility(View.VISIBLE);

        feedbackViewModel.getProductFeedback(productId,rating_filter).observe(this, new Observer<List<ProductFeedback>>() {
            @Override
            public void onChanged(List<ProductFeedback> productFeedbacks) {
                if (productFeedbacks != null) {
                    productFeedbackAdapter.updateFeedbackList(productFeedbacks);
                }
                loadingSpinner.setVisibility(View.GONE);
            }
        });
    }

}
