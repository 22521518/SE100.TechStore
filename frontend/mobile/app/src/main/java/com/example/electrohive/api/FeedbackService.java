package com.example.electrohive.api;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.POST;
import retrofit2.http.Path;

public interface FeedbackService {
    @POST("/feedback/{id}")
    Call<JsonObject> addFeedback(
            @Header("Content-Type") String header,
            @Path("id") String productId,
                                 @Body JsonObject feedback);

    @GET("/feedback/{id}")
    Call<JsonArray> getFeedbacks(@Path("id") String productId);
}
