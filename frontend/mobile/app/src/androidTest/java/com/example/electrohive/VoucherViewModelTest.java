package com.example.electrohive;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import android.content.Context;
import android.util.Log;

import androidx.arch.core.executor.testing.InstantTaskExecutorRule;
import androidx.test.core.app.ApplicationProvider;

import com.example.electrohive.Models.Customer;
import com.example.electrohive.ViewModel.CartViewModel;
import com.example.electrohive.ViewModel.VoucherViewModel;
import com.example.electrohive.utils.PreferencesHelper;

import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;


public class VoucherViewModelTest {
    @Rule
    public InstantTaskExecutorRule instantTaskExecutorRule = new InstantTaskExecutorRule();
    private VoucherViewModel voucherViewModel;


    @Before
    public void setUp() {
        voucherViewModel = new VoucherViewModel();
    }

    @Test
    public void testGetVoucher() {
        final Object lock = new Object();

        voucherViewModel.getVouchers().observeForever(res -> {
            if (res != null) {
                // Log the data size from the response
                Log.d("VoucherViewModelTest", "Length of the vouchers: " + (res.getData() != null ? res.getData().size() : "No data"));

                assertNotNull("Response should not be null", res);
                assertTrue("Response should be successful", res.isSuccess());
                assertNotNull("Data should not be null", res.getData());
                assertFalse("Data should not be empty", res.getData().isEmpty());
            } else {
                Log.d("VoucherViewModelTest", "Received null response.");
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
