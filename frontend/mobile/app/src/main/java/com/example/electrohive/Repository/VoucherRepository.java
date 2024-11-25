package com.example.electrohive.Repository;

import android.util.Log;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.example.electrohive.Models.Province;
import com.example.electrohive.Models.Voucher;
import com.example.electrohive.api.VoucherService;
import com.example.electrohive.api.VoucherService;
import com.example.electrohive.utils.RetrofitClient;
import com.example.electrohive.utils.generator.MockVoucher;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import org.json.JSONArray;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class VoucherRepository {

    private final VoucherService voucherService;

    public VoucherRepository() {

        voucherService =  RetrofitClient.getClient().create(VoucherService.class);
    }

    public LiveData<List<Voucher>> getVouchers() {
        MutableLiveData<List<Voucher>> voucherData = new MutableLiveData<>();


        voucherService.getUserVouchers().enqueue(new Callback<JsonArray>() {
            @Override
            public void onResponse(Call<JsonArray> call, Response<JsonArray> response) {
                if (response.isSuccessful() && response.body() != null) {
                    try {
                        JsonArray resultsArray = response.body().getAsJsonArray();
                        List<Voucher> vouchers = new ArrayList<>();

                        for (int i = 0; i < resultsArray.size(); i++) {
                            JsonObject provinceJson = resultsArray.get(i).getAsJsonObject();
                            String voucher_code = provinceJson.get("voucher_code").getAsString();
                            String voucher_name = provinceJson.get("voucher_name").getAsString();
                            String description = provinceJson.get("description").getAsString();
                            Double discount_amount = provinceJson.get("discount_amount").getAsDouble();

                            // If valid_from and valid_to are strings, parse them into Date objects
                            String valid_from = provinceJson.get("valid_from").getAsString();
                            String valid_to = provinceJson.get("valid_to").getAsString();

                            Boolean is_active = provinceJson.get("is_active").getAsBoolean();

                            // Add the voucher to the list
                            vouchers.add(new Voucher(voucher_code, voucher_name, description, discount_amount, valid_from, valid_to, is_active));
                        }
                        voucherData.postValue(vouchers);
                    } catch (Exception e) {
                        Log.e("Repository Error", "Error parsing response: " + e.getMessage());
                        voucherData.postValue(new ArrayList<>());
                    }
                } else {
                    Log.e("Repository Error", "Failed to load vouchers: " + response.code());
                    voucherData.postValue(new ArrayList<>());
                }
            }

            @Override
            public void onFailure(Call<JsonArray> call, Throwable t) {
                Log.e("Repository Error", "Error making request: " + t.getMessage());
                voucherData.postValue(new ArrayList<>());
            }
        });

        return voucherData;

    }
}
