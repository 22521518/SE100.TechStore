package com.example.electrohive.Activities;

import android.content.Intent;
import android.content.SharedPreferences;
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

public class LoginPage extends AppCompatActivity {
    private TextView sign_up_button;

    private EditText email_input;

    private EditText password_input;

    private AccountViewModel accountViewModel;

    private CustomerViewModel customerViewModel;

    protected TextView log_in_button;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.login_page);

        accountViewModel = new AccountViewModel();
        customerViewModel = new CustomerViewModel();

        email_input = findViewById(R.id.emailInput);
        password_input  = findViewById(R.id.passwordInput);

        log_in_button = findViewById(R.id.loginButton);
        sign_up_button = findViewById(R.id.signupLinkTextView);

        log_in_button.setOnClickListener(v->login());
        sign_up_button.setOnClickListener(v->signUp());
    }

    private void checkLoginStatus () {
        SharedPreferences preferences = getSharedPreferences("user_prefs", MODE_PRIVATE);
        String savedCustomerId = preferences.getString("customer_id", null);

        if (savedCustomerId != null) {
            customerViewModel.getCustomer(savedCustomerId).observe(this, new Observer<Customer>() {
                @Override
                public void onChanged(Customer customer) {
                    if (customer != null) {

                        // Navigate to HomePage if login is successful
                        Intent intent = new Intent(LoginPage.this, HomePage.class);
                        startActivity(intent);
                        finish();
                    } else {
                        // Show error message if login failed
                        Toast.makeText(LoginPage.this, "Fail to fetch user", Toast.LENGTH_SHORT).show();
                    }
                }
            });
        }
    }


    private void login() {
        String email = email_input.getText().toString().trim();
        String password = password_input.getText().toString().trim();

        if (email.isEmpty() || password.isEmpty()) {
            // Notify the user to fill all fields
            Toast.makeText(this, "Please fill in both fields", Toast.LENGTH_SHORT).show();
            return;
        }

        accountViewModel.login(email, password).observe(this, new Observer<Boolean>() {
            @Override
            public void onChanged(Boolean authenticated) {
                if (authenticated) {
                    // Navigate to HomePage if login is successful
                    Intent intent = new Intent(LoginPage.this, HomePage.class);
                    startActivity(intent);
                    finish();
                } else {
                    // Show error message if login failed
                    Toast.makeText(LoginPage.this, "Invalid email or password", Toast.LENGTH_SHORT).show();
                }
            }
        });

    }


    private void signUp() {
        Intent intent = new Intent(LoginPage.this,SignUpPage.class);
        startActivity(intent);
    }

}
