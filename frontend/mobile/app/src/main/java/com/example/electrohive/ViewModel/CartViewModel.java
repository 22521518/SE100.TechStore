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


    public CartViewModel() {
        repository = new CartRepository();
    }


    public LiveData<List<CartItem>> getCart() {
        return repository.getCart(PreferencesHelper.getCustomerData().getCustomerId());

    }

    public LiveData<Boolean> addItemToCart(String productId, int quantity) {
        JsonObject payload = new JsonObject();
        payload.addProperty("product_id", productId);
        payload.addProperty("quantity", quantity);

        return repository.addItemToCart(PreferencesHelper.getCustomerData().getCustomerId(), payload);
    }

    public LiveData<Boolean> updateItemToCart(String productId, int quantity) {
        JsonObject payload = new JsonObject();
        payload.addProperty("product_id", productId);
        payload.addProperty("quantity", quantity);

        return repository.updateCartItem(PreferencesHelper.getCustomerData().getCustomerId(), payload);
    }

    public LiveData<Boolean> deleteCartItem(String productId) {
        return repository.deleteItemFromCart(PreferencesHelper.getCustomerData().getCustomerId(), productId);
    }

    public LiveData<Boolean> deleteAllCartItem() {
        return repository.deleteAllItemsFromCart(PreferencesHelper.getCustomerData().getCustomerId());
    }
}
