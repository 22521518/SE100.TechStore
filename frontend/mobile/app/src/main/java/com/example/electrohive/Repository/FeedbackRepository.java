package com.example.electrohive.Repository;

import android.icu.text.LocaleDisplayNames;
import android.util.Log;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.example.electrohive.Models.Product;
import com.example.electrohive.Models.ProductFeedback;
import com.example.electrohive.api.CustomerService;
import com.example.electrohive.api.FeedbackService;
import com.example.electrohive.utils.Model.FeedbackUtils;
import com.example.electrohive.utils.Model.ProductUtils;
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

    public LiveData<List<ProductFeedback>> getProductFeedback(String productId) {
        MutableLiveData<List<ProductFeedback>> feedbackData = new MutableLiveData<>();

        feedbackService.getFeedbacks(productId).enqueue(new Callback<JsonArray>() {
            @Override
            public void onResponse(Call<JsonArray> call, Response<JsonArray> response) {
                if (response.isSuccessful() && response.body() != null) {
                    try {
                        List<ProductFeedback> feedbacks = FeedbackUtils.parseProductFeedbacks(response.body());
                        feedbackData.postValue(feedbacks);
                    } catch (Exception e) {
                        Log.d("Repository Error", "Error parsing response: " + e.getMessage());
                    }
                } else {
                    Log.d("Repository Error", "Failed to load feedbacks: " + response.code());
                }
            }

            @Override
            public void onFailure(Call<JsonArray> call, Throwable t) {
                Log.e("Repository Error", "Error making request: " + t.getMessage());
            }
        });
        return feedbackData;
    }

    public LiveData<Boolean> addFeedback(String userId,String productId,String feedback,int rating) {
        MutableLiveData<Boolean> isAdded = new MutableLiveData<>();

        JsonObject payload = new JsonObject();

        payload.addProperty("customer_id",userId);
        payload.addProperty("feedback",feedback);
        payload.addProperty("rating",rating);

        isAdded.setValue(false);

        feedbackService.addFeedback(productId,payload).enqueue(new Callback<JsonObject>() {
            @Override
            public void onResponse(Call<JsonObject> call, Response<JsonObject> response) {
                if(response.isSuccessful()) {
                    isAdded.postValue(true);
                } else {
                    isAdded.postValue(false);
                }
            }

            @Override
            public void onFailure(Call<JsonObject> call, Throwable t) {
                isAdded.postValue(false);
            }
        });

        return isAdded;
    }

}
