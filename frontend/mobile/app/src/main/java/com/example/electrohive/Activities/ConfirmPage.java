package com.example.electrohive.Activities;

import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.os.StrictMode;
import android.widget.ImageButton;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.LifecycleOwner;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.electrohive.Adapters.PaymentAdapter;
import com.example.electrohive.Models.CartItem;
import com.example.electrohive.Models.CheckoutAddress;
import com.example.electrohive.Models.Enum.PAYMENT_METHOD;
import com.example.electrohive.Models.OrderItemRequest;
import com.example.electrohive.Models.Voucher;
import com.example.electrohive.R;
import com.example.electrohive.ViewModel.CartViewModel;
import com.example.electrohive.ViewModel.OrderViewModel;
import com.example.electrohive.ZaloPay.Api.CreateOrder;
import com.google.common.reflect.TypeToken;
import com.google.gson.Gson;

import org.json.JSONObject;

import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.Locale;

import vn.zalopay.sdk.Environment;
import vn.zalopay.sdk.ZaloPayError;
import vn.zalopay.sdk.ZaloPaySDK;
import vn.zalopay.sdk.listeners.PayOrderListener;

public class ConfirmPage  extends AppCompatActivity {

    TextView date,payment,address,Subtotal,Discount,ShipCost,GrandTotal,confirm,voucher_code,voucher_discount_percentage;


    OrderViewModel orderViewModel;
    CartViewModel cartViewModel= CartViewModel.getInstance();
    @RequiresApi(api = Build.VERSION_CODES.O)
    @Override
    protected void  onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.confirm_page);

        orderViewModel = new OrderViewModel(this);

        StrictMode.ThreadPolicy policy = new
        StrictMode.ThreadPolicy.Builder().permitAll().build();
        StrictMode.setThreadPolicy(policy);

        ZaloPaySDK.init(554, Environment.SANDBOX);



        ImageButton backbutton=findViewById(R.id.backbutton);
        backbutton.setOnClickListener(v -> {
            finish();
        });
        String payment_method= getIntent().getStringExtra("payment_method");
        payment=findViewById(R.id.payment_method);
        payment.setText(payment_method);

        date=findViewById(R.id.date);
        createDate();
        CheckoutAddress Address=(CheckoutAddress) getIntent().getSerializableExtra("address");

        String formattedDate = String.format("%s, %s %s, %s", Address.getAddress(),Address.getWard(),Address.getDistrict(),Address.getCity());
        address=findViewById(R.id.address);
        address.setText(formattedDate);

        String productJson = getIntent().getStringExtra("checkedItems");
        Gson gson = new Gson();
        ArrayList<CartItem> cartItems=gson.fromJson(productJson, new TypeToken<ArrayList<CartItem>>() {}.getType());
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
        voucher_code = findViewById(R.id.receipt_discount_code);
        voucher_discount_percentage = findViewById(R.id.receipt_discount_percentage);
        Subtotal=findViewById(R.id.receipt_subtotal);
        Discount=findViewById(R.id.receipt_discount);
        ShipCost=findViewById(R.id.receipt_shipment_cost);
        GrandTotal=findViewById(R.id.receipt_grand_total);
        Subtotal.setText(subtotal);
        Discount.setText(discount);
        ShipCost.setText(shipCost);
        GrandTotal.setText(grandTotal);
        if(voucher!=null) {
            voucher_code.setText(voucher.getVoucherName());
            voucher_discount_percentage.setText("("+voucher.getDiscountAmount()+"%)");
        }

        confirm=findViewById(R.id.confirm);
        confirm.setOnClickListener(v -> {
            String numericPart = GrandTotal.getText().toString()
                    .replace(" VNĐ", "")
                    .replace(",", "")
                    .trim();
            double price = Double.parseDouble(numericPart);
            if(payment_method.equals("COD"))
            {
                orderViewModel.postUserOrder(price,list,PAYMENT_METHOD.valueOf(payment_method),Address,voucher).observe(this, res-> {
                    if(res.isSuccess()) {
                        Intent intent1=new Intent(getApplicationContext(),ReceiptPage.class);
                        intent1.putExtra("checkedItems",productJson);
                        intent1.putExtra("address", Address);
                        intent1.putExtra("voucher",voucher);
                        intent1.putExtra("payment_method",getIntent().getStringExtra("payment_method"));
                        intent1.putExtra("date",date.getText().toString());
                        intent1.putExtras(bundle);
                        for(CartItem item: cartItems){
                            cartViewModel.deleteCartItem(item.getProductId());
                        }
                        startActivity(intent1);
                    } else {
                        Toast.makeText(ConfirmPage.this, res.getMessage(), Toast.LENGTH_SHORT).show();
                    }});
            }
            else if(payment_method.equals("ZALOPAY"))
            {
                CreateOrder orderApi = new CreateOrder();
                try {
                    JSONObject data = orderApi.createOrder(numericPart);
                    String code = data.getString("returncode");
                    if (code.equals("1")) {
                        String token = data.getString("zptranstoken");
                        ZaloPaySDK.getInstance().payOrder(ConfirmPage.this, token, "demozpdk://app", new PayOrderListener() {
                            @Override
                             public void onPaymentSucceeded(String s, String s1, String s2) {
                                orderViewModel.postUserOrder(price,list, PAYMENT_METHOD.valueOf(payment_method),Address,voucher).observeForever(res-> {
                                    if(res.isSuccess()) {
                                        Intent intent1=new Intent(getApplicationContext(),ReceiptPage.class);
                                        intent1.putExtra("checkedItems",productJson);
                                        intent1.putExtra("address", Address);
                                        intent1.putExtra("voucher",voucher);
                                        intent1.putExtra("payment_method",getIntent().getStringExtra("payment_method"));
                                        intent1.putExtra("date",date.getText().toString());
                                        intent1.putExtras(bundle);
                                        for(CartItem item: cartItems){
                                            cartViewModel.deleteCartItem(item.getProductId());
                                        }
                                        startActivity(intent1);
                                    } else {
                                        Toast.makeText(ConfirmPage.this, res.getMessage(), Toast.LENGTH_SHORT).show();
                                    }
                                });

                            }

                            @Override
                            public void onPaymentCanceled(String s, String s1) {
                            }

                            @Override
                            public void onPaymentError(ZaloPayError zaloPayError, String s, String s1) {
                            }
                        });
                    }

                } catch (Exception e) {
                    e.printStackTrace();
                }
            }

        });

    }
    @Override
    protected void onNewIntent(@NonNull Intent intent) {
        super.onNewIntent(intent);
        ZaloPaySDK.getInstance().onResult(intent);
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    public void createDate()
    {
        LocalDate currentDate = LocalDate.now();

        // Lấy tên thứ (Monday, Tuesday, ...)
        String dayOfWeek = currentDate.getDayOfWeek().getDisplayName(TextStyle.FULL, Locale.ENGLISH);

        // Lấy tháng (October, November, ...)
        String month = currentDate.getMonth().getDisplayName(TextStyle.FULL, Locale.ENGLISH);

        // Lấy ngày (9, 10, ...)
        int day = currentDate.getDayOfMonth();

        // Lấy năm (2024, ...)
        int year = currentDate.getYear();

        // Tạo chuỗi theo định dạng
        String formattedDate = String.format("%s, %s %d, %d", dayOfWeek, month, day, year);
        date.setText(formattedDate);
    }


}
