package com.example.electrohive.Activities;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.View;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.RadioButton;
import android.widget.TextView;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;

import com.bumptech.glide.Glide;
import com.example.electrohive.Models.Customer;
import com.example.electrohive.R;
import com.example.electrohive.utils.PreferencesHelper;

public class AccountPage extends AppCompatActivity {
    private TextView menuItemUserInfo;
    private TextView menuItemUserAddress;
    private TextView menuItemUserChangePassword;
    private TextView menuItemUserOrders;
    private TextView menuItemUserVouchers;

    private TextView signOutButton;

    private Customer sessionCustomer;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.account_page);

        // Initialize views
        TextView userNameTextView = findViewById(R.id.userName);
        ImageView userImageView = findViewById(R.id.userImage);

        ImageButton backButton = findViewById(R.id.backbutton);
        backButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });

        // Fetch user data from SharedPreferences

        sessionCustomer = PreferencesHelper.getCustomerData();
        // Set user name
        userNameTextView.setText(sessionCustomer.getUsername());

        // Set user image
        Glide.with(AccountPage.this)
                .load(sessionCustomer.getImage()) // URL to the image
                .placeholder(R.drawable.ic_user_icon) // Optional placeholder
                .error(R.drawable.ic_user_icon) // Optional error image
                .into(userImageView); // Your ImageView

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

        signOutButton = findViewById(R.id.signOutButton);

        signOutButton.setOnClickListener(v->signOut());
    }
    private void signOut() {

        PreferencesHelper.clear();

        Intent intent = new Intent(AccountPage.this, LoginPage.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        startActivity(intent);
        finish(); // Ends the current activity
    }
}
