package com.example.electrohive.Activities;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.view.GravityCompat;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.lifecycle.Observer;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.example.electrohive.Adapters.ProductAdapter;
import com.example.electrohive.Models.Category;
import com.example.electrohive.Models.Customer;
import com.example.electrohive.Models.Product;
import com.example.electrohive.Models.Voucher;
import com.example.electrohive.R;
import com.example.electrohive.ViewModel.CategoryViewModel;
import com.example.electrohive.ViewModel.ProductViewModel;
import com.example.electrohive.utils.PreferencesHelper;
import com.google.android.material.navigation.NavigationView;

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
        productViewModel.getProducts(16).observe(this, new Observer<List<Product>>() {
            @Override
            public void onChanged(List<Product> products) {
                // Update the adapter with new data
                if (products != null) {
                    productAdapter.updateProducts(products);  // Method to update the adapter data
                }
                loadingSpinner.setVisibility(View.GONE);
            }
        });
    }

    private void showProductDetail(String productId) {
        Intent intent = new Intent(HomePage.this,ProductDetailPage.class);
        intent.putExtra("PRODUCT_ID",productId);
        startActivity(intent);
    }


}