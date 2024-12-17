package com.example.electrohive.UIs;

import static androidx.test.espresso.Espresso.onView;
import static androidx.test.espresso.assertion.ViewAssertions.matches;
import static androidx.test.espresso.matcher.ViewMatchers.isDisplayed;
import static androidx.test.espresso.matcher.ViewMatchers.withId;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;

import androidx.test.core.app.ApplicationProvider;
import androidx.test.espresso.intent.Intents;
import androidx.test.ext.junit.rules.ActivityScenarioRule;

import com.example.electrohive.Activities.ProductDetailPage;
import com.example.electrohive.Activities.ProductFeedbackPage;
import com.example.electrohive.Models.Customer;
import com.example.electrohive.R;
import com.example.electrohive.ViewModel.CustomerViewModel;
import com.example.electrohive.utils.PreferencesHelper;

import org.junit.After;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Rule;
import org.junit.Test;

public class ProductFeedbackPageTest {
    static Intent intent;

    static {
        intent = new Intent(ApplicationProvider.getApplicationContext(), ProductFeedbackPage.class);
        Bundle bundle = new Bundle();
        bundle.putString("PRODUCT_ID", "17fc5a34-9f8a-4dc1-b7bd-944a95fd9d6c");
        intent.putExtras(bundle);
    }

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
    public ActivityScenarioRule<ProductFeedbackPage> activityRule = new ActivityScenarioRule<>(intent);

    @Test
    public void testVisibilityOfViews(){
        // Check PowerSpinnerView visibility
        onView(withId(R.id.feedback_filter_spinner)).check(matches(isDisplayed()));

        // Check footer elements
        onView(withId(R.id.feedback_rating)).check(matches(isDisplayed()));
        onView(withId(R.id.textArea)).check(matches(isDisplayed()));
        onView(withId(R.id.send_feedback_button)).check(matches(isDisplayed()));

    }


}

