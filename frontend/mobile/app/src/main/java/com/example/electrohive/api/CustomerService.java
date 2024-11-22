package com.example.electrohive.api;

import com.example.electrohive.Models.Address;
import com.example.electrohive.Models.Customer;
import com.google.gson.JsonObject;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.DELETE;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.PATCH;
import retrofit2.http.POST;
import retrofit2.http.Path;

public interface CustomerService {
    @GET("/customers/{id}")
    Call<JsonObject> getCustomer(@Path("id") String userId);

    @POST("/customers")
    Call<JsonObject> signUp(JsonObject customer);
}
