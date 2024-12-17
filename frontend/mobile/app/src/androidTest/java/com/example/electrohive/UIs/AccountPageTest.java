package com.example.electrohive.UIs;

import static androidx.test.espresso.Espresso.onView;
import static androidx.test.espresso.action.ViewActions.click;
import static androidx.test.espresso.assertion.ViewAssertions.matches;
import static androidx.test.espresso.intent.Intents.intended;
import static androidx.test.espresso.intent.matcher.IntentMatchers.hasComponent;
import static androidx.test.espresso.matcher.ViewMatchers.isDisplayed;
import static androidx.test.espresso.matcher.ViewMatchers.withId;
import static androidx.test.espresso.matcher.ViewMatchers.withText;

import android.content.Context;
import android.content.Intent;

import androidx.test.core.app.ApplicationProvider;
import androidx.test.espresso.intent.Intents;
import androidx.test.ext.junit.rules.ActivityScenarioRule;

import com.example.electrohive.Activities.AccountAddressPage;
import com.example.electrohive.Activities.AccountChangePasswordPage;
import com.example.electrohive.Activities.AccountInfoPage;
import com.example.electrohive.Activities.AccountOrderPage;
import com.example.electrohive.Activities.AccountPage;
import com.example.electrohive.Activities.AccountVoucherPage;
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

public class AccountPageTest {
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
    public ActivityScenarioRule<AccountPage> activityRule = new ActivityScenarioRule<>(new Intent(ApplicationProvider.getApplicationContext(), AccountPage.class));

    @Test
    public void testVisibilityOfViews() throws InterruptedException {
        onView(withId(R.id.userImage)).check(matches(isDisplayed()));
        onView(withId(R.id.userName)).check(matches(isDisplayed()));
        onView(withId(R.id.menuItemUserInfo)).check(matches(isDisplayed()));
        onView(withId(R.id.menuItemUserAddress)).check(matches(isDisplayed()));
        onView(withId(R.id.menuItemUserChangePassword)).check(matches(isDisplayed()));
        onView(withId(R.id.menuItemUserOrders)).check(matches(isDisplayed()));
        onView(withId(R.id.menuItemUserVouchers)).check(matches(isDisplayed()));
        onView(withId(R.id.signOutButton)).check(matches(isDisplayed()));
    }

    @Test
    public void testSignInUserInfo() {
        onView(withId(R.id.userName)).check(matches(isDisplayed())).check(matches(withText(mockCustomer.getUsername())));
    }

    @Test
    public void testSignOut() throws InterruptedException {
        onView(withId(R.id.signOutButton)).perform(click());

        Thread.sleep(1000);
        intended(hasComponent(LoginPage.class.getName()));
    }

    @Test
    public void testNavigateInfoPage() throws InterruptedException {
        onView(withId(R.id.menuItemUserInfo)).perform(click());

        Thread.sleep(1000);
        intended(hasComponent(AccountInfoPage.class.getName()));
    }

    @Test
    public void testNavigateAddressPage() throws InterruptedException {
        onView(withId(R.id.menuItemUserAddress)).perform(click());

        Thread.sleep(1000);
        intended(hasComponent(AccountAddressPage.class.getName()));
    }

    @Test
    public void testNavigateChangePasswordPage() throws InterruptedException {
        onView(withId(R.id.menuItemUserChangePassword)).perform(click());

        Thread.sleep(1000);
        intended(hasComponent(AccountChangePasswordPage.class.getName()));
    }
    @Test
    public void testNavigateOrderPage() throws InterruptedException {
        onView(withId(R.id.menuItemUserOrders)).perform(click());

        Thread.sleep(1000);
        intended(hasComponent(AccountOrderPage.class.getName()));
    }
    @Test
    public void testNavigateVoucherPage() throws InterruptedException {
        onView(withId(R.id.menuItemUserVouchers)).perform(click());

        Thread.sleep(1000);
        intended(hasComponent(AccountVoucherPage.class.getName()));
    }





}
