package com.example.electrohive.Repository;

import android.util.Log;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.example.electrohive.Models.Category;
import com.example.electrohive.Models.Product;
import com.example.electrohive.Models.ProductAttribute;
import com.example.electrohive.Models.ProductFeedback;
import com.example.electrohive.Models.ProductImage;
import com.example.electrohive.api.ProductService;
import com.example.electrohive.utils.Model.ProductUtils;
import com.example.electrohive.utils.RetrofitClient;
import com.example.electrohive.utils.generator.MockProduct;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ProductRepository {

    private final ProductService productService;

    public ProductRepository() {
        productService = RetrofitClient.getClient().create(ProductService.class);
    }




    public LiveData<List<Product>> searchProducts(String searchText, String category, String priceRange) {
        MutableLiveData<List<Product>> filteredProductData = new MutableLiveData<>();

        // Fetch all products if not already fetched
        getProducts(0).observeForever(products -> {
            if (products != null && !products.isEmpty()) {
                List<Product> filteredProducts = new ArrayList<>(products);

                // Filter by search text (product name)
                if (searchText != null && !searchText.isEmpty()) {
                    filteredProducts = ProductUtils.filterBySearchText(filteredProducts, searchText);
                }

                // Filter by category
                if (category != null && !category.isEmpty()) {
                    filteredProducts = ProductUtils.filterByCategory(filteredProducts, category);
                }

                // Filter by price range
                if (priceRange != null && !priceRange.isEmpty()) {
                    filteredProducts = ProductUtils.filterByPriceRange(filteredProducts, priceRange);
                }

                // Post filtered data
                filteredProductData.postValue(filteredProducts);
            }
        });

        return filteredProductData;
    }

    public LiveData<List<Product>> getProducts(int pageSize) {
        MutableLiveData<List<Product>> productData = new MutableLiveData<>();

        productService.getProducts(pageSize).enqueue(new Callback<JsonArray>() {
            @Override
            public void onResponse(Call<JsonArray> call, Response<JsonArray> response) {
                if (response.isSuccessful() && response.body() != null) {
                    try {
                        List<Product> products = ProductUtils.parseProducts(response.body());
                        productData.postValue(products);
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

        return productData;
    }

    public LiveData<Product> getProductDetail(String id) {
        MutableLiveData<Product> productData = new MutableLiveData<>();

        productService.getProductDetail(id).enqueue(new Callback<JsonObject>() {
            @Override
            public void onResponse(Call<JsonObject> call, Response<JsonObject> response) {
                if (response.isSuccessful() && response.body() != null) {
                    try {
                        JsonObject resultProduct = response.body();

                        // Extract fields from JSON
                        String productId = resultProduct.get("product_id").getAsString();
                        String productName = resultProduct.get("product_name").getAsString();
                        JsonArray imagesArray = resultProduct.get("images").getAsJsonArray();
                        String description = resultProduct.get("description").getAsString();
                        float price = resultProduct.get("price").getAsFloat();
                        float discount = resultProduct.get("discount").getAsFloat();
                        int stockQuantity = resultProduct.get("stock_quantity").getAsInt();
                        JsonArray categoriesArray = resultProduct.get("categories").getAsJsonArray();
                        JsonArray productFeedbacksArray = resultProduct.get("product_feedbacks").getAsJsonArray();
                        JsonArray attributesArray = resultProduct.get("attributes").getAsJsonArray();

                        // Convert JSON arrays to lists
                        List<ProductImage> imageList = ProductUtils.parseImages(imagesArray);
                        List<Category> categoryList = ProductUtils.parseCategories(categoriesArray);
                        List<ProductFeedback> productFeedbackList = parseProductFeedbacks(productFeedbacksArray);
                        List<ProductAttribute> attributeList = ProductUtils.parseAttributes(attributesArray);

                        // Create Product object
                        Product product = new Product(
                                productId, productName, imageList, description, price, discount,
                                stockQuantity, categoryList, attributeList
                        );
                        product.setProductFeedbacks(productFeedbackList);

                        // Update LiveData
                        productData.postValue(product);
                    } catch (Exception e) {
                        Log.e("Repository Error", "Error parsing response: " + e.getMessage());
                    }
                } else {
                    Log.e("Repository Error", "Failed to load product: " + response.code());
                }
            }

            @Override
            public void onFailure(Call<JsonObject> call, Throwable t) {
                Log.e("Repository Error", "Error making request: " + t.getMessage());
            }
        });

        return productData;
    }

    private List<ProductFeedback> parseProductFeedbacks(JsonArray feedbackArray) {
        List<ProductFeedback> productFeedbackList = new ArrayList<>();
        for (int i = 0; i < feedbackArray.size(); i++) {
            JsonObject feedbackJson = feedbackArray.get(i).getAsJsonObject();
            String feedbackId = feedbackJson.get("feedback_id").getAsString();
            String productId = feedbackJson.get("product_id").getAsString();
            String customerId = feedbackJson.get("customer_id").getAsString();
            String feedback = feedbackJson.get("feedback").getAsString();
            int rating = feedbackJson.get("rating").getAsInt();
            String createdAt = feedbackJson.get("created_at").getAsString();

            ProductFeedback productFeedback = new ProductFeedback(feedbackId, customerId, productId, rating, feedback, createdAt);
            productFeedbackList.add(productFeedback);
        }
        return productFeedbackList;
    }
}
