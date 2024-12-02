package com.example.electrohive.api;

import com.google.gson.JsonObject;

import org.json.JSONObject;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.POST;
import retrofit2.http.Path;

public interface SupportChatService {
    @GET("/customer-inbox/{id}")
    Call<JsonObject> getInbox(@Path("id") String customerId);

    @POST("/customer-inbox/{id}")
    Call<JsonObject> postMessage(@Path("id") String customerId,
                                 @Header("Content-Type") String header,
                                 @Body JsonObject payload);  // Add @Body annotation here
}
