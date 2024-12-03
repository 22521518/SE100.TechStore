package com.example.electrohive.ViewModel;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.example.electrohive.Models.CartItem;
import com.example.electrohive.Repository.CartRepository;
import com.example.electrohive.utils.PreferencesHelper;
import com.google.gson.JsonObject;

import java.util.List;

public class CartViewModel extends ViewModel {
    private final CartRepository repository;

    private static CartViewModel instance;

    private final MutableLiveData<List<CartItem>> cart = new MutableLiveData<>();

    // Private constructor to enforce singleton pattern
    private CartViewModel() {
        repository = new CartRepository();
        fetchCartFromServer(); // Initialize cart from server
    }

    // Singleton instance
    public static synchronized CartViewModel getInstance() {
        if (instance == null) {
            instance = new CartViewModel();
        }
        return instance;
    }

    // Fetch cart from the server and update the local cart LiveData
    public LiveData<List<CartItem>> fetchCartFromServer() {
        LiveData<List<CartItem>> serverCart = repository.getCart(PreferencesHelper.getCustomerData().getCustomerId());
        serverCart.observeForever(cart::setValue); // Update local cart when server cart changes
        return serverCart;
    }

    // Get the current cart LiveData
    public LiveData<List<CartItem>> getCart() {
        return cart;
    }

    // Add item to cart and update local cart
    public LiveData<Boolean> addItemToCart(String productId, int quantity) {
        JsonObject payload = new JsonObject();
        payload.addProperty("product_id", productId);
        payload.addProperty("quantity", quantity);

        LiveData<Boolean> result = repository.addItemToCart(PreferencesHelper.getCustomerData().getCustomerId(), payload);
        result.observeForever(success -> {
            if (Boolean.TRUE.equals(success)) {
                fetchCartFromServer(); // Refresh cart from server on success
            }
        });
        return result;
    }

    // Update item in cart and synchronize local cart
    public LiveData<Boolean> updateItemToCart(String productId, int quantity) {
        JsonObject payload = new JsonObject();
        payload.addProperty("product_id", productId);
        payload.addProperty("quantity", quantity);

        LiveData<Boolean> result = repository.updateCartItem(PreferencesHelper.getCustomerData().getCustomerId(), payload);
        result.observeForever(success -> {
            if (Boolean.TRUE.equals(success)) {
                fetchCartFromServer(); // Refresh cart from server on success
            }
        });
        return result;
    }

    // Delete a single item from the cart and update local cart
    public LiveData<Boolean> deleteCartItem(String productId) {
        LiveData<Boolean> result = repository.deleteItemFromCart(PreferencesHelper.getCustomerData().getCustomerId(), productId);
        result.observeForever(success -> {
            if (Boolean.TRUE.equals(success)) {
                fetchCartFromServer(); // Refresh cart from server on success
            }
        });
        return result;
    }

    // Delete all items from the cart and clear local cart
    public LiveData<Boolean> deleteAllCartItem() {
        LiveData<Boolean> result = repository.deleteAllItemsFromCart(PreferencesHelper.getCustomerData().getCustomerId());
        result.observeForever(success -> {
            if (Boolean.TRUE.equals(success)) {
                cart.setValue(null); // Clear local cart
            }
        });
        return result;
    }
}
