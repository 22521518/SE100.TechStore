package com.example.electrohive.Activities;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.electrohive.Adapters.OrderItemAdapter;
import com.example.electrohive.Models.Order;
import com.example.electrohive.Models.OrderItem;
import com.example.electrohive.R;
import com.example.electrohive.ViewModel.OrderViewModel;
import com.example.electrohive.utils.format.Format;

import java.util.Date;
import java.util.List;

public class TrackPage extends AppCompatActivity {

    private ImageButton backButton;

    private OrderViewModel orderViewModel;



    private EditText order_id_input;

    private ImageButton order_track_button;

    private TextView order_date;

    private TextView order_fullname;
    private TextView order_phonenumber;
    private TextView order_address;
    private TextView order_payment_method;
    private TextView order_id;
    private TextView order_total_price;
    private RecyclerView order_items_listview;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.tracking_page);

        backButton = findViewById(R.id.backbutton);
        backButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });

        order_id_input = findViewById(R.id.order_id_input);
        order_track_button = findViewById(R.id.order_track_button);
        order_date = findViewById(R.id.order_date);
        order_fullname = findViewById(R.id.order_fullname);
        order_phonenumber = findViewById(R.id.order_phonenumber);
        order_address = findViewById(R.id.order_address);
        order_payment_method = findViewById(R.id.order_payment_method);
        order_id = findViewById(R.id.order_id);
        order_total_price = findViewById(R.id.order_totalprice);
        order_items_listview = findViewById(R.id.order_items_listview);

        Intent intent = getIntent();
        String orderId = intent.getStringExtra("ORDER_ID");

        orderViewModel = new OrderViewModel(TrackPage.this);

        if (orderId != null) {
           fetchOrder(orderId);
        }


        // Handle the track button click to fetch order details
        order_track_button.setOnClickListener(v -> {
            String orderIdInput = order_id_input.getText().toString().trim();
            if (!orderIdInput.isEmpty()) {
                // You can update the order ID and re-fetch data here if necessary
                fetchOrder(orderIdInput);
            }
        });

    }

    private void fetchOrder(String orderId) {
        orderViewModel.getOrder(orderId).observe(this, apiResponse -> {
            // Check if the apiResponse is not null and if the request was successful
            if (apiResponse != null && apiResponse.isSuccess()) {
                Order order = apiResponse.getData();  // Get the actual order data

                if (order != null) {
                    List<OrderItem> items = order.getOrderItems();

                    // Update the UI with the order data
                    order_id_input.setText(orderId);
                    if (order.getShippingAddress() != null) {
                        order_fullname.setText(order.getShippingAddress().getAddress().getFullName());
                        order_phonenumber.setText(order.getShippingAddress().getAddress().getPhoneNumber());
                        order_address.setText(
                                order.getShippingAddress().getAddress().getAddress() + ", " +
                                        order.getShippingAddress().getAddress().getWard() + ", " +
                                        order.getShippingAddress().getAddress().getDistrict() + ", " +
                                        order.getShippingAddress().getAddress().getCity());
                    }
                    order_date.setText(Format.getFormattedDate(new Date()));
                    order_payment_method.setText(order.getPaymentMethod().toString());
                    order_id.setText("Order id: " + order.getOrderId());
                    order_total_price.setText("Total: " + Format.getFormattedTotalPrice(order.getTotalPrice()) + " (" + items.size() + " items)");

                    // Set the order items in the adapter
                    OrderItemAdapter adapter = new OrderItemAdapter(TrackPage.this, items);
                    order_items_listview.setLayoutManager(new LinearLayoutManager(TrackPage.this));
                    order_items_listview.setAdapter(adapter);
                }
            } else {
                this.recreate();
                Toast.makeText(TrackPage.this, "Failed to load order", Toast.LENGTH_SHORT).show();
            }
        });
    }

}
