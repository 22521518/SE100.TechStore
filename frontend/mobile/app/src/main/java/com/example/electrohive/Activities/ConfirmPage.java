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


}
