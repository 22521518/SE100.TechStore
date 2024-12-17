package com.example.electrohive.UIs;

import static androidx.test.espresso.Espresso.onView;
import static androidx.test.espresso.action.ViewActions.click;
import static androidx.test.espresso.action.ViewActions.replaceText;
import static androidx.test.espresso.assertion.ViewAssertions.matches;
import static androidx.test.espresso.intent.Intents.intended;
import static androidx.test.espresso.intent.Intents.times;
import static androidx.test.espresso.intent.matcher.IntentMatchers.hasComponent;
import static androidx.test.espresso.intent.matcher.IntentMatchers.hasExtra;
import static androidx.test.espresso.matcher.ViewMatchers.isAssignableFrom;
import static androidx.test.espresso.matcher.ViewMatchers.isChecked;
import static androidx.test.espresso.matcher.ViewMatchers.isDisplayed;
import static androidx.test.espresso.matcher.ViewMatchers.withId;

import static org.hamcrest.CoreMatchers.allOf;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.TextView;

import androidx.test.core.app.ApplicationProvider;
import androidx.test.espresso.UiController;
import androidx.test.espresso.ViewAction;
import androidx.test.espresso.intent.Intents;
import androidx.test.ext.junit.rules.ActivityScenarioRule;

import com.example.electrohive.Activities.AccountOrderPage;
import com.example.electrohive.Activities.AccountPage;
import com.example.electrohive.Activities.CartPage;
import com.example.electrohive.Activities.CheckoutPage;
import com.example.electrohive.Activities.ProductFeedbackPage;
import com.example.electrohive.Models.Customer;
import com.example.electrohive.R;
import com.example.electrohive.ViewModel.CustomerViewModel;
import com.example.electrohive.utils.PreferencesHelper;

import org.hamcrest.Matcher;
import org.junit.After;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Rule;
import org.junit.Test;

public class CartPageTest {

    public static ViewAction setTextInTextView(final String value){
        return new ViewAction() {
            @SuppressWarnings("unchecked")
            @Override
            public Matcher<View> getConstraints() {
                return allOf(isDisplayed(), isAssignableFrom(TextView.class));
                //
                // To check that the found view is TextView or it's subclass like EditText
                // so it will work for TextView and it's descendants
            }

            @Override
            public void perform(UiController uiController, View view) {
                ((TextView) view).setText(value);
            }

            @Override
            public String getDescription() {
                return "replace text";
            }
        };
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
    public ActivityScenarioRule<CartPage> activityRule = new ActivityScenarioRule<>(new Intent(ApplicationProvider.getApplicationContext(), CartPage.class));

    @Test
    public void testVisibilityOfViews() throws InterruptedException {
        onView(withId(R.id.checkAll)).check(matches(isDisplayed()));
        onView(withId(R.id.subtotal)).check(matches(isDisplayed()));
        onView(withId(R.id.discount)).check(matches(isDisplayed()));
        onView(withId(R.id.grandtotal)).check(matches(isDisplayed()));
        onView(withId(R.id.checkout)).check(matches(isDisplayed()));
    }

    @Test
    public void testCheckAllProduct() throws InterruptedException {
        onView(withId(R.id.checkAll)).check(matches(isDisplayed())).perform(click()).check(matches(isChecked()));



    }

    @Test
    public void testInvalidCheckout() throws InterruptedException {
        onView(withId(R.id.grandtotal)).check(matches(isDisplayed())).perform(setTextInTextView("0 VNĐ"));

        onView(withId(R.id.checkout)).check(matches(isDisplayed())).perform(click());
        Thread.sleep(500);
        intended(hasComponent(CheckoutPage.class.getName()), times(0));

    }

    @Test
    public void testValidCheckout() throws InterruptedException {
        onView(withId(R.id.grandtotal)).check(matches(isDisplayed())).perform(setTextInTextView("1000 VNĐ"));

        onView(withId(R.id.checkout)).check(matches(isDisplayed())).perform(click());


        Thread.sleep(500);
        intended(hasComponent(CheckoutPage.class.getName()));

    }
}
