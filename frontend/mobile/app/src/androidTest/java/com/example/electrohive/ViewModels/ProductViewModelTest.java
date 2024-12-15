package com.example.electrohive.ViewModels;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import androidx.arch.core.executor.testing.InstantTaskExecutorRule;

import com.example.electrohive.Models.Product;
import com.example.electrohive.ViewModel.ProductViewModel;

import org.junit.BeforeClass;
import org.junit.Rule;
import org.junit.Test;

public class ProductViewModelTest {
    @Rule
    public InstantTaskExecutorRule instantTaskExecutorRule = new InstantTaskExecutorRule();
    private static ProductViewModel productViewModel;

    @BeforeClass
    public static void setUp() {
        productViewModel = new ProductViewModel();
    }

    @Test
    public void testGetProduct() {
        final Object lock = new Object();
        productViewModel.getAllProducts().observeForever(res -> {
            assertNotNull(res);
            assertTrue(res.isSuccess());
            assertNotNull(res.getData());

            synchronized (lock) {
                lock.notify(); // Notify that the observer has completed
            }
        });

        synchronized (lock) {
            try {
                lock.wait(); // Wait until the observer has processed its data
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
    @Test
    public void testGetProductSize_1() {
        final Object lock = new Object();
        productViewModel.getProducts(2).observeForever(res -> {
            assertNotNull(res);
            assertTrue(res.isSuccess());
            assertNotNull(res.getData());
            assertEquals(2,res.getData().size());

            synchronized (lock) {
                lock.notify(); // Notify that the observer has completed
            }
        });

        synchronized (lock) {
            try {
                lock.wait(); // Wait until the observer has processed its data
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }

    @Test
    public void testGetProductDetail() {
        final Object lock = new Object();
        productViewModel.getProductDetail("17fc5a34-9f8a-4dc1-b7bd-944a95fd9d6c").observeForever(res -> {
            assertNotNull(res);
            assertTrue(res.isSuccess());
            assertNotNull(res.getData());
            assertEquals("17fc5a34-9f8a-4dc1-b7bd-944a95fd9d6c",res.getData().getProductId());

            synchronized (lock) {
                lock.notify(); // Notify that the observer has completed
            }
        });

        synchronized (lock) {
            try {
                lock.wait(); // Wait until the observer has processed its data
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }

    @Test
    public void testSearchProduct(){
        final Object lock = new Object();
        productViewModel.searchProducts("","","").observeForever(res -> {
            assertNotNull(res);
            assertTrue(res.isSuccess());

            synchronized (lock) {
                lock.notify(); // Notify that the observer has completed
            }
        });

        synchronized (lock) {
            try {
                lock.wait(); // Wait until the observer has processed its data
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }

    @Test
    public void testSearchProduct_SearchText(){
        final Object lock = new Object();
        productViewModel.searchProducts("Sony Alpha A7 IV","","").observeForever(res -> {
            assertNotNull(res);
            assertTrue(res.isSuccess());
            assertNotNull(res.getData());

            if(!res.getData().isEmpty()) {
                for(Product product:res.getData()) {
                    assertEquals("Sony Alpha A7 IV",product.getProductName());
                }
            }

            synchronized (lock) {
                lock.notify(); // Notify that the observer has completed
            }
        });

        synchronized (lock) {
            try {
                lock.wait(); // Wait until the observer has processed its data
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }

    @Test
    public void testSearchProduct_Category() {
        final Object lock = new Object();

        productViewModel.searchProducts("", "Cameras", "").observeForever(res -> {
            assertNotNull(res);
            assertTrue(res.isSuccess());
            assertNotNull(res.getData());

            if (!res.getData().isEmpty()) {
                for (Product product : res.getData()) {
                    assertNotNull(product.getCategories());
                    assertFalse(product.getCategories().isEmpty());

                    // Verify at least one category matches the searched category
                    boolean hasMatchingCategory = product.getCategories().stream()
                            .anyMatch(category -> "Cameras".equals(category.getCategoryName()));

                    assertTrue(
                            hasMatchingCategory
                    );
                }
            }

            synchronized (lock) {
                lock.notify(); // Notify that the observer has completed
            }
        });

        synchronized (lock) {
            try {
                lock.wait(); // Wait until the observer has processed its data
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                e.printStackTrace();
            }
        }
    }

    @Test
    public void testSearchProduct_PriceRange_1(){
        final Object lock = new Object();
        productViewModel.searchProducts("","","-10tr VNĐ").observeForever(res -> {
            assertNotNull(res);
            assertTrue(res.isSuccess());
            assertNotNull(res.getData());

            if(!res.getData().isEmpty()) {
                for(Product product:res.getData()) {
                    assertTrue(product.getPrice()<10000000);
                }
            }

            synchronized (lock) {
                lock.notify(); // Notify that the observer has completed
            }
        });

        synchronized (lock) {
            try {
                lock.wait(); // Wait until the observer has processed its data
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
    @Test
    public void testSearchProduct_PriceRange_2(){
        final Object lock = new Object();
        productViewModel.searchProducts("","","10tr - 50tr VNĐ").observeForever(res -> {
            assertNotNull(res);
            assertTrue(res.isSuccess());
            assertNotNull(res.getData());

            if(!res.getData().isEmpty()) {
                for(Product product:res.getData()) {
                    assertTrue(product.getPrice()<50000000);
                    assertTrue(product.getPrice()>10000000);
                }
            }

            synchronized (lock) {
                lock.notify(); // Notify that the observer has completed
            }
        });

        synchronized (lock) {
            try {
                lock.wait(); // Wait until the observer has processed its data
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }

    @Test
    public void testSearchProduct_PriceRange_3(){
        final Object lock = new Object();
        productViewModel.searchProducts("","","50tr+").observeForever(res -> {
            assertNotNull(res);
            assertTrue(res.isSuccess());
            assertNotNull(res.getData());

            if(!res.getData().isEmpty()) {
                for(Product product:res.getData()) {
                    assertTrue(product.getPrice()>50000000);
                }
            }

            synchronized (lock) {
                lock.notify(); // Notify that the observer has completed
            }
        });

        synchronized (lock) {
            try {
                lock.wait(); // Wait until the observer has processed its data
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }


}
