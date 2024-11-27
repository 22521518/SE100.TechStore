package com.example.electrohive.ViewModel;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MediatorLiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.example.electrohive.Models.ProductFeedback;
import com.example.electrohive.Repository.FeedbackRepository;
import com.example.electrohive.utils.PreferencesHelper;
import com.google.gson.JsonObject;

import java.util.ArrayList;
import java.util.List;

public class FeedbackViewModel extends ViewModel {

    private final FeedbackRepository repository;
    private MediatorLiveData<List<ProductFeedback>> feedbacks; // Use MediatorLiveData to allow updates

    private MediatorLiveData<List<ProductFeedback>> filteredList;

    public FeedbackViewModel() {
        repository = new FeedbackRepository();
        feedbacks = new MediatorLiveData<>();
        filteredList = new MediatorLiveData<>();
    }

    public LiveData<List<ProductFeedback>> getProductFeedback(String productId, String ratingFilter) {
        // Fetch from the repository only if feedbacks is null
        if (feedbacks.getValue() == null) {
            repository.getProductFeedback(productId).observeForever(fb -> {
                feedbacks.setValue(fb);
            });
        }

        // Update filtered list whenever feedbacks change
        feedbacks.observeForever(feedbackList -> {
            if (feedbackList != null) {
                filteredList.setValue(filterFeedbacks(feedbackList, ratingFilter));
            }
        });

        return filteredList; // Return filteredList to the UI
    }

    public LiveData<ProductFeedback> addProductFeedback(String productId, String content, int rating) {
        JsonObject payload = new JsonObject();
        payload.addProperty("customer_id", PreferencesHelper.getCustomerData().getCustomerId());
        payload.addProperty("feedback", content);
        payload.addProperty("rating", rating);

        LiveData<ProductFeedback> newFeedback = repository.addFeedback(productId, payload);

        feedbacks.addSource(newFeedback, feedback -> {
            if (feedback != null) {
                // Update the list by replacing or adding the feedback
                List<ProductFeedback> currentFeedbacks = feedbacks.getValue() != null ? feedbacks.getValue() : new ArrayList<>();
                boolean updated = false;

                for (int i = 0; i < currentFeedbacks.size(); i++) {
                    if (currentFeedbacks.get(i).getFeedbackId().equals(feedback.getFeedbackId())) {
                        currentFeedbacks.set(i, feedback); // Replace if exists
                        updated = true;
                        break;
                    }
                }

                if (!updated) {
                    currentFeedbacks.add(feedback); // Add new feedback
                }

                feedbacks.setValue(currentFeedbacks); // Update LiveData
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
