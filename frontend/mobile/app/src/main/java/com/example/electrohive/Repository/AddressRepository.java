package com.example.electrohive.Repository;

import android.util.Log;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.example.electrohive.Models.Address;
import com.example.electrohive.Models.ApiResponse;
import com.example.electrohive.Models.Order;
import com.example.electrohive.api.AddressService;
import com.example.electrohive.api.OrderService;
import com.example.electrohive.utils.Model.AddressUtils;
import com.example.electrohive.utils.RetrofitClient;
import com.example.electrohive.utils.generator.MockAddress;
import com.example.electrohive.utils.generator.MockOrder;
import com.google.common.reflect.MutableTypeToInstanceMap;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class AddressRepository {
    private final AddressService addressService;

    public AddressRepository() {
        addressService =  RetrofitClient.getClient().create(AddressService.class);
    }

    public LiveData<ApiResponse<List<Address>>> getAddress(String userId) {
        MutableLiveData<ApiResponse<List<Address>>> responseLiveData = new MutableLiveData<>();

        addressService.getUserAddresses(userId).enqueue(new Callback<JsonArray>() {
            @Override
            public void onResponse(Call<JsonArray> call, Response<JsonArray> response) {
                if (response.isSuccessful() && response.body() != null) {
                    try {
                        JsonArray resultsArray = response.body().getAsJsonArray();
                        List<Address> addresses = AddressUtils.parseAddresses(resultsArray);
                        responseLiveData.postValue(new ApiResponse<>(true, addresses, "Addresses loaded successfully", response.code()));
                    } catch (Exception e) {
                        Log.e("Repository Error", "Error parsing response: " + e.getMessage());
                        responseLiveData.postValue(new ApiResponse<>(false, null, "Error parsing response", response.code()));
                    }
                } else {
                    Log.e("Repository Error", "Failed to load addresses: " + response.code());
                    responseLiveData.postValue(new ApiResponse<>(false, null, "Failed to load addresses", response.code()));
                }
            }

            @Override
            public void onFailure(Call<JsonArray> call, Throwable t) {
                Log.e("Repository Error", "Error making request: " + t.getMessage());
                responseLiveData.postValue(new ApiResponse<>(false, null, "Network error", 0));
            }
        });

        return responseLiveData;
    }

    public LiveData<ApiResponse<Address>> addAddress(String userId, JsonObject addressPayload) {
        MutableLiveData<ApiResponse<Address>> responseLiveData = new MutableLiveData<>();

        addressService.postCustomerAddress(userId, "application/json", addressPayload).enqueue(new Callback<JsonObject>() {
            @Override
            public void onResponse(Call<JsonObject> call, Response<JsonObject> response) {
                if (response.isSuccessful() && response.body() != null) {
                    try {
                        Address address = AddressUtils.parseAddress(response.body().getAsJsonObject());
                        responseLiveData.postValue(new ApiResponse<>(true, address, "Address added successfully", response.code()));
                    } catch (Exception e) {
                        Log.e("Repository Error", "Error parsing response: " + e.getMessage());
                        responseLiveData.postValue(new ApiResponse<>(false, null, "Error parsing response", response.code()));
                    }
                } else {
                    Log.e("Repository Error", "Failed to add address: " + response.code());
                    responseLiveData.postValue(new ApiResponse<>(false, null, "Failed to add address", response.code()));
                }
            }

            @Override
            public void onFailure(Call<JsonObject> call, Throwable t) {
                responseLiveData.postValue(new ApiResponse<>(false, null, "Network error", 0));
            }
        });

        return responseLiveData;
    }
    public LiveData<ApiResponse<Address>> updateAddress(String userId,String addressId,JsonObject addressPayload) {
        MutableLiveData<ApiResponse<Address>> responseLiveData = new MutableLiveData<>();


        addressService.patchCustomerAddress(userId,addressId,"application/json",addressPayload).enqueue(new Callback<JsonObject>() {
            @Override
            public void onResponse(Call<JsonObject> call, Response<JsonObject> response) {
                if (response.isSuccessful() && response.body() != null) {
                    try {
                        Address address = AddressUtils.parseAddress(response.body().getAsJsonObject());
                        responseLiveData.postValue(new ApiResponse<>(true, address, "Address added successfully", response.code()));
                    } catch (Exception e) {
                        Log.e("Repository Error", "Error parsing response: " + e.getMessage());
                        responseLiveData.postValue(new ApiResponse<>(false, null, "Error parsing response", response.code()));
                    }
                } else {
                    Log.e("Repository Error", "Failed to add address: " + response.code());
                    responseLiveData.postValue(new ApiResponse<>(false, null, "Failed to add address", response.code()));
                }
            }

            @Override
            public void onFailure(Call<JsonObject> call, Throwable t) {
                responseLiveData.postValue(new ApiResponse<>(false, null, "Network error", 0));
            }
        });
        return responseLiveData;
    }

    public LiveData<ApiResponse<Boolean>> deleteAddress(String userId, String addressId) {
        MutableLiveData<ApiResponse<Boolean>> responseLiveData = new MutableLiveData<>();

        addressService.deleteCustomerAddress(userId, addressId).enqueue(new Callback<JsonObject>() {
            @Override
            public void onResponse(Call<JsonObject> call, Response<JsonObject> response) {
                if (response.isSuccessful()) {
                    responseLiveData.postValue(new ApiResponse<>(true, true, "Address deleted successfully", response.code()));
                } else {
                    Log.e("Repository Error", "Failed to delete address: " + response.code());
                    responseLiveData.postValue(new ApiResponse<>(false, false, "Failed to delete address", response.code()));
                }
            }

            @Override
            public void onFailure(Call<JsonObject> call, Throwable t) {
                responseLiveData.postValue(new ApiResponse<>(false, false, "Network error", 0));
            }
        });

        return responseLiveData;
    }

}
