package com.example.electrohive.Activities;

import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Paint;
import android.os.Bundle;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.Observer;

import com.example.electrohive.Models.ApiResponse;
import com.example.electrohive.Models.Customer;
import com.example.electrohive.R;
import com.example.electrohive.ViewModel.AccountViewModel;
import com.example.electrohive.ViewModel.CustomerViewModel;
import com.example.electrohive.utils.PreferencesHelper;

public class LoginPage extends AppCompatActivity {
    private TextView sign_up_button;

    private EditText email_input;

    private EditText password_input;

    private AccountViewModel accountViewModel;

    private CustomerViewModel customerViewModel = CustomerViewModel.getInstance();

    protected TextView log_in_button;

    protected boolean isLoading = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.login_page);

        accountViewModel = new AccountViewModel();


        email_input = findViewById(R.id.emailInput);
        password_input = findViewById(R.id.passwordInput);

        log_in_button = findViewById(R.id.loginButton);
        sign_up_button = findViewById(R.id.signupLinkTextView);
        checkLoginStatus();


        log_in_button.setOnClickListener(v -> login());
        sign_up_button.setOnClickListener(v -> signUp());
    }

    private void checkLoginStatus() {
        log_in_button.setText("Verifying...");


        if (PreferencesHelper.getAccessToken()!=null && !PreferencesHelper.getAccessToken().isEmpty()) {
            customerViewModel.getCustomer(PreferencesHelper.getCustomerData().getCustomerId()).observe(this, new Observer<ApiResponse<Customer>>() {
                @Override
                public void onChanged(ApiResponse<Customer> apiResponse) {
                    if (apiResponse == null) {
                        Toast.makeText(LoginPage.this, "Error occurred. Please try again.", Toast.LENGTH_SHORT).show();
                        log_in_button.setText("Login");
                        return;
                    }

                    if (apiResponse.getStatusCode() == 200) {
                        // Navigate to HomePage if login is successful
                        Intent intent = new Intent(LoginPage.this, HomePage.class);
                        startActivity(intent);
                        finish();
                    } else {
                        // Handle specific error messages based on the status code
                        String errorMessage = apiResponse.getMessage() != null
                                ? apiResponse.getMessage()
                                : "Login failed. Please check your credentials.";
                        Toast.makeText(LoginPage.this, errorMessage, Toast.LENGTH_SHORT).show();
                    }

                    log_in_button.setText("Login");
                }
            });

        }
        log_in_button.setText("Login");
    }


    private void login() {
        if (log_in_button.getText().toString().equals("Verifying...")) return;

        String email = email_input.getText().toString().trim();
        String password = password_input.getText().toString().trim();

        if (email.isEmpty() || password.isEmpty()) {
            Toast.makeText(this, "Please fill in both fields", Toast.LENGTH_SHORT).show();
            return;
        }

        log_in_button.setText("Verifying...");

        accountViewModel.login(email, password).observe(this, new Observer<ApiResponse>() {
            @Override
            public void onChanged(ApiResponse apiResponse) {
                if (apiResponse == null) {
                    Toast.makeText(LoginPage.this, "Unknown error occurred. Please try again.", Toast.LENGTH_SHORT).show();
                    log_in_button.setText("Login");
                    return;
                }

                if (apiResponse.isSuccess()) {
                    Toast.makeText(LoginPage.this, "Welcome " + PreferencesHelper.getCustomerData().getUsername(), Toast.LENGTH_SHORT).show();
                    Intent intent = new Intent(LoginPage.this, HomePage.class);
                    startActivity(intent);
                    finish();
                } else {
                    // Handle specific error messages based on the response
                    String errorMessage = apiResponse.getMessage() != null
                            ? apiResponse.getMessage()
                            : "Login failed. Please check your credentials.";
                    Toast.makeText(LoginPage.this, errorMessage, Toast.LENGTH_SHORT).show();
                }

                log_in_button.setText("Login");
            }
        });

    }


    private void signUp() {
        sign_up_button.setPaintFlags(sign_up_button.getPaintFlags() | Paint.UNDERLINE_TEXT_FLAG);

        Intent intent = new Intent(LoginPage.this, SignUpPage.class);
        startActivity(intent);
    }

}
