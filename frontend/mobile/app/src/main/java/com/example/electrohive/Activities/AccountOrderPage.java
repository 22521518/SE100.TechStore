package com.example.electrohive.Activities;

import android.content.res.ColorStateList;
import android.graphics.Color;
import android.os.Bundle;
import android.view.View;
import android.widget.ImageButton;
import android.widget.ProgressBar;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.Observer;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.electrohive.Adapters.OrderAdapter;
import com.example.electrohive.Models.Enum.ORDER_STATUS;
import com.example.electrohive.Models.Order;
import com.example.electrohive.R;
import com.example.electrohive.ViewModel.OrderViewModel;

import java.util.ArrayList;
import java.util.List;

public class AccountOrderPage extends AppCompatActivity {

    private ProgressBar loadingSpinner;

    private ORDER_STATUS filter = null;
    private OrderViewModel orderViewModel;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.account_orders_page);


        loadingSpinner = findViewById(R.id.loading_spinner);
        loadingSpinner.setVisibility(View.VISIBLE);
        // Initialize ViewModel
        orderViewModel = new OrderViewModel();

        // Set up RecyclerView
        RecyclerView ordersRecyclerView = findViewById(R.id.orders_listview);  // Ensure this ID exists in your layout XML
        ordersRecyclerView.setLayoutManager(new LinearLayoutManager(this));

        // Set up adapter
        OrderAdapter orderAdapter = new OrderAdapter(AccountOrderPage.this,new ArrayList<>());
        ordersRecyclerView.setAdapter(orderAdapter);

        // Observe orders LiveData
        orderViewModel.getOrders("userId_here",filter).observe(this, new Observer<List<Order>>() {
            @Override
            public void onChanged(List<Order> orders) {
                if (orders != null) {
                    orderAdapter.updateOrders(orders);
                }
                loadingSpinner.setVisibility(View.GONE);
            }
        });
        setupFilterButtons();


        ImageButton backButton = findViewById(R.id.backbutton);
        backButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });
    }

    private void setupFilterButtons() {
        findViewById(R.id.AllOrders).setOnClickListener(v -> applyFilter(null,v));
        findViewById(R.id.PendingOrders).setOnClickListener(v -> applyFilter(ORDER_STATUS.PENDING,v));
        findViewById(R.id.ConfirmedOrders).setOnClickListener(v -> applyFilter(ORDER_STATUS.CONFIRMED,v));
        findViewById(R.id.ShippedOrder).setOnClickListener(v -> applyFilter(ORDER_STATUS.SHIPPED,v));
        findViewById(R.id.DeliveredOrders).setOnClickListener(v -> applyFilter(ORDER_STATUS.DELIVERED,v));
        findViewById(R.id.CancelledOrders).setOnClickListener(v -> applyFilter(ORDER_STATUS.CANCELLED,v));

        applyFilter(null,findViewById(R.id.AllOrders));
    }
    private void applyFilter(ORDER_STATUS newFilter,View clickedButton) {
        filter = newFilter;
        orderViewModel.getOrders("userId_here", filter).observe(this, new Observer<List<Order>>() {
            @Override
            public void onChanged(List<Order> orders) {
                // Update the orders list with new data based on the filter
                if (orders != null) {
                    ((OrderAdapter) ((RecyclerView) findViewById(R.id.orders_listview)).getAdapter()).updateOrders(orders);
                }
            }
        });


        resetButtonBackgrounds();
        clickedButton.setBackgroundTintList(ColorStateList.valueOf(Color.parseColor("#80D3D3D3")));

    }

    private void resetButtonBackgrounds() {
        findViewById(R.id.AllOrders).setBackgroundTintList(ColorStateList.valueOf(Color.TRANSPARENT));
        findViewById(R.id.PendingOrders).setBackgroundTintList(ColorStateList.valueOf(Color.TRANSPARENT));
        findViewById(R.id.ConfirmedOrders).setBackgroundTintList(ColorStateList.valueOf(Color.TRANSPARENT));
        findViewById(R.id.ShippedOrder).setBackgroundTintList(ColorStateList.valueOf(Color.TRANSPARENT));
        findViewById(R.id.DeliveredOrders).setBackgroundTintList(ColorStateList.valueOf(Color.TRANSPARENT));
        findViewById(R.id.CancelledOrders).setBackgroundTintList(ColorStateList.valueOf(Color.TRANSPARENT));
    }

}
