package com.example.electrohive.UIs;

import static androidx.test.espresso.Espresso.onView;
import static androidx.test.espresso.action.ViewActions.click;
import static androidx.test.espresso.assertion.ViewAssertions.matches;
import static androidx.test.espresso.intent.Intents.intended;
import static androidx.test.espresso.intent.matcher.IntentMatchers.hasComponent;
import static androidx.test.espresso.matcher.ViewMatchers.isChecked;
import static androidx.test.espresso.matcher.ViewMatchers.isDisplayed;
import static androidx.test.espresso.matcher.ViewMatchers.withId;
import static androidx.test.espresso.matcher.ViewMatchers.withText;

import android.content.Context;
import android.content.Intent;

import androidx.test.core.app.ApplicationProvider;
import androidx.test.espresso.intent.Intents;
import androidx.test.ext.junit.rules.ActivityScenarioRule;

import com.example.electrohive.Activities.CheckoutPage;
import com.example.electrohive.Activities.ConfirmPage;
import com.example.electrohive.Activities.PaymentPage;
import com.example.electrohive.Activities.PaymentVoucherPage;
import com.example.electrohive.Models.CheckoutAddress;
import com.example.electrohive.Models.Customer;
import com.example.electrohive.R;
import com.example.electrohive.ViewModel.CustomerViewModel;
import com.example.electrohive.utils.PreferencesHelper;
import com.google.gson.Gson;

import org.junit.After;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Rule;
import org.junit.Test;

import java.util.ArrayList;

public class PaymentPageTest {
    static Intent intent;
    static {
        intent = new Intent(ApplicationProvider.getApplicationContext(), PaymentPage.class);
        Gson gson = new Gson();
        String json = gson.toJson(new ArrayList<>());
        intent.putExtra("checkedItems",json);
        intent.putExtra("address",new CheckoutAddress("address","city","district","ward","full name","1234567890"));
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
    public ActivityScenarioRule<PaymentPage> activityRule = new ActivityScenarioRule<>(intent);


    @Test
    public void testVisibilityOfViews() throws InterruptedException {
        onView(withId(R.id.wallet)).check(matches(isDisplayed()));
        onView(withId(R.id.cash)).check(matches(isDisplayed())).check(matches(isChecked()));
        onView(withId(R.id.zalo_pay)).check(matches(isDisplayed()));
        onView(withId(R.id.cod_icon)).check(matches(isDisplayed()));
        onView(withId(R.id.wallet_icon)).check(matches(isDisplayed()));
        onView(withId(R.id.voucherCode)).check(matches(isDisplayed()));
        onView(withId(R.id.payment_subtotal)).check(matches(isDisplayed()));
        onView(withId(R.id.payment_discount)).check(matches(isDisplayed()));
        onView(withId(R.id.payment_discount_percentage)).check(matches(isDisplayed()));
        onView(withId(R.id.payment_shipment_cost)).check(matches(isDisplayed()));
        onView(withId(R.id.payment_grand_total)).check(matches(isDisplayed()));
        onView(withId(R.id.finish_payment)).check(matches(isDisplayed()));
    }
    @Test
    public void testSelectCOD(){
        onView(withId(R.id.cash)).check(matches(isDisplayed())).perform(click()).check(matches(isChecked()));

    }
    @Test
    public void testSelectWallet(){
        onView(withId(R.id.wallet)).check(matches(isDisplayed())).perform(click()).check(matches(isChecked()));

    }
    @Test
    public void testSelectVoucher(){
        onView(withId(R.id.voucherCode)).check(matches(isDisplayed())).perform(click());

        intended(hasComponent(PaymentVoucherPage.class.getName()));
    }


    @Test
    public void testPaymentWithWallet(){
        onView(withId(R.id.wallet)).check(matches(isDisplayed())).perform(click()).check(matches(isChecked()));
        onView(withId(R.id.finish_payment)).check(matches(isDisplayed())).perform(click());

        intended(hasComponent(ConfirmPage.class.getName()));

        onView(withId(R.id.payment_method)).check(matches(withText("ZALOPAY")));
    }

    @Test
    public void testPaymentWithCOD(){
        onView(withId(R.id.cash)).check(matches(isDisplayed())).perform(click()).check(matches(isChecked()));
        onView(withId(R.id.finish_payment)).check(matches(isDisplayed())).perform(click());

        intended(hasComponent(ConfirmPage.class.getName()));

        onView(withId(R.id.payment_method)).check(matches(withText("COD")));
    }

}
