package com.example.electrohive.Activities;

import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;

import com.example.electrohive.Models.CartItem;
import com.example.electrohive.Models.CheckoutAddress;
import com.example.electrohive.R;
import com.google.common.reflect.TypeToken;
import com.google.gson.Gson;

import java.util.ArrayList;

public class ConfirmPage  extends AppCompatActivity {

    @Override
    protected void  onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.confirm_page);
    }
}
