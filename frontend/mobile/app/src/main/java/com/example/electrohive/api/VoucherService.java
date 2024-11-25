package com.example.electrohive.api;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Path;

public interface VoucherService {
    @GET("/vouchers")
    Call<JsonArray> getUserVouchers();
}
