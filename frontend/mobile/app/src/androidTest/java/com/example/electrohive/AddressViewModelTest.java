package com.example.electrohive;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import android.content.Context;
import android.util.Log;

import androidx.lifecycle.LiveData;

import androidx.arch.core.executor.testing.InstantTaskExecutorRule;
import androidx.test.core.app.ApplicationProvider;

import com.example.electrohive.Models.Address;
import com.example.electrohive.Models.ApiResponse;
import com.example.electrohive.Models.Customer;
import com.example.electrohive.ViewModel.AccountViewModel;
import com.example.electrohive.ViewModel.AddressViewModel;
import com.example.electrohive.utils.PreferencesHelper;

import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Rule;
import org.junit.Test;

import java.util.List;
import java.util.Random;

public class AddressViewModelTest {
    @Rule
    public InstantTaskExecutorRule instantTaskExecutorRule = new InstantTaskExecutorRule();
    private static AddressViewModel addressViewModel;


    @BeforeClass
    public static void setup() {
        Context context = ApplicationProvider.getApplicationContext();
        PreferencesHelper.init(context);
        Customer customer = new Customer();
        customer.setCustomerId("cm3zduwjq0000xgepnisnou24");
        PreferencesHelper.saveCustomerData(customer);
        addressViewModel = new AddressViewModel();


    }

    @Before
    public void setUp() {
        addressViewModel.getAddress();
    }

    @Test
    public void getAddress_withDataAvailable() {
        final Object lock = new Object();
        addressViewModel.getAddress().observeForever(res -> {
            // Assert
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

    private String generateRandomPhoneNumber() {
        Random random = new Random();
        // Ensure the first digit is non-zero to simulate a valid phone number
        StringBuilder phoneNumber = new StringBuilder("9");
        for (int i = 0; i < 9; i++) {
            phoneNumber.append(random.nextInt(10));
        }
        return phoneNumber.toString();
    }

    @Test
    public void addAddress_validData() {
        final Object lock = new Object();
        String randomPhoneNumber = generateRandomPhoneNumber();
        Address newAddress = new Address("12", randomPhoneNumber, "Los Angeles", "Hollywood", "CA", "Jane Doe", randomPhoneNumber, false);
        LiveData<ApiResponse<Boolean>> resultLiveData = addressViewModel.addAddress(newAddress);

        resultLiveData.observeForever(res1 -> {

            // Assert
            assertNotNull(res1);
            assertTrue(res1.isSuccess());
            assertEquals("Address added successfully", res1.getMessage());
            assertNotNull(res1.getData());
            assertTrue(res1.getData());


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
    public void updateAddress_existingAddress() {
        final Object lock = new Object();
        Address updatedAddress = new Address("59", "Along", "Thành phố Đà Nẵng", "Huyện Hòa Vang", "Xã Hòa Châu", "Updated Name", "0987654321", false);

        LiveData<ApiResponse<Boolean>> resultLiveData = addressViewModel.updateAddress(updatedAddress);

        resultLiveData.observeForever(res1 -> {
            // Assert
            assertNotNull(res1);
            assertTrue(res1.isSuccess());
            assertEquals("Address updated successfully", res1.getMessage());
            assertNotNull(res1.getData());
            assertTrue(res1.getData());

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
    public void deleteAddress_existingAddress() {
        final Object lock = new Object();
        addressViewModel.getAddress().observeForever(res -> {
            // Fetch current addresses to delete one
            Address addressToDelete = res.getData().get(res.getData().size() - 1); // Assume there is at least one address

            // Check if address ID is "59", skip the test for this case
            if ("59".equals(addressToDelete.getAddressId())) {
                System.out.println("Address ID is 59. Skipping delete operation.");
                synchronized (lock) {
                    lock.notify(); // Notify and exit the test
                }
                return;
            }

            LiveData<ApiResponse<Boolean>> resultLiveData = addressViewModel.deleteAddress(addressToDelete.getAddressId());

            resultLiveData.observeForever(res1 -> {
                // Assert
                assertNotNull(res1);
                assertTrue(res1.isSuccess());
                assertEquals("Address deleted successfully", res1.getMessage());
                assertNotNull(res1.getData());
                assertTrue(res1.getData());
                synchronized (lock) {
                    lock.notify(); // Notify that the observer has completed
                }
            });

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
    public void setDefaultAddress_validAddressId() {
        final Object lock = new Object();
        // Arrange

        addressViewModel.setDefaultAddress("59").observeForever(res1 -> {

            assertNotNull(res1);
            assertTrue(res1.isSuccess());
            assertEquals("Address successfully updated", res1.getMessage());
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
