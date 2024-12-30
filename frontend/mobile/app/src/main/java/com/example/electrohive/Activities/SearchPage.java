package com.example.electrohive.Activities;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.EditText;
import android.widget.ProgressBar;

import androidx.annotation.Nullable;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.electrohive.Adapters.ProductAdapter;
import com.example.electrohive.Models.Category;
import com.example.electrohive.Models.Product;
import com.example.electrohive.R;
import com.example.electrohive.ViewModel.CategoryViewModel;
import com.example.electrohive.ViewModel.ProductViewModel;
import com.skydoves.powerspinner.OnSpinnerItemSelectedListener;
import com.skydoves.powerspinner.PowerSpinnerView;

import java.util.ArrayList;
import java.util.List;

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
        categoryViewModel.getCategories().observe(this, apiResponse -> {
            // Check if the response is not null and the request was successful
            if (apiResponse != null && apiResponse.isSuccess()) {
                List<Category> categories = apiResponse.getData();  // Get the actual list of categories

                List<String> categoryNames = new ArrayList<>();
                categoryNames.add("All"); // Add "All" as the first option

                if (categories != null && !categories.isEmpty()) {
                    for (Category category : categories) {
                        categoryNames.add(category.getCategoryName());
                    }
                } else {
                    // Handle empty category list
                    Log.d("CategoryViewModel", "No categories found.");
                }

                // Set up the spinner for categories
                spinner_category.setItems(categoryNames);
                spinner_category.setOnSpinnerItemSelectedListener(new OnSpinnerItemSelectedListener<String>() {
                    @Override
                    public void onItemSelected(int oldIndex, @Nullable String oldItem, int newIndex, String newItem) {
                        category = newItem;
                        fetchProducts();
                    }
                });
                spinner_category.selectItemByIndex(0);  // Select "All" by default

            } else {
                // Handle failure scenario (success = false)
                String errorMessage = apiResponse != null ? apiResponse.getMessage() : "Failed to load categories.";
                Log.d("CategoryViewModel", errorMessage);
            }

            // Hide the loading spinner once data has been processed
            loadingSpinner.setVisibility(View.GONE);
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

        productViewModel.searchProducts(searchText, category, priceRange).observe(this, apiResponse -> {
            // Check if the response is not null and the request was successful
            if (apiResponse != null && apiResponse.isSuccess()) {
                List<Product> products = apiResponse.getData();  // Get the actual list of products

                if (products != null && !products.isEmpty()) {
                    Log.d("SearchPage", "Fetched products: " + products.size());
                    productAdapter.updateProducts(products); // Update adapter with new data
                } else {
                    Log.d("SearchPage", "No products found.");
                    productAdapter.updateProducts(new ArrayList<>()); // Pass an empty list to handle the UI state
                }

            } else {
                // Handle failure scenario (success = false)
                String errorMessage = apiResponse != null ? apiResponse.getMessage() : "Failed to search products.";
                Log.d("SearchPage", errorMessage);

                productAdapter.updateProducts(new ArrayList<>()); // Update UI with empty list in case of error
            }

            // Hide the loading spinner once data has been processed
            loadingSpinner.setVisibility(View.GONE);
        });

    }


    private void showProductDetail(String productId) {
        Intent intent = new Intent(SearchPage.this, ProductDetailPage.class);
        intent.putExtra("PRODUCT_ID", productId);
        startActivity(intent);
    }


}
