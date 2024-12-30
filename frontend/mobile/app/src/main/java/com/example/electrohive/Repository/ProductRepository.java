package com.example.electrohive.Repository;

import android.util.Log;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.example.electrohive.Models.ApiResponse;
import com.example.electrohive.Models.Category;
import com.example.electrohive.Models.Product;
import com.example.electrohive.Models.ProductAttribute;
import com.example.electrohive.Models.ProductFeedback;
import com.example.electrohive.Models.ProductImage;
import com.example.electrohive.api.ProductService;
import com.example.electrohive.utils.Model.FeedbackUtils;
import com.example.electrohive.utils.Model.ProductUtils;
import com.example.electrohive.utils.RetrofitClient;
import com.google.gson.JsonArray;
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




    public LiveData<ApiResponse<List<Product>>> searchProducts(String searchText, String category, String priceRange) {
        MutableLiveData<ApiResponse<List<Product>>> filteredProductData = new MutableLiveData<>();

        getProducts(0).observeForever(apiResponse -> {
            if (apiResponse != null) {
                // Check if the API response is successful
                if (apiResponse.isSuccess()) {
                    List<Product> products = apiResponse.getData();

                    // If products are not null or empty, apply filters
                    if (products != null && !products.isEmpty()) {
                        List<Product> filteredProducts = new ArrayList<>(products);

                        // Apply search text filter if provided
                        if (searchText != null && !searchText.isEmpty()) {
                            filteredProducts = ProductUtils.filterBySearchText(filteredProducts, searchText);
                        }

                        // Apply category filter if provided
                        if (category != null && !category.isEmpty()) {
                            filteredProducts = ProductUtils.filterByCategory(filteredProducts, category);
                        }

                        // Apply price range filter if provided
                        if (priceRange != null && !priceRange.isEmpty()) {
                            filteredProducts = ProductUtils.filterByPriceRange(filteredProducts, priceRange);
                        }

                        // Wrap the filtered products in an ApiResponse and post it
                        ApiResponse<List<Product>> filteredApiResponse = new ApiResponse<>(true, filteredProducts, "Products fetched successfully", 200);
                        filteredProductData.postValue(filteredApiResponse);
                    } else {
                        // If no products were found
                        ApiResponse<List<Product>> emptyResponse = new ApiResponse<>(false, null, "No products found", 404);
                        filteredProductData.postValue(emptyResponse);
                    }
                } else {
                    // Handle failed API response
                    ApiResponse<List<Product>> errorResponse = new ApiResponse<>(false, null, apiResponse.getMessage(), apiResponse.getStatusCode());
                    filteredProductData.postValue(errorResponse);
                }
            } else {
                // Handle null API response
                ApiResponse<List<Product>> nullResponse = new ApiResponse<>(false, null, "Error: No response from API", 500);
                filteredProductData.postValue(nullResponse);
            }
        });


        return filteredProductData;
    }

    public LiveData<ApiResponse<List<Product>>> getProducts(int pageSize) {
        MutableLiveData<ApiResponse<List<Product>>> productData = new MutableLiveData<>();

        productService.getProducts(pageSize).enqueue(new Callback<JsonArray>() {
            @Override
            public void onResponse(Call<JsonArray> call, Response<JsonArray> response) {
                if (response.isSuccessful() && response.body() != null) {
                    try {
                        List<Product> products = ProductUtils.parseProducts(response.body());
                        ApiResponse<List<Product>> apiResponse = new ApiResponse<>(true, products, "Products loaded successfully", response.code());
                        productData.postValue(apiResponse);
                    } catch (Exception e) {
                        Log.d("Repository Error", "Error parsing response: " + e.getMessage());
                        ApiResponse<List<Product>> apiResponse = new ApiResponse<>(false, null, "Error parsing response", 500);
                        productData.postValue(apiResponse);
                    }
                } else {
                    Log.d("Repository Error", "Failed to load products: " + response.code());
                    ApiResponse<List<Product>> apiResponse = new ApiResponse<>(false, null, "Failed to load products", response.code());
                    productData.postValue(apiResponse);
                }
            }

            @Override
            public void onFailure(Call<JsonArray> call, Throwable t) {
                Log.e("Repository Error", "Error making request: " + t.getMessage());
                ApiResponse<List<Product>> apiResponse = new ApiResponse<>(false, null, "Request failed: " + t.getMessage(), 500);
                productData.postValue(apiResponse);
            }
        });

        return productData;
    }

    public LiveData<ApiResponse<Product>> getProductDetail(String id) {
        MutableLiveData<ApiResponse<Product>> productData = new MutableLiveData<>();

        productService.getProductDetail(id).enqueue(new Callback<JsonObject>() {
            @Override
            public void onResponse(Call<JsonObject> call, Response<JsonObject> response) {
                if (response.isSuccessful() && response.body() != null) {
                    try {
                        JsonObject resultProduct = response.body();

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

                        List<ProductImage> imageList = ProductUtils.parseImages(imagesArray);
                        List<Category> categoryList = ProductUtils.parseCategories(categoriesArray);
                        List<ProductFeedback> productFeedbackList = FeedbackUtils.parseProductFeedbacks(productFeedbacksArray);
                        List<ProductAttribute> attributeList = ProductUtils.parseAttributes(attributesArray);

                        Product product = new Product(
                                productId, productName, imageList, description, price, discount,
                                stockQuantity, categoryList, attributeList
                        );
                        product.setProductFeedbacks(productFeedbackList);

                        ApiResponse<Product> apiResponse = new ApiResponse<>(true, product, "Product details fetched successfully", response.code());
                        productData.postValue(apiResponse);
                    } catch (Exception e) {
                        Log.e("Repository Error", "Error parsing response: " + e.getMessage());
                        ApiResponse<Product> apiResponse = new ApiResponse<>(false, null, "Error parsing response", 500);
                        productData.postValue(apiResponse);
                    }
                } else {
                    Log.e("Repository Error", "Failed to load product: " + response.code());
                    ApiResponse<Product> apiResponse = new ApiResponse<>(false, null, "Failed to load product", response.code());
                    productData.postValue(apiResponse);
                }
            }

            @Override
            public void onFailure(Call<JsonObject> call, Throwable t) {
                Log.e("Repository Error", "Error making request: " + t.getMessage());
                ApiResponse<Product> apiResponse = new ApiResponse<>(false, null, "Request failed: " + t.getMessage(), 500);
                productData.postValue(apiResponse);
            }
        });

        return productData;
    }


}
