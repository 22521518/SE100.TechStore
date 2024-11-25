package com.example.electrohive.api;

import com.example.electrohive.Models.Account;
import com.example.electrohive.Models.Address;
import com.google.gson.JsonObject;

import org.openqa.selenium.json.Json;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.Header;
import retrofit2.http.PATCH;
import retrofit2.http.POST;
import retrofit2.http.Path;

public interface AccountService {

    @POST("/auth/login/store")
    Call<JsonObject> login(
            @Header("Content-Type") String header,
            @Body JsonObject account
    );
    @PATCH("/addresses/{id}")
    Call<JsonObject> patchAccount(
            @Path("id") String addressId,
            @Header("access_token") String accessToken,
            @Body JsonObject payload
    );
}
