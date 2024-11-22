package com.example.electrohive.api;

import com.example.electrohive.Models.Address;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.DELETE;
import retrofit2.http.GET;
import retrofit2.http.PATCH;
import retrofit2.http.POST;
import retrofit2.http.Path;

public interface CartService {

    @GET("/carts/{id}")
    Call<JsonArray> getCart(@Path("id") String userid);

    @POST("/carts/{id}")
    Call<JsonObject> addCartItem(@Path("id") String userid,
                                 @Body JsonObject payload);

    @PATCH("/carts/{id}")
    Call<JsonObject> updateCartItem(@Path("id") String userId,
                                    @Body JsonObject payload);

    @DELETE("/carts/{id}")
    Call<ResponseBody> deleteAllCartItems(@Path("id") String userId);

    // Deletes a specific item from the user's cart
    @DELETE("/carts/{id}/{pro_id}")
    Call<ResponseBody> deleteCartItem(@Path("id") String userId, @Path("pro_id") String productId);
}
