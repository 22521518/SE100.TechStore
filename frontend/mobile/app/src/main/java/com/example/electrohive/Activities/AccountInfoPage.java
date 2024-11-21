package com.example.electrohive.Activities;

import android.app.DatePickerDialog;
import android.content.Intent;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.RadioButton;
import android.widget.TextView;

import androidx.activity.EdgeToEdge;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import com.bumptech.glide.Glide;
import com.example.electrohive.Models.Customer;
import com.example.electrohive.R;
import com.example.electrohive.utils.PreferencesHelper;
import com.example.electrohive.utils.format.Format;

import java.io.IOException;
import java.util.Calendar;

public class AccountInfoPage extends AppCompatActivity {
    private ImageView userInfoImage;
    private TextView userInfoChangePhotoButton;

    private ActivityResultLauncher<Intent> imagePickerLauncher;
    private EditText birthDateInput;
    private EditText lastnameInput;
    private EditText firstnameInput;
    private EditText usernameInput;
    private EditText phonenumberInput;

    private RadioButton radioMale;

    private RadioButton radioFemale;
    private Customer sessionCustomer;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.account_info_page);

        sessionCustomer = PreferencesHelper.getCustomerData();

        ImageButton backButton = findViewById(R.id.backbutton);
        backButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });

        birthDateInput = findViewById(R.id.birthDateInput);
        lastnameInput = findViewById(R.id.lastnameInput);
        firstnameInput = findViewById(R.id.firstnameInput);
        phonenumberInput = findViewById(R.id.phonenumberInput);
        radioFemale = findViewById(R.id.radioFemale);
        radioMale = findViewById(R.id.radioMale);
        userInfoImage = findViewById(R.id.userInfoImage);
        userInfoChangePhotoButton = findViewById(R.id.userInfoChangePhotoButton);

        Glide.with(AccountInfoPage.this)
                .load(sessionCustomer.getImage()) // URL to the image
                .placeholder(R.drawable.ic_user_icon) // Optional placeholder
                .error(R.drawable.ic_image_error_icon) // Optional error image
                .into(userInfoImage); // Your ImageView

        String fullName = sessionCustomer.getFullName();
        String[] nameParts = fullName.split("\\s+"); // This splits by one or more spaces

        if (nameParts.length > 1) {
            // Assuming the first part is the first name and the last part is the last name
            firstnameInput.setText(nameParts[0]); // First name
            lastnameInput.setText(nameParts[nameParts.length - 1]); // Last name (last part)
        } else {
            // In case the full name is just one word (single name)
            firstnameInput.setText(nameParts[0]);
            lastnameInput.setText(""); // If no last name exists, you can leave this empty
        }

        phonenumberInput.setText(sessionCustomer.getPhoneNumber());

        birthDateInput.setText(sessionCustomer.getBirthDate().toString());

        if(sessionCustomer.getMale()) {
            radioMale.setChecked(true);
        } else {
            radioFemale.setChecked(true);
        }

        // Initialize the image picker launcher
        imagePickerLauncher = registerForActivityResult(
                new ActivityResultContracts.StartActivityForResult(),
                result -> {
                    if (result.getResultCode() == RESULT_OK) {
                        Intent data = result.getData();
                        if (data != null && data.getData() != null) {
                            Uri imageUri = data.getData();
                            try {
                                Bitmap bitmap = MediaStore.Images.Media.getBitmap(this.getContentResolver(), imageUri);
                                userInfoImage.setImageBitmap(bitmap);
                            } catch (IOException e) {
                                e.printStackTrace();
                            }
                        }
                    }
                }
        );

        userInfoChangePhotoButton.setOnClickListener(v -> openImagePicker());

        // Set an OnClickListener to open the date picker when the birth date field is tapped
        birthDateInput.setOnClickListener(v -> showDatePickerDialog());
    }

    private void openImagePicker() {
        Intent intent = new Intent();
        intent.setType("image/*");
        intent.setAction(Intent.ACTION_GET_CONTENT);
        imagePickerLauncher.launch(Intent.createChooser(intent, "Select Picture"));
    }

    private void showDatePickerDialog() {
        // Get the current date to set as default in the date picker
        final Calendar calendar = Calendar.getInstance();
        int year = calendar.get(Calendar.YEAR);
        int month = calendar.get(Calendar.MONTH);
        int day = calendar.get(Calendar.DAY_OF_MONTH);

        // Create and show the DatePickerDialog
        DatePickerDialog datePickerDialog = new DatePickerDialog(
                this,
                (view, selectedYear, selectedMonth, selectedDay) -> {
                    // Format and set the selected date
                    String selectedDate = selectedDay + "/" + (selectedMonth + 1) + "/" + selectedYear;
                    birthDateInput.setText(selectedDate);
                },
                year, month, day
        );

        datePickerDialog.show();
    }
}