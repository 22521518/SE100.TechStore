package com.example.electrohive.Activities;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import com.bumptech.glide.Glide;
import com.example.electrohive.R;
import com.example.electrohive.ViewModel.CustomerViewModel;
import com.example.electrohive.utils.PreferencesHelper;

public class AccountPage extends AppCompatActivity {

    private CustomerViewModel customerViewModel = CustomerViewModel.getInstance();

    private TextView menuItemUserInfo;
    private TextView menuItemUserAddress;
    private TextView menuItemUserChangePassword;
    private TextView menuItemUserOrders;
    private TextView menuItemUserVouchers;

    private ImageView userImageView;
    private TextView userNameTextView;
    private TextView signOutButton;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.account_page);


        // Initialize views
        userNameTextView = findViewById(R.id.userName);
        userImageView = findViewById(R.id.userImage);

        ImageButton backButton = findViewById(R.id.backbutton);
        backButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });

        customerViewModel.getSessionCustomer().observe(this,sessionCustomer->{
            if(sessionCustomer!=null) {
                // Update UI after receiving the customer data
                userNameTextView.setText(sessionCustomer.getUsername());
                Glide.with(AccountPage.this)
                        .load(sessionCustomer.getImage()) // URL to the image
                        .placeholder(R.drawable.ic_user_icon) // Optional placeholder
                        .error(R.drawable.ic_user_icon) // Optional error image
                        .into(userImageView); // Your ImageView
            }
        });

        menuItemUserInfo = findViewById(R.id.menuItemUserInfo);
        menuItemUserAddress = findViewById(R.id.menuItemUserAddress);
        menuItemUserChangePassword = findViewById(R.id.menuItemUserChangePassword);
        menuItemUserOrders = findViewById(R.id.menuItemUserOrders);
        menuItemUserVouchers = findViewById(R.id.menuItemUserVouchers);

        menuItemUserInfo.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(AccountPage.this, AccountInfoPage.class);

                startActivity(intent);
            }
        });
        menuItemUserAddress.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(AccountPage.this, AccountAddressPage.class);

                startActivity(intent);
            }
        });
        menuItemUserChangePassword.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(AccountPage.this, AccountChangePasswordPage.class);

                startActivity(intent);
            }
        });
        menuItemUserOrders.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(AccountPage.this, AccountOrderPage.class);

                startActivity(intent);
            }
        });
        menuItemUserVouchers.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(AccountPage.this, AccountVoucherPage.class);

                startActivity(intent);
            }
        });

        signOutButton = findViewById(R.id.signOutButton);

        signOutButton.setOnClickListener(v -> signOut());
    }


    private void signOut() {

        PreferencesHelper.clear();

        Intent intent = new Intent(AccountPage.this, LoginPage.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        startActivity(intent);
        finish(); // Ends the current activity
    }
}
