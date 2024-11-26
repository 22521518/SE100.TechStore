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
        SharedPreferences.Editor editor = sharedPreferences.edit();
        editor.putString("user_id", customer.getCustomerId());
        editor.putString("account_id", customer.getCustomerId());
        editor.putString("username", customer.getUsername());
        editor.putString("full_name", customer.getFullName());
        editor.putString("phone_number", customer.getPhoneNumber());
        editor.putString("image", customer.getImage());
        editor.putString("birth_date", customer.getBirthDate().toString());
        editor.putString("date_joined", customer.getDateJoined().toString());
        editor.apply();
    }

    public static Customer getCustomerData() {
        return new Customer(
                sharedPreferences.getString("user_id", null),
                sharedPreferences.getString("account_id", null),
                sharedPreferences.getString("username", null),
                sharedPreferences.getString("full_name", null),
                sharedPreferences.getString("phone_number", null),
                sharedPreferences.getString("image", null),
                sharedPreferences.getString("birth_date", null),
                sharedPreferences.getString("date_joined", null)
        );
    }
}
