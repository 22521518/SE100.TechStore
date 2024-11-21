package com.example.electrohive.ViewModel;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.ViewModel;

import com.example.electrohive.Models.Product;
import com.example.electrohive.Models.Voucher;
import com.example.electrohive.Repository.ProductRepository;

import java.util.List;

public class ProductViewModel extends ViewModel {

    private final ProductRepository repository;

    private LiveData<List<Product>> products;
    private LiveData<Product> product;

    public ProductViewModel() {
        repository = new ProductRepository();
    }

    public LiveData<List<Product>> searchProducts(String searchText, String category,String priceRange) {
        return repository.searchProducts(searchText, category, priceRange);
    }


    public LiveData<List<Product>> getAllProducts() {
        if (products == null || !products.hasObservers()) {
            products = repository.getProducts(0); // Ensure repository method is implemented
        }
        return products;
    }

    public LiveData<List<Product>> getProducts(int pageSize) {
        if (products == null || !products.hasObservers()) {
            products = repository.getProducts(pageSize); // Ensure repository method is implemented
        }
        return products;
    }


    public LiveData<Product> getProductDetail(String productId) {
        if (product == null || !product.hasObservers()) {
            product = repository.getProductDetail(productId); // Ensure repository method is implemented
        }
        return product;
    }

}
