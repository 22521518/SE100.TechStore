package com.example.electrohive.Repository;

import android.util.Log;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.example.electrohive.Models.ApiResponse;
import com.example.electrohive.Models.Category;
import com.example.electrohive.api.CategoryService;
import com.example.electrohive.utils.RetrofitClient;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class CategoryRepository {
    private final CategoryService categoryService;

    // Constructor
    public CategoryRepository() {
        categoryService = RetrofitClient.getClient().create(CategoryService.class);
    }

    // Fetch Categories
    public LiveData<ApiResponse<List<Category>>> getCategories() {
        MutableLiveData<ApiResponse<List<Category>>> categoryResponseData = new MutableLiveData<>();

        categoryService.getCategories().enqueue(new Callback<JsonArray>() {
            @Override
            public void onResponse(Call<JsonArray> call, Response<JsonArray> response) {
                if (response.isSuccessful() && response.body() != null) {
                    try {
                        JsonArray results = response.body();
                        List<Category> categories = new ArrayList<>();

                        // Parse JSON into Category objects
                        for (JsonElement element : results) {
                            JsonObject category = element.getAsJsonObject();
                            int id = category.get("category_id").getAsInt(); // Match "category_id"
                            String categoryName = category.get("category_name").getAsString();
                            String description = category.get("description").getAsString();

                            // Create Category object
                            Category cate = new Category(id, categoryName, description);
                            categories.add(cate);
                        }

                        // Post success response
                        ApiResponse<List<Category>> apiResponse = new ApiResponse<>(
                                true,
                                categories,
                                "Categories fetched successfully",
                                response.code()
                        );
                        categoryResponseData.postValue(apiResponse);
                    } catch (Exception e) {
                        Log.e("Repository Error", "Error parsing response: " + e.getMessage());

                        // Post error response
                        ApiResponse<List<Category>> apiResponse = new ApiResponse<>(
                                false,
                                null,
                                "Error parsing response: " + e.getMessage(),
                                response.code()
                        );
                        categoryResponseData.postValue(apiResponse);
                    }
                } else {
                    Log.e("Repository Error", "Failed to load categories: " + response.code());

                    // Post error response
                    ApiResponse<List<Category>> apiResponse = new ApiResponse<>(
                            false,
                            null,
                            "Failed to load categories",
                            response.code()
                    );
                    categoryResponseData.postValue(apiResponse);
                }
            }

            @Override
            public void onFailure(Call<JsonArray> call, Throwable t) {
                Log.e("Repository Error", "Error making request: " + t.getMessage());

                // Post failure response
                ApiResponse<List<Category>> apiResponse = new ApiResponse<>(
                        false,
                        null,
                        "Error making request: " + t.getMessage(),
                        500
                );
                categoryResponseData.postValue(apiResponse);
            }
        });

        return categoryResponseData;
    }
}
