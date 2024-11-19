package com.example.electrohive.api;

import com.example.electrohive.Models.Address;
import com.google.gson.JsonObject;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.Path;

public interface CartService {

    @GET("/carts/{id}")
    Call<JsonObject> getCart(@Path("id") String userid);

    @POST("/carts/{id}")
    Call<JsonObject> addCartItem(@Path("id") String userid,
                                 @Body Object payload);
}
