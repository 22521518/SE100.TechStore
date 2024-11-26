package com.example.electrohive.ViewModel;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MediatorLiveData;
import androidx.lifecycle.ViewModel;

import com.example.electrohive.Models.ProductFeedback;
import com.example.electrohive.Repository.FeedbackRepository;
import com.example.electrohive.utils.PreferencesHelper;

import java.util.ArrayList;
import java.util.List;

public class FeedbackViewModel extends ViewModel {

    private final FeedbackRepository repository;

    private LiveData<List<ProductFeedback>> feedbacks;

    public FeedbackViewModel() {
        repository = new FeedbackRepository();
    }

    public LiveData<List<ProductFeedback>> getProductFeedback(String productId, String rating_filter) {
        // Ensure LiveData is initialized
        if (feedbacks == null || !feedbacks.hasObservers()) {
            feedbacks = repository.getProductFeedback(productId); // Fetch from repository
        }

        // Use MediatorLiveData to transform or filter the original LiveData
        MediatorLiveData<List<ProductFeedback>> filteredFeedbacks = new MediatorLiveData<>();
        filteredFeedbacks.addSource(feedbacks, feedbackList -> {
            if (feedbackList != null) {
                List<ProductFeedback> filteredList = new ArrayList<>();
                if (rating_filter.equalsIgnoreCase("All")) {
                    // Add all feedbacks if the filter is "All"
                    filteredList.addAll(feedbackList);
                } else {
                    try {
                        // Parse the filter value and apply filtering
                        int targetRating = Integer.parseInt(rating_filter);
                        for (ProductFeedback feedback : feedbackList) {
                            if (feedback.getRating() == targetRating) {
                                filteredList.add(feedback);
                            }
                        }
                    } catch (NumberFormatException e) {
                        // Handle invalid filter (optional)
                        filteredList.addAll(feedbackList);
                    }
                }
                // Update filtered data
                filteredFeedbacks.setValue(filteredList);
            }
        });

        return filteredFeedbacks;
    }


    public LiveData<Boolean> postProductFeedback(String productId, String feedback, int rating) {
        return repository.addFeedback(PreferencesHelper.getCustomerData().getAccountId(), productId, feedback, rating);
    }
}
