package com.example.electrohive.api;

import com.google.gson.JsonObject;

import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Path;

public interface OrderService {
    @GET("/orders/{id}")
    Call<JsonObject> getUserVouchers(@Path("id") String userId);
}
