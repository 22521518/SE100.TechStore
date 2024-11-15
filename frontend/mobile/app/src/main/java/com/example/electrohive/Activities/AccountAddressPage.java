package com.example.electrohive.Activities;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.TextView;

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

import org.w3c.dom.Text;

import java.util.ArrayList;
import java.util.List;

public class AccountAddressPage extends AppCompatActivity {

    private TextView userAddressAddAddressButton;

    private AddressViewModel addressViewModel;
    private AddressAdapter addressAdapter;

    private final ActivityResultLauncher<Intent> resultLauncher = registerForActivityResult(
            new ActivityResultContracts.StartActivityForResult(),
            result -> {
                if (result.getResultCode() == RESULT_OK) {
                    // Handle the result here, for example, refresh the address list
                    Intent data = result.getData();
                    if (data != null) {
                        Address updatedAddress = (Address) data.getSerializableExtra("UPDATED_ADDRESS");
                        // You can update the address list or refresh the UI
                        addressViewModel.updateAddress(updatedAddress);  // Assuming you have a method in your ViewModel to update the address
                    }
                }
            }
    );

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.account_address_page);

        addressViewModel = new AddressViewModel();

        RecyclerView ordersRecyclerView = findViewById(R.id.address_listview);  // Ensure this ID exists in your layout XML
        ordersRecyclerView.setLayoutManager(new LinearLayoutManager(this));
        // Set up adapter
        addressAdapter = new AddressAdapter(getApplicationContext(),new ArrayList<>(),resultLauncher);
        ordersRecyclerView.setAdapter(addressAdapter);

        // Observe orders LiveData
        addressViewModel.getAddress("userId_here").observe(this, new Observer<List<Address>>() {
            @Override
            public void onChanged(List<Address> addresses) {
                if (addresses != null) {
                    addressAdapter.updateAddress(addresses);
                }
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
                startActivity(intent);
            }
        });
    }
}
