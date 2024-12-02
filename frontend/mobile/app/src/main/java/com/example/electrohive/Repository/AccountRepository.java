package com.example.electrohive.Repository;

import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.example.electrohive.Models.Account;
import com.example.electrohive.api.AccountService;
import com.example.electrohive.api.CustomerService;
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

        accountService =  RetrofitClient.getClient().create(AccountService.class);

    }

    public MutableLiveData<String> login(String email,String passowrd) {
        MutableLiveData<String> accessToken = new MutableLiveData<>();




        JsonObject loginAccount = new JsonObject();
        loginAccount.addProperty("email",email);
        loginAccount.addProperty("password",passowrd);
        accountService.login("application/json",loginAccount).enqueue(new Callback<JsonObject>() {
            @Override
            public void onResponse(Call<JsonObject> call, Response<JsonObject> response) {
                if (response.isSuccessful() && response.body() != null) {
                    JsonObject loginResponse = response.body();
                    if (loginResponse.has("access_token")) {
                        // Handle success (user authenticated)
                        String token = loginResponse.get("access_token").getAsString();
                        PreferencesHelper.saveAccessToken(token);
                        accessToken.postValue(token);
                    }
                } else {
                    // Handle other response issues (e.g., network errors)
                    Log.e("Login", "Login failed with response code: " + response.code());
                    accessToken.postValue(null);

                }
            }

            @Override
            public void onFailure(Call<JsonObject> call, Throwable t) {
                // Handle failure (e.g., no internet, server down)
                Log.e("Login", "Network error: " + t.getMessage());
                accessToken.postValue(null);

            }
        });

        return accessToken;

    }

    public MutableLiveData<Account> getAccount(String id) {
        MutableLiveData<Account> accountData = new MutableLiveData<>();

        accountService.getAccount(id).enqueue(new Callback<JsonObject>() {
            @Override
            public void onResponse(Call<JsonObject> call, Response<JsonObject> response) {
                if (response.isSuccessful() && response.body() != null) {
                    JsonObject accountJson = response.body().getAsJsonObject();
                    Account account = AccountUtils.parseAccount(accountJson);
                    accountData.postValue(account);
                } else {
                    // Handle other response issues (e.g., network errors)
                    Log.e("Login", "Login failed with response code: " + response.code());
                    accountData.postValue(null);

                }
            }

            @Override
            public void onFailure(Call<JsonObject> call, Throwable t) {
                // Handle failure (e.g., no internet, server down)
                Log.e("Login", "Network error: " + t.getMessage());
                accountData.postValue(null);

            }
        });

        return accountData;

    }

    public MutableLiveData<Account> patchAccount(String id,JsonObject payload) {
        MutableLiveData<Account> accountData = new MutableLiveData<>();

        accountService.patchAccount(id,"application/json",payload).enqueue(new Callback<JsonObject>() {
            @Override
            public void onResponse(Call<JsonObject> call, Response<JsonObject> response) {
                if (response.isSuccessful() && response.body() != null) {
                    JsonObject accountJson = response.body().getAsJsonObject();
                    Account account = AccountUtils.parseAccount(accountJson);
                    accountData.postValue(account);
                } else {
                    // Handle other response issues (e.g., network errors)
                    Log.e("Patch", "patch failed with response code: " + response.code());
                    accountData.postValue(null);

                }
            }

            @Override
            public void onFailure(Call<JsonObject> call, Throwable t) {
                // Handle failure (e.g., no internet, server down)
                Log.e("Patch", "Network error: " + t.getMessage());
                accountData.postValue(null);

            }
        });

        return accountData;

    }


}
