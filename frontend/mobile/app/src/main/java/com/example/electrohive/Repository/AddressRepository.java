package com.example.electrohive.Repository;

import android.util.Log;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.example.electrohive.Models.Address;
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

    public MutableLiveData<List<Address>> getAddress(String userId) {
        MutableLiveData<List<Address>> addressData = new MutableLiveData<>();


        addressService.getUserAddresses(userId).enqueue(new Callback<JsonArray>() {
            @Override
            public void onResponse(Call<JsonArray> call, Response<JsonArray> response) {
                if (response.isSuccessful() && response.body() != null) {
                    try {
                        JsonArray resultsArray = response.body().getAsJsonArray();
                        List<Address> vouchers = AddressUtils.parseAddresses(resultsArray);

                        addressData.postValue(vouchers);
                    } catch (Exception e) {
                        Log.e("Repository Error", "Error parsing response: " + e.getMessage());
                        addressData.postValue(new ArrayList<>());
                    }
                } else {
                    Log.e("Repository Error", "Failed to load addresses: " + response.code());
                    addressData.postValue(new ArrayList<>());
                }
            }

            @Override
            public void onFailure(Call<JsonArray> call, Throwable t) {
                Log.e("Repository Error", "Error making request: " + t.getMessage());
                addressData.postValue(new ArrayList<>());
            }
        });

        return addressData;

    }

    public LiveData<Address> addAddress(String userId,JsonObject addressPayload) {
        MutableLiveData<Address> addressData = new MutableLiveData<>();


        addressService.postCustomerAddress(userId,"application/json",addressPayload).enqueue(new Callback<JsonObject>() {
            @Override
            public void onResponse(Call<JsonObject> call, Response<JsonObject> response) {
                if (response.isSuccessful() && response.body() != null) {
                    try {

                        Address address = AddressUtils.parseAddress(response.body().getAsJsonObject());

                        addressData.postValue(address);
                    } catch (Exception e) {
                        Log.e("Repository Error", "Error parsing response: " + e.getMessage());
                        addressData.postValue(null);
                    }
                } else {
                    Log.e("Repository Error", "Failed to load addresses: " + response.code());
                    addressData.postValue(null);
                }
            }

            @Override
            public void onFailure(Call<JsonObject> call, Throwable t) {
                addressData.postValue(null);
            }
        });
        return addressData;
    }
    public LiveData<Address> updateAddress(String userId,String addressId,JsonObject addressPayload) {
        MutableLiveData<Address> addressData = new MutableLiveData<>();


        addressService.patchCustomerAddress(userId,addressId,"application/json",addressPayload).enqueue(new Callback<JsonObject>() {
            @Override
            public void onResponse(Call<JsonObject> call, Response<JsonObject> response) {
                if (response.isSuccessful() && response.body() != null) {
                    try {

                        Address address = AddressUtils.parseAddress(response.body().getAsJsonObject());

                        addressData.postValue(address);
                    } catch (Exception e) {
                        Log.e("Repository Error", "Error parsing response: " + e.getMessage());
                        addressData.postValue(null);
                    }
                } else {
                    Log.e("Repository Error", "Failed to load addresses: " + response.code());
                    addressData.postValue(null);
                }
            }

            @Override
            public void onFailure(Call<JsonObject> call, Throwable t) {
                addressData.postValue(null);
            }
        });
        return addressData;
    }

    public LiveData<Boolean> deleteAddress(String userId, String addressId) {
        MutableLiveData<Boolean> deleteState = new MutableLiveData<>();


        addressService.deleteCustomerAddress(userId,addressId).enqueue(new Callback<JsonObject>() {
            @Override
            public void onResponse(Call<JsonObject> call, Response<JsonObject> response) {
                if (response.isSuccessful() && response.body() != null) {
                    try {

                     deleteState.setValue(true);
                    } catch (Exception e) {
                        Log.e("Repository Error", "Error parsing response: " + e.getMessage());
                        deleteState.setValue(false);
                    }
                } else {
                    Log.e("Repository Error", "Failed to load addresses: " + response.code());
                    deleteState.setValue(false);
                }
            }

            @Override
            public void onFailure(Call<JsonObject> call, Throwable t) {
                deleteState.setValue(false);
            }
        });
        return deleteState;
    }

}
