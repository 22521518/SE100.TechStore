package com.example.electrohive.api;

import com.google.gson.JsonArray;

import retrofit2.Call;
import retrofit2.http.GET;

public interface VoucherService {
    @GET("/vouchers")
    Call<JsonArray> getUserVouchers();
}
