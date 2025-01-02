package com.example.electrohive.ViewModel;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.example.electrohive.Models.ApiResponse;
import com.example.electrohive.Models.CartItem;
import com.example.electrohive.Repository.CartRepository;
import com.example.electrohive.utils.PreferencesHelper;
import com.google.gson.JsonObject;

import java.util.List;

public class CartViewModel extends ViewModel {
    private final CartRepository repository;

    private static CartViewModel instance;

    private final MutableLiveData<ApiResponse<List<CartItem>>> cart = new MutableLiveData<>();

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
    public LiveData<ApiResponse<List<CartItem>>> fetchCartFromServer() {
        LiveData<ApiResponse<List<CartItem>>> serverCart = repository.getCart(PreferencesHelper.getCustomerData().getCustomerId());
        serverCart.observeForever(apiResponse -> cart.setValue(apiResponse)); // Update local cart when server cart changes
        return serverCart;
    }

    // Get the current cart LiveData
    public LiveData<ApiResponse<List<CartItem>>> getCart() {
        return cart;
    }



    // Add item to cart and update local cart
    public LiveData<ApiResponse<Boolean>> addItemToCart(String productId, int quantity) {
        JsonObject payload = new JsonObject();
        payload.addProperty("product_id", productId);
        payload.addProperty("quantity", quantity);

        LiveData<ApiResponse<Boolean>> result = repository.addItemToCart(PreferencesHelper.getCustomerData().getCustomerId(), payload);
        result.observeForever(apiResponse -> {
            if (apiResponse.isSuccess()) {
                fetchCartFromServer(); // Refresh cart from server on success
            }
        });
        return result;
    }

    // Update item in cart and synchronize local cart
    public LiveData<ApiResponse<Boolean>> updateItemToCart(String productId, int quantity) {
        JsonObject payload = new JsonObject();
        payload.addProperty("product_id", productId);
        payload.addProperty("quantity", quantity);

        LiveData<ApiResponse<Boolean>> result = repository.updateCartItem(PreferencesHelper.getCustomerData().getCustomerId(), payload);
        result.observeForever(apiResponse -> {
            if (apiResponse.isSuccess()) {
                fetchCartFromServer(); // Refresh cart from server on success
            }
        });
        return result;
    }

    // Delete a single item from the cart and update local cart
    public LiveData<ApiResponse<Boolean>> deleteCartItem(String productId) {
        LiveData<ApiResponse<Boolean>> result = repository.deleteItemFromCart(PreferencesHelper.getCustomerData().getCustomerId(), productId);
        result.observeForever(apiResponse -> {
            if (apiResponse.isSuccess()) {
                fetchCartFromServer(); // Refresh cart from server on success
            }
        });
        return result;
    }

    // Delete all items from the cart and clear local cart
    public LiveData<ApiResponse<Boolean>> deleteAllCartItem() {
        LiveData<ApiResponse<Boolean>> result = repository.deleteAllItemsFromCart(PreferencesHelper.getCustomerData().getCustomerId());
        result.observeForever(apiResponse -> {
            if (apiResponse.isSuccess()) {
                fetchCartFromServer(); // Refresh cart from server on success
            }
        });
        return result;
    }
}

