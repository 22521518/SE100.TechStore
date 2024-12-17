package com.example.electrohive.UIs;

import static androidx.test.espresso.Espresso.onView;
import static androidx.test.espresso.action.ViewActions.click;
import static androidx.test.espresso.action.ViewActions.replaceText;
import static androidx.test.espresso.assertion.ViewAssertions.matches;
import static androidx.test.espresso.intent.Intents.intended;
import static androidx.test.espresso.intent.Intents.times;
import static androidx.test.espresso.intent.matcher.IntentMatchers.hasComponent;
import static androidx.test.espresso.matcher.ViewMatchers.isDisplayed;
import static androidx.test.espresso.matcher.ViewMatchers.withId;

import android.content.Context;
import android.content.Intent;

import androidx.test.core.app.ApplicationProvider;
import androidx.test.espresso.intent.Intents;
import androidx.test.ext.junit.rules.ActivityScenarioRule;

import com.example.electrohive.Activities.AccountAddAddressPage;
import com.example.electrohive.Activities.AccountChangePasswordPage;
import com.example.electrohive.Activities.LoginPage;
import com.example.electrohive.Models.Customer;
import com.example.electrohive.R;
import com.example.electrohive.ViewModel.CustomerViewModel;
import com.example.electrohive.utils.PreferencesHelper;

import org.junit.After;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Rule;
import org.junit.Test;

public class AccountChangePasswordPageTest {
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
    public ActivityScenarioRule<AccountChangePasswordPage> activityRule = new ActivityScenarioRule<>(new Intent(ApplicationProvider.getApplicationContext(), AccountChangePasswordPage.class));

    @Test
    public void testVisibilityOfViews(){
        onView(withId(R.id.current_password)).check(matches(isDisplayed()));
        onView(withId(R.id.new_password)).check(matches(isDisplayed()));
        onView(withId(R.id.confirm_password)).check(matches(isDisplayed()));
        onView(withId(R.id.change_password)).check(matches(isDisplayed()));
    }

    @Test
    public void testChangePasswordEmptyInput() throws InterruptedException {
        onView(withId(R.id.current_password)).check(matches(isDisplayed())).perform(replaceText(""));
        onView(withId(R.id.new_password)).check(matches(isDisplayed())).perform(replaceText(""));
        onView(withId(R.id.confirm_password)).check(matches(isDisplayed())).perform(replaceText(""));
        onView(withId(R.id.change_password)).check(matches(isDisplayed())).perform(click());

        Thread.sleep(1000);
        intended(hasComponent(LoginPage.class.getName()),times(0));
    }

    @Test
    public void testChangePasswordInvalidNewPassword() throws InterruptedException {
        onView(withId(R.id.current_password)).check(matches(isDisplayed())).perform(replaceText("11111111"));
        onView(withId(R.id.new_password)).check(matches(isDisplayed())).perform(replaceText("1234567"));
        onView(withId(R.id.confirm_password)).check(matches(isDisplayed())).perform(replaceText("1234567"));
        onView(withId(R.id.change_password)).check(matches(isDisplayed())).perform(click());

        Thread.sleep(1000);
        intended(hasComponent(LoginPage.class.getName()),times(0));
    }
    @Test
    public void testChangePasswordMismatchPassword() throws InterruptedException {
        onView(withId(R.id.current_password)).check(matches(isDisplayed())).perform(replaceText("11111111"));
        onView(withId(R.id.new_password)).check(matches(isDisplayed())).perform(replaceText("12345678"));
        onView(withId(R.id.confirm_password)).check(matches(isDisplayed())).perform(replaceText("876543321"));
        onView(withId(R.id.change_password)).check(matches(isDisplayed())).perform(click());

        Thread.sleep(1000);
        intended(hasComponent(LoginPage.class.getName()),times(0));
    }
}
