package com.example.electrohive.ViewModel;

import android.widget.Toast;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.ViewModel;

import com.example.electrohive.Models.CartItem;
import com.example.electrohive.Repository.CartRepository;
import com.example.electrohive.utils.PreferencesHelper;
import com.google.gson.JsonObject;

import java.util.List;

public class CartViewModel extends ViewModel {
    private final CartRepository repository;

    private LiveData<List<CartItem>> cartItems;

    public CartViewModel() {
        repository = new CartRepository();
    }


    public LiveData<List<CartItem>> getCart() {
        if (cartItems == null || !cartItems.hasObservers()) {
            cartItems = repository.getCart(PreferencesHelper.getCustomerData().getAccountId());
        }
        return cartItems;
    }

    public LiveData<Boolean> addItemToCart(String productId, int quantity) {
        JsonObject payload = new JsonObject();
        payload.addProperty("product_id", productId);
        payload.addProperty("quantity", quantity);

        return repository.addItemToCart(PreferencesHelper.getCustomerData().getAccountId(), payload);
    }

    public LiveData<Boolean> updateItemToCart(String productId, int quantity) {
        JsonObject payload = new JsonObject();
        payload.addProperty("product_id", productId);
        payload.addProperty("quantity", quantity);

        return repository.updateCartItem(PreferencesHelper.getCustomerData().getAccountId(), payload);
    }

    public LiveData<Boolean> deleteCartItem(String productId) {
        return repository.deleteItemFromCart(PreferencesHelper.getCustomerData().getAccountId(), productId);
    }

    public LiveData<Boolean> deleteAllCartItem() {
        return repository.deleteAllItemsFromCart(PreferencesHelper.getCustomerData().getAccountId());
    }
}
