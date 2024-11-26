package com.example.electrohive.ViewModel;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.ViewModel;

import com.example.electrohive.Models.Category;
import com.example.electrohive.Models.Product;
import com.example.electrohive.Repository.CategoryRepository;
import com.example.electrohive.Repository.ProductRepository;

import java.util.List;

public class CategoryViewModel extends ViewModel {
    private final CategoryRepository repository;

    private LiveData<List<Category>> categories;

    public CategoryViewModel() {
        repository = new CategoryRepository();
    }

    public LiveData<List<Category>> getCategories() {
        if (categories == null || !categories.hasObservers()) {
            categories = repository.getCategories(); // Ensure repository method is implemented
        }
        return categories;
    }


}
