package com.example.electrohive.Activities;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.example.electrohive.R;
import com.example.electrohive.ViewModel.AccountViewModel;
import com.example.electrohive.utils.PreferencesHelper;

public class AccountChangePasswordPage extends AppCompatActivity {

    private AccountViewModel accountViewModel;

    private EditText currentPassword;
    private EditText newPassword;
    private EditText confirmPassword;
    private TextView changePasswordButton;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.account_change_password_page);

        ImageButton backButton = findViewById(R.id.backbutton);
        backButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });

        accountViewModel = new AccountViewModel();

        currentPassword = findViewById(R.id.current_password);
        newPassword = findViewById(R.id.new_password);
        confirmPassword = findViewById(R.id.confirm_password);
        changePasswordButton = findViewById(R.id.change_password);

        changePasswordButton.setOnClickListener(v -> changePassword());
    }

    private void changePassword() {
        String currentPwd = currentPassword.getText().toString().trim();
        String newPwd = newPassword.getText().toString().trim();
        String confirmPwd = confirmPassword.getText().toString().trim();

        if (TextUtils.isEmpty(currentPwd)||TextUtils.isEmpty(newPwd)||TextUtils.isEmpty(confirmPwd)) {
            Toast.makeText(this, "Please fill out all fields", Toast.LENGTH_SHORT).show();
            return;
        }

        if (newPwd.length() < 8) {
            Toast.makeText(this, "New password must be at least 8 characters long", Toast.LENGTH_SHORT).show();
            return;
        }

        if (!newPwd.equals(confirmPwd)) {
            Toast.makeText(this, "New password and confirm password do not match", Toast.LENGTH_SHORT).show();
            return;
        }

        // Proceed with changing the password using ViewModel or backend API
        accountViewModel.changePassword(currentPwd, newPwd).observe(this, apiResponse -> {
            if (apiResponse != null && apiResponse.isSuccess()) {
                // Password change successful
                boolean success = apiResponse.getData(); // Get the success flag
                if (success) {
                    Toast.makeText(this, "Password changed successfully, please log in again", Toast.LENGTH_LONG).show();
                    signOut(); // Log the user out after a successful password change
                } else {
                    // If the API returned a failure flag
                    Toast.makeText(this, "Failed to change password", Toast.LENGTH_SHORT).show();
                }
            } else {
                // Handle failure or error response
                String errorMessage = apiResponse != null ? apiResponse.getMessage() : "An error occurred while changing password.";
                Toast.makeText(this, errorMessage, Toast.LENGTH_SHORT).show();
            }
        });


    }
    private void signOut() {

        PreferencesHelper.clear();

        Intent intent = new Intent(AccountChangePasswordPage.this, LoginPage.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        startActivity(intent);
        finish(); // Ends the current activity
    }
}
