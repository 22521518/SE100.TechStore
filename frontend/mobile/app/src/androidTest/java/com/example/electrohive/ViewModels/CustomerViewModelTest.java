package com.example.electrohive.ViewModels;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import android.content.Context;

import androidx.arch.core.executor.testing.InstantTaskExecutorRule;
import androidx.test.core.app.ApplicationProvider;

import com.example.electrohive.Models.Account;
import com.example.electrohive.Models.Customer;
import com.example.electrohive.ViewModel.CustomerViewModel;
import com.example.electrohive.utils.PreferencesHelper;

import org.junit.BeforeClass;
import org.junit.Rule;
import org.junit.Test;

public class CustomerViewModelTest {
    @Rule
    public InstantTaskExecutorRule instantTaskExecutorRule = new InstantTaskExecutorRule();
    private static CustomerViewModel customerViewModel;


    @BeforeClass
    public static void setUp() {
        Context context = ApplicationProvider.getApplicationContext();
        PreferencesHelper.init(context);
        Customer customer = new Customer();
        customer.setCustomerId("cm3zduwjq0000xgepnisnou24");
        PreferencesHelper.saveCustomerData(customer);
        customerViewModel = CustomerViewModel.getInstance();


    }

    @Test
    public void testGetCustomer() {
        final Object lock = new Object();
        customerViewModel.getCustomer("cm3zduwjq0000xgepnisnou24").observeForever(res -> {
            assertNotNull(res);
            assertTrue(res.isSuccess());
            assertEquals("cm3zduwjq0000xgepnisnou24",res.getData().getCustomerId());
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
    public void testSignUp() {
        final Object lock = new Object();
        customerViewModel.signUp(
                new Account("test@gmail.com","12345678"),
                new Customer("1",
                "1",
                "test", "Test User",
                "0987654321",
                "",
                "2024-11-13T17:00:00.000Z",
                "2024-11-13T17:00:00.000Z")).observeForever(res -> {
            assertNotNull(res);
            assertTrue(res.isSuccess());
            assertEquals("test",res.getData().getUsername());
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
    public void testUpdateCustomer_1() {
        final Object lock = new Object();
        customerViewModel.updateCustomer(
                new Customer(
                        "cm3zduwjq0000xgepnisnou24",
                        "cm3zduwk10001xgepy7hwsw4w",
                        "chaule123", "Chau Le",
                        "0963852741",
                        "",
                        "2024-11-13T17:00:00.000Z",
                        "2024-11-13T17:00:00.000Z")).observeForever(res -> {
            assertNotNull(res);
            assertTrue(res.isSuccess());
            assertEquals("cm3zduwjq0000xgepnisnou24",res.getData().getCustomerId());
            assertEquals("chaule123",res.getData().getUsername());
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
    public void testUpdateCustomer_2() {
        final Object lock = new Object();
        customerViewModel.updateCustomer(
                new Customer(
                        "cm3zduwjq0000xgepnisnou24",
                        "cm3zduwk10001xgepy7hwsw4w",
                        "chaule321", "Chau Le",
                        "0963852741",
                        "",
                        "2024-11-13T17:00:00.000Z",
                        "2024-11-13T17:00:00.000Z")).observeForever(res -> {
            assertNotNull(res);
            assertTrue(res.isSuccess());
            assertEquals("cm3zduwjq0000xgepnisnou24",res.getData().getCustomerId());
            assertEquals("chaule321",res.getData().getUsername());
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
