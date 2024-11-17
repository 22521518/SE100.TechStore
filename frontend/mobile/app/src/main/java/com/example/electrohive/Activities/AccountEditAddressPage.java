package com.example.electrohive.Activities;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AppCompatActivity;

import com.example.electrohive.Models.Address;
import com.example.electrohive.Models.District;
import com.example.electrohive.Models.Province;
import com.example.electrohive.Models.Ward;
import com.example.electrohive.R;

public class AccountEditAddressPage extends AppCompatActivity {

    private EditText address_location;

    private EditText address_fullname;
    private EditText address_phonenumber;
    private EditText address_address;

    private Address address;
    private TextView save_address_button;
    private final ActivityResultLauncher<Intent> resultLauncher = registerForActivityResult (
            new ActivityResultContracts.StartActivityForResult(),
            result -> {
                if (result.getResultCode() == RESULT_OK) {
                    Intent data =result.getData();
                    if (data != null) {
                        Ward resultWard = (Ward) data.getSerializableExtra("WARD");
                        District resultDistrict = (District) data.getSerializableExtra("DISTRICT");
                        Province resultProvince = (Province) data.getSerializableExtra("PROVINCE");
                        String finalAddress =   resultWard.getWardName() +", "+ resultDistrict.getDistrictName() +", "+ resultProvince.getProvinceName();

                        address_location.setText(finalAddress);
                    }

                }
            });

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.account_edit_address_page);

        ImageButton backButton = findViewById(R.id.backbutton);
        backButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });

        Intent intent = getIntent();

        address = (Address) intent.getSerializableExtra("ADDRESS");

        address_fullname = findViewById(R.id.address_fullname);
        address_phonenumber = findViewById(R.id.address_phonenumber);
        address_address = findViewById(R.id.address_address);
        address_location = findViewById(R.id.address_location);

        address_fullname.setText(address.getFullName());
        address_phonenumber.setText(address.getPhoneNumber());
        address_location.setText(address.getWard()+", "+address.getDistrict()+", "+address.getCity());
        address_address.setText(address.getAddress());

        address_location.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(AccountEditAddressPage.this, ProvincePage.class);

                resultLauncher.launch(intent);
            }
        });

        save_address_button = findViewById(R.id.save_address_button);
        save_address_button.setOnClickListener(v->updateAddress());

    }

    private void updateAddress() {
            // Get the input values
            String location = address_location.getText().toString().trim();
            String fullName = address_fullname.getText().toString().trim();
            String phoneNumber = address_phonenumber.getText().toString().trim();
            String addressText = address_address.getText().toString().trim();

            // Validate that all required fields are filled
            if (location.isEmpty() || fullName.isEmpty() || phoneNumber.isEmpty() || addressText.isEmpty()) {
                // Show a Toast message to the user
                Toast.makeText(AccountEditAddressPage.this, "Please fill out all fields", Toast.LENGTH_SHORT).show();
                return;  // Don't save if any field is empty
            }

            // If all fields are filled, proceed to update the address
            String city = location.split(", ")[2];
            String district = location.split(", ")[1];
            String ward = location.split(", ")[0];

            // Update the address object
            address.setFullName(fullName);
            address.setPhoneNumber(phoneNumber);
            address.setCity(city);
            address.setDistrict(district);
            address.setWard(ward);
            address.setAddress(addressText);

            // Return the updated address back to the calling activity
            Intent intent = new Intent();
            intent.putExtra("UPDATED_ADDRESS", address);
            setResult(RESULT_OK, intent);

            // Finish the activity to return to the previous screen
            finish();
    }


}
