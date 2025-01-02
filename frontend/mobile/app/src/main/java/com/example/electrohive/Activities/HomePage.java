package com.example.electrohive.Activities;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.ProgressBar;
import android.widget.Toast;

import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.electrohive.Adapters.ProductAdapter;
import com.example.electrohive.Models.Product;
import com.example.electrohive.R;
import com.example.electrohive.ViewModel.ProductViewModel;

import java.util.ArrayList;
import java.util.List;

public class HomePage extends DrawerBasePage {

    private ProgressBar loadingSpinner;
    private List<Product> productList = new ArrayList<>();
    private ProductViewModel productViewModel;
    private ProductAdapter productAdapter;
    private RecyclerView products_listview;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContent(R.layout.home_page);


        loadingSpinner = findViewById(R.id.loading_spinner);


        productViewModel = new ProductViewModel();
        productAdapter = new ProductAdapter(
                HomePage.this,
                productList,
                product -> showProductDetail(product.getProductId())
        );
        products_listview = findViewById(R.id.product_listview);
        products_listview.setLayoutManager(new GridLayoutManager(HomePage.this, 2));
        products_listview.setAdapter(productAdapter);

        // Observe the LiveData
        fetchProducts();

    }

    @Override
    protected void onResume() {
        super.onResume();
        fetchProducts();
    }

    private void fetchProducts() {
        loadingSpinner.setVisibility(View.VISIBLE);
        productViewModel.getProducts(16).observe(this, apiResponse -> {
            if (apiResponse != null && apiResponse.isSuccess()) {
                // Check if the response is successful
                List<Product> products = apiResponse.getData();
                if (products != null) {
                    // Update the adapter with new data
                    productAdapter.updateProducts(products);  // Method to update the adapter data
                }
            } else {
                // Handle failure or error response
                String errorMessage = apiResponse != null ? apiResponse.getMessage() : "An error occurred while fetching products.";
                Toast.makeText(getApplicationContext(), errorMessage, Toast.LENGTH_SHORT).show();
            }

            // Hide loading spinner after data is loaded or error occurs
            loadingSpinner.setVisibility(View.GONE);
        });
    }

    private void showProductDetail(String productId) {
        Intent intent = new Intent(HomePage.this,ProductDetailPage.class);
        intent.putExtra("PRODUCT_ID",productId);
        startActivity(intent);
    }


}