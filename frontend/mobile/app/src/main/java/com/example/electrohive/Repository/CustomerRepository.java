package com.example.electrohive.Repository;

import android.util.Log;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.example.electrohive.Models.Address;
import com.example.electrohive.Models.ApiResponse;
import com.example.electrohive.Models.Customer;
import com.example.electrohive.api.AddressService;
import com.example.electrohive.api.CustomerService;
import com.example.electrohive.utils.Model.CustomerUtils;
import com.example.electrohive.utils.PreferencesHelper;
import com.example.electrohive.utils.RetrofitClient;
import com.example.electrohive.utils.generator.MockAddress;
import com.example.electrohive.utils.generator.MockCustomer;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class CustomerRepository {
    private final CustomerService customerService;

    public CustomerRepository() {

        customerService = RetrofitClient.getClient().create(CustomerService.class);
    }

    public LiveData<ApiResponse<Customer>> updateCustomer(String userId, JsonObject updatePayload) {
        MutableLiveData<ApiResponse<Customer>> result = new MutableLiveData<>();
        result.setValue(new ApiResponse<>(false, null, "Loading...", 200));

        customerService.patchCustomer(userId, "application/json", updatePayload).enqueue(new Callback<JsonObject>() {
            @Override
            public void onResponse(Call<JsonObject> call, Response<JsonObject> response) {
                if (response.isSuccessful() && response.body() != null) {
                    JsonObject customerJson = response.body().getAsJsonObject();
                    Customer customer = CustomerUtils.parseCustomer(customerJson);
                    result.setValue(new ApiResponse<>(true, customer, "Customer updated", response.code()));
                } else {
                    result.setValue(new ApiResponse<>(false, null, "Error: " + response.code(), response.code()));
                }
            }

            @Override
            public void onFailure(Call<JsonObject> call, Throwable t) {
                result.setValue(new ApiResponse<>(false, null, t.getMessage(), 500));
            }
        });

        return result;
    }

    public LiveData<ApiResponse<Customer>> signUp(JsonObject signUpPayload) {
        MutableLiveData<ApiResponse<Customer>> result = new MutableLiveData<>();

        customerService.postCustomer("application/json", signUpPayload).enqueue(new Callback<JsonObject>() {
            @Override
            public void onResponse(Call<JsonObject> call, Response<JsonObject> response) {
                if (response.isSuccessful() && response.body() != null) {
                    JsonObject customerJson = response.body().getAsJsonObject();
                    Customer customer = CustomerUtils.parseCustomer(customerJson);
                    result.setValue(new ApiResponse<>(true, customer, "User signed up", response.code()));
                } else {
                    result.setValue(new ApiResponse<>(false, null, "Error: " + response.code(), response.code()));
                }
            }

            @Override
            public void onFailure(Call<JsonObject> call, Throwable t) {
                result.setValue(new ApiResponse<>(false, null, t.getMessage(), 500));
            }
        });

        return result;
    }

    public LiveData<ApiResponse<Customer>> getCustomer(String userId) {
        MutableLiveData<ApiResponse<Customer>> result = new MutableLiveData<>();

        customerService.getCustomer(userId).enqueue(new Callback<JsonObject>() {
            @Override
            public void onResponse(Call<JsonObject> call, Response<JsonObject> response) {
                if (response.isSuccessful() && response.body() != null) {
                    JsonObject customerJson = response.body().getAsJsonObject();
                    Customer customer = CustomerUtils.parseCustomer(customerJson);
                    result.setValue(new ApiResponse<>(true, customer, "Customer loaded successfully", response.code()));
                } else {
                    Log.e("Repository Error", "Failed to load customer: " + response.code());
                    result.setValue(new ApiResponse<>(false, null, "Error: " + response.code(), response.code()));
                }
            }

            @Override
            public void onFailure(Call<JsonObject> call, Throwable t) {
                Log.e("Repository Error", "Error making request: " + t.getMessage());
                result.setValue(new ApiResponse<>(false, null, t.getMessage(), 500));  // Set failure response
            }
        });

        return result;
    }

}
