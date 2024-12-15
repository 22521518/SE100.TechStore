package com.example.electrohive;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import android.content.Context;

import androidx.arch.core.executor.testing.InstantTaskExecutorRule;
import androidx.test.core.app.ApplicationProvider;

import com.example.electrohive.Models.CheckoutAddress;
import com.example.electrohive.Models.Customer;
import com.example.electrohive.Models.Enum.PAYMENT_METHOD;
import com.example.electrohive.Models.OrderItemRequest;
import com.example.electrohive.ViewModel.OrderViewModel;
import com.example.electrohive.utils.PreferencesHelper;

import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Rule;
import org.junit.Test;

import java.util.ArrayList;
import java.util.Arrays;

public class OrderViewModelTest {
    @Rule
    public InstantTaskExecutorRule instantTaskExecutorRule = new InstantTaskExecutorRule();
    private static OrderViewModel orderViewModel;

    @BeforeClass
    public static void setUp() {
        Context context = ApplicationProvider.getApplicationContext();
        PreferencesHelper.init(context);
        Customer customer = new Customer();
        customer.setCustomerId("cm3zduwjq0000xgepnisnou24");
        PreferencesHelper.saveCustomerData(customer);

    }

    @Before
    public void setUpForEach() {
        Context context = ApplicationProvider.getApplicationContext();
        orderViewModel = new OrderViewModel(context);
    }

    @Test
    public void testGetOrder() {
        final Object lock = new Object();
        orderViewModel.getOrder("cm4jpeoj20002yk6v4gy5y7u0").observeForever(res -> {
            assertNotNull(res);
            assertTrue(res.isSuccess());
            assertNotNull(res.getData());
            assertEquals("cm4jpeoj20002yk6v4gy5y7u0", res.getData().getOrderId());


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
    public void testPostOrder() {
        final Object lock = new Object();

        orderViewModel.postUserOrder(
                10000,
                new ArrayList<>(Arrays.asList(new OrderItemRequest("78ce3619-1205-485f-a937-bee6d7b0f7f3", 1, 1200, 1200)
        )),
                PAYMENT_METHOD.COD,
                new CheckoutAddress("test", "test", "test", "test", "test", "0987654321"),
                null).observeForever(res -> {
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
