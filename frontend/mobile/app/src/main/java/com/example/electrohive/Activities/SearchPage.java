package com.example.electrohive.Activities;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.Spinner;
import android.widget.TextView;

import androidx.activity.EdgeToEdge;
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

    private Spinner spinner_price_range;
    private Spinner spinner_category;

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
        ArrayAdapter<CharSequence> priceRangeAdapter = ArrayAdapter.createFromResource(
                this,
                R.array.price_range_options,
                android.R.layout.simple_spinner_item
        );
        priceRangeAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spinner_price_range.setAdapter(priceRangeAdapter);

        // Set listener for price range spinner
        spinner_price_range.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                priceRange = parent.getItemAtPosition(position).toString();
                // Trigger the search again with the updated price range
                fetchProducts();
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {
                // Optional: handle no selection
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

                // Create adapter for spinner
                ArrayAdapter<String> categoryAdapter = new ArrayAdapter<>(
                        SearchPage.this,
                        android.R.layout.simple_spinner_item,
                        categoryNames
                );
                categoryAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
                spinner_category.setAdapter(categoryAdapter);

                spinner_category.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
                    @Override
                    public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                        category = parent.getItemAtPosition(position).toString();
                        // Treat "All" as no category filter
                        fetchProducts();
                    }

                    @Override
                    public void onNothingSelected(AdapterView<?> parent) {
                        // Optional: handle no selection
                    }
                });

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
