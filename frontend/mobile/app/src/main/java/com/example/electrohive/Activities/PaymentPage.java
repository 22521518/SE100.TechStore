package com.example.electrohive.Activities;

import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.RadioButton;
import android.widget.TextView;

import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.electrohive.Adapters.PaymentAdapter;
import com.example.electrohive.Adapters.ProductCartAdapter;
import com.example.electrohive.Models.Address;
import com.example.electrohive.Models.CartItem;
import com.example.electrohive.Models.CheckoutAddress;
import com.example.electrohive.Models.District;
import com.example.electrohive.Models.Province;
import com.example.electrohive.Models.Voucher;
import com.example.electrohive.Models.Ward;
import com.example.electrohive.R;
import com.google.common.reflect.TypeToken;
import com.google.gson.Gson;

import org.w3c.dom.Text;

import java.text.DecimalFormat;
import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.Locale;

public class PaymentPage extends AppCompatActivity {

    RadioButton zaloPay, cash;
    ArrayList<CartItem> cartItems;
    PaymentAdapter paymentAdapter;
    ImageButton backbutton;
    TextView Grandtotal, Subtotal, Discount, discount_percentage, voucher, Shipcost, finish;
    NumberFormat currencyFormat = NumberFormat.getInstance(Locale.US);

    Voucher selectedVoucher = null;

    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (requestCode == 1 && resultCode == RESULT_OK) {
            Voucher returnVoucher = (Voucher) data.getSerializableExtra("voucher");


            // Compare the new voucher and discount values with the current ones
            if (selectedVoucher == null || !selectedVoucher.getVoucherCode().equals(returnVoucher.getVoucherCode())) {
                selectedVoucher = returnVoucher;
                voucher.setText(returnVoucher.getVoucherName()); // Update voucher text
                UpdateTotal(returnVoucher.getDiscountAmount());
            }


        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.payment_page);
        backbutton = findViewById(R.id.backbutton);
        backbutton.setOnClickListener(v -> {
            finish();
        });
        finish = findViewById(R.id.finish_payment);
        finish.setOnClickListener(v -> {
            CheckoutAddress tmp = (CheckoutAddress) getIntent().getSerializableExtra("address");
            String json = getIntent().getStringExtra("checkedItems");
            Intent intent = new Intent(getApplicationContext(), ConfirmPage.class);
            intent.putExtra("checkedItems", json);
            intent.putExtra("address", tmp);
            if (cash.isChecked())
                intent.putExtra("payment_method", "COD");
            else
                intent.putExtra("payment_method", "ZALOPAY");
            Bundle bundle = new Bundle();
            bundle.putSerializable("voucher",selectedVoucher);
            bundle.putString("subtotal", Subtotal.getText().toString());
            bundle.putString("discount", Discount.getText().toString());
            bundle.putString("shipCost", Shipcost.getText().toString());
            bundle.putString("grandTotal", Grandtotal.getText().toString());
            intent.putExtras(bundle);
            startActivity(intent);
        });
        Grandtotal = findViewById(R.id.payment_grand_total);
        Subtotal = findViewById(R.id.payment_subtotal);
        Discount = findViewById(R.id.payment_discount);
        discount_percentage = findViewById(R.id.payment_discount_percentage);
        Shipcost = findViewById(R.id.payment_shipment_cost);
        voucher = findViewById(R.id.voucherCode);
        voucher.setOnClickListener(v -> {
            Intent intent = new Intent(getApplicationContext(), PaymentVoucherPage.class);
            startActivityForResult(intent, 1);
        });
        zaloPay = findViewById(R.id.wallet);
        cash = findViewById(R.id.cash);
        cartItems = new ArrayList<>();
        String productJson = getIntent().getStringExtra("checkedItems");
        Gson gson = new Gson();
        cartItems = gson.fromJson(productJson, new TypeToken<ArrayList<CartItem>>() {
        }.getType());
        System.out.println(cartItems);
        RecyclerView recyclerView = findViewById(R.id.order_items_listview);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));
        paymentAdapter = new PaymentAdapter(this, cartItems);
        recyclerView.setAdapter(paymentAdapter);
        Subtotal.setText(currencyFormat.format(SubTotal()) + " VNĐ");
        Grandtotal.setText(currencyFormat.format(SubTotal() + 30000) + " VNĐ");
        zaloPay.setOnClickListener(v -> {
            cash.setChecked(false);
        });
        cash.setOnClickListener(v -> {
            zaloPay.setChecked(false);
        });
    }

    private double SubTotal() {
        double grandtotal = 0;
        double subtotal = 0;
        double discount = 0;
        for (CartItem item : cartItems) {
                subtotal += item.getProduct().getPrice() * item.getQuantity();
                discount += (item.getProduct().getDiscount() * item.getProduct().getPrice() * item.getQuantity()) / 100;
        }
        grandtotal = subtotal - discount;
        return grandtotal;
    }

    private void UpdateTotal(double discount) {
        double grandtotal = SubTotal() + 30000 - (SubTotal() * discount) / 100;
        discount_percentage.setText("(" + discount + "%)");
        Discount.setText(currencyFormat.format((SubTotal() * discount) / 100) + " VNĐ");
        Grandtotal.setText(currencyFormat.format(grandtotal) + " VNĐ");
    }
}
