package com.example.electrohive.ViewModel;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.ViewModel;

import com.example.electrohive.Models.ApiResponse;
import com.example.electrohive.Models.Category;
import com.example.electrohive.Repository.CategoryRepository;

import java.util.List;

public class CategoryViewModel extends ViewModel {
    private final CategoryRepository repository;

    // LiveData to hold the ApiResponse
    private LiveData<ApiResponse<List<Category>>> categoryResponse;

    public CategoryViewModel() {
        repository = new CategoryRepository();
    }

    // Expose LiveData of ApiResponse
    public LiveData<ApiResponse<List<Category>>> getCategories() {
        if (categoryResponse == null) {
            categoryResponse = repository.getCategories();
        }
        return categoryResponse;
    }


}
