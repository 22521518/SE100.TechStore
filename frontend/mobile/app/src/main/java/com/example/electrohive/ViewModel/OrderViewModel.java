package com.example.electrohive.ViewModel;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.Observer;
import androidx.lifecycle.ViewModel;

import com.example.electrohive.Models.CheckoutAddress;
import com.example.electrohive.Models.Enum.ORDER_STATUS;
import com.example.electrohive.Models.Order;
import com.example.electrohive.Models.OrderItemRequest;
import com.example.electrohive.Repository.OrderRepository;
import com.example.electrohive.utils.PreferencesHelper;

import java.util.ArrayList;
import java.util.List;

public class OrderViewModel extends ViewModel {
    private static OrderRepository repository;

    private static MutableLiveData<List<Order>> orders; // MutableLiveData to hold the orders
    private static List<Order> allOrders = new ArrayList<>();  // List to store all fetched orders

    public OrderViewModel() {
        repository = new OrderRepository();
    }

    // Fetch single order using its ID
    public LiveData<Order> getOrder(String orderId) {
        MutableLiveData<Order> orderLiveData = new MutableLiveData<>();

        // Fetch order from repository asynchronously
        repository.getOrder(PreferencesHelper.getCustomerData().getCustomerId(),orderId).observeForever(new Observer<Order>() {
            @Override
            public void onChanged(Order fetchedOrder) {
                orderLiveData.setValue(fetchedOrder);  // Set fetched order
            }
        });

        return orderLiveData;  // Return LiveData for the order
    }

    // This method will fetch the orders and apply filtering if needed
    public LiveData<List<Order>> getOrders(ORDER_STATUS filter) {
        // If orders are not fetched yet or no observers are present, fetch the data
        if (orders == null || !orders.hasObservers()) {
            orders = new MutableLiveData<>();
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
    private void fetchOrders() {
        repository.getOrders(PreferencesHelper.getCustomerData().getCustomerId()).observeForever(new Observer<List<Order>>() {
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


    public static void cancelOrder(String orderId) {
        // Find the order by its ID and change the status to CANCELLED
        for (Order order : allOrders) {
            if (order.getOrderId().equals(orderId)) {
                order.setOrderStatus(ORDER_STATUS.CANCELLED);  // Update the status to CANCELLED
                break;
            }
        }

        // Notify the repository to persist the changes (if required by your repository logic)
        repository.updateOrderStatus(orderId, ORDER_STATUS.CANCELLED);

        // Update LiveData with the new order list
        orders.setValue(allOrders);  // Update LiveData with the modified orders list
    }

    public LiveData<Boolean> postUserOrder(double totalPrice, ArrayList<OrderItemRequest> list, String paymentMethod, CheckoutAddress address) {
        return repository.postOrder(PreferencesHelper.getCustomerData().getCustomerId(),totalPrice,list,paymentMethod,address);
    }
}
