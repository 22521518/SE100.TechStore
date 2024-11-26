package com.example.electrohive.ViewModel;

import android.content.Context;
import android.content.SharedPreferences;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.example.electrohive.Models.Account;
import com.example.electrohive.Models.Customer;
import com.example.electrohive.Repository.AccountRepository;
import com.example.electrohive.Repository.CustomerRepository;
import com.example.electrohive.utils.PreferencesHelper;
import com.google.gson.JsonObject;

import org.openqa.selenium.json.Json;

public class CustomerViewModel {

    private final CustomerRepository repository;


    public CustomerViewModel() {
        this.repository = new CustomerRepository();
    }
    public LiveData<Customer> getCustomer(String customerId) {
        return repository.getCustomer(customerId);
    }

    public LiveData<Boolean> updateCustomer(Customer newCustomer) {
        MutableLiveData<Boolean> booleanMutableLiveData = new MutableLiveData<>();
        JsonObject updatePayload = new JsonObject();
        if(newCustomer.getImage()!=""){
            JsonObject updatedImage = new JsonObject();
            updatedImage.addProperty("name","profile_image");
            updatedImage.addProperty("url",newCustomer.getImage());
            updatePayload.add("image",updatedImage);
        }
        updatePayload.addProperty("username",newCustomer.getUsername());
        updatePayload.addProperty("full_name",newCustomer.getFullName());
        updatePayload.addProperty("phone_number",newCustomer.getPhoneNumber());
        updatePayload.addProperty("male",newCustomer.getMale());
        updatePayload.addProperty("birth_date",newCustomer.getBirthDate().toString());

        repository.updateCustomer(PreferencesHelper.getCustomerData().getCustomerId(),updatePayload).observeForever(customer -> {
            if(customer != null) {
                booleanMutableLiveData.postValue(true);
                PreferencesHelper.saveCustomerData(customer);
            } else {
                booleanMutableLiveData.postValue(false);
            }
        });
        return booleanMutableLiveData;
    }

    public LiveData<Boolean> signUp(Account newAccount,Customer newCustomer) {
        MutableLiveData<Boolean> booleanMutableLiveData = new MutableLiveData<>();

        JsonObject signUpPayload = new JsonObject();
        JsonObject accountPayload = new JsonObject();
        accountPayload.addProperty("email",newAccount.getEmail());
        accountPayload.addProperty("password",newAccount.getPassword());
        signUpPayload.add("account",accountPayload);
        signUpPayload.addProperty("username",newCustomer.getUsername());
        signUpPayload.addProperty("full_name",newCustomer.getFullName());
        signUpPayload.addProperty("phone_number",newCustomer.getPhoneNumber());
        signUpPayload.addProperty("male",newCustomer.getMale());
        signUpPayload.addProperty("birth_date",newCustomer.getBirthDate().toString());

        repository.signUp(signUpPayload).observeForever(customer -> {
            if(customer != null) {
                booleanMutableLiveData.postValue(true);
            } else {
                booleanMutableLiveData.postValue(false);
            }
        });

        return booleanMutableLiveData;
    }



}
