package com.example.electrohive.UIs;

import static androidx.test.espresso.Espresso.onView;
import static androidx.test.espresso.action.ViewActions.click;
import static androidx.test.espresso.action.ViewActions.replaceText;
import static androidx.test.espresso.assertion.ViewAssertions.matches;
import static androidx.test.espresso.intent.Intents.intended;
import static androidx.test.espresso.intent.Intents.times;
import static androidx.test.espresso.intent.matcher.IntentMatchers.hasComponent;
import static androidx.test.espresso.matcher.ViewMatchers.isAssignableFrom;
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

import com.example.electrohive.Activities.CartPage;
import com.example.electrohive.Activities.CheckoutPage;
import com.example.electrohive.Activities.ConfirmPage;
import com.example.electrohive.Activities.PaymentPage;
import com.example.electrohive.Activities.ProvincePage;
import com.example.electrohive.Activities.TrackPage;
import com.example.electrohive.Models.Customer;
import com.example.electrohive.Models.Province;
import com.example.electrohive.R;
import com.example.electrohive.ViewModel.CustomerViewModel;
import com.example.electrohive.utils.PreferencesHelper;
import com.google.gson.Gson;

import org.hamcrest.Matcher;
import org.junit.After;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Rule;
import org.junit.Test;

import java.util.ArrayList;

public class CheckoutPageTest {
    static Intent intent;
    static {
        intent = new Intent(ApplicationProvider.getApplicationContext(), CheckoutPage.class);
        Gson gson = new Gson();
        String json = gson.toJson(new ArrayList<>());
        intent.putExtra("checkedItems",json);
    }
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
    public ActivityScenarioRule<CheckoutPage> activityRule = new ActivityScenarioRule<>(intent);


    @Test
    public void testVisibilityOfViews() throws InterruptedException {
        onView(withId(R.id.radioButton5)).check(matches(isDisplayed()));
        onView(withId(R.id.fullname)).check(matches(isDisplayed()));
        onView(withId(R.id.phone)).check(matches(isDisplayed()));
        onView(withId(R.id.addressInput)).check(matches(isDisplayed()));
        onView(withId(R.id.n_address)).check(matches(isDisplayed()));
        onView(withId(R.id.continue_button)).check(matches(isDisplayed()));
    }

    @Test
    public void testLocationClick() throws InterruptedException {
        onView(withId(R.id.addressInput)).check(matches(isDisplayed())).perform(click());

        intended(hasComponent(ProvincePage.class.getName()));
    }

    @Test
    public void testCheckoutWithNewAddressEmptyInputs() throws InterruptedException {
        onView(withId(R.id.radioButton5)).check(matches(isDisplayed())).perform(click());

        onView(withId(R.id.fullname)).check(matches(isDisplayed())).perform(replaceText(""));
        onView(withId(R.id.phone)).check(matches(isDisplayed())).perform(replaceText(""));
        onView(withId(R.id.addressInput)).check(matches(isDisplayed())).perform(replaceText(""));
        onView(withId(R.id.n_address)).check(matches(isDisplayed())).perform(replaceText(""));

        onView(withId(R.id.continue_button)).check(matches(isDisplayed())).perform(click());

        Thread.sleep(500);

        intended(hasComponent(ConfirmPage.class.getName()),times(0));
    }

    @Test
    public void testCheckoutWithNewAddressInvalidPhoneNumber() throws InterruptedException {
        onView(withId(R.id.radioButton5)).check(matches(isDisplayed())).perform(click());

        onView(withId(R.id.fullname)).check(matches(isDisplayed())).perform(replaceText("1"));
        onView(withId(R.id.phone)).check(matches(isDisplayed())).perform(replaceText("123456789"));
        onView(withId(R.id.addressInput)).check(matches(isDisplayed())).perform(replaceText("1, 2, 3"));
        onView(withId(R.id.n_address)).check(matches(isDisplayed())).perform(replaceText("1"));

        onView(withId(R.id.continue_button)).check(matches(isDisplayed())).perform(click());

        Thread.sleep(500);

        intended(hasComponent(ConfirmPage.class.getName()),times(0));
    }

    @Test
    public void testCheckoutWithNewAddressValidInputs() throws InterruptedException {
        onView(withId(R.id.radioButton5)).check(matches(isDisplayed())).perform(click());

        onView(withId(R.id.fullname)).check(matches(isDisplayed())).perform(replaceText("1"));
        onView(withId(R.id.phone)).check(matches(isDisplayed())).perform(replaceText("1234567890"));
        onView(withId(R.id.addressInput)).check(matches(isDisplayed())).perform(replaceText("1, 2, 3"));
        onView(withId(R.id.n_address)).check(matches(isDisplayed())).perform(replaceText("1"));

        onView(withId(R.id.continue_button)).check(matches(isDisplayed())).perform(click());

        Thread.sleep(500);

        intended(hasComponent(PaymentPage.class.getName()));
    }
}
