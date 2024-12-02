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
import com.example.electrohive.Models.Ward;
import com.example.electrohive.R;
import com.google.common.reflect.TypeToken;
import com.google.gson.Gson;

import java.text.DecimalFormat;
import java.util.ArrayList;

public class PaymentPage  extends AppCompatActivity {

    RadioButton momo,cash;
    ArrayList<CartItem> cartItems;
    PaymentAdapter paymentAdapter;
    ImageButton backbutton;
    EditText voucherName;
    TextView Grandtotal,Subtotal,Discount,voucher,Shipcost,finish;
    DecimalFormat df = new DecimalFormat("0.#");

    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (requestCode == 1) {
            if (resultCode == RESULT_OK) {
                voucherName.setText(data.getStringExtra("voucherName"));
                if(data.getStringExtra("voucherName").equals("freeship"))
                {
                    UpdateTotal(0,0);
                }
                else
                {
                    UpdateTotal(30000,data.getDoubleExtra("discount",0));
                }
            }
        }
    }
    @Override
    protected void  onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.payment_page);
        backbutton=findViewById(R.id.backbutton);
        backbutton.setOnClickListener(v -> {
            finish();
        });
        finish=findViewById(R.id.finish_payment);
        finish.setOnClickListener(v -> {
            CheckoutAddress tmp= (CheckoutAddress) getIntent().getSerializableExtra("address");
            String json = getIntent().getStringExtra("checkedItems");
            Intent intent=new Intent(getApplicationContext(),ConfirmPage.class);
            intent.putExtra("checkedItems",json);
            intent.putExtra("address", tmp);
            if(cash.isChecked())
                intent.putExtra("payment_method","COD");
            else
                intent.putExtra("payment_method","MOMO");
            Bundle bundle=new Bundle();
            bundle.putString("subtotal",Subtotal.getText().toString());
            bundle.putString("discount",Discount.getText().toString());
            bundle.putString("shipCost",Shipcost.getText().toString());
            bundle.putString("grandTotal",Grandtotal.getText().toString());
            intent.putExtras(bundle);
            startActivity(intent);
        });
        voucherName=findViewById(R.id.discount);
        Grandtotal=findViewById(R.id.payment_grand_total);
        Subtotal=findViewById(R.id.payment_subtotal);
        Discount=findViewById(R.id.payment_discount);
        Shipcost=findViewById(R.id.payment_shipment_cost);
        voucher=findViewById(R.id.discount_button);
        voucher.setOnClickListener(v -> {
            Intent intent=new Intent(getApplicationContext(), PaymentVoucherPage.class);
            startActivityForResult(intent,1);
        });
        momo=findViewById(R.id.wallet);
        cash=findViewById(R.id.cash);
        cartItems=new ArrayList<>();
        String productJson = getIntent().getStringExtra("checkedItems");
        Gson gson = new Gson();
        cartItems=gson.fromJson(productJson, new TypeToken<ArrayList<CartItem>>() {}.getType());
        RecyclerView recyclerView = findViewById(R.id.rc_trend);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));
        paymentAdapter=new PaymentAdapter(this,cartItems);
        recyclerView.setAdapter(paymentAdapter);
        Subtotal.setText(df.format(SubTotal())+" VNĐ");
        Grandtotal.setText(df.format(SubTotal()+30000)+" VNĐ");
        momo.setOnClickListener(v->{
            cash.setChecked(false);
        });
        cash.setOnClickListener(v->{
            momo.setChecked(false);
        });
    }
    private double SubTotal(){
        double grandtotal=0;
        double subtotal=0;
        double discount=0;
        for(CartItem item : cartItems)
        {
            if(item.getChecked())
            {
                subtotal+=item.getProduct().getPrice()*item.getQuantity();
                discount+=(item.getProduct().getDiscount()*item.getProduct().getPrice()*item.getQuantity())/100;
            }
        }
        grandtotal=subtotal-discount;
        return grandtotal;
    }

    private void UpdateTotal(double shipCost,double discount){
        double grandtotal=SubTotal()+shipCost-(SubTotal()*discount)/100;
        Shipcost.setText(df.format(shipCost)+" VNĐ");
        Discount.setText(df.format((SubTotal()*discount)/100) +" VNĐ");
        Grandtotal.setText(df.format(grandtotal)+" VNĐ");
    }
}
