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

    public void addAddress(Address updatedAddress) {

    }
    public void updateAddress(Address updatedAddress) {

    }

}
