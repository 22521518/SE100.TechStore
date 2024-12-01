package com.example.electrohive.Activities;

import android.os.Bundle;
import android.view.View;
import android.widget.ImageButton;
import android.widget.ProgressBar;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.Observer;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.electrohive.Adapters.PaymentVoucherAdapter;
import com.example.electrohive.Adapters.VoucherAdapter;
import com.example.electrohive.Models.Voucher;
import com.example.electrohive.R;
import com.example.electrohive.ViewModel.VoucherViewModel;
import com.example.electrohive.utils.generator.MockVoucher;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class PaymentVoucherPage extends AppCompatActivity {

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
        PaymentVoucherAdapter voucherAdapter = new PaymentVoucherAdapter(new ArrayList<>());
        voucherRecyclerView.setAdapter(voucherAdapter);

        // Handle back button click
        ImageButton backButton = findViewById(R.id.backbutton);
        backButton.setOnClickListener(v -> finish());

        // Observe the LiveData from the ViewModel
        voucherViewModel.getVouchers().observe(this, new Observer<List<Voucher>>() {
            @Override
            public void onChanged(List<Voucher> vouchers) {
                // Update the adapter with new data
                if (vouchers != null) {
                    voucherAdapter.updateVouchers(vouchers);  // Method to update the adapter data
                }
                loadingSpinner.setVisibility(View.GONE);
            }
        });
    }

    // Method to create mock voucher data

}
