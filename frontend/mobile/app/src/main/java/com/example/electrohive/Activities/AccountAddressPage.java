package com.example.electrohive.Activities;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.ImageButton;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.electrohive.Adapters.AddressAdapter;
import com.example.electrohive.Models.Address;
import com.example.electrohive.R;
import com.example.electrohive.ViewModel.AddressViewModel;

import java.util.ArrayList;
import java.util.List;

public class AccountAddressPage extends AppCompatActivity {
    private ProgressBar loadingSpinner;

    private TextView userAddressAddAddressButton;

    private AddressViewModel addressViewModel;
    private AddressAdapter addressAdapter;

    private final ActivityResultLauncher<Intent> updateAddressLauncher = registerForActivityResult(
            new ActivityResultContracts.StartActivityForResult(),
            result -> {
                if (result.getResultCode() == RESULT_OK) {
                    // Handle the result here, for example, refresh the address list
                    Intent data = result.getData();
                    if (data != null) {
                        Address updatedAddress = (Address) data.getSerializableExtra("UPDATED_ADDRESS");
                        // You can update the address list or refresh the UI
                        addressViewModel.updateAddress(updatedAddress).observe(this, apiResponse -> {
                            if (apiResponse != null && apiResponse.isSuccess()) {
                                // Address update successful
                                boolean success = apiResponse.getData(); // Get the success flag
                                if (success) {
                                    Toast.makeText(this, "Address updated", Toast.LENGTH_SHORT).show();
                                } else {
                                    // If the API returned a failure flag
                                    Toast.makeText(this, "Failed to update address", Toast.LENGTH_SHORT).show();
                                }
                            } else {
                                // Handle failure or error response
                                String errorMessage = apiResponse != null ? apiResponse.getMessage() : "An error occurred while updating the address.";
                                Toast.makeText(this, errorMessage, Toast.LENGTH_SHORT).show();
                            }
                        });

                    }
                }
            }
    );

    private final ActivityResultLauncher<Intent> addAddressLauncher = registerForActivityResult(
            new ActivityResultContracts.StartActivityForResult(),
            result -> {
                if (result.getResultCode() == RESULT_OK) {
                    // Handle the result here, for example, refresh the address list
                    Intent data = result.getData();
                    if (data != null) {
                        Address updatedAddress = (Address) data.getSerializableExtra("NEW_ADDRESS");
                        // You can update the address list or refresh the UI
                        addressViewModel.addAddress(updatedAddress).observe(this, apiResponse -> {
                            if (apiResponse != null && apiResponse.isSuccess()) {
                                // Address added successfully
                                boolean success = apiResponse.getData(); // Get the success flag
                                if (success) {
                                    Toast.makeText(this, "Address added", Toast.LENGTH_SHORT).show();
                                } else {
                                    // If the API returned a failure flag
                                    Toast.makeText(this, "Failed to add address", Toast.LENGTH_SHORT).show();
                                }
                            } else {
                                // Handle failure or error response
                                String errorMessage = apiResponse != null ? apiResponse.getMessage() : "An error occurred while adding the address.";
                                Toast.makeText(this, errorMessage, Toast.LENGTH_SHORT).show();
                            }
                        });

                    }
                }
            }
    );

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.account_address_page);

        addressViewModel = new AddressViewModel();

        loadingSpinner = findViewById(R.id.loading_spinner);

        RecyclerView addressRecyclerView = findViewById(R.id.address_listview);  // Ensure this ID exists in your layout XML
        addressRecyclerView.setLayoutManager(new LinearLayoutManager(this));

        loadingSpinner.setVisibility(View.VISIBLE);
        // Set up adapter
        addressAdapter = new AddressAdapter(AccountAddressPage.this, new ArrayList<>(), updateAddressLauncher , addressViewModel);
        addressRecyclerView.setAdapter(addressAdapter);


        // Observe address LiveData
        addressViewModel.getAddress().observe(this, apiResponse -> {
            if (apiResponse != null && apiResponse.isSuccess()) {
                // Check if the API call was successful
                List<Address> addresses = apiResponse.getData();
                if (addresses != null) {
                    addressAdapter.updateAddress(addresses);  // Update the adapter with the new address list
                }

            } else {
                // Handle failure case (e.g., API call failed)

                Toast.makeText(getApplicationContext(), "Failed to fetch addresses", Toast.LENGTH_SHORT).show();
            }

            // Hide the loading spinner once the response is processed
            loadingSpinner.setVisibility(View.GONE);
        });


        ImageButton backButton = findViewById(R.id.backbutton);
        backButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });

        userAddressAddAddressButton = findViewById(R.id.userAddressAddAddressButton);
        userAddressAddAddressButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(AccountAddressPage.this, AccountAddAddressPage.class);
                addAddressLauncher.launch(intent);
            }
        });
    }


}
