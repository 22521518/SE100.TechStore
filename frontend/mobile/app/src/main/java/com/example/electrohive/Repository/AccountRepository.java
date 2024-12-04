package com.example.electrohive.Repository;

import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.example.electrohive.Models.Account;
import com.example.electrohive.Models.ApiResponse;
import com.example.electrohive.api.AccountService;
import com.example.electrohive.api.CustomerService;
import com.example.electrohive.utils.ApiErrorParser;
import com.example.electrohive.utils.Model.AccountUtils;
import com.example.electrohive.utils.PreferencesHelper;
import com.example.electrohive.utils.RetrofitClient;
import com.google.gson.JsonObject;

import org.json.JSONObject;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class AccountRepository {
    private final AccountService accountService;
    private PreferencesHelper sharedPreferences;


    public AccountRepository() {

        accountService = RetrofitClient.getClient().create(AccountService.class);

    }

    public MutableLiveData<ApiResponse<String>> login(String email, String passowrd) {
        MutableLiveData<ApiResponse<String>> accessToken = new MutableLiveData<>();


        JsonObject loginAccount = new JsonObject();
        loginAccount.addProperty("email", email);
        loginAccount.addProperty("password", passowrd);
        accountService.login("application/json", loginAccount).enqueue(new Callback<JsonObject>() {
            @Override
            public void onResponse(Call<JsonObject> call, Response<JsonObject> response) {
                if (response.isSuccessful() && response.body() != null) {
                    JsonObject loginResponse = response.body();

                    String token = loginResponse.get("access_token").getAsString();
                    PreferencesHelper.saveAccessToken(token);
                    accessToken.postValue(new ApiResponse<>(true, token, "Login successful", response.code()));
                } else {
                    String errorMessage = ApiErrorParser.parseErrorBody(response);
                    accessToken.postValue(new ApiResponse<>(false, null, errorMessage, response.code()));

                }
            }

            @Override
            public void onFailure(Call<JsonObject> call, Throwable t) {
                // Handle failure (e.g., no internet, server down)
                accessToken.postValue(new ApiResponse<>(false, null, t.getMessage(), -1));

            }
        });

        return accessToken;

    }

    public MutableLiveData<ApiResponse<Account>> getAccount(String id) {
        MutableLiveData<ApiResponse<Account>> accountData = new MutableLiveData<>();

        accountService.getAccount(id).enqueue(new Callback<JsonObject>() {
            @Override
            public void onResponse(Call<JsonObject> call, Response<JsonObject> response) {
                if (response.isSuccessful() && response.body() != null) {
                    JsonObject accountJson = response.body().getAsJsonObject();
                    Account account = AccountUtils.parseAccount(accountJson);
                    accountData.postValue(new ApiResponse<>(true, account, "Account fetched successfully", response.code()));
                } else {
                    String errorMessage = ApiErrorParser.parseErrorBody(response);
                    accountData.postValue(new ApiResponse<>(false, null, errorMessage, response.code()));
                }
            }

            @Override
            public void onFailure(Call<JsonObject> call, Throwable t) {
                accountData.postValue(new ApiResponse<>(false, null, t.getMessage(), -1));

            }
        });

        return accountData;

    }

    public MutableLiveData<ApiResponse<Account>> patchAccount(String id, JsonObject payload) {
        MutableLiveData<ApiResponse<Account>> accountData = new MutableLiveData<>();

        accountService.patchAccount(id, "application/json", payload).enqueue(new Callback<JsonObject>() {
            @Override
            public void onResponse(Call<JsonObject> call, Response<JsonObject> response) {
                if (response.isSuccessful() && response.body() != null) {
                    JsonObject accountJson = response.body().getAsJsonObject();
                    Account account = AccountUtils.parseAccount(accountJson);
                    accountData.postValue(new ApiResponse<>(true, account, "Account fetched successfully", response.code()));
                } else {
                    String errorMessage = ApiErrorParser.parseErrorBody(response);
                    accountData.postValue(new ApiResponse<>(false, null, errorMessage, response.code()));

                }
            }

            @Override
            public void onFailure(Call<JsonObject> call, Throwable t) {
                accountData.postValue(new ApiResponse<>(false, null, t.getMessage(), -1));

            }
        });

        return accountData;

    }


}
