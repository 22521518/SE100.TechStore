package com.example.electrohive.utils.Model;

import com.example.electrohive.Models.CartItem;
import com.example.electrohive.Models.Category;
import com.example.electrohive.Models.Product;
import com.example.electrohive.Models.ProductAttribute;
import com.example.electrohive.Models.ProductImage;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import java.util.ArrayList;
import java.util.List;

public class CartUtils {
    public static CartItem parseCartItem(JsonObject productJson) {
        CartItem cartItem = null;

        // Use JsonObject's safe method to check for the presence of keys before accessing
        String productId = productJson.has("product_id") ? productJson.get("product_id").getAsString() : "";
        String customerId = productJson.has("customer_id") ? productJson.get("customer_id").getAsString() : "";
        JsonObject product = productJson.has("product") ? productJson.get("product").getAsJsonObject() : new JsonObject();
        int quantity = productJson.has("quantity") ? productJson.get("quantity").getAsInt() : 0;

        // Convert JSON arrays to lists of objects
        Product productItem = ProductUtils.parseProduct(product);

        // Create Product object and add it to the list
        cartItem = new CartItem(customerId,productId,quantity,productItem);

        return cartItem;
    }

    public static List<CartItem> parseCart(JsonArray resultsArray) {
        List<CartItem> cartItems = new ArrayList<>();
        for (JsonElement element : resultsArray) {
            JsonObject productJson = element.getAsJsonObject();
            CartItem item = parseCartItem(productJson);
            if(item!=null){
                cartItems.add(item);
            }
        }
        return cartItems;
    }
}
