package com.example.electrohive.Repository;

import android.util.Log;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.example.electrohive.Models.ApiResponse;
import com.example.electrohive.Models.District;
import com.example.electrohive.Models.Province;
import com.example.electrohive.Models.Ward;
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
                .baseUrl("https://api.vnappmob.com")
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        apiService = retrofit.create(LocationService.class);
    }

    public LiveData<ApiResponse<List<Province>>> getProvinces() {
        MutableLiveData<ApiResponse<List<Province>>> provinceData = new MutableLiveData<>();
        provinceData.setValue(new ApiResponse<>(false, null, "Loading provinces...", 200)); // Initial loading state

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
                        provinceData.setValue(new ApiResponse<>(true, provinces, "Provinces loaded successfully", response.code()));
                    } catch (Exception e) {
                        Log.e("Repository Error", "Error parsing response: " + e.getMessage());
                        provinceData.setValue(new ApiResponse<>(false, null, "Error parsing provinces", 500));
                    }
                } else {
                    Log.e("Repository Error", "Failed to load provinces: " + response.code());
                    provinceData.setValue(new ApiResponse<>(false, null, "Failed to load provinces", response.code()));
                }
            }

            @Override
            public void onFailure(Call<JsonObject> call, Throwable t) {
                Log.e("Repository Error", "Error making request: " + t.getMessage());
                provinceData.setValue(new ApiResponse<>(false, null, t.getMessage(), 500));
            }
        });

        return provinceData;
    }

    public LiveData<ApiResponse<List<District>>> getDistricts(String provinceId) {
        MutableLiveData<ApiResponse<List<District>>> districtData = new MutableLiveData<>();
        districtData.setValue(new ApiResponse<>(false, null, "Loading districts...", 200)); // Initial loading state

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
                        districtData.setValue(new ApiResponse<>(true, districts, "Districts loaded successfully", response.code()));
                    } catch (Exception e) {
                        Log.e("Repository Error", "Error parsing response: " + e.getMessage());
                        districtData.setValue(new ApiResponse<>(false, null, "Error parsing districts", 500));
                    }
                } else {
                    Log.e("Repository Error", "Failed to load districts: " + response.code());
                    districtData.setValue(new ApiResponse<>(false, null, "Failed to load districts", response.code()));
                }
            }

            @Override
            public void onFailure(Call<JsonObject> call, Throwable t) {
                Log.e("Repository Error", "Error making request: " + t.getMessage());
                districtData.setValue(new ApiResponse<>(false, null, t.getMessage(), 500));
            }
        });

        return districtData;
    }

    public LiveData<ApiResponse<List<Ward>>> getWards(String districtId) {
        MutableLiveData<ApiResponse<List<Ward>>> wardData = new MutableLiveData<>();
        wardData.setValue(new ApiResponse<>(false, null, "Loading wards...", 200)); // Initial loading state

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
                        wardData.setValue(new ApiResponse<>(true, wards, "Wards loaded successfully", response.code()));
                    } catch (Exception e) {
                        Log.e("Repository Error", "Error parsing response: " + e.getMessage());
                        wardData.setValue(new ApiResponse<>(false, null, "Error parsing wards", 500));
                    }
                } else {
                    Log.e("Repository Error", "Failed to load wards: " + response.code());
                    wardData.setValue(new ApiResponse<>(false, null, "Failed to load wards", response.code()));
                }
            }

            @Override
            public void onFailure(Call<JsonObject> call, Throwable t) {
                Log.e("Repository Error", "Error making request: " + t.getMessage());
                wardData.setValue(new ApiResponse<>(false, null, t.getMessage(), 500));
            }
        });

        return wardData;
    }
}
