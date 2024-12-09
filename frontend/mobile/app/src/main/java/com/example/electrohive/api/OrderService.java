package com.example.electrohive.api;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.PATCH;
import retrofit2.http.POST;
import retrofit2.http.Path;

public interface OrderService {
    @GET("/orders/{id}")
    Call<JsonArray> getUserOrders(@Path("id") String userId);

    @GET("/orders/{customerId}/{orderId}")
    Call<JsonObject> getOrder(@Path("customerId") String customerId, @Path("orderId") String orderId);

    @PATCH("/orders/{customerId}/{orderId}")
    Call<JsonObject> patchOrder(@Path("customerId") String customerId,
                                @Path("orderId") String orderId,
                                @Header("Content-Type") String header,
                                @Body JsonObject payload);
    @POST("/orders/{id}")
    Call<JsonObject> postUserOrders(@Path("id") String userId,
                                    @Body JsonObject payload);

    @POST("momo-payment/{id}")
    Call<ResponseBody> postMOMO(@Path("id") String userId,
                                 @Body JsonObject payload);
}
