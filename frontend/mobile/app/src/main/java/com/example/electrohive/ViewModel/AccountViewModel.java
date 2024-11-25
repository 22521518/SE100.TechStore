package com.example.electrohive.ViewModel;

import android.content.Context;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.example.electrohive.Models.Account;
import com.example.electrohive.Models.Address;
import com.example.electrohive.Repository.AccountRepository;
import com.example.electrohive.Repository.AddressRepository;
import com.example.electrohive.Repository.CustomerRepository;
import com.example.electrohive.utils.PreferencesHelper;

import java.util.ArrayList;
import java.util.List;

public class AccountViewModel extends ViewModel {
    private final AccountRepository accountRepository;
    private final CustomerRepository customerRepository;


    public AccountViewModel() {
        accountRepository = new AccountRepository();
        customerRepository = new CustomerRepository();
    }

    public LiveData<Boolean> login(String email, String password) {
        MutableLiveData<Boolean> successLiveData = new MutableLiveData<>();

        accountRepository.login(email, password).observeForever(accessToken -> {
            if (accessToken != null) {
                String userId = extractUserIdFromJWT(accessToken);

                if (userId != null) {
                    PreferencesHelper.saveAccessToken(accessToken);

                    customerRepository.getCustomer(userId).observeForever(customer -> {
                        if (customer != null) {
                            PreferencesHelper.saveCustomerData(customer);
                            successLiveData.postValue(true);
                        } else {
                            successLiveData.postValue(false);
                        }
                    });
                } else {
                    successLiveData.postValue(false);
                }
            } else {
                successLiveData.postValue(false);
            }
        });

        return successLiveData;
    }


    private String extractUserIdFromJWT(String token) {
        try {
            // Decode the JWT
            DecodedJWT decodedJWT = JWT.decode(token);

            // Extract the "id" claim (adjust based on your JWT structure)
            return decodedJWT.getClaim("id").asString();
        } catch (Exception e) {
            // Handle decoding errors (invalid token, missing claim, etc.)
            e.printStackTrace();
            return null;
        }
    }

    public String getAccessToken(Context context) {
        return PreferencesHelper.getAccessToken();
    }
}
