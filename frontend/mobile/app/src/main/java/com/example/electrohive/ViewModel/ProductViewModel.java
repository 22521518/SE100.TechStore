package com.example.electrohive.ViewModel;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.ViewModel;

import com.example.electrohive.Models.ApiResponse;
import com.example.electrohive.Models.Product;
import com.example.electrohive.Models.Voucher;
import com.example.electrohive.Repository.ProductRepository;

import java.util.List;

public class ProductViewModel extends ViewModel {

    private final ProductRepository repository;


    public ProductViewModel() {
        repository = new ProductRepository();
    }

    public LiveData<ApiResponse<List<Product>>> searchProducts(String searchText, String category, String priceRange) {
        return repository.searchProducts(searchText, category, priceRange);
    }


    public LiveData<ApiResponse<List<Product>>> getAllProducts() {
        return repository.getProducts(0); // Use the repository method
    }

    // Get products with specific page size
    public LiveData<ApiResponse<List<Product>>> getProducts(int pageSize) {
        return repository.getProducts(pageSize); // Use the repository method
    }


    public LiveData<ApiResponse<Product>> getProductDetail(String productId) {
        return repository.getProductDetail(productId); // Use the repository method
    }

}
