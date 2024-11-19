package com.example.electrohive.api;

import com.google.gson.JsonObject;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.POST;
import retrofit2.http.Path;

public interface FeedbackService {
    @POST("/feedback/{id}")
    Call<JsonObject> addFeedback(@Path("id") String productId,
                                 @Body Object feedback);
}
