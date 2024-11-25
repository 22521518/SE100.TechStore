package com.example.electrohive.Repository;

import android.util.Log;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.example.electrohive.Models.Enum.ORDER_STATUS;
import com.example.electrohive.Models.Order;
import com.example.electrohive.Models.Province;
import com.example.electrohive.Models.Voucher;
import com.example.electrohive.api.OrderService;
import com.example.electrohive.api.VoucherService;
import com.example.electrohive.api.VoucherService;
import com.example.electrohive.utils.Model.OrderUtils;
import com.example.electrohive.utils.RetrofitClient;
import com.example.electrohive.utils.generator.MockOrder;
import com.example.electrohive.utils.generator.MockVoucher;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class OrderRepository {

    private final OrderService orderService;

    public OrderRepository() {
        orderService =  RetrofitClient.getClient().create(OrderService.class);
    }

    public LiveData<Order> getOrder(String customerId ,String orderId) {
        MutableLiveData<Order> orderData = new MutableLiveData<>();

        orderService.getOrder(customerId,orderId).enqueue(new Callback<JsonObject>() {
            @Override
            public void onResponse(Call<JsonObject> call, Response<JsonObject> response) {
                if (response.isSuccessful() && response.body() != null) {
                    JsonObject orderObject = response.body().getAsJsonObject();
                    Order order = OrderUtils.parseOrder(orderObject);
                    orderData.setValue(order);
                } else {
                    Log.e("OrderRepository", "Error fetching order: " + response.code());
                    orderData.setValue(null);
                }
            }

            @Override
            public void onFailure(Call<JsonObject> call, Throwable t) {
                Log.e("OrderRepository", "Error fetching order: " + t.getMessage());
                orderData.setValue(null);
            }
        });

        return orderData;
    }


    public LiveData<List<Order>> getOrders(String userId) {
        MutableLiveData<List<Order>> orderData = new MutableLiveData<>();


        orderService.getUserOrders(userId).enqueue(new Callback<JsonArray>() {
            @Override
            public void onResponse(Call<JsonArray> call, Response<JsonArray> response) {
                if (response.isSuccessful() && response.body() != null) {
                    try {
                        JsonArray resultsArray = response.body().getAsJsonArray();
                        List<Order> orders = OrderUtils.parseOrders(resultsArray);
                        orderData.postValue(orders);
                    } catch (Exception e) {
                        Log.e("Repository Error", "Error parsing response: " + e.getMessage());
                        orderData.postValue(new ArrayList<>());
                    }
                } else {
                    Log.e("Repository Error", "Failed to load vouchers: " + response.code());
                    orderData.postValue(new ArrayList<>());
                }
            }

            @Override
            public void onFailure(Call<JsonArray> call, Throwable t) {
                Log.e("Repository Error", "Error making request: " + t.getMessage());
                orderData.postValue(new ArrayList<>());
            }
        });

        return orderData;

    }

    public void updateOrderStatus(String orderId, ORDER_STATUS status) {

    }

}
