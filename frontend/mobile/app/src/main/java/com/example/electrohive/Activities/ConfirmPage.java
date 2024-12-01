package com.example.electrohive.Activities;

import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.TextView;

import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AppCompatActivity;

import com.example.electrohive.Models.CartItem;
import com.example.electrohive.Models.CheckoutAddress;
import com.example.electrohive.R;
import com.google.common.reflect.TypeToken;
import com.google.gson.Gson;

import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.Locale;

public class ConfirmPage  extends AppCompatActivity {

    TextView date,payment;

    @RequiresApi(api = Build.VERSION_CODES.O)
    @Override
    protected void  onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.confirm_page);
        ImageButton backbutton=findViewById(R.id.backbutton);
        backbutton.setOnClickListener(v -> {
            finish();
        });

        date=findViewById(R.id.date);
        createDate();
        payment=findViewById(R.id.payment_method);
        payment.setText(getIntent().getStringExtra("payment_method"));

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
