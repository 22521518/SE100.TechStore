package com.example.electrohive.Repository;

import android.util.Log;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.example.electrohive.Models.Order;
import com.example.electrohive.Models.Province;
import com.example.electrohive.Models.Voucher;
import com.example.electrohive.api.OrderService;
import com.example.electrohive.api.VoucherService;
import com.example.electrohive.api.VoucherService;
import com.example.electrohive.utils.generator.MockOrder;
import com.example.electrohive.utils.generator.MockVoucher;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class OrderRepository {

    private final OrderService orderService;

    public OrderRepository() {
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl("https://se100-techstore.onrender.com") // Base URL
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        orderService = retrofit.create(OrderService.class);
    }

    public LiveData<List<Order>> getOrders(String userId) {
        MutableLiveData<List<Order>> orderData = new MutableLiveData<>();

        List<Order> mockOrders = MockOrder.createMockOrdersData(4);
        orderData.setValue(mockOrders);

//        voucherService.getUserVouchers(userId).enqueue(new Callback<JsonObject>() {
//            @Override
//            public void onResponse(Call<JsonObject> call, Response<JsonObject> response) {
//                if (response.isSuccessful() && response.body() != null) {
//                    try {
//                        JsonArray resultsArray = response.body().getAsJsonArray("results");
//                        List<Voucher> vouchers = new ArrayList<>();
//
//                        for (int i = 0; i < resultsArray.size(); i++) {
//                            JsonObject provinceJson = resultsArray.get(i).getAsJsonObject();
//                            String voucher_code = provinceJson.get("voucher_code").getAsString();
//                            String voucher_name = provinceJson.get("voucher_name").getAsString();
//                            String description = provinceJson.get("description").getAsString();
//                            Double discount_amount = provinceJson.get("discount_amount").getAsDouble();
//
//                            // If valid_from and valid_to are strings, parse them into Date objects
//                            String validFromString = provinceJson.get("valid_from").getAsString();
//                            String validToString = provinceJson.get("valid_to").getAsString();
//
//                            // Define the date format you expect the dates to be in
//                            SimpleDateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy");
//
//                            Date valid_from = null;
//                            Date valid_to = null;
//
//                            try {
//                                valid_from = dateFormat.parse(validFromString);
//                                valid_to = dateFormat.parse(validToString);
//                            } catch (Exception e) {
//                                e.printStackTrace(); // Handle the exception if parsing fails
//                            }
//
//                            Boolean is_active = provinceJson.get("is_active").getAsBoolean();
//
//                            // Add the voucher to the list
//                            vouchers.add(new Voucher(voucher_code, voucher_name, description, discount_amount, valid_from, valid_to, is_active));
//                        }
//                        voucherData.postValue(vouchers);
//                    } catch (Exception e) {
//                        Log.e("Repository Error", "Error parsing response: " + e.getMessage());
//                    }
//                } else {
//                    Log.e("Repository Error", "Failed to load vouchers: " + response.code());
//                }
//            }
//
//            @Override
//            public void onFailure(Call<JsonObject> call, Throwable t) {
//                Log.e("Repository Error", "Error making request: " + t.getMessage());
//            }
//        });

        return orderData;

    }
}
