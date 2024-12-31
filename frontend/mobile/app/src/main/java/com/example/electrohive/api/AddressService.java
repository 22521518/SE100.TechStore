package com.example.electrohive.api;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.DELETE;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.PATCH;
import retrofit2.http.POST;
import retrofit2.http.Path;

public interface AddressService {
    @GET("/addresses/{id}")
    Call<JsonArray> getUserAddresses(@Path("id") String userId);

    @POST("addresses/{userId}")
    Call<JsonObject> postCustomerAddress(
            @Path("userId") String userId,
            @Header("Content-Type") String header,
            @Body JsonObject payload
    );

    @PATCH("addresses/{id}/{address_id}")
    Call<JsonObject> patchCustomerAddress(
            @Path("id") String userId,
            @Path("address_id") String addressId,
            @Header("Content-Type") String header,
            @Body JsonObject payload
    );

    @DELETE("addresses/{id}/{address_id}")
    Call<JsonObject> deleteCustomerAddress(
            @Path("id") String userId,
            @Path("address_id") String addressId
    );
}
