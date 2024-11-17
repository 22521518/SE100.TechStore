package com.example.electrohive.api;

import com.google.gson.JsonObject;

import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Path;

public interface OrderService {
    @GET("/orders/{id}")
    Call<JsonObject> getUserOrders(@Path("id") String userId);

    @GET("/orders/{id}")
    Call<JsonObject> getOrder(@Path("id") String orderId);
}
