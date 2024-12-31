package com.example.electrohive.ViewModel;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.example.electrohive.Models.Account;
import com.example.electrohive.Models.ApiResponse;
import com.example.electrohive.Repository.AccountRepository;
import com.example.electrohive.Repository.CustomerRepository;
import com.example.electrohive.utils.PreferencesHelper;
import com.google.gson.JsonObject;

public class AccountViewModel extends ViewModel {
    private final AccountRepository accountRepository;
    private final CustomerRepository customerRepository;
    private final CustomerViewModel customerViewModel = CustomerViewModel.getInstance();


    public AccountViewModel() {
        accountRepository = new AccountRepository();
        customerRepository = new CustomerRepository();
    }

    public LiveData<ApiResponse<Boolean>> login(String email, String password) {
        MutableLiveData<ApiResponse<Boolean>> resultLiveData = new MutableLiveData<>();

        accountRepository.login(email, password).observeForever(response -> {
            if (response != null) {
                if (response.isSuccess()) {
                    // Extract and validate the access token
                    String accessToken = response.getData();
                    String userId = extractUserIdFromJWT(accessToken);

                    if (userId != null) {
                        PreferencesHelper.saveAccessToken(accessToken);

                        customerRepository.getCustomer(userId).observeForever(customerResponse -> {
                            if (customerResponse != null && customerResponse.isSuccess()) {
                                PreferencesHelper.saveCustomerData(customerResponse.getData());
                                customerViewModel.setSessionCustomer(customerResponse.getData());
                                resultLiveData.postValue(new ApiResponse<>(true, true, "Login successful", 200));
                            } else {
                                resultLiveData.postValue(new ApiResponse<>(false, false, "Failed to fetch customer data", 500));
                            }
                        });
                    } else {
                        resultLiveData.postValue(new ApiResponse<>(false, false, "Invalid token", 400));
                    }
                } else {
                    // Handle specific status codes
                    int statusCode = response.getStatusCode();
                    String message;

                    switch (statusCode) {
                        case 401:
                            message = "Incorrect email or password";
                            break;
                        case 403:
                            message = "Account is locked or not authorized";
                            break;
                        case 404:
                            message = "User not found";
                            break;
                        default:
                            message = response.getMessage() != null ? response.getMessage() : "Login failed";
                    }

                    resultLiveData.postValue(new ApiResponse<>(false, false, message, statusCode));
                }
            } else {
                // Null response from repository
                resultLiveData.postValue(new ApiResponse<>(false, false, "Unknown error during login", 500));
            }
        });

        return resultLiveData;
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

    // Change password method
    // Change password method
    public LiveData<ApiResponse<Boolean>> changePassword(String currentPassword, String newPassword) {
        MutableLiveData<ApiResponse<Boolean>> resultLiveData = new MutableLiveData<>();

        // Get accountId from saved customer data
        String accountId = PreferencesHelper.getCustomerData().getAccountId();

        // Fetch account details from the repository
        accountRepository.getAccount(accountId).observeForever(accountResponse -> {
            if (accountResponse != null) {
                if (accountResponse.isSuccess()) {
                    Account account = accountResponse.getData();

                    // Check if the provided current password matches
                    if (account.getPassword().equals(currentPassword)) {
                        JsonObject payload = new JsonObject();
                        payload.addProperty("password", newPassword);

                        // Update the password
                        accountRepository.patchAccount(accountId, payload).observeForever(patchResponse -> {
                            if (patchResponse != null) {
                                if (patchResponse.isSuccess()) {
                                    resultLiveData.postValue(new ApiResponse<>(true, true, "Password updated successfully", 200));
                                } else {
                                    String message = patchResponse.getMessage() != null
                                            ? patchResponse.getMessage()
                                            : "Failed to update password";
                                    resultLiveData.postValue(new ApiResponse<>(false, false, message, patchResponse.getStatusCode()));
                                }
                            } else {
                                resultLiveData.postValue(new ApiResponse<>(false, false, "Error updating password", 500));
                            }
                        });
                    } else {
                        // Current password is incorrect
                        resultLiveData.postValue(new ApiResponse<>(false, false, "Current password is incorrect", 401));
                    }
                } else {
                    // Handle specific errors when fetching account details
                    int statusCode = accountResponse.getStatusCode();
                    String message;

                    switch (statusCode) {
                        case 404:
                            message = "Account not found";
                            break;
                        case 403:
                            message = "Access denied to account information";
                            break;
                        default:
                            message = accountResponse.getMessage() != null
                                    ? accountResponse.getMessage()
                                    : "Failed to fetch account details";
                    }

                    resultLiveData.postValue(new ApiResponse<>(false, false, message, statusCode));
                }
            } else {
                // Null response from the repository
                resultLiveData.postValue(new ApiResponse<>(false, false, "Unknown error fetching account details", 500));
            }
        });

        return resultLiveData;
    }


}
