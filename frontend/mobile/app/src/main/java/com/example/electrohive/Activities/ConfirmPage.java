package com.example.electrohive.Activities;

import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.TextView;

import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.Observer;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.electrohive.Adapters.PaymentAdapter;
import com.example.electrohive.Models.CartItem;
import com.example.electrohive.Models.CheckoutAddress;
import com.example.electrohive.Models.OrderItemRequest;
import com.example.electrohive.R;
import com.example.electrohive.ViewModel.OrderViewModel;
import com.google.common.reflect.TypeToken;
import com.google.gson.Gson;

import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

public class ConfirmPage  extends AppCompatActivity {

    TextView date,payment,address,Subtotal,Discount,ShipCost,GrandTotal,confirm;


    @RequiresApi(api = Build.VERSION_CODES.O)
    @Override
    protected void  onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.confirm_page);

        OrderViewModel orderViewModel=new OrderViewModel();

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
        String subtotal= bundle.getString("subtotal");
        String discount=bundle.getString("discount");
        String shipCost=bundle.getString("shipCost");
        String grandTotal=bundle.getString("grandTotal");
        Subtotal=findViewById(R.id.receipt_subtotal);
        Discount=findViewById(R.id.receipt_discount);
        ShipCost=findViewById(R.id.receipt_shipment_cost);
        GrandTotal=findViewById(R.id.receipt_grand_total);
        Subtotal.setText(subtotal);
        Discount.setText(discount);
        ShipCost.setText(shipCost);
        GrandTotal.setText(grandTotal);

        confirm=findViewById(R.id.confirm);
        confirm.setOnClickListener(v -> {
            String numericPart = GrandTotal.getText().toString().replace(" VNĐ", "").trim();
            double price = Double.parseDouble(numericPart);
            if(payment_method.equals("COD"))
            {
                orderViewModel.postUserOrder(price,list,payment.getText().toString(),Address);
                Intent intent=new Intent(getApplicationContext(),ReceiptPage.class);
                intent.putExtra("checkedItems",productJson);
                intent.putExtra("address", Address);
                intent.putExtra("payment_method",getIntent().getStringExtra("payment_method"));
                intent.putExtra("date",date.getText().toString());
                intent.putExtras(bundle);
                startActivity(intent);
            }
            else
            {
                orderViewModel.postMOMO(price,list,payment.getText().toString(),Address).observe(this, new Observer<String>() {
                    @Override
                    public void onChanged(String shortLink) {
                        if (!shortLink.isEmpty()) {
                            Uri momoUri = Uri.parse("momo://pay?url=" + shortLink);  // Giả sử momo sử dụng URI như vậy
                            Intent intent = new Intent(Intent.ACTION_VIEW, momoUri);

                            // Kiểm tra xem Momo có được cài đặt hay không
                            PackageManager packageManager = getPackageManager();
                            List<ResolveInfo> activities = packageManager.queryIntentActivities(intent, 0);
                            if (!activities.isEmpty()) {
                                startActivity(intent);
                            } else {
                                // Nếu không tìm thấy Momo app, mở trình duyệt
                                System.out.println("Ứng dụng Momo không được cài đặt. Mở web...");
                                intent = new Intent(Intent.ACTION_VIEW, Uri.parse(shortLink));
                                startActivity(intent);
                            }
                        } else {
                            // Xử lý nếu không có shortLink hoặc có lỗi
                            System.out.println("Không nhận được shortLink.");
                        }
                    }
                });
            }
        });
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
