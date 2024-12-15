package com.example.electrohive;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import androidx.arch.core.executor.testing.InstantTaskExecutorRule;

import com.example.electrohive.ViewModel.CartViewModel;
import com.example.electrohive.ViewModel.CategoryViewModel;

import org.junit.BeforeClass;
import org.junit.Rule;
import org.junit.Test;

public class CategoryViewModelTest {
    @Rule
    public InstantTaskExecutorRule instantTaskExecutorRule = new InstantTaskExecutorRule();
    private static CategoryViewModel categoryViewModel;

    @BeforeClass
    public static void setUp(){
        categoryViewModel = new CategoryViewModel();
    }

    @Test
    public void testGetCategories(){
        final Object lock = new Object();
        categoryViewModel.getCategories().observeForever(res -> {
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
}
