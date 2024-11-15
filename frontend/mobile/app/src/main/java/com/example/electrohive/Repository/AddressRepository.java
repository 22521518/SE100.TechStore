package com.example.electrohive.Repository;

import android.util.Log;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.example.electrohive.Models.Address;
import com.example.electrohive.Models.Order;
import com.example.electrohive.api.AddressService;
import com.example.electrohive.api.OrderService;
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
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl("https://se100-techstore.onrender.com") // Base URL
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        addressService = retrofit.create(AddressService.class);
    }

    public MutableLiveData<List<Address>> getAddress(String userId) {
        MutableLiveData<List<Address>> addressData = new MutableLiveData<>();

        List<Address> mockAddresses = MockAddress.createMockAddressData(4);
        addressData.setValue(mockAddresses);

//        addressService.getUserAddresses(userId).enqueue(new Callback<JsonObject>() {
//            @Override
//            public void onResponse(Call<JsonObject> call, Response<JsonObject> response) {
//                if (response.isSuccessful() && response.body() != null) {
//                    try {
//                        JsonArray resultsArray = response.body().getAsJsonArray("results");
//                        List<Address> vouchers = new ArrayList<>();
//
//                        for (int i = 0; i < resultsArray.size(); i++) {
//                            JsonObject addressJson = resultsArray.get(i).getAsJsonObject();
//                            String address_id = addressJson.get("address_id").getAsString();
//                            String address_address = addressJson.get("address").getAsString();
//                            String address_city = addressJson.get("city").getAsString();
//                            String address_district = addressJson.get("district").getAsString();
//                            String address_ward = addressJson.get("ward").getAsString();
//                            String address_full_name = addressJson.get("full_name").getAsString();
//                            String address_phone_number = addressJson.get("phone_number").getAsString();
//
//                            Boolean address_is_primary = addressJson.get("is_primary").getAsBoolean();
//
//                            // Add the voucher to the list
//                            vouchers.add(new Address(address_id,  address_address,address_city, address_district, address_ward, address_full_name, address_phone_number,address_is_primary));
//                        }
//                        addressData.postValue(vouchers);
//                    } catch (Exception e) {
//                        Log.e("Repository Error", "Error parsing response: " + e.getMessage());
//                    }
//                } else {
//                    Log.e("Repository Error", "Failed to load addresses: " + response.code());
//                }
//            }
//
//            @Override
//            public void onFailure(Call<JsonObject> call, Throwable t) {
//                Log.e("Repository Error", "Error making request: " + t.getMessage());
//            }
//        });

        return addressData;

    }

    public void updateAddress(Address updatedAddress) {

    }

}
