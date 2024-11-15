package com.example.electrohive.ViewModel;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.Observer;
import androidx.lifecycle.ViewModel;

import com.example.electrohive.Models.Enum.ORDER_STATUS;
import com.example.electrohive.Models.Order;
import com.example.electrohive.Repository.OrderRepository;

import java.util.ArrayList;
import java.util.List;

public class OrderViewModel extends ViewModel {
    private final OrderRepository repository;

    private MutableLiveData<List<Order>> orders; // MutableLiveData to hold the orders
    private List<Order> allOrders = new ArrayList<>();  // List to store all fetched orders

    public OrderViewModel() {
        repository = new OrderRepository();
    }

    // This method will fetch the orders and apply filtering if needed
    public LiveData<List<Order>> getOrders(String userId, ORDER_STATUS filter) {
        // If orders are not fetched yet or no observers are present, fetch the data
        if (orders == null || !orders.hasObservers()) {
            orders = new MutableLiveData<>();
            fetchOrders(userId);
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
    private void fetchOrders(String userId) {
        repository.getOrders(userId).observeForever(new Observer<List<Order>>() {
            @Override
            public void onChanged(List<Order> fetchedOrders) {
                if (fetchedOrders != null) {
                    allOrders.clear();
                    allOrders.addAll(fetchedOrders);  // Store fetched orders
                    // Update LiveData with all orders after fetching
                    orders.setValue(allOrders);
                }
            }
        });
    }
}
