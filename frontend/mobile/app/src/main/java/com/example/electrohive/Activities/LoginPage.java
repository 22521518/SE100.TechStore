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

    private CustomerViewModel customerViewModel;

    protected TextView log_in_button;

    protected boolean isLoading = false;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.login_page);

        accountViewModel = new AccountViewModel();
        customerViewModel = new CustomerViewModel();



        email_input = findViewById(R.id.emailInput);
        password_input  = findViewById(R.id.passwordInput);

        log_in_button = findViewById(R.id.loginButton);
        sign_up_button = findViewById(R.id.signupLinkTextView);
        checkLoginStatus();


        log_in_button.setOnClickListener(v->login());
        sign_up_button.setOnClickListener(v->signUp());
    }

    private void checkLoginStatus () {
        log_in_button.setText("Verifying...");


        if (PreferencesHelper.getAccessToken() != "") {
            customerViewModel.getCustomer(PreferencesHelper.getCustomerData().getCustomerId()).observe(this, new Observer<Customer>() {
                @Override
                public void onChanged(Customer customer) {
                    if (customer != null) {
                        // Navigate to HomePage if login is successful
                        Intent intent = new Intent(LoginPage.this, HomePage.class);
                        startActivity(intent);
                        finish();
                    } else {
                        // Show error message if login failed
                        Toast.makeText(LoginPage.this, "Please login", Toast.LENGTH_SHORT).show();
                    }
                    log_in_button.setText("Login");
                }
            });
        }
        log_in_button.setText("Login");
    }


    private void login() {
        if(log_in_button.getText().toString().equals("Verifying...")) return;
        String email = email_input.getText().toString().trim();
        String password = password_input.getText().toString().trim();

        if (email.isEmpty() || password.isEmpty()) {
            Toast.makeText(this, "Please fill in both fields", Toast.LENGTH_SHORT).show();
            return;
        }

        log_in_button.setText("Verifying...");

        accountViewModel.login(email, password).observe(this, authenticated -> {
            if (authenticated == null) {
                return;
            }

            if (authenticated) {
                Toast.makeText(this, "Welcome "+ PreferencesHelper.getCustomerData().getUsername(), Toast.LENGTH_SHORT).show();
                Intent intent = new Intent(LoginPage.this, HomePage.class);
                startActivity(intent);
                finish();
            } else {
                Toast.makeText(this, "Could not verify account please check email or password", Toast.LENGTH_SHORT).show();
            }
            log_in_button.setText("Login");
        });
    }



    private void signUp() {
        sign_up_button.setPaintFlags(sign_up_button.getPaintFlags() |   Paint.UNDERLINE_TEXT_FLAG);

        Intent intent = new Intent(LoginPage.this,SignUpPage.class);
        startActivity(intent);
    }

}
