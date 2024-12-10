package com.example.electrohive.Repository;

import android.util.Log;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.example.electrohive.Models.ApiResponse;
import com.example.electrohive.Models.CheckoutAddress;
import com.example.electrohive.Models.Enum.ORDER_STATUS;
import com.example.electrohive.Models.Enum.PAYMENT_METHOD;
import com.example.electrohive.Models.Order;
import com.example.electrohive.Models.OrderItemRequest;
import com.example.electrohive.Models.Voucher;
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

    public LiveData<ApiResponse<Order>> getOrder(String customerId, String orderId) {
        MutableLiveData<ApiResponse<Order>> orderData = new MutableLiveData<>();

        orderService.getOrder(customerId, orderId).enqueue(new Callback<JsonObject>() {
            @Override
            public void onResponse(Call<JsonObject> call, Response<JsonObject> response) {
                if (response.isSuccessful() && response.body() != null) {
                    JsonObject orderObject = response.body().getAsJsonObject();
                    Order order = OrderUtils.parseOrder(orderObject);
                    ApiResponse<Order> apiResponse = new ApiResponse<>(
                            true, order, "Order fetched successfully", response.code()
                    );
                    orderData.setValue(apiResponse);
                } else {
                    ApiResponse<Order> apiResponse = new ApiResponse<>(
                            false, null, "Error fetching order: " + response.code(), response.code()
                    );
                    orderData.setValue(apiResponse);
                }
            }

            @Override
            public void onFailure(Call<JsonObject> call, Throwable t) {
                ApiResponse<Order> apiResponse = new ApiResponse<>(
                        false, null, "Error fetching order: " + t.getMessage(), -1
                );
                orderData.setValue(apiResponse);
            }
        });

        return orderData;
    }


    public LiveData<ApiResponse<List<Order>>> getOrders(String userId) {
        MutableLiveData<ApiResponse<List<Order>>> orderData = new MutableLiveData<>();

        orderService.getUserOrders(userId).enqueue(new Callback<JsonArray>() {
            @Override
            public void onResponse(Call<JsonArray> call, Response<JsonArray> response) {
                if (response.isSuccessful() && response.body() != null) {
                    try {
                        JsonArray resultsArray = response.body().getAsJsonArray();
                        List<Order> orders = OrderUtils.parseOrders(resultsArray);
                        ApiResponse<List<Order>> apiResponse = new ApiResponse<>(
                                true, orders, "Orders fetched successfully", response.code()
                        );
                        orderData.setValue(apiResponse);
                    } catch (Exception e) {
                        ApiResponse<List<Order>> apiResponse = new ApiResponse<>(
                                false, new ArrayList<>(), "Error parsing orders: " + e.getMessage(), response.code()
                        );
                        orderData.setValue(apiResponse);
                    }
                } else {
                    ApiResponse<List<Order>> apiResponse = new ApiResponse<>(
                            false, new ArrayList<>(), "Failed to load orders: " + response.code(), response.code()
                    );
                    orderData.setValue(apiResponse);
                }
            }

            @Override
            public void onFailure(Call<JsonArray> call, Throwable t) {
                ApiResponse<List<Order>> apiResponse = new ApiResponse<>(
                        false, new ArrayList<>(), "Error making request: " + t.getMessage(), -1
                );
                orderData.setValue(apiResponse);
            }
        });

        return orderData;
    }

    public LiveData<ApiResponse<ORDER_STATUS>> updateOrderStatus(String order_id, String customer_id, ORDER_STATUS status) {
        MutableLiveData<ApiResponse<ORDER_STATUS>> orderStatusData = new MutableLiveData<>();

        // Create payload for the request
        JsonObject payload = new JsonObject();
        payload.addProperty("order_status", status.toString());

        // Make asynchronous request to update the order status
        orderService.patchOrder(customer_id, order_id, "application/json", payload).enqueue(new Callback<JsonObject>() {
            @Override
            public void onResponse(Call<JsonObject> call, Response<JsonObject> response) {
                if (response.isSuccessful() && response.body() != null) {
                    try {
                        String updatedStatus = response.body().get("order_status").getAsString();
                        ORDER_STATUS newStatus = ORDER_STATUS.valueOf(updatedStatus);
                        ApiResponse<ORDER_STATUS> apiResponse = new ApiResponse<>(
                                true, newStatus, "Order status updated successfully", response.code()
                        );
                        orderStatusData.setValue(apiResponse);
                    } catch (Exception e) {
                        ApiResponse<ORDER_STATUS> apiResponse = new ApiResponse<>(
                                false, null, "Error updating order status: " + e.getMessage(), response.code()
                        );
                        orderStatusData.setValue(apiResponse);
                    }
                } else {
                    ApiResponse<ORDER_STATUS> apiResponse = new ApiResponse<>(
                            false, null, "Failed to update order status: " + response.code(), response.code()
                    );
                    orderStatusData.setValue(apiResponse);
                }
            }

            @Override
            public void onFailure(Call<JsonObject> call, Throwable t) {
                ApiResponse<ORDER_STATUS> apiResponse = new ApiResponse<>(
                        false, null, "Error updating order status: " + t.getMessage(), -1
                );
                orderStatusData.setValue(apiResponse);
            }
        });

        return orderStatusData;
    }

    public LiveData<ApiResponse<Boolean>> postOrder(String userId, double totalPrice, ArrayList<OrderItemRequest> list, PAYMENT_METHOD paymentMethod, CheckoutAddress address, Voucher voucher)
    {
        MutableLiveData<ApiResponse<Boolean>> result = new MutableLiveData<>();

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
        payload.addProperty("payment_method", paymentMethod.toString());
        JsonObject shippingAddress = new JsonObject();
        shippingAddress.addProperty("address", address.getAddress());
        shippingAddress.addProperty("city", address.getCity());
        shippingAddress.addProperty("district", address.getDistrict());
        shippingAddress.addProperty("ward", address.getWard());
        shippingAddress.addProperty("full_name", address.getFullName());
        shippingAddress.addProperty("phone_number", address.getPhoneNumber());
        payload.add("shipping_address", shippingAddress);
        payload.addProperty("voucher",voucher!=null?voucher.getVoucherCode():"");

        System.out.println("Payload: " + gson.toJson(payload));

        orderService.postUserOrders(userId,payload).enqueue(new Callback<JsonObject>() {
            @Override
            public void onResponse(Call<JsonObject> call, Response<JsonObject> response) {
                if (response.isSuccessful()) {
                    result.postValue(new ApiResponse<>(true,true,"New order created",response.code()));
                } else {
                    result.postValue(new ApiResponse<>(false,false,response.message(),response.code()));
                }
            }

            @Override
            public void onFailure(Call<JsonObject> call, Throwable t) {
                result.postValue(new ApiResponse<>(false,false,t.getMessage(),-1));
            }
        });
        return result;
    }
}
