package com.example.electrohive.Activities;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.Observer;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.electrohive.Adapters.AddressAdapter;
import com.example.electrohive.Adapters.OrderAdapter;
import com.example.electrohive.Models.Address;
import com.example.electrohive.Models.Order;
import com.example.electrohive.R;
import com.example.electrohive.ViewModel.AddressViewModel;
import com.example.electrohive.utils.PreferencesHelper;

import org.w3c.dom.Text;

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
                        addressViewModel.updateAddress(updatedAddress).observe(this,address -> {
                            if(address) {
                                Toast.makeText(this,"Address updated",Toast.LENGTH_SHORT).show();
                            } else {
                                Toast.makeText(this,"Failed to update address",Toast.LENGTH_SHORT).show();
                            }
                        });  // Assuming you have a method in your ViewModel to update the address
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
                        addressViewModel.addAddress(updatedAddress).observe(this,address -> {
                            if(address) {
                                Toast.makeText(this,"Address added",Toast.LENGTH_SHORT).show();
                            } else {
                                Toast.makeText(this,"Failed to add address",Toast.LENGTH_SHORT).show();
                            }
                        });  // Assuming you have a method in your ViewModel to update the address
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
        addressAdapter = new AddressAdapter(AccountAddressPage.this,new ArrayList<>(),updateAddressLauncher);
        addressRecyclerView.setAdapter(addressAdapter);


        // Observe orders LiveData
        addressViewModel.getAddress().observe(this, new Observer<List<Address>>() {
            @Override
            public void onChanged(List<Address> addresses) {
                if (addresses != null) {
                    addressAdapter.updateAddress(addresses);
                }
                loadingSpinner.setVisibility(View.GONE);

            }
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
                Intent intent = new Intent(AccountAddressPage.this,AccountAddAddressPage.class);
                addAddressLauncher.launch(intent);
            }
        });
    }


}
