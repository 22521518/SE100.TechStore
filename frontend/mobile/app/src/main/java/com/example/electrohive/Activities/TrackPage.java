package com.example.electrohive.Activities;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.ListView;
import android.widget.TextView;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.Observer;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.electrohive.Adapters.OrderAdapter;
import com.example.electrohive.Adapters.OrderItemAdapter;
import com.example.electrohive.Models.Order;
import com.example.electrohive.Models.OrderItem;
import com.example.electrohive.Models.Province;
import com.example.electrohive.R;
import com.example.electrohive.ViewModel.OrderViewModel;
import com.example.electrohive.utils.format.Format;

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

        orderViewModel = new OrderViewModel();

        if (orderId != null) {
            orderViewModel.getOrder(orderId).observe(this, new Observer<Order>() {
                @Override
                public void onChanged(Order order) {
                    if (order != null) {
                        List<OrderItem> items = order.getOrderItems();

                        order_id_input.setText(orderId);
                        // Update the UI with the order data
                        order_date.setText(Format.getFormattedDate(order.getShippingAddress().getDeliveryDate()));
                        order_fullname.setText(order.getShippingAddress().getAddress().getFullName());
                        order_phonenumber.setText(order.getShippingAddress().getAddress().getPhoneNumber());
                        order_address.setText(
                                order.getShippingAddress().getAddress().getAddress() + ", " +
                                        order.getShippingAddress().getAddress().getWard() + ", " +
                                        order.getShippingAddress().getAddress().getDistrict() + ", " +
                                        order.getShippingAddress().getAddress().getCity());
                        order_payment_method.setText(order.getPaymentMethod().toString());
                        order_id.setText("Order: "+order.getOrderId());
                        order_total_price.setText("Total: "+Format.getFormattedTotalPrice(order.getTotalPrice())+ " ("+items.size()+" items)");
                        // Set the order items in the adapter
                        OrderItemAdapter adapter = new OrderItemAdapter(TrackPage.this, items);
                        order_items_listview.setLayoutManager(new LinearLayoutManager(TrackPage.this));
                        order_items_listview.setAdapter(adapter);
                    }
                }
            });
        }


        // Handle the track button click to fetch order details
        order_track_button.setOnClickListener(v -> {
            String orderIdInput = order_id_input.getText().toString().trim();
            if (!orderIdInput.isEmpty()) {
                // You can update the order ID and re-fetch data here if necessary
                orderViewModel.getOrder(orderIdInput).observe(this, new Observer<Order>() {
                    @Override
                    public void onChanged(Order order) {
                        if (order != null) {
                            List<OrderItem> items = order.getOrderItems();
                            // Update the UI with the order data
                            order_date.setText(Format.getFormattedDate(order.getShippingAddress().getDeliveryDate()));
                            order_fullname.setText(order.getShippingAddress().getAddress().getFullName());
                            order_phonenumber.setText(order.getShippingAddress().getAddress().getPhoneNumber());
                            order_address.setText(
                                    order.getShippingAddress().getAddress().getAddress() + ", " +
                                            order.getShippingAddress().getAddress().getWard() + ", " +
                                            order.getShippingAddress().getAddress().getDistrict() + ", " +
                                            order.getShippingAddress().getAddress().getCity());
                            order_payment_method.setText(order.getPaymentMethod().toString());
                            order_id.setText("Order: "+order.getOrderId());
                            order_total_price.setText("Total: "+Format.getFormattedTotalPrice(order.getTotalPrice())+ " ("+items.size()+" items)");

                            // Set the order items in the adapter
                            OrderItemAdapter adapter = new OrderItemAdapter(TrackPage.this, items);
                            order_items_listview.setLayoutManager(new LinearLayoutManager(TrackPage.this));

                            order_items_listview.setAdapter(adapter);
                        }
                    }
                });
            }
        });

    }
}
