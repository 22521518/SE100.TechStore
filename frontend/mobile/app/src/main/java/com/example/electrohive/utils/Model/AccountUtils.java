package com.example.electrohive.utils.Model;

import com.example.electrohive.Models.Account;
import com.google.gson.JsonObject;

public class AccountUtils {

    public static Account parseAccount(JsonObject accountJson) {
        Account account = null;

        String account_id = accountJson.get("account_id").getAsString();
        String email = accountJson.get("email").getAsString();
        String password = accountJson.get("password").getAsString();
        Boolean is_active = accountJson.get("is_active").getAsBoolean();

        account = new Account(email,password);
        account.setAccount_id(account_id);
        account.setIs_active(is_active);
        return account;
    }
}
