package com.example.electrohive.Activities;

import android.app.DatePickerDialog;
import android.content.Intent;
import android.graphics.Paint;
import android.os.Bundle;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.example.electrohive.Models.Account;
import com.example.electrohive.Models.Customer;
import com.example.electrohive.R;
import com.example.electrohive.ViewModel.CustomerViewModel;
import com.example.electrohive.utils.format.Format;

import java.util.Calendar;

public class SignUpPage extends AppCompatActivity {
    protected TextView log_in_button, sign_up_button;
    protected EditText firstNameInput, lastNameInput, birthDateInput, usernameInput, phoneNumberInput,emailInput, passwordInput, confirmPasswordInput;
    protected RadioGroup genderRadioGroup;
    protected RadioButton maleRadioButton, femaleRadioButton;

    protected CustomerViewModel customerViewModel = CustomerViewModel.getInstance();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.signup_page);

        // Assign all views
        firstNameInput = findViewById(R.id.fistNameInput);
        lastNameInput = findViewById(R.id.lastNameInput);
        birthDateInput = findViewById(R.id.birthDateInput);
        usernameInput = findViewById(R.id.usernameInput);
        phoneNumberInput = findViewById(R.id.phoneNumberInput);
        emailInput = findViewById(R.id.emailInput);
        passwordInput = findViewById(R.id.passwordInput);
        confirmPasswordInput = findViewById(R.id.confirmPasswordInput);

        genderRadioGroup = findViewById(R.id.radioGroup);
        maleRadioButton = findViewById(R.id.radioMale);
        femaleRadioButton = findViewById(R.id.radioFemale);

        log_in_button = findViewById(R.id.loginBackLinkTextView);
        sign_up_button = findViewById(R.id.signupButton);

        sign_up_button.setOnClickListener(v->signUp());
        // Set listener for Sign In link
        log_in_button.setOnClickListener(v -> signIn());

        // Set DatePicker for birth date input
        birthDateInput.setOnClickListener(v -> showDatePickerDialog());
    }

    private void signUp() {
        if(sign_up_button.getText().toString().equals("Signing up...")) return;
        String email = emailInput.getText().toString().trim();
        String password = passwordInput.getText().toString().trim();
        String confirmPassword = confirmPasswordInput.getText().toString().trim();
        String firstName = firstNameInput.getText().toString().trim();
        String lastName = lastNameInput.getText().toString().trim();
        String birthDate = Format.formatToISO8601(birthDateInput.getText().toString().trim()); // Assuming the date is a String

        String username = String.join("_", usernameInput.getText().toString().trim().split(" "));
        String phoneNumber = phoneNumberInput.getText().toString().trim(); // Assuming the date is a String
        String fullName = firstName + " " + lastName; // Combine first and last name
        String dateJoined = Calendar.getInstance().getTime().toString(); // Current date as a String

        // Check if any input field is empty
        if (firstName.isEmpty() ||
                lastName.isEmpty() ||
                birthDate.isEmpty() ||
                username.isEmpty() ||
                email.isEmpty() ||
                password.isEmpty() ||
                confirmPassword.isEmpty()) {

            Toast.makeText(this, "Please fill in all the fields!", Toast.LENGTH_SHORT).show();
            return;
        }

        // Check if the email is valid
        if (!android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            Toast.makeText(this, "Please enter a valid email address!", Toast.LENGTH_SHORT).show();
            return;
        }

        if (phoneNumber.length()!=10) {
            Toast.makeText(this, "Phone number must be exact 10 digits", Toast.LENGTH_SHORT).show();
            return;
        }

        // Check if passwords match and meet the length requirement
        if (password.length() < 8) {
            Toast.makeText(this, "Password must be at least 8 characters long!", Toast.LENGTH_SHORT).show();
            return;
        }

        if (!password.equals(confirmPassword)) {
            Toast.makeText(this, "Passwords do not match!", Toast.LENGTH_SHORT).show();
            return;
        }

        sign_up_button.setText("Signing up...");
        Account newAccount = new Account(email, password);

        Customer newCustomer = new Customer("", "", username, fullName, phoneNumber, "", birthDate, dateJoined);
        newCustomer.setMale(maleRadioButton.isChecked());

        // Assuming `customerViewModel.signUp` exists and is correctly implemented
        customerViewModel.signUp(
                newAccount, newCustomer
        ).observe(this, response  -> {
            if (response != null) {
                if (response.isSuccess()) {
                    // Successfully signed up
                    Toast.makeText(SignUpPage.this, "Account created successfully", Toast.LENGTH_SHORT).show();
                    Intent intent = new Intent(SignUpPage.this, LoginPage.class);
                    startActivity(intent);
                } else {
                    // Failed to sign up, show error message
                    Toast.makeText(SignUpPage.this, response.getMessage(), Toast.LENGTH_SHORT).show();
                }
            } else {
                // Network or other issues
                Toast.makeText(SignUpPage.this, "An error occurred. Please try again.", Toast.LENGTH_SHORT).show();
            }
        });
    }

    // Method to open the Login page
    private void signIn() {
        log_in_button.setPaintFlags(log_in_button.getPaintFlags() |   Paint.UNDERLINE_TEXT_FLAG);

        Intent intent = new Intent(SignUpPage.this, LoginPage.class);
        startActivity(intent);
    }

    // Method to show the DatePickerDialog
    private void showDatePickerDialog() {
        Calendar calendar = Calendar.getInstance();
        int year = calendar.get(Calendar.YEAR);
        int month = calendar.get(Calendar.MONTH);
        int day = calendar.get(Calendar.DAY_OF_MONTH);

        DatePickerDialog datePickerDialog = new DatePickerDialog(
                SignUpPage.this,
                (view, selectedYear, selectedMonth, selectedDay) -> {
                    // Update the birthDateInput with the selected date
                    String selectedDate = selectedDay + "/" + (selectedMonth + 1) + "/" + selectedYear;
                    birthDateInput.setText(selectedDate);
                },
                year, month, day);

        datePickerDialog.show();
    }
}
