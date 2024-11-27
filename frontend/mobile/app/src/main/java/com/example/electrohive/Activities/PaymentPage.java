package com.example.electrohive.Activities;

import android.os.Bundle;
import android.widget.RadioButton;

import androidx.appcompat.app.AppCompatActivity;

import com.example.electrohive.R;

public class PaymentPage  extends AppCompatActivity {

    RadioButton momo,cash;
    @Override
    protected void  onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.payment_page);
        momo=findViewById(R.id.wallet);
        cash=findViewById(R.id.cash);
        momo.setOnClickListener(v->{
            cash.setChecked(false);
        });
        cash.setOnClickListener(v->{
            momo.setChecked(false);
        });
    }
}
