package com.example.electrohive.utils.Model;

import android.util.Log;

import com.example.electrohive.Models.Customer;
import com.google.gson.JsonObject;

public class CustomerUtils {
    public static Customer parseCustomer(JsonObject customerObject) {
        if (customerObject == null) {
            return null; // Handle the case where the entire object is null
        }

        String customerId = customerObject.has("customer_id") && !customerObject.get("customer_id").isJsonNull()
                ? customerObject.get("customer_id").getAsString() : "";

        String accountId = customerObject.has("account_id") && !customerObject.get("account_id").isJsonNull()
                ? customerObject.get("account_id").getAsString() : "";

        String username = customerObject.has("username") && !customerObject.get("username").isJsonNull()
                ? customerObject.get("username").getAsString() : "";

        String fullName = customerObject.has("full_name") && !customerObject.get("full_name").isJsonNull()
                ? customerObject.get("full_name").getAsString() : "";

        String phoneNumber = customerObject.has("phone_number") && !customerObject.get("phone_number").isJsonNull()
                ? customerObject.get("phone_number").getAsString() : "";

        String image = customerObject.has("image") && !customerObject.get("image").isJsonNull()
                ? customerObject.get("image").getAsString() : "";

        String birthDate = customerObject.has("birth_date") && !customerObject.get("birth_date").isJsonNull()
                ? customerObject.get("birth_date").getAsString() : "";

        String dateJoined = customerObject.has("date_joined") && !customerObject.get("date_joined").isJsonNull()
                ? customerObject.get("date_joined").getAsString() : "";

        boolean isMale = customerObject.has("male") && !customerObject.get("male").isJsonNull()
                ? customerObject.get("male").getAsBoolean() : false;

        Customer customer = new Customer(
                customerId,
                accountId,
                username,
                fullName,
                phoneNumber,
                image,
                birthDate,
                dateJoined
        );
        customer.setMale(isMale);

        return customer;
    }

}
