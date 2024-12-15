package com.example.electrohive;

import androidx.arch.core.executor.testing.InstantTaskExecutorRule;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.Observer;
import androidx.test.core.app.ApplicationProvider;
import androidx.test.runner.AndroidJUnit4;

import com.example.electrohive.Models.Account;
import com.example.electrohive.Models.ApiResponse;
import com.example.electrohive.Models.Customer;
import com.example.electrohive.Repository.AccountRepository;
import com.example.electrohive.Repository.CustomerRepository;
import com.example.electrohive.ViewModel.AccountViewModel;
import com.example.electrohive.utils.PreferencesHelper;

import androidx.test.platform.app.InstrumentationRegistry;

import org.junit.After;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import static org.junit.Assert.*;
import static org.mockito.Mockito.*;

import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;

public class AccountViewModelTest {
    @Rule
    public InstantTaskExecutorRule instantTaskExecutorRule = new InstantTaskExecutorRule();
    private static AccountViewModel accountViewModel;


    @BeforeClass
    public static void setUp() {
        // Mock user data in PreferencesHelper
        Context context = ApplicationProvider.getApplicationContext();
        PreferencesHelper.init(context);
        Customer customer = new Customer();
        customer.setCustomerId("cm3zduwjq0000xgepnisnou24");
        PreferencesHelper.saveCustomerData(customer);
        accountViewModel = new AccountViewModel();


    }


    @Test
    public void login_withValidCredentials_triggersSuccessfulLogin() {
        final Object lock = new Object();
        // Arrange
        String email = "notfuny4927@gmail.com";
        String password = "11111111";

        // Act
        LiveData<ApiResponse<Boolean>> resultLiveData = accountViewModel.login(email, password);
        resultLiveData.observeForever(res -> {
            // Assert
            ApiResponse<Boolean> result = res;
            assertNotNull(result);
            assertTrue(result.isSuccess());
            assertEquals("Login successful", result.getMessage());
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
    public void login_withInvalidCredentials_triggersError() {
        final Object lock = new Object();
        // Arrange
        String email = "notfuny4927@gmail.com";
        String password = "12345678";

        // Act
        LiveData<ApiResponse<Boolean>> resultLiveData = accountViewModel.login(email, password);
        resultLiveData.observeForever(res->{
            // Assert
            ApiResponse<Boolean> result = res;
            assertNotNull(result);
            assertFalse(result.isSuccess());
            assertEquals("Incorrect email or password", result.getMessage());
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
    public void changePassword_withValidCurrentPassword_triggersSuccess() {
        final Object lock = new Object();
        // Arrange
        String currentPassword = "11111111";
        String newPassword = "11111111";


        // Act
        LiveData<ApiResponse<Boolean>> resultLiveData = accountViewModel.changePassword(currentPassword, newPassword);
        resultLiveData.observeForever(res -> {
            // Assert
            ApiResponse<Boolean> result = res;
            assertNotNull(result);
            assertTrue(result.isSuccess());
            assertEquals("Password updated successfully", result.getMessage());
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
    public void changePassword_withInvalidCurrentPassword_triggersError() {
        final Object lock = new Object();
        // Arrange
        String currentPassword = "11111112";
        String newPassword = "11111111";

        // Act
        LiveData<ApiResponse<Boolean>> resultLiveData = accountViewModel.changePassword(currentPassword, newPassword);
        resultLiveData.observeForever(res-> {
            // Assert
            ApiResponse<Boolean> result = res;
            assertNotNull(result);
            assertFalse(result.isSuccess());
            assertEquals("Current password is incorrect", result.getMessage());
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
