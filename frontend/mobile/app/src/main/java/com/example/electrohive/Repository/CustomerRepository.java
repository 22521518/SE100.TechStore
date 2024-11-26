package com.example.electrohive.Repository;

import android.util.Log;

import androidx.lifecycle.MutableLiveData;

import com.example.electrohive.Models.Address;
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

    public MutableLiveData<Customer> updateCustomer(String userId,JsonObject updatePayload) {

        MutableLiveData<Customer> customerData = new MutableLiveData<>();


        customerService.patchCustomer(userId,"application/json", updatePayload).enqueue(new Callback<JsonObject>() {
            @Override
            public void onResponse(Call<JsonObject> call, Response<JsonObject> response) {
                if (response.isSuccessful() && response.body() != null) {
                    JsonObject customerJson = response.body().getAsJsonObject();
                    Customer customer = CustomerUtils.parseCustomer(customerJson);
                    customerData.postValue(customer);
                } else {
                    Log.e("Repository Error", "Failed to update user: " + response.code());
                    customerData.postValue(null);
                }
            }

            @Override
            public void onFailure(Call<JsonObject> call, Throwable t) {
                Log.e("Repository Error", "Error making request: " + t.getMessage());
                customerData.postValue(null);

            }
        });
        return customerData;
    }

    public MutableLiveData<Customer> signUp(JsonObject signUpPayload) {
        MutableLiveData<Customer> customerData = new MutableLiveData<>();


        customerService.postCustomer("application/json", signUpPayload).enqueue(new Callback<JsonObject>() {
            @Override
            public void onResponse(Call<JsonObject> call, Response<JsonObject> response) {
                if (response.isSuccessful() && response.body() != null) {
                    JsonObject customerJson = response.body().getAsJsonObject();
                    Customer customer = CustomerUtils.parseCustomer(customerJson);
                    customerData.postValue(customer);
                } else {
                    Log.e("Repository Error", "Failed to create new user: " + response.code());
                    customerData.postValue(null);
                }
            }

            @Override
            public void onFailure(Call<JsonObject> call, Throwable t) {
                Log.e("Repository Error", "Error making request: " + t.getMessage());
                customerData.postValue(null);

            }
        });

        return customerData;
    }

    public MutableLiveData<Customer> getCustomer(String userId) {
        MutableLiveData<Customer> customerData = new MutableLiveData<>();

        customerService.getCustomer(userId).enqueue(new Callback<JsonObject>() {
            @Override
            public void onResponse(Call<JsonObject> call, Response<JsonObject> response) {
                if (response.isSuccessful() && response.body() != null) {
                    JsonObject customerJson = response.body().getAsJsonObject();
                    Customer customer = CustomerUtils.parseCustomer(customerJson);
                    customerData.postValue(customer);
                } else {
                    Log.e("Repository Error", "Failed to load customer: " + response.code());
                    customerData.postValue(null);
                }
            }

            @Override
            public void onFailure(Call<JsonObject> call, Throwable t) {
                Log.e("Repository Error", "Error making request: " + t.getMessage());
                customerData.postValue(null);

            }
        });

        return customerData;

    }
}
