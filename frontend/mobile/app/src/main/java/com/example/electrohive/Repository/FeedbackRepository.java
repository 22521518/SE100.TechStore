package com.example.electrohive.Repository;

import android.util.Log;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.example.electrohive.Models.ApiResponse;
import com.example.electrohive.Models.ProductFeedback;
import com.example.electrohive.api.FeedbackService;
import com.example.electrohive.utils.Model.FeedbackUtils;
import com.example.electrohive.utils.RetrofitClient;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class FeedbackRepository {
    private final FeedbackService feedbackService;

    public FeedbackRepository() {
        feedbackService =  RetrofitClient.getClient().create(FeedbackService.class);
    }

    public LiveData<ApiResponse<List<ProductFeedback>>> getProductFeedback(String productId) {
        MutableLiveData<ApiResponse<List<ProductFeedback>>> feedbackData = new MutableLiveData<>();

        feedbackService.getFeedbacks(productId).enqueue(new Callback<JsonArray>() {
            @Override
            public void onResponse(Call<JsonArray> call, Response<JsonArray> response) {
                if (response.isSuccessful() && response.body() != null) {
                    try {
                        List<ProductFeedback> feedbacks = FeedbackUtils.parseProductFeedbacks(response.body());
                        feedbackData.setValue(new ApiResponse<>(true, feedbacks, "Feedbacks loaded successfully", response.code()));
                    } catch (Exception e) {
                        Log.d("Repository Error", "Error parsing response: " + e.getMessage());
                        feedbackData.setValue(new ApiResponse<>(false, null, "Error parsing feedbacks", 500));
                    }
                } else {
                    Log.d("Repository Error", "Failed to load feedbacks: " + response.code());
                    feedbackData.setValue(new ApiResponse<>(false, null, "Failed to load feedbacks", response.code()));
                }
            }

            @Override
            public void onFailure(Call<JsonArray> call, Throwable t) {
                Log.e("Repository Error", "Error making request: " + t.getMessage());
                feedbackData.setValue(new ApiResponse<>(false, null, t.getMessage(), 500));
            }
        });

        return feedbackData;
    }


    public LiveData<ApiResponse<ProductFeedback>> addFeedback(String productId, JsonObject payload) {
        MutableLiveData<ApiResponse<ProductFeedback>> feedbackData = new MutableLiveData<>();

        feedbackService.addFeedback("application/json", productId, payload).enqueue(new Callback<JsonObject>() {
            @Override
            public void onResponse(Call<JsonObject> call, Response<JsonObject> response) {
                if (response.isSuccessful() && response.body() != null) {
                    JsonObject feedbackJson = response.body().getAsJsonObject();
                    ProductFeedback feedback = FeedbackUtils.parseProductFeedback(feedbackJson);
                    feedbackData.setValue(new ApiResponse<>(true, feedback, "Feedback added successfully", response.code()));
                } else {
                    feedbackData.setValue(new ApiResponse<>(false, null, "Failed to add feedback", response.code()));
                }
            }

            @Override
            public void onFailure(Call<JsonObject> call, Throwable t) {
                feedbackData.setValue(new ApiResponse<>(false, null, t.getMessage(), 500));
            }
        });

        return feedbackData;
    }

}
