package com.example.electrohive.ViewModel;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.example.electrohive.Models.Account;
import com.example.electrohive.Models.ApiResponse;
import com.example.electrohive.Models.Customer;
import com.example.electrohive.Repository.CustomerRepository;
import com.example.electrohive.utils.PreferencesHelper;
import com.google.gson.JsonObject;

public class CustomerViewModel {

    private final CustomerRepository repository;
    private static CustomerViewModel instance;
    private static final MutableLiveData<Customer> sessionCustomer = new MutableLiveData<>();

    private CustomerViewModel() {
        this.repository = new CustomerRepository();
    }

    // Singleton pattern to get a single instance of CustomerViewModel
    public static synchronized CustomerViewModel getInstance() {
        if (instance == null) {
            instance = new CustomerViewModel();
        }
        return instance;
    }

    // Get session customer data
    public LiveData<Customer> getSessionCustomer() {
        return sessionCustomer;
    }

    // Fetch customer details by customerId
    public LiveData<ApiResponse<Customer>> getCustomer(String customerId) {
        MutableLiveData<ApiResponse<Customer>> customerData = new MutableLiveData<>();

        repository.getCustomer(customerId).observeForever(response -> {
            if (response != null) {
                if (response.isSuccess()) {
                    // Update session customer if the API call is successful
                    sessionCustomer.postValue(response.getData());
                }
                customerData.postValue(response);
            }
        });
        return customerData;
    }

    public void setSessionCustomer(Customer customer) {
        sessionCustomer.postValue(customer);
    }
    // Update customer data and save it locally
    public LiveData<ApiResponse<Customer>> updateCustomer(Customer newCustomer) {
        MutableLiveData<ApiResponse<Customer>> result = new MutableLiveData<>();

        JsonObject updatePayload = buildCustomerUpdatePayload(newCustomer);

        repository.updateCustomer(PreferencesHelper.getCustomerData().getCustomerId(), updatePayload)
                .observeForever(response -> {
                    if (response != null) {
                        if (response.isSuccess()) {
                            // Update session customer and preferences on success
                            sessionCustomer.postValue(response.getData());
                            PreferencesHelper.saveCustomerData(response.getData());
                        }
                        result.postValue(response);
                    }
                });
        return result;
    }

    // Sign up new customer with account details
    public LiveData<ApiResponse<Customer>> signUp(Account newAccount, Customer newCustomer) {
        MutableLiveData<ApiResponse<Customer>> result = new MutableLiveData<>();

        JsonObject signUpPayload = buildSignUpPayload(newAccount, newCustomer);

        repository.signUp(signUpPayload).observeForever(response -> {
            if (response != null) {
                result.postValue(response);
            }
        });

        return result;
    }

    // Helper method to build update payload for customer data
    private JsonObject buildCustomerUpdatePayload(Customer customer) {
        JsonObject updatePayload = new JsonObject();

        if (customer.getImage() != null && !customer.getImage().isEmpty()) {
            JsonObject updatedImage = new JsonObject();
            updatedImage.addProperty("name", "profile_image");
            updatedImage.addProperty("url", customer.getImage());
            updatePayload.add("image", updatedImage);
        }

        updatePayload.addProperty("username", customer.getUsername());
        updatePayload.addProperty("full_name", customer.getFullName());
        updatePayload.addProperty("phone_number", customer.getPhoneNumber());
        updatePayload.addProperty("male", customer.getMale());
        updatePayload.addProperty("birth_date", customer.getBirthDate().toString());

        return updatePayload;
    }

    // Helper method to build sign-up payload for new customer
    private JsonObject buildSignUpPayload(Account account, Customer customer) {
        JsonObject signUpPayload = new JsonObject();
        JsonObject accountPayload = new JsonObject();
        accountPayload.addProperty("email", account.getEmail());
        accountPayload.addProperty("password", account.getPassword());

        signUpPayload.add("account", accountPayload);
        signUpPayload.addProperty("username", customer.getUsername());
        signUpPayload.addProperty("full_name", customer.getFullName());
        signUpPayload.addProperty("phone_number", customer.getPhoneNumber());
        signUpPayload.addProperty("male", customer.getMale());
        signUpPayload.addProperty("birth_date", customer.getBirthDate().toString());

        return signUpPayload;
    }
}
