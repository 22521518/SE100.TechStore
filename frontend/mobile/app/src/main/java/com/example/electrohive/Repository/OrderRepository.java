package com.example.electrohive.Repository;

import android.util.Log;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.example.electrohive.Models.CheckoutAddress;
import com.example.electrohive.Models.Enum.ORDER_STATUS;
import com.example.electrohive.Models.Order;
import com.example.electrohive.Models.OrderItemRequest;
import com.example.electrohive.api.OrderService;
import com.example.electrohive.utils.Model.OrderUtils;
import com.example.electrohive.utils.RetrofitClient;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

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

    public LiveData<Boolean> postOrder(String userId, double totalPrice, ArrayList<OrderItemRequest> list, String paymentMethod, CheckoutAddress address)
    {
        MutableLiveData<Boolean> result = new MutableLiveData<>();
        result.postValue(false);

        Gson gson = new Gson();
        JsonObject payload = new JsonObject();
        payload.addProperty("total_price", totalPrice);
        JsonArray orderItemsArray = new JsonArray();
        for (OrderItemRequest item : list) {
            JsonObject orderItemJson = new JsonObject();
            orderItemJson.addProperty("product_id", item.getProductId());
            orderItemJson.addProperty("quantity", item.getQuantity());
            orderItemJson.addProperty("unit_price", item.getUnitPrice());
            orderItemJson.addProperty("total_price", item.getTotalPrice());
            orderItemsArray.add(orderItemJson);
        }
        payload.add("order_items", orderItemsArray);
        payload.addProperty("payment_method", paymentMethod);
        JsonObject shippingAddress = new JsonObject();
        shippingAddress.addProperty("address", address.getAddress());
        shippingAddress.addProperty("city", address.getCity());
        shippingAddress.addProperty("district", address.getDistrict());
        shippingAddress.addProperty("ward", address.getWard());
        shippingAddress.addProperty("full_name", address.getFullName());
        shippingAddress.addProperty("phone_number", address.getPhoneNumber());
        payload.add("shipping_address", shippingAddress);

        System.out.println("Payload: " + gson.toJson(payload));

        orderService.postUserOrders(userId,payload).enqueue(new Callback<JsonObject>() {
            @Override
            public void onResponse(Call<JsonObject> call, Response<JsonObject> response) {
                if (response.isSuccessful()) {
                    result.postValue(true);
                    System.out.println("THANH CONG");
                } else {
                    System.out.println("Failed: " + response.code() + " " + response.message());
                }
            }

            @Override
            public void onFailure(Call<JsonObject> call, Throwable t) {
                System.out.println("Error: " + t.getMessage());
            }
        });
        return result;
    }
}
