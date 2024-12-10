package com.example.electrohive.Repository;

import android.util.Log;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.example.electrohive.Models.ApiResponse;
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

    public LiveData<ApiResponse<Boolean>> deleteItemFromCart(String userId, String productId) {
        MutableLiveData<ApiResponse<Boolean>> result = new MutableLiveData<>();

        cartService.deleteCartItem(userId, productId).enqueue(new Callback<JsonObject>() {
            @Override
            public void onResponse(Call<JsonObject> call, Response<JsonObject> response) {
                if (response.isSuccessful()) {
                    result.postValue(new ApiResponse<>(true, true, "Item deleted successfully", response.code()));
                } else {
                    result.postValue(new ApiResponse<>(false, false, "Failed to delete item" , response.code()));
                }
            }

            @Override
            public void onFailure(Call<JsonObject> call, Throwable t) {
                result.postValue(new ApiResponse<>(false, false, "Exception: " + t.getMessage(), 500));
            }
        });
        return result;
    }


    // Delete all items from cart
    public LiveData<ApiResponse<Boolean>> deleteAllItemsFromCart(String userId) {
        MutableLiveData<ApiResponse<Boolean>> result = new MutableLiveData<>();
        result.postValue(new ApiResponse<>(false, false, "Failed to delete items", 500));

        cartService.deleteAllCartItems(userId).enqueue(new Callback<JsonObject>() {
            @Override
            public void onResponse(Call<JsonObject> call, Response<JsonObject> response) {
                if (response.isSuccessful()) {
                    result.postValue(new ApiResponse<>(true, true, "Item deleted successfully", response.code()));
                } else {
                    result.postValue(new ApiResponse<>(false, false, "Failed to delete item" , response.code()));
                }
            }

            @Override
            public void onFailure(Call<JsonObject> call, Throwable t) {
                result.postValue(new ApiResponse<>(false, false, "Exception: " + t.getMessage(), 500));
            }
        });
        return result;
    }
    // Add item to cart
    public LiveData<ApiResponse<Boolean>> addItemToCart(String userId, JsonObject payload) {
        MutableLiveData<ApiResponse<Boolean>> result = new MutableLiveData<>();

        cartService.addCartItem(userId, "application/json", payload).enqueue(new Callback<JsonObject>() {
            @Override
            public void onResponse(Call<JsonObject> call, Response<JsonObject> response) {
                if (response.isSuccessful()) {
                    result.postValue(new ApiResponse<>(true, true, "Item added to cart successfully", response.code()));
                } else {
                    result.postValue(new ApiResponse<>(false, false, "Failed to add item", response.code()));
                }
            }

            @Override
            public void onFailure(Call<JsonObject> call, Throwable t) {
                result.postValue(new ApiResponse<>(false, false, "Request failed: " + t.getMessage(), 500));
            }
        });

        return result;
    }

    // Update cart item
    public LiveData<ApiResponse<Boolean>> updateCartItem(String userId, JsonObject payload) {
        MutableLiveData<ApiResponse<Boolean>> result = new MutableLiveData<>();

        cartService.patchCartItem(userId, "application/json", payload).enqueue(new Callback<JsonObject>() {
            @Override
            public void onResponse(Call<JsonObject> call, Response<JsonObject> response) {
                if (response.isSuccessful()) {
                    result.postValue(new ApiResponse<>(true, true, "Cart item updated successfully", response.code()));
                } else {
                    result.postValue(new ApiResponse<>(false, false, "Failed to update item", response.code()));
                }
            }

            @Override
            public void onFailure(Call<JsonObject> call, Throwable t) {
                result.postValue(new ApiResponse<>(false, false, "Request failed: " + t.getMessage(), 500));
            }
        });

        return result;
    }



    // Get cart items
    public LiveData<ApiResponse<List<CartItem>>> getCart(String userId) {
        MutableLiveData<ApiResponse<List<CartItem>>> cartData = new MutableLiveData<>();

        cartService.getCart(userId).enqueue(new Callback<JsonArray>() {
            @Override
            public void onResponse(Call<JsonArray> call, Response<JsonArray> response) {
                if (response.isSuccessful() && response.body() != null) {
                    try {
                        List<CartItem> cartItemList = CartUtils.parseCart(response.body());
                        cartData.postValue(new ApiResponse<>(true, cartItemList, "Cart items fetched successfully", response.code()));
                    } catch (Exception e) {
                        cartData.postValue(new ApiResponse<>(false, null, "Error parsing response: " + e.getMessage(), response.code()));
                        Log.d("Repository Error", "Error parsing response: " + e.getMessage());
                    }
                } else {
                    cartData.postValue(new ApiResponse<>(false, null, "Failed to load cart", response.code()));
                    Log.d("Repository Error", "Failed to load products: " + response.code());
                }
            }

            @Override
            public void onFailure(Call<JsonArray> call, Throwable t) {
                cartData.postValue(new ApiResponse<>(false, null, "Error making request: " + t.getMessage(), 500));
                Log.e("Repository Error", "Error making request: " + t.getMessage());
            }
        });

        return cartData;
    }
}
