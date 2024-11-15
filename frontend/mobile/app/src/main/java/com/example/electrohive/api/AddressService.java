package com.example.electrohive.api;

import com.example.electrohive.Models.Address;
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
    Call<JsonObject> getUserAddresses(@Path("id") String userId);

    @POST("addresses/{userId}")
    Call<Boolean> postCustomerAddress(
            @Path("userId") String userId,
            @Header("access_token") String accessToken,
            @Body Address payload
    );

    @PATCH("addresses/{id}")
    Call<Boolean> patchCustomerAddress(
            @Path("id") String addressId,
            @Header("access_token") String accessToken,
            @Body Address payload
    );

    @DELETE("addresses/{id}")
    Call<Boolean> deleteCustomerAddress(
            @Path("id") String addressId,
            @Header("access_token") String accessToken
    );
}
