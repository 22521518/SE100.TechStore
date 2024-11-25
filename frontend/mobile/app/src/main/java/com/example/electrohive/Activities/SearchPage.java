package com.example.electrohive.Activities;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.MotionEvent;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.view.GravityCompat;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.lifecycle.Observer;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.example.electrohive.Adapters.ProductAdapter;
import com.example.electrohive.Models.Category;
import com.example.electrohive.Models.Customer;
import com.example.electrohive.Models.Product;
import com.example.electrohive.R;
import com.example.electrohive.ViewModel.CategoryViewModel;
import com.example.electrohive.ViewModel.ProductViewModel;
import com.example.electrohive.utils.PreferencesHelper;
import com.google.android.material.navigation.NavigationView;
import com.skydoves.powerspinner.OnSpinnerItemSelectedListener;
import com.skydoves.powerspinner.PowerSpinnerView;

import java.util.ArrayList;
import java.util.List;

import kotlin.collections.IntIterator;

public class SearchPage extends DrawerBasePage {

    private ProgressBar loadingSpinner;
    private List<Product> productList = new ArrayList<>();
    private ProductViewModel productViewModel;
    private CategoryViewModel categoryViewModel;
    private ProductAdapter productAdapter;
    private RecyclerView products_listview;

    private PowerSpinnerView spinner_price_range;
    private PowerSpinnerView spinner_category;

    private String searchText = "";
    private String priceRange = "";
    private String category = "";


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContent(R.layout.search_page);

        Intent intent = getIntent();
        searchText = intent.getStringExtra("SEARCH_TEXT");
        EditText search_input = (EditText)findViewById(R.id.search_input);
        search_input.setText(searchText);
        category = intent.getStringExtra("CATEGORY_NAME");

        spinner_price_range = findViewById(R.id.spinner_price_range);
        spinner_category = findViewById(R.id.spinner_category);

        loadingSpinner = findViewById(R.id.loading_spinner);
        loadingSpinner.setVisibility(View.VISIBLE);

        // Price Range Spinner
        spinner_price_range.setItems(R.array.price_range_options);
        spinner_price_range.selectItemByIndex(0);
        spinner_price_range.setOnSpinnerItemSelectedListener(new OnSpinnerItemSelectedListener<String>() {
            @Override public void onItemSelected(int oldIndex, @Nullable String oldItem, int newIndex, String newItem) {
               priceRange = newItem;
               fetchProducts();
            }
        });

        // Set up CategoryViewModel
        categoryViewModel = new CategoryViewModel();
        categoryViewModel.getCategories().observe(this, new Observer<List<Category>>() {
            @Override
            public void onChanged(List<Category> categories) {
                List<String> categoryNames = new ArrayList<>();
                categoryNames.add("All"); // Add "All" as the first option

                if (categories != null && !categories.isEmpty()) {
                    for (Category category : categories) {
                        categoryNames.add(category.getCategoryName());
                    }
                } else {
                    // Handle empty category list
                    Log.d("CategoryViewModel", "No categories found or error fetching data");
                }

                // Set up the spinner for categories
                spinner_category.setItems(categoryNames);
                spinner_category.setOnSpinnerItemSelectedListener(new OnSpinnerItemSelectedListener<String>() {
                    @Override public void onItemSelected(int oldIndex, @Nullable String oldItem, int newIndex, String newItem) {
                        category = newItem;
                        fetchProducts();
                    }
                });
                spinner_category.selectItemByIndex(0);

                loadingSpinner.setVisibility(View.GONE);
            }
        });

        // Set up ProductViewModel
        productViewModel = new ProductViewModel();
        productAdapter = new ProductAdapter(
                SearchPage.this,
                productList,
                product -> showProductDetail(product.getProductId())
        );
        products_listview = findViewById(R.id.product_listview);
        products_listview.setLayoutManager(new GridLayoutManager(SearchPage.this, 2));
        products_listview.setAdapter(productAdapter);


    }

    private void fetchProducts() {
        loadingSpinner.setVisibility(View.VISIBLE);

        productViewModel.searchProducts(searchText,category,priceRange).observe(this, new Observer<List<Product>>() {
            @Override
            public void onChanged(List<Product> products) {
                if (products != null && !products.isEmpty()) {
                    Log.d("SearchPage", "Fetched products: " + products.size());
                    productAdapter.updateProducts(products); // Update adapter with new data
                } else {

                    productAdapter.updateProducts(new ArrayList<>()); // Pass an empty list to handle the UI state
                }
                loadingSpinner.setVisibility(View.GONE);
            }
        });
    }


    private void showProductDetail(String productId) {
        Intent intent = new Intent(SearchPage.this, ProductDetailPage.class);
        intent.putExtra("PRODUCT_ID", productId);
        startActivity(intent);
    }


}
