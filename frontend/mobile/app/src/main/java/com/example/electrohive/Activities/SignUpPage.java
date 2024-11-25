package com.example.electrohive.Activities;

import android.app.DatePickerDialog;
import android.content.Intent;
import android.os.Bundle;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.example.electrohive.R;

import java.util.Calendar;

public class SignUpPage extends AppCompatActivity {
    protected TextView log_in_button;
    protected EditText firstNameInput, lastNameInput, birthDateInput, usernameInput, emailInput, passwordInput, confirmPasswordInput;
    protected RadioGroup genderRadioGroup;
    protected RadioButton maleRadioButton, femaleRadioButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.signup_page);

        // Assign all views
        firstNameInput = findViewById(R.id.fistNameInput);
        lastNameInput = findViewById(R.id.lastNameInput);
        birthDateInput = findViewById(R.id.birthDateInput);
        usernameInput = findViewById(R.id.usernameInput);
        emailInput = findViewById(R.id.emailInput);
        passwordInput = findViewById(R.id.passwordInput);
        confirmPasswordInput = findViewById(R.id.confirmPasswordInput);

        genderRadioGroup = findViewById(R.id.radioGroup);
        maleRadioButton = findViewById(R.id.radioMale);
        femaleRadioButton = findViewById(R.id.radioFemale);

        log_in_button = findViewById(R.id.loginBackLinkTextView);

        // Set listener for Sign In link
        log_in_button.setOnClickListener(v -> signIn());

        // Set DatePicker for birth date input
        birthDateInput.setOnClickListener(v -> showDatePickerDialog());
    }

    // Method to open the Login page
    private void signIn() {
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
