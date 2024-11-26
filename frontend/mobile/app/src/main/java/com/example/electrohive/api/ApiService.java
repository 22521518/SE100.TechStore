package com.example.electrohive.api;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import retrofit2.Call;
import retrofit2.http.DELETE;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.Path;

public interface ApiService {
    @GET("api/province/")
    Call<JsonObject> getProvinces();
    @GET("api/province/district/{id}")
    Call<JsonObject> getDistricts(@Path("id") String provinceId);

    @GET("api/province/ward/{id}")
    Call<JsonObject> getWards(@Path("id") String districtId);

    @GET("carts/{id}")
    Call<JsonArray> getCart(@Path("id") String id);

    @DELETE("carts/{customer_id}/{product_id}")
    Call<Void> deleteCart(@Path("customer_id") String customer_id,@Path("product_id") String product_id);
}
