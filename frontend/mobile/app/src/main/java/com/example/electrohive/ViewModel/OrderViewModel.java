package com.example.electrohive.ViewModel;

import android.content.Context;
import android.util.Log;
import android.widget.Toast;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.example.electrohive.Models.CheckoutAddress;
import com.example.electrohive.Models.ApiResponse;
import com.example.electrohive.Models.Enum.ORDER_STATUS;
import com.example.electrohive.Models.Enum.PAYMENT_METHOD;
import com.example.electrohive.Models.Order;
import com.example.electrohive.Models.OrderItemRequest;
import com.example.electrohive.Models.OrderItem;
import com.example.electrohive.Models.Voucher;
import com.example.electrohive.Repository.OrderRepository;
import com.example.electrohive.utils.PreferencesHelper;
import com.example.electrohive.utils.format.Format;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class OrderViewModel extends ViewModel {

    private final OrderRepository repository;
    private final MutableLiveData<List<Order>> allOrders = new MutableLiveData<>();
    private final MutableLiveData<ORDER_STATUS> filterStatus = new MutableLiveData<>();
    private final MutableLiveData<List<Order>> filteredOrders = new MutableLiveData<>();
    private final Context context;

    public OrderViewModel(Context context) {
        this.context = context;
        repository = new OrderRepository();
        initialize();
    }

    private void initialize() {
        fetchOrders();
        observeFilters();
    }

    // Observing filters to automatically update the filtered orders
    private void observeFilters() {
        filterStatus.observeForever(status -> applyFilter());
        allOrders.observeForever(orders -> applyFilter());
    }

    // Fetch orders from repository and store them in LiveData
    private void fetchOrders() {
        repository.getOrders(PreferencesHelper.getCustomerData().getCustomerId())
                .observeForever(apiResponse -> {
                    if (apiResponse.isSuccess()) {
                        allOrders.setValue(apiResponse.getData());
                    } else {
                        Toast.makeText(context, apiResponse.getMessage(), Toast.LENGTH_SHORT).show();
                    }
                    applyFilter();
                });
    }

    // Apply filter logic based on the current filter status
    private void applyFilter() {
        List<Order> currentOrders = allOrders.getValue();
        ORDER_STATUS currentFilter = filterStatus.getValue();

        if (currentOrders == null) return;

        List<Order> filteredList = new ArrayList<>();
        if (currentFilter != null) {
            for (Order order : currentOrders) {
                if (order.getOrderStatus() == currentFilter) {
                    filteredList.add(order);
                }
            }
        } else {
            filteredList = new ArrayList<>(currentOrders);
        }
        // Sort the filtered list by created_at in descending order (most recent first)
        filteredList.sort((o1, o2) -> {
            try {
                // Extract and convert created_at from custom object
                Object createdAt1 = o1.getCreatedAt();
                Object createdAt2 = o2.getCreatedAt();

                // Assuming createdAt has a method to fetch a Date or ISO 8601 string
                Date date1 = Format.convertToDate(createdAt1);
                Date date2 = Format.convertToDate(createdAt2);

                return date2.compareTo(date1); // Descending order
            } catch (Exception e) {
                e.printStackTrace();
                return 0; // Fallback to equal comparison in case of an error
            }
        });

        filteredOrders.setValue(filteredList);
    }

    // Change the filter status
    public void changeFilterStatus(ORDER_STATUS status) {
        filterStatus.setValue(status);
    }

    // Fetch single order details
    public LiveData<ApiResponse<Order>> getOrder(String orderId) {
        return repository.getOrder(PreferencesHelper.getCustomerData().getCustomerId(), orderId);
    }

    // Return filtered orders for observing in the UI
    public LiveData<List<Order>> getFilteredOrders() {
        return filteredOrders;
    }

    // Reorder items from a given order
    public void reorder(String orderId) {
        Log.d("Order to reorder",orderId);
        List<Order> currentOrders = allOrders.getValue();
        Log.d("Orders",allOrders.getValue().toString());
        if (currentOrders == null) return;

        for (Order order : currentOrders) {
            if (order.getOrderId().equals(orderId)) {
                Log.d("Order found",orderId);
                for (OrderItem orderItem : order.getOrderItems()) {
                    CartViewModel.getInstance()
                            .addItemToCart(orderItem.getProductId(), orderItem.getQuantity())
                            .observeForever(res -> {
                                String message = res.isSuccess()
                                        ? "Added " + orderItem.getProduct().getProductName() + " to cart"
                                        : "Failed to add " + orderItem.getProduct().getProductName() + " to cart";
                                Toast.makeText(context, message, Toast.LENGTH_SHORT).show();
                            });
                }
                break;
            }
        }
    }

    // Cancel an order by updating its status
    public void cancelOrder(String orderId) {
        repository.updateOrderStatus(orderId, PreferencesHelper.getCustomerData().getCustomerId(), ORDER_STATUS.CANCELLED)
                .observeForever(res -> {
                    if (res.isSuccess() && res.getData() == ORDER_STATUS.CANCELLED) {
                        updateOrderStatusLocally(orderId, ORDER_STATUS.CANCELLED);
                        Toast.makeText(context, "Order successfully cancelled.", Toast.LENGTH_SHORT).show();
                    } else {
                        Toast.makeText(context, "Failed to cancel order. Please try again later.", Toast.LENGTH_SHORT).show();
                    }
                });
    }

    // Update order status locally and notify observers
    private void updateOrderStatusLocally(String orderId, ORDER_STATUS newStatus) {
        List<Order> currentOrders = allOrders.getValue();
        if (currentOrders == null) return;

        for (Order order : currentOrders) {
            if (order.getOrderId().equals(orderId)) {
                order.setOrderStatus(newStatus);
                break;
            }
        }
        allOrders.postValue(currentOrders);
    }

    public LiveData<ApiResponse<Boolean>> postUserOrder(double totalPrice, ArrayList<OrderItemRequest> list, PAYMENT_METHOD paymentMethod, CheckoutAddress address, Voucher voucher) {
        return repository.postOrder(PreferencesHelper.getCustomerData().getCustomerId(),totalPrice,list,paymentMethod,address,voucher);
    }
}
