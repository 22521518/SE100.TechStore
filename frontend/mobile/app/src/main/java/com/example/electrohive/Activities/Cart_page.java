package com.example.electrohive.Activities;

import android.os.Bundle;
import android.widget.CheckBox;
import android.widget.ImageButton;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.electrohive.Adapters.ProductCartAdapter;
import com.example.electrohive.Models.CartItem;
import com.example.electrohive.Models.Product;
import com.example.electrohive.R;
import com.example.electrohive.api.ApiService;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import java.util.ArrayList;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class Cart_page extends AppCompatActivity {

    private String customer_id = "9a810d7f-a98d-42e5-ae1e-ce5316fedc10";
    ImageButton deleteItem;
    private ArrayList<CartItem> cartItems;
    private ProductCartAdapter adapter; // Adapter for RecyclerView
    private ArrayList<CartItem> checkedItems;

    private CheckBox checkAll;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.cart);
        checkAll=findViewById(R.id.checkAll);
        cartItems=new ArrayList<>();
        // Initialize RecyclerView
        RecyclerView recyclerView = findViewById(R.id.rc_trend);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));
        adapter = new ProductCartAdapter(this,cartItems); // Initialize adapter
        recyclerView.setAdapter(adapter);
        checkAll.setOnCheckedChangeListener((buttonView,isChecked)->{
            for(CartItem item:cartItems)
            {
                item.setChecked(isChecked);
            }
            adapter.notifyDataSetChanged();
        });
        // Initialize Retrofit
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl("https://se100-techstore.onrender.com/") // Base URL
                .addConverterFactory(GsonConverterFactory.create()) // Use Gson for JSON parsing
                .build();
        ApiService apiService = retrofit.create(ApiService.class);

        // API Call
        Call<JsonArray> call = apiService.getCart(customer_id);
        call.enqueue(new Callback<JsonArray>() {
            @Override
            public void onResponse(Call<JsonArray> call, Response<JsonArray> response) {
                if (response.isSuccessful() && response.body() != null) {
                    try {
                        System.out.println("Response: " + response.body().toString());
                        // Parse JSON response
                        JsonArray resultsArray = response.body();
                        Gson gson = new Gson();
                        for(JsonElement element : resultsArray)
                        {
                            JsonObject cartItemJson = element.getAsJsonObject();
                            String idCustomer = cartItemJson.get("customer_id").getAsString();
                            String idProduct = cartItemJson.get("product_id").getAsString();
                            int quantity = cartItemJson.get("quantity").getAsInt();
                            Product product = gson.fromJson(cartItemJson.get("product"), Product.class);

                            // Create CartItem object and add to list
                            CartItem cartItem = new CartItem(idCustomer, idProduct, quantity,product);
                            cartItems.add(cartItem);
                        }
                        for (CartItem item : cartItems) {
                            System.out.println("CartItem: " + item);
                        }
                        // Notify adapter of data changes
                        adapter.notifyDataSetChanged();

                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                } else {
                    System.err.println("Error: " + response.message());
                }
            }

            @Override
            public void onFailure(Call<JsonArray> call, Throwable t) {
                t.printStackTrace();
            }
        });
    }

    private ArrayList<CartItem> getCheckedItem()
    {
        ArrayList<CartItem> checkedItems =new ArrayList<>();
        for(CartItem item: cartItems){
            if(item.isChecked())
                checkedItems.add(item);
        }
        return checkedItems;
    }
}
