package com.example.electrohive.ViewModel;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.Observer;
import androidx.lifecycle.ViewModel;

import com.example.electrohive.Models.Enum.ORDER_STATUS;
import com.example.electrohive.Models.Order;
import com.example.electrohive.Repository.OrderRepository;
import com.example.electrohive.utils.PreferencesHelper;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class OrderViewModel extends ViewModel {

    private final OrderRepository repository;
    private final MutableLiveData<List<Order>> orders;
    private List<Order> allOrders;
    private ExecutorService executor;

    public OrderViewModel() {
        repository = new OrderRepository();
        orders = new MutableLiveData<>();
        allOrders = new ArrayList<>();
        executor = Executors.newSingleThreadExecutor(); // Create a single-threaded executor for background tasks
    }

    // Fetch single order using its ID
    public LiveData<Order> getOrder(String orderId) {
        return repository.getOrder(PreferencesHelper.getCustomerData().getCustomerId(), orderId);
    }

    // This method will fetch the orders and apply filtering if needed
    public LiveData<List<Order>> getOrders(ORDER_STATUS filter) {
        // Fetch orders if not already fetched
        if (orders.getValue() == null || allOrders.isEmpty()) {
            fetchOrders();
        }

        // Apply filter on existing list if filter is provided
        if (filter != null) {
            List<Order> filteredOrders = new ArrayList<>();
            for (Order order : allOrders) {
                if (order.getOrderStatus() == filter) {
                    filteredOrders.add(order);
                }
            }
            orders.setValue(filteredOrders);  // Set filtered orders to LiveData
        } else {
            orders.setValue(allOrders);  // No filter, set all orders
        }

        return orders;
    }

    // Method to fetch orders from repository and store them
    // Method to fetch orders from repository and store them
    private void fetchOrders() {
        // Fetch orders asynchronously
        LiveData<List<Order>> fetchedOrders = repository.getOrders(PreferencesHelper.getCustomerData().getCustomerId());
        fetchedOrders.observeForever(orderList -> {
            if (orderList != null) {
                allOrders.clear();
                allOrders.addAll(orderList);  // Store fetched orders
                orders.postValue(allOrders);  // Update LiveData on the main thread
            }
        });
    }

    // Cancel an order
    public void cancelOrder(String orderId) {
        for (Order order : allOrders) {
            if (order.getOrderId().equals(orderId)) {
                order.setOrderStatus(ORDER_STATUS.CANCELLED);  // Update the status to CANCELLED
                break;
            }
        }

        // Notify the repository to persist the changes (if required by your repository logic)
        repository.updateOrderStatus(orderId, ORDER_STATUS.CANCELLED);

        // Update LiveData with the new order list
        orders.postValue(allOrders);  // Update LiveData with the modified orders list
    }
}