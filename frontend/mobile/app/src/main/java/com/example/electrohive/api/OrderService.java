package com.example.electrohive.api;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Path;

public interface OrderService {
    @GET("/orders/{id}")
    Call<JsonArray> getUserOrders(@Path("id") String userId);

    @GET("/orders/{customerId}/{orderId}")
    Call<JsonObject> getOrder(@Path("customerId") String customerId,@Path("orderId") String orderId);
}
