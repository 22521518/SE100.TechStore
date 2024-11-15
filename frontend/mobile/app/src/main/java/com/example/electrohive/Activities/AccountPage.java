package com.example.electrohive.Activities;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.TextView;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;

import com.example.electrohive.R;

public class AccountPage extends AppCompatActivity {
    private TextView menuItemUserInfo;
    private TextView menuItemUserAddress;
    private TextView menuItemUserChangePassword;
    private TextView menuItemUserOrders;
    private TextView menuItemUserVouchers;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.account_page);

        menuItemUserInfo = findViewById(R.id.menuItemUserInfo);
        menuItemUserAddress = findViewById(R.id.menuItemUserAddress);
        menuItemUserChangePassword = findViewById(R.id.menuItemUserChangePassword);
        menuItemUserOrders = findViewById(R.id.menuItemUserOrders);
        menuItemUserVouchers = findViewById(R.id.menuItemUserVouchers);

        menuItemUserInfo.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(AccountPage.this,AccountInfoPage.class);

                startActivity(intent);
            }
        });
        menuItemUserAddress.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(AccountPage.this,AccountAddressPage.class);

                startActivity(intent);
            }
        });
        menuItemUserChangePassword.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(AccountPage.this,AccountChangePassword.class);

                startActivity(intent);
            }
        });
        menuItemUserOrders.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(AccountPage.this,AccountOrderPage.class);

                startActivity(intent);
            }
        });
        menuItemUserVouchers.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(AccountPage.this,AccountVoucherPage.class);

                startActivity(intent);
            }
        });
    }
}
