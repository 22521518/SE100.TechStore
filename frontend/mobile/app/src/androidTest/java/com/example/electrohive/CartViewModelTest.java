package com.example.electrohive;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import android.content.Context;
import android.util.Log;

import androidx.arch.core.executor.testing.InstantTaskExecutorRule;
import androidx.lifecycle.LiveData;
import androidx.test.core.app.ApplicationProvider;

import com.example.electrohive.Models.Address;
import com.example.electrohive.Models.ApiResponse;
import com.example.electrohive.Models.CartItem;
import com.example.electrohive.Models.Customer;
import com.example.electrohive.ViewModel.AddressViewModel;
import com.example.electrohive.ViewModel.CartViewModel;
import com.example.electrohive.utils.PreferencesHelper;

import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Rule;
import org.junit.Test;

import java.lang.ref.PhantomReference;

public class CartViewModelTest {
    @Rule
    public InstantTaskExecutorRule instantTaskExecutorRule = new InstantTaskExecutorRule();
    private static CartViewModel cartViewModel;


    @BeforeClass
    public static void setUp() {
        Context context = ApplicationProvider.getApplicationContext();
        PreferencesHelper.init(context);
        Customer customer = new Customer();
        customer.setCustomerId("cm3zduwjq0000xgepnisnou24");
        PreferencesHelper.saveCustomerData(customer);


    }

    @Before
    public void setUpBeforeEach(){
        cartViewModel = CartViewModel.getInstance();
    }


    @Test
    public void testFetchCartFromServer_success() {
        final Object lock = new Object();
        cartViewModel.fetchCartFromServer().observeForever(res -> {
            assertNotNull(res);
            assertTrue(res.isSuccess());
            assertNotNull(res.getData());
            assertFalse(res.getData().isEmpty());
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
    public void testAddItemToCart_success() {
        final Object lock = new Object();
        // Mocking the repository response
        cartViewModel.addItemToCart("17fc5a34-9f8a-4dc1-b7bd-944a95fd9d6c",1).observeForever(res -> {
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
    public void testAddItemToCart_success_1() {
        final Object lock = new Object();
        // Mocking the repository response
        cartViewModel.addItemToCart("17fc5a34-9f8a-4dc1-b7bd-944a95fd9d6c",7).observeForever(res -> {
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
    public void testAddItemToCart_success_2() {
        final Object lock = new Object();
        // Mocking the repository response
        cartViewModel.addItemToCart("17fc5a34-9f8a-4dc1-b7bd-944a95fd9d6c",8).observeForever(res -> {
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
    public void testUpdateItemToCart_success() {
        final Object lock = new Object();
        cartViewModel.updateItemToCart("17fc5a34-9f8a-4dc1-b7bd-944a95fd9d6c",2).observeForever(res -> {
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
    public void testDeleteCartItem_success() {
        final Object lock = new Object();
        cartViewModel.deleteCartItem("17fc5a34-9f8a-4dc1-b7bd-944a95fd9d6c").observeForever(res -> {
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
    public void testDeleteAllCartItem_success() {
        final Object lock = new Object();
        cartViewModel.deleteAllCartItem().observeForever(res -> {
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
}
