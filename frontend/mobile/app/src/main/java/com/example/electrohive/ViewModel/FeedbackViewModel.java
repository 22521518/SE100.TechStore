package com.example.electrohive.ViewModel;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MediatorLiveData;
import androidx.lifecycle.ViewModel;

import com.example.electrohive.Models.ApiResponse;
import com.example.electrohive.Models.ProductFeedback;
import com.example.electrohive.Repository.FeedbackRepository;
import com.example.electrohive.utils.PreferencesHelper;
import com.google.gson.JsonObject;

import java.util.ArrayList;
import java.util.List;

public class FeedbackViewModel extends ViewModel {

    private final FeedbackRepository repository;
    private MediatorLiveData<ApiResponse<List<ProductFeedback>>> feedbacks; // Use ApiResponse here


    public FeedbackViewModel() {
        repository = new FeedbackRepository();
        feedbacks = new MediatorLiveData<>();
    }

    public LiveData<ApiResponse<List<ProductFeedback>>> getProductFeedback(String productId, String ratingFilter) {
        // Fetch feedbacks from repository and observe
        LiveData<ApiResponse<List<ProductFeedback>>> repositoryFeedbacks = repository.getProductFeedback(productId);

        // When feedbacks are updated, apply filtering based on rating
        feedbacks.addSource(repositoryFeedbacks, apiResponse -> {
            if (apiResponse != null) {
                List<ProductFeedback> filteredList = filterFeedbacks(apiResponse.getData(), ratingFilter);
                feedbacks.setValue(new ApiResponse<>(apiResponse.isSuccess(), filteredList, apiResponse.getMessage(), apiResponse.getStatusCode()));
            }
        });

        return feedbacks; // Return the ApiResponse LiveData for the UI to observe
    }

    public LiveData<ApiResponse<ProductFeedback>> addProductFeedback(String productId, String content, int rating) {
        JsonObject payload = new JsonObject();
        payload.addProperty("customer_id", PreferencesHelper.getCustomerData().getCustomerId());
        payload.addProperty("feedback", content);
        payload.addProperty("rating", rating);

        // Add feedback to repository
        LiveData<ApiResponse<ProductFeedback>> newFeedback = repository.addFeedback(productId, payload);

        // When a new feedback is added, update the feedback list in the ViewModel
        feedbacks.addSource(newFeedback, apiResponse -> {
            if (apiResponse != null && apiResponse.isSuccess()) {
                List<ProductFeedback> currentFeedbacks = feedbacks.getValue() != null ? feedbacks.getValue().getData() : new ArrayList<>();
                boolean updated = false;

                // Replace existing feedback or add new one
                for (int i = 0; i < currentFeedbacks.size(); i++) {
                    if (currentFeedbacks.get(i).getFeedbackId().equals(apiResponse.getData().getFeedbackId())) {
                        currentFeedbacks.set(i, apiResponse.getData()); // Replace if exists
                        updated = true;
                        break;
                    }
                }

                if (!updated) {
                    currentFeedbacks.add(apiResponse.getData()); // Add new feedback
                }

                // Update LiveData with the new list
                feedbacks.setValue(new ApiResponse<>(true, currentFeedbacks, "Feedback added successfully", 200));
            }
        });

        return newFeedback;
    }

    // Helper method to filter feedbacks based on rating
    private List<ProductFeedback> filterFeedbacks(List<ProductFeedback> feedbackList, String ratingFilter) {
        if ("All".equalsIgnoreCase(ratingFilter)) {
            return feedbackList;
        }

        try {
            int targetRating = Integer.parseInt(ratingFilter);
            List<ProductFeedback> filteredList = new ArrayList<>();
            for (ProductFeedback feedback : feedbackList) {
                if (feedback.getRating() == targetRating) {
                    filteredList.add(feedback);
                }
            }
            return filteredList;
        } catch (NumberFormatException e) {
            return feedbackList; 
        }
    }
}
