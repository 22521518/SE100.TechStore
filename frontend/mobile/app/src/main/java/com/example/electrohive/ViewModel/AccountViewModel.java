package com.example.electrohive.ViewModel;

import android.content.Context;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

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

        // Ensure PreferencesHelper is initialized

        accountRepository.login(email, password).observeForever(accessToken -> {
            if (accessToken != null) {
                // Save the access token
                PreferencesHelper preferencesHelper = new PreferencesHelper();
                preferencesHelper.saveAccessToken(accessToken);

                // Fetch user details with the token
                customerRepository.getCustomer(accessToken).observeForever(customer -> {
                    if (customer != null) {
                        // Save customer data
                        preferencesHelper.saveCustomerData(customer);
                        successLiveData.setValue(true);
                    } else {
                        successLiveData.setValue(false);
                    }
                });
            } else {
                successLiveData.setValue(false);
            }
        });

        return successLiveData;
    }

    public String getAccessToken(Context context) {
        return context.getSharedPreferences("user_prefs", Context.MODE_PRIVATE).getString("access_token", null);
    }
}
