package com.example.electrohive.Activities;

import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.ImageButton;
import android.widget.ProgressBar;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.Observer;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.electrohive.Adapters.VoucherAdapter;
import com.example.electrohive.Models.Voucher;
import com.example.electrohive.R;
import com.example.electrohive.ViewModel.VoucherViewModel;
import com.example.electrohive.utils.generator.MockVoucher;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class AccountVoucherPage extends AppCompatActivity {

    private ProgressBar loadingSpinner;
    private VoucherViewModel voucherViewModel;

    private List<Voucher> vouchers;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.account_vouchers_page);

        loadingSpinner = findViewById(R.id.loading_spinner);
        loadingSpinner.setVisibility(View.VISIBLE);
        // Initialize the RecyclerView
        RecyclerView voucherRecyclerView = findViewById(R.id.voucher_listview);
        voucherRecyclerView.setLayoutManager(new LinearLayoutManager(this));

        // Create test data
        voucherViewModel = new VoucherViewModel();

        // Set the adapter with mock data
        VoucherAdapter voucherAdapter = new VoucherAdapter(new ArrayList<>());
        voucherRecyclerView.setAdapter(voucherAdapter);

        // Handle back button click
        ImageButton backButton = findViewById(R.id.backbutton);
        backButton.setOnClickListener(v -> finish());

        // Observe the LiveData from the ViewModel
        voucherViewModel.getVouchers().observe(this, apiResponse -> {
            if (apiResponse != null && apiResponse.isSuccess()) {
                // Check if the response is successful
                List<Voucher> vouchers = apiResponse.getData();
                if (vouchers != null) {
                    // Update the adapter with new data
                    voucherAdapter.updateVouchers(vouchers);  // Method to update the adapter data
                }
            } else {
                // Handle failure or error response (optional)
                String errorMessage = apiResponse != null ? apiResponse.getMessage() : "An error occurred while fetching vouchers.";
                Log.e("VoucherViewModel", errorMessage);
            }
            loadingSpinner.setVisibility(View.GONE);  // Hide the loading spinner
        });

    }

    // Method to create mock voucher data

}
