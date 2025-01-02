package com.example.electrohive.Activities;

import android.content.Intent;
import android.os.Bundle;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.electrohive.Adapters.PaymentAdapter;
import com.example.electrohive.Models.CartItem;
import com.example.electrohive.Models.CheckoutAddress;
import com.example.electrohive.Models.OrderItemRequest;
import com.example.electrohive.Models.Voucher;
import com.example.electrohive.R;
import com.google.common.reflect.TypeToken;
import com.google.gson.Gson;

import java.util.ArrayList;

public class ReceiptPage  extends AppCompatActivity {

    TextView date,payment,address,Subtotal,Discount,ShipCost,GrandTotal,confirm,voucher_code,voucher_discount_percentage;

    @Override
    protected void  onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.receipt_page);

        payment=findViewById(R.id.payment_method);
        payment.setText(getIntent().getStringExtra("payment_method"));

        date=findViewById(R.id.date);
        date.setText(getIntent().getStringExtra("date"));
        CheckoutAddress Address=(CheckoutAddress) getIntent().getSerializableExtra("address");
        String formattedDate = String.format("%s, %s %s, %s", Address.getAddress(),Address.getWard(),Address.getDistrict(),Address.getCity());
        address=findViewById(R.id.address);
        address.setText(formattedDate);

        ArrayList<CartItem> cartItems= new ArrayList<>();
        String productJson = getIntent().getStringExtra("checkedItems");
        Gson gson = new Gson();
        cartItems=gson.fromJson(productJson, new TypeToken<ArrayList<CartItem>>() {}.getType());
        RecyclerView recyclerView = findViewById(R.id.rc_trend);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));
        PaymentAdapter paymentAdapter=new PaymentAdapter(this,cartItems);
        recyclerView.setAdapter(paymentAdapter);
        ArrayList<OrderItemRequest> list =new ArrayList<>();
        for(CartItem item: cartItems)
        {
            list.add(new OrderItemRequest(item.getProductId(), item.getQuantity(),item.getProduct().getPrice(),item.getTotalPrice()));
        }

        Bundle bundle = getIntent().getExtras();
        Voucher voucher = (Voucher) bundle.getSerializable("voucher");
        String subtotal= bundle.getString("subtotal");
        String discount=bundle.getString("discount");
        String shipCost=bundle.getString("shipCost");
        String grandTotal=bundle.getString("grandTotal");
        Subtotal=findViewById(R.id.receipt_subtotal);
        Discount=findViewById(R.id.receipt_discount);
        ShipCost=findViewById(R.id.receipt_shipment_cost);
        GrandTotal=findViewById(R.id.receipt_grand_total);
        voucher_code = findViewById(R.id.receipt_discount_code);
        voucher_discount_percentage = findViewById(R.id.receipt_discount_percentage);
        if(voucher!=null) {
            voucher_code.setText(voucher.getVoucherName());
            voucher_discount_percentage.setText("("+voucher.getDiscountAmount()+"%)");
        }
        Subtotal.setText(subtotal);
        Discount.setText(discount);
        ShipCost.setText(shipCost);
        GrandTotal.setText(grandTotal);


        confirm=findViewById(R.id.continue_shopping);
        confirm.setOnClickListener(v -> {
            Intent intent=new Intent(getApplicationContext(), HomePage.class);
            startActivity(intent);
            finish();
        });
    }
}
