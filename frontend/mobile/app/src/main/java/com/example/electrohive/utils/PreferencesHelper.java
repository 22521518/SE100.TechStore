package com.example.electrohive.utils;

import android.content.Context;
import android.content.SharedPreferences;

import com.example.electrohive.Models.Customer;

public class PreferencesHelper {
    private static SharedPreferences sharedPreferences;

    public static void init(Context context) {
        sharedPreferences = context.getSharedPreferences("user_prefs", Context.MODE_PRIVATE);
    }
    public static void saveAccessToken(String token) {
        sharedPreferences.edit().putString("access_token", token).apply();
    }

    public static String getAccessToken() {
        return sharedPreferences.getString("access_token", null);
    }

    public static void clear() {
        SharedPreferences.Editor editor = sharedPreferences.edit();
        editor.clear(); // This removes all data in SharedPreferences
        editor.apply();
    }



    public static void saveCustomerData(Customer customer) {
        if (customer == null) {
            return; // If customer is null, do nothing
        }

        SharedPreferences.Editor editor = sharedPreferences.edit();

        if (customer.getCustomerId() != null) {
            editor.putString("customer_id", customer.getCustomerId());
        }

        if (customer.getAccountId() != null) {
            editor.putString("account_id", customer.getAccountId());
        }

        if (customer.getUsername() != null) {
            editor.putString("username", customer.getUsername());
        }

        if (customer.getFullName() != null) {
            editor.putString("full_name", customer.getFullName());
        }

        if (customer.getPhoneNumber() != null) {
            editor.putString("phone_number", customer.getPhoneNumber());
        }

        if (customer.getImage() != null) {
            editor.putString("image", customer.getImage());
        }

        if (customer.getBirthDate() != null) {
            editor.putString("birth_date", customer.getBirthDate().toString());
        }

        if (customer.getDateJoined() != null) {
            editor.putString("date_joined", customer.getDateJoined().toString());
        }

        // Assuming 'male' field is a Boolean
        if (customer.getMale() != null) {
            editor.putBoolean("male", customer.getMale());
        }

        editor.apply();
    }
    public static Customer getCustomerData() {
        Customer customer = new Customer(
                sharedPreferences.getString("customer_id", null),
                sharedPreferences.getString("account_id", null),
                sharedPreferences.getString("username", null),
                sharedPreferences.getString("full_name", null),
                sharedPreferences.getString("phone_number", null),
                sharedPreferences.getString("image", null),
                sharedPreferences.getString("birth_date", null),
                sharedPreferences.getString("date_joined", null)
        );
        customer.setMale(sharedPreferences.getBoolean("male",true));
        return customer;
    }
}
