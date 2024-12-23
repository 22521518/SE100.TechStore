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
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import com.bumptech.glide.Glide;
import com.example.electrohive.Models.Customer;
import com.example.electrohive.R;
import com.example.electrohive.ViewModel.CustomerViewModel;
import com.example.electrohive.utils.PreferencesHelper;
import com.example.electrohive.utils.format.Format;

import java.io.IOException;
import java.util.Calendar;
import java.util.Date;

import retrofit2.http.Body;

public class AccountInfoPage extends AppCompatActivity {
    private ImageView userInfoImage;
    private TextView userInfoChangePhotoButton;
    private TextView updateCustomerButton;

    private ActivityResultLauncher<Intent> imagePickerLauncher;
    private EditText birthDateInput;
    private EditText lastnameInput;
    private EditText firstnameInput;
    private EditText usernameInput;
    private EditText phonenumberInput;

    private RadioButton radioMale;

    private RadioButton radioFemale;
    private Customer SessionCustomer;

    private CustomerViewModel customerViewModel = CustomerViewModel.getInstance();

    private String imageUrl="";


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.account_info_page);

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
        usernameInput = findViewById(R.id.usernameInput);
        phonenumberInput = findViewById(R.id.phonenumberInput);
        radioFemale = findViewById(R.id.radioFemale);
        radioMale = findViewById(R.id.radioMale);
        userInfoImage = findViewById(R.id.userInfoImage);
        userInfoChangePhotoButton = findViewById(R.id.userInfoChangePhotoButton);
        updateCustomerButton = findViewById(R.id.updateCustomerButton);

        customerViewModel.getSessionCustomer().observe(this,sessionCustomer -> {
            SessionCustomer=sessionCustomer;
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

            usernameInput.setText(sessionCustomer.getUsername());
            phonenumberInput.setText(sessionCustomer.getPhoneNumber());

            Object birthDateObject = sessionCustomer.getBirthDate();  // This returns an Object

            if (birthDateObject != null) {
                String formattedDate = null;

                // Check if the object is a Date
                if (birthDateObject instanceof Date) {
                    formattedDate = Format.getFormattedDate((Date) birthDateObject);
                } else if (birthDateObject instanceof String) {
                    // If it's a String, try parsing it
                    formattedDate = Format.getFormattedDateFromString((String) birthDateObject);
                }

                // Set the formatted date to the EditText
                if (formattedDate != null) {
                    birthDateInput.setText(formattedDate);
                }
            }

            if(sessionCustomer.getMale()) {
                radioMale.setChecked(true);
            } else {
                radioFemale.setChecked(true);
            }
        });


        // Updated imagePickerLauncher
        imagePickerLauncher = registerForActivityResult(
                new ActivityResultContracts.StartActivityForResult(),
                result -> {
                    if (result.getResultCode() == RESULT_OK) {
                        Intent data = result.getData();
                        if (data != null && data.getData() != null) {
                            Uri imageUri = data.getData();
                            try {
                                // Get the Bitmap from the URI
                                Bitmap bitmap = MediaStore.Images.Media.getBitmap(this.getContentResolver(), imageUri);
                                userInfoImage.setImageBitmap(bitmap); // Display the image in the ImageView

                                // Convert Bitmap to Base64
                                imageUrl = Format.encodeImageToBase64(bitmap);

                                // Example: You can now use base64Image as needed, like sending it to the server
                                Toast.makeText(this, "Image converted to Base64!", Toast.LENGTH_SHORT).show();

                            } catch (IOException e) {
                                e.printStackTrace();
                                Toast.makeText(this, "Failed to load image!", Toast.LENGTH_SHORT).show();
                            }
                        }
                    }
                }
        );

        userInfoChangePhotoButton.setOnClickListener(v -> openImagePicker());
        updateCustomerButton.setOnClickListener(v->updateCustomer());
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

    private void updateCustomer() {
        if (SessionCustomer == null) {
            Toast.makeText(this, "Customer data is not loaded. Please try again later.", Toast.LENGTH_SHORT).show();
            return;
        }
        if(updateCustomerButton.getText().toString().equals("Updating...")) return ;

        // Get inputs
        String firstName = firstnameInput.getText().toString().trim();
        String lastName = lastnameInput.getText().toString().trim();
        String fullName = firstName+" "+lastName;
        String username = usernameInput.getText().toString().trim();
        String phoneNumber = phonenumberInput.getText().toString().trim();
        String birthDate = Format.formatToISO8601(birthDateInput.getText().toString().trim());
        Boolean male = radioMale.isChecked();

        // Check for empty fields
        if (firstName.isEmpty() || lastName.isEmpty() || username.isEmpty() || phoneNumber.isEmpty() || birthDate.isEmpty()) {
            Toast.makeText(this, "Please fill in all fields!", Toast.LENGTH_SHORT).show();
            return;
        }
        // Check for empty fields
        if (phoneNumber.length()!=10) {
            Toast.makeText(this, "Phone number must be exact 10 digits", Toast.LENGTH_SHORT).show();
            return;
        }


        updateCustomerButton.setText("Updating...");




        SessionCustomer.setUsername(username);
        SessionCustomer.setFullName(fullName);
        SessionCustomer.setPhoneNumber(phoneNumber);
        SessionCustomer.setImage(imageUrl);
        SessionCustomer.setBirthDate(birthDate);
        SessionCustomer.setMale(male);


        customerViewModel.updateCustomer(SessionCustomer).observe(this, apiResponse -> {
            if (apiResponse != null && apiResponse.isSuccess()) {
                // If the response is successful
                boolean success = apiResponse.getData() !=null; // Get the success flag
                if (success) {
                    Toast.makeText(this, "Account information updated successfully!", Toast.LENGTH_SHORT).show();
                } else {
                    Toast.makeText(this, "Failed to update account information. Please try again.", Toast.LENGTH_SHORT).show();
                }
            } else {
                // Handle failure or error response
                String errorMessage = apiResponse != null ? apiResponse.getMessage() : "An error occurred while updating the account.";
                Toast.makeText(this, errorMessage, Toast.LENGTH_SHORT).show();
            }
            updateCustomerButton.setText("Save changes"); // Reset the button text
        });

    }

}