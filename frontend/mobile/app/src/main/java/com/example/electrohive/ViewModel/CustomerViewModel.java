package com.example.electrohive.ViewModel;

import android.content.Context;
import android.content.SharedPreferences;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.example.electrohive.Models.Customer;
import com.example.electrohive.Repository.AccountRepository;
import com.example.electrohive.Repository.CustomerRepository;
import com.example.electrohive.utils.PreferencesHelper;

public class CustomerViewModel {

    private final CustomerRepository repository;

    public CustomerViewModel() {
        this.repository = new CustomerRepository();
    }
    public LiveData<Customer> getCustomer(String customerId) {
        return repository.getCustomer(customerId);

    }

    public LiveData<Customer> getSessionCustomer() {
        MutableLiveData<Customer> customerLiveData = new MutableLiveData<>();
        String customerId = PreferencesHelper.getCustomerData().getCustomerId();

        if (customerId != null) {
            Customer customer = PreferencesHelper.getCustomerData();
            customerLiveData.setValue(customer);
        } else {
            // Fetch user data from the API if not available in SharedPreferences
            repository.getCustomer(customerId).observeForever(customer -> {
                if (customer != null) {
                    PreferencesHelper.saveCustomerData(customer);
                    customerLiveData.setValue(customer);
                }
            });
        }

        return customerLiveData;
    }

}
