package com.example.electrohive.Repository;

import android.util.Log;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.example.electrohive.Models.CartItem;
import com.example.electrohive.Models.Enum.ORDER_STATUS;
import com.example.electrohive.Models.Order;
import com.example.electrohive.Models.Product;
import com.example.electrohive.api.CartService;
import com.example.electrohive.api.OrderService;
import com.example.electrohive.utils.Model.CartUtils;
import com.example.electrohive.utils.Model.ProductUtils;
import com.example.electrohive.utils.RetrofitClient;
import com.example.electrohive.utils.generator.MockOrder;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import java.util.List;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class CartRepository {
    private final CartService cartService;

    public CartRepository() {
        cartService =  RetrofitClient.getClient().create(CartService.class);
    }

    public LiveData<Boolean> deleteItemFromCart(String userId, String productId) {
        MutableLiveData<Boolean> result = new MutableLiveData<>();
        Call<ResponseBody> call = cartService.deleteCartItem(userId, productId);

        try {
            // Synchronous execution
            Response<ResponseBody> response = call.execute();
            if (response.isSuccessful()) {
                // Successfully deleted the specific item
                result.postValue(true);
            } else {
                System.err.println("Error: " + response.errorBody().string());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result; // Return false if an error occurs
    }


    public LiveData<Boolean> deleteAllItemsFromCart(String userId) {
        MutableLiveData<Boolean> result = new MutableLiveData<>();
        result.postValue(false);


        Call<ResponseBody> call = cartService.deleteAllCartItems(userId);

        try {
            // Synchronous execution
            Response<ResponseBody> response = call.execute();
            if (response.isSuccessful()) {
                // Successfully deleted all items
                result.postValue(true);

            } else {
                System.err.println("Error: " + response.errorBody().string());
            }
        } catch (Exception e) {

        }
        return result; // Return false if an error occurs
    }
    public LiveData<Boolean> addItemToCart(String userId, String productId, int quantity) {
        MutableLiveData<Boolean> result = new MutableLiveData<>();
        result.postValue(false);

        JsonObject payload = new JsonObject();
        payload.addProperty("product_id", productId);
        payload.addProperty("quantity", quantity);

        cartService.addCartItem(userId, payload).enqueue(new Callback<JsonObject>() {
            @Override
            public void onResponse(Call<JsonObject> call, Response<JsonObject> response) {
                if (response.isSuccessful()) {
                    result.postValue(true);
                } else {
                }
            }

            @Override
            public void onFailure(Call<JsonObject> call, Throwable t) {
            }
        });
        return  result;
    }



    public LiveData<List<CartItem>> getCart(String userId) {
        MutableLiveData<List<CartItem>> cartData = new MutableLiveData<>();

        cartService.getCart(userId).enqueue(new Callback<JsonArray>() {
            @Override
            public void onResponse(Call<JsonArray> call, Response<JsonArray> response) {
                if (response.isSuccessful() && response.body() != null) {
                    try {
                         List<CartItem> cartItemList = CartUtils.parseCart(response.body());

                        cartData.postValue(cartItemList);
                    } catch (Exception e) {
                        Log.d("Repository Error", "Error parsing response: " + e.getMessage());
                    }
                } else {
                    Log.d("Repository Error", "Failed to load products: " + response.code());
                }
            }

            @Override
            public void onFailure(Call<JsonArray> call, Throwable t) {
                Log.e("Repository Error", "Error making request: " + t.getMessage());
            }
        });
        return cartData;
    }
}
