package com.example.electrohive.UIs;

import static androidx.test.espresso.Espresso.onView;
import static androidx.test.espresso.action.ViewActions.click;
import static androidx.test.espresso.action.ViewActions.replaceText;
import static androidx.test.espresso.assertion.ViewAssertions.matches;
import static androidx.test.espresso.matcher.ViewMatchers.isDisplayed;
import static androidx.test.espresso.matcher.ViewMatchers.withId;
import static androidx.test.espresso.matcher.ViewMatchers.withText;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;

import androidx.test.core.app.ApplicationProvider;
import androidx.test.ext.junit.rules.ActivityScenarioRule;

import com.example.electrohive.Activities.TrackPage;
import com.example.electrohive.Models.Customer;
import com.example.electrohive.R;
import com.example.electrohive.ViewModel.CustomerViewModel;
import com.example.electrohive.utils.PreferencesHelper;

import org.junit.BeforeClass;
import org.junit.Rule;
import org.junit.Test;

public class TrackPageTest {
    static Intent intent;
    static {
        intent = new Intent(ApplicationProvider.getApplicationContext(), TrackPage.class);
        Bundle bundle = new Bundle();
        bundle.putString("ORDER_ID", "cm4jpeoj20002yk6v4gy5y7u0");
        intent.putExtras(bundle);
    }

    @Rule
    public ActivityScenarioRule<TrackPage> activityRule  = new ActivityScenarioRule<>(intent);
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
    @Test
    public void testAllSectionsVisibility() {
        // Order Details section visibility checks
        onView(withId(R.id.order_id_input)).check(matches(isDisplayed()));
        onView(withId(R.id.order_track_button)).check(matches(isDisplayed()));
        onView(withId(R.id.order_date)).check(matches(isDisplayed()));
        onView(withId(R.id.order_fullname)).check(matches(isDisplayed()));
        onView(withId(R.id.order_phonenumber)).check(matches(isDisplayed()));
        onView(withId(R.id.order_address)).check(matches(isDisplayed()));
        onView(withId(R.id.order_payment_method)).check(matches(isDisplayed()));

        // Order Summary section visibility checks
        onView(withId(R.id.order_id)).check(matches(isDisplayed()));
        onView(withId(R.id.order_totalprice)).check(matches(isDisplayed()));
    }

    @Test
    public void testTrackOrderSuccessful() throws InterruptedException {
        onView(withId(R.id.order_id_input)).perform(replaceText("cm4jpeoj20002yk6v4gy5y7u0"));
        onView(withId(R.id.order_track_button)).perform(click());
        Thread.sleep(1000);

        onView(withId(R.id.order_id)).check(matches(withText("Order id: cm4jpeoj20002yk6v4gy5y7u0")));
    }
    @Test
    public void testTrackOrderUnsuccessful() throws InterruptedException {
        onView(withId(R.id.order_id_input)).perform(replaceText("abc"));
        onView(withId(R.id.order_track_button)).perform(click());
        Thread.sleep(1000);

        onView(withId(R.id.order_id)).check(matches(withText("Order id:")));
    }

    @Test
    public void testTrackOrderFromIntentExtra() throws InterruptedException {

        Thread.sleep(1000);

        onView(withId(R.id.order_id)).check(matches(withText("Order id: cm4jpeoj20002yk6v4gy5y7u0")));
    }
}
