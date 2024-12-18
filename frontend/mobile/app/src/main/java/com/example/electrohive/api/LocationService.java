package com.example.electrohive.api;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import retrofit2.Call;
import retrofit2.http.DELETE;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.Path;

public interface LocationService {
    @GET("/api/v2/province/")
    Call<JsonObject> getProvinces();
    @GET("/api/v2/province/district/{id}")
    Call<JsonObject> getDistricts(@Path("id") String provinceId);
    @GET("/api/v2/province/ward/{id}")
    Call<JsonObject> getWards(@Path("id") String districtId);

}
