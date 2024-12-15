package com.example.electrohive;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import android.content.Context;

import androidx.arch.core.executor.testing.InstantTaskExecutorRule;
import androidx.test.core.app.ApplicationProvider;

import com.example.electrohive.Models.Customer;
import com.example.electrohive.Models.ProductFeedback;
import com.example.electrohive.ViewModel.CustomerViewModel;
import com.example.electrohive.ViewModel.FeedbackViewModel;
import com.example.electrohive.utils.PreferencesHelper;

import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Rule;
import org.junit.Test;

public class FeedbackViewModelTest {
    @Rule
    public InstantTaskExecutorRule instantTaskExecutorRule = new InstantTaskExecutorRule();
    private static FeedbackViewModel feedbackViewModel;

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
        feedbackViewModel = new FeedbackViewModel();
    }

    @Test
    public void testGetProductFeedback_All(){
        final Object lock = new Object();
        feedbackViewModel.getProductFeedback("17fc5a34-9f8a-4dc1-b7bd-944a95fd9d6c","All").observeForever(res -> {
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
    public void testGetProductFeedback_1(){
        final Object lock = new Object();
        feedbackViewModel.getProductFeedback("17fc5a34-9f8a-4dc1-b7bd-944a95fd9d6c","1").observeForever(res -> {
            assertNotNull(res);
            assertTrue(res.isSuccess());
            assertNotNull(res.getData());

            if(!res.getData().isEmpty()) {
                for(ProductFeedback pf: res.getData()) {
                    assertEquals(1,pf.getRating());
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
    public void testGetProductFeedback_2(){
        final Object lock = new Object();
        feedbackViewModel.getProductFeedback("17fc5a34-9f8a-4dc1-b7bd-944a95fd9d6c","2").observeForever(res -> {
            assertNotNull(res);
            assertTrue(res.isSuccess());
            assertNotNull(res.getData());

            if(!res.getData().isEmpty()) {
                for(ProductFeedback pf: res.getData()) {
                    assertEquals(2,pf.getRating());
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
    public void testGetProductFeedback_3(){
        final Object lock = new Object();
        feedbackViewModel.getProductFeedback("17fc5a34-9f8a-4dc1-b7bd-944a95fd9d6c","3").observeForever(res -> {
            assertNotNull(res);
            assertTrue(res.isSuccess());
            assertNotNull(res.getData());

            if(!res.getData().isEmpty()) {
                for(ProductFeedback pf: res.getData()) {
                    assertEquals(3,pf.getRating());
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
    public void testGetProductFeedback_4(){
        final Object lock = new Object();
        feedbackViewModel.getProductFeedback("17fc5a34-9f8a-4dc1-b7bd-944a95fd9d6c","4").observeForever(res -> {
            assertNotNull(res);
            assertTrue(res.isSuccess());
            assertNotNull(res.getData());

            if(!res.getData().isEmpty()) {
                for(ProductFeedback pf: res.getData()) {
                    assertEquals(4,pf.getRating());
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
    public void testGetProductFeedback_5(){
        final Object lock = new Object();
        feedbackViewModel.getProductFeedback("17fc5a34-9f8a-4dc1-b7bd-944a95fd9d6c","5").observeForever(res -> {
            assertNotNull(res);
            assertTrue(res.isSuccess());
            assertNotNull(res.getData());

            if(!res.getData().isEmpty()) {
                for(ProductFeedback pf: res.getData()) {
                    assertEquals(5,pf.getRating());
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
    public void testAddingProductFeedback_3(){
        final Object lock = new Object();
        feedbackViewModel.addProductFeedback("17fc5a34-9f8a-4dc1-b7bd-944a95fd9d6c","test feedback",3).observeForever(res -> {
            assertNotNull(res);
            assertTrue(res.isSuccess());
            assertNotNull(res.getData());
            assertEquals("test feedback",res.getData().getFeedback());
            assertEquals("cm3zduwjq0000xgepnisnou24",res.getData().getCustomerId());
            assertEquals(3,res.getData().getRating());

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
    public void testAddingProductFeedback_6(){
        final Object lock = new Object();
        feedbackViewModel.addProductFeedback("17fc5a34-9f8a-4dc1-b7bd-944a95fd9d6c","test feedback",6).observeForever(res -> {
            assertNotNull(res);
            assertFalse(res.isSuccess());

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
    public void testAddingProductFeedback_0(){
        final Object lock = new Object();
        feedbackViewModel.addProductFeedback("17fc5a34-9f8a-4dc1-b7bd-944a95fd9d6c","test feedback",0).observeForever(res -> {
            assertNotNull(res);
            assertFalse(res.isSuccess());

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
