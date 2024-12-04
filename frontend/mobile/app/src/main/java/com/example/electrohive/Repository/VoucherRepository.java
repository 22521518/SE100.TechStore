package com.example.electrohive.Repository;

import android.util.Log;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.example.electrohive.Models.ApiResponse;
import com.example.electrohive.Models.Voucher;
import com.example.electrohive.api.VoucherService;
import com.example.electrohive.utils.RetrofitClient;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class VoucherRepository {

    private final VoucherService voucherService;

    public VoucherRepository() {
        voucherService = RetrofitClient.getClient().create(VoucherService.class);
    }

    // Get the list of vouchers and wrap it in ApiResponse
    public LiveData<ApiResponse<List<Voucher>>> getVouchers() {
        MutableLiveData<ApiResponse<List<Voucher>>> voucherData = new MutableLiveData<>();

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
                            String valid_from = provinceJson.get("valid_from").getAsString();
                            String valid_to = provinceJson.get("valid_to").getAsString();
                            Boolean is_active = provinceJson.get("is_active").getAsBoolean();

                            vouchers.add(new Voucher(voucher_code, voucher_name, description, discount_amount, valid_from, valid_to, is_active));
                        }

                        // Wrap the successful response in ApiResponse
                        ApiResponse<List<Voucher>> apiResponse = new ApiResponse<>(
                                true,
                                vouchers,
                                "Vouchers loaded successfully",
                                response.code()
                        );
                        voucherData.postValue(apiResponse);

                    } catch (Exception e) {
                        Log.e("Repository Error", "Error parsing response: " + e.getMessage());
                        ApiResponse<List<Voucher>> apiResponse = new ApiResponse<>(
                                false,
                                new ArrayList<>(),
                                "Error parsing response: " + e.getMessage(),
                                response.code()
                        );
                        voucherData.postValue(apiResponse);
                    }
                } else {
                    Log.e("Repository Error", "Failed to load vouchers: " + response.code());
                    ApiResponse<List<Voucher>> apiResponse = new ApiResponse<>(
                            false,
                            new ArrayList<>(),
                            "Failed to load vouchers: " + response.code(),
                            response.code()
                    );
                    voucherData.postValue(apiResponse);
                }
            }

            @Override
            public void onFailure(Call<JsonArray> call, Throwable t) {
                Log.e("Repository Error", "Error making request: " + t.getMessage());
                ApiResponse<List<Voucher>> apiResponse = new ApiResponse<>(
                        false,
                        new ArrayList<>(),
                        "Error making request: " + t.getMessage(),
                        500 // Use 500 to indicate server error on failure
                );
                voucherData.postValue(apiResponse);
            }
        });

        return voucherData;
    }
}
