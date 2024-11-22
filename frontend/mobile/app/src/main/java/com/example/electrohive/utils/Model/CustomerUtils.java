package com.example.electrohive.utils.Model;

import com.example.electrohive.Models.Customer;
import com.google.gson.JsonObject;

public class CustomerUtils {
    public static Customer parseCustomer(JsonObject customerObject) {
        Customer customer = null;

        String customerId = customerObject.get("customer_id").getAsString();
        String accountId = customerObject.get("account_id").getAsString();
        String username = customerObject.get("username").getAsString();
        String fullName = customerObject.get("full_name").getAsString();
        String phoneNumber = customerObject.get("phone_number").getAsString();
        String image = customerObject.get("image").getAsString();
        String birthDate = customerObject.get("birth_date").getAsString();
        String dateJoined = customerObject.get("date_joined").getAsString();
        boolean isMale = customerObject.get("male").getAsBoolean();

        customer = new Customer(customerId,
                accountId,
                username,
                fullName,
                phoneNumber,
                image,
                birthDate,
                dateJoined);
        customer.setMale(isMale);

        return customer;
    }
}
