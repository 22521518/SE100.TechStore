package com.example.electrohive.UIs;

import static androidx.test.espresso.Espresso.onView;
import static androidx.test.espresso.action.ViewActions.scrollTo;
import static androidx.test.espresso.assertion.ViewAssertions.matches;
import static androidx.test.espresso.matcher.ViewMatchers.isDisplayed;
import static androidx.test.espresso.matcher.ViewMatchers.withId;

import android.content.Context;
import android.content.Intent;

import androidx.test.core.app.ApplicationProvider;
import androidx.test.espresso.intent.Intents;
import androidx.test.ext.junit.rules.ActivityScenarioRule;

import com.example.electrohive.Activities.AccountChangePasswordPage;
import com.example.electrohive.Activities.AccountOrderPage;
import com.example.electrohive.Models.Customer;
import com.example.electrohive.R;
import com.example.electrohive.ViewModel.CustomerViewModel;
import com.example.electrohive.utils.PreferencesHelper;

import org.junit.After;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Rule;
import org.junit.Test;

public class AccountOrderPageTest {
    // Set up the mocked LiveData for getSessionCustomer
    private static final Customer mockCustomer = new Customer(
            "cm3zduwjq0000xgepnisnou24",
            "cm3zduwk10001xgepy7hwsw4w",
            "chaule321",
            "Chau le",
            "0963852741",
            "https://res.cloudinary.com/dtajf7sn8/image/upload/v1732716980/customers/o3nhhli42v6of0tl0hsz.jpg",
            "2024-11-13T17:00:00.000Z",
            "2024-11-27T04:25:50.150Z"
    );


    @BeforeClass
    public static void setUp() {
        Context context = ApplicationProvider.getApplicationContext();
        PreferencesHelper.init(context);
        PreferencesHelper.saveCustomerData(mockCustomer);
        CustomerViewModel.getInstance().setSessionCustomer(mockCustomer);

    }


    @Before
    public void setUpForEach() {
        Intents.init(); // Initialize intents for testing navigation

    }


    @After
    public void tearDown() {
        Intents.release();
    }


    @Rule
    public ActivityScenarioRule<AccountOrderPage> activityRule = new ActivityScenarioRule<>(new Intent(ApplicationProvider.getApplicationContext(), AccountOrderPage.class));

    @Test
    public void testVisibilityOfViews(){
        onView(withId(R.id.AllOrders)).perform(scrollTo()).check(matches(isDisplayed()));
        onView(withId(R.id.PendingOrders)).perform(scrollTo()).check(matches(isDisplayed()));
        onView(withId(R.id.ConfirmedOrders)).perform(scrollTo()).check(matches(isDisplayed()));
        onView(withId(R.id.ShippedOrder)).perform(scrollTo()).check(matches(isDisplayed()));
        onView(withId(R.id.DeliveredOrders)).perform(scrollTo()).check(matches(isDisplayed()));
        onView(withId(R.id.CancelledOrders)).perform(scrollTo()).check(matches(isDisplayed()));
    }
}
