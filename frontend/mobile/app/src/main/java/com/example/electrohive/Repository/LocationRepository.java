package com.example.electrohive.Repository;

import android.util.Log;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.example.electrohive.Models.District;
import com.example.electrohive.Models.Province;
import com.example.electrohive.Models.Ward;
import com.example.electrohive.api.LocationService;
import com.example.electrohive.api.LocationService;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class LocationRepository {
    private final LocationService apiService;

    public LocationRepository() {
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl("https://vapi.vnappmob.com/") // Base URL
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        apiService = retrofit.create(LocationService.class);
    }

    public LiveData<List<Province>> getProvinces() {
        MutableLiveData<List<Province>> provinceData = new MutableLiveData<>();

        apiService.getProvinces().enqueue(new Callback<JsonObject>() {
            @Override
            public void onResponse(Call<JsonObject> call, Response<JsonObject> response) {
                if (response.isSuccessful() && response.body() != null) {
                    try {
                        JsonArray resultsArray = response.body().getAsJsonArray("results");
                        List<Province> provinces = new ArrayList<>();

                        for (int i = 0; i < resultsArray.size(); i++) {
                            JsonObject provinceJson = resultsArray.get(i).getAsJsonObject();
                            String provinceId = provinceJson.get("province_id").getAsString();
                            String provinceName = provinceJson.get("province_name").getAsString();

                            provinces.add(new Province(provinceId, provinceName));
                        }
                        provinceData.postValue(provinces);
                    } catch (Exception e) {
                        Log.e("Repository Error", "Error parsing response: " + e.getMessage());
                    }
                } else {
                    Log.e("Repository Error", "Failed to load provinces: " + response.code());
                }
            }

            @Override
            public void onFailure(Call<JsonObject> call, Throwable t) {
                Log.e("Repository Error", "Error making request: " + t.getMessage());
            }
        });

        return provinceData;
    }

    public LiveData<List<District>> getDistricts(String provinceId) {
        MutableLiveData<List<District>> districtData = new MutableLiveData<>();

        apiService.getDistricts(provinceId).enqueue(new Callback<JsonObject>() {
            @Override
            public void onResponse(Call<JsonObject> call, Response<JsonObject> response) {
                if (response.isSuccessful() && response.body() != null) {
                    try {
                        JsonArray resultsArray = response.body().getAsJsonArray("results");
                        List<District> districts = new ArrayList<>();
                        for (int i = 0; i < resultsArray.size(); i++) {
                            JsonObject districtJson = resultsArray.get(i).getAsJsonObject();
                            String districtId = districtJson.get("district_id").getAsString();
                            String districtName = districtJson.get("district_name").getAsString();
                            districts.add(new District(districtId, districtName));
                        }
                        districtData.postValue(districts);
                    } catch (Exception e) {
                        Log.e("Repository Error", "Error parsing response: " + e.getMessage());
                    }
                } else {
                    Log.e("Repository Error", "Failed to load districts: " + response.code());
                }
            }

            @Override
            public void onFailure(Call<JsonObject> call, Throwable t) {
                Log.e("Repository Error", "Error making request: " + t.getMessage());
            }
        });

        return districtData;
    }

    public LiveData<List<Ward>> getWards(String districtId) {
        MutableLiveData<List<Ward>> wardData = new MutableLiveData<>();

        apiService.getWards(districtId).enqueue(new Callback<JsonObject>() {
            @Override
            public void onResponse(Call<JsonObject> call, Response<JsonObject> response) {
                if (response.isSuccessful() && response.body() != null) {
                    try {
                        JsonArray resultsArray = response.body().getAsJsonArray("results");
                        List<Ward> wards = new ArrayList<>();
                        for (int i = 0; i < resultsArray.size(); i++) {
                            JsonObject wardJson = resultsArray.get(i).getAsJsonObject();
                            String wardId = wardJson.get("ward_id").getAsString();
                            String wardName = wardJson.get("ward_name").getAsString();
                            wards.add(new Ward(wardId, wardName));
                        }
                        wardData.postValue(wards);
                    } catch (Exception e) {
                        Log.e("Repository Error", "Error parsing response: " + e.getMessage());
                    }
                } else {
                    Log.e("Repository Error", "Failed to load wards: " + response.code());
                }
            }

            @Override
            public void onFailure(Call<JsonObject> call, Throwable t) {
                Log.e("Repository Error", "Error making request: " + t.getMessage());
            }
        });

        return wardData;
    }
}
