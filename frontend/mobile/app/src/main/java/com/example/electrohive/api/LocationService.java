package com.example.electrohive.api;

import com.google.gson.JsonObject;

import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Path;

public interface LocationService {
    @GET("api/province/")
    Call<JsonObject> getProvinces();
    @GET("api/province/district/{id}")
    Call<JsonObject> getDistricts(@Path("id") String provinceId);
    @GET("api/province/ward/{id}")
    Call<JsonObject> getWards(@Path("id") String districtId);
}
