package com.example.electrohive.api;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Path;
import retrofit2.http.Query;

public interface ProductService {

    @GET("/products")
    Call<JsonArray> getProducts(@Query("pageSize") int pageSize);

    @GET("/products/{id}")
    Call<JsonObject> getProductDetail(@Path("id") String productId);
}
