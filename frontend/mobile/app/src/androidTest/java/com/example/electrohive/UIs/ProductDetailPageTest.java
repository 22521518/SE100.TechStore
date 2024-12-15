package com.example.electrohive.UIs;

import static androidx.test.espresso.Espresso.onView;
import static androidx.test.espresso.action.ViewActions.click;
import static androidx.test.espresso.action.ViewActions.replaceText;
import static androidx.test.espresso.action.ViewActions.scrollTo;
import static androidx.test.espresso.assertion.ViewAssertions.matches;
import static androidx.test.espresso.intent.Intents.intended;
import static androidx.test.espresso.intent.Intents.times;
import static androidx.test.espresso.intent.matcher.IntentMatchers.hasComponent;
import static androidx.test.espresso.intent.matcher.IntentMatchers.hasExtra;
import static androidx.test.espresso.matcher.ViewMatchers.isDisplayed;
import static androidx.test.espresso.matcher.ViewMatchers.withId;
import static androidx.test.espresso.matcher.ViewMatchers.withParent;
import static androidx.test.espresso.matcher.ViewMatchers.withText;

import static org.hamcrest.CoreMatchers.allOf;
import static org.hamcrest.CoreMatchers.not;
import static org.mockito.ArgumentMatchers.isNotNull;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;

import androidx.test.core.app.ApplicationProvider;
import androidx.test.espresso.intent.Intents;
import androidx.test.ext.junit.rules.ActivityScenarioRule;

import com.example.electrohive.Activities.CartPage;
import com.example.electrohive.Activities.DrawerBasePage;
import com.example.electrohive.Activities.FullScreenImageActivity;
import com.example.electrohive.Activities.LoginPage;
import com.example.electrohive.Activities.ProductDetailPage;
import com.example.electrohive.Activities.ProductFeedbackPage;
import com.example.electrohive.Activities.TrackPage;
import com.example.electrohive.Models.Customer;
import com.example.electrohive.R;
import com.example.electrohive.ViewModel.CustomerViewModel;
import com.example.electrohive.utils.PreferencesHelper;

import org.junit.After;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Rule;
import org.junit.Test;

public class ProductDetailPageTest {
    static Intent intent;

    static {
        intent = new Intent(ApplicationProvider.getApplicationContext(), ProductDetailPage.class);
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
    public ActivityScenarioRule<ProductDetailPage> activityRule = new ActivityScenarioRule<>(intent);

    @Test
    public void testVisibilityOfViews() throws InterruptedException {
        // Check the ViewPager2
        onView(withId(R.id.dt_display_image)).check(matches(isDisplayed()));

        // Check the CircleIndicator
        onView(withId(R.id.dt_display_image_indicator)).check(matches(isDisplayed()));

        // Scroll and check the product name
        onView(withId(R.id.dt_product_name)).check(matches(isDisplayed()));

        // Scroll and check the product price
        onView(withId(R.id.dt_product_price)).check(matches(isDisplayed()));

        // Scroll and check the original price
        onView(withId(R.id.dt_product_original_price)).check(matches(isDisplayed()));

        // Scroll and check the product discount
        onView(withId(R.id.dt_product_discount)).check(matches(isDisplayed()));

        // Scroll and check the stock count
        onView(withId(R.id.product_stock_count)).check(matches(isDisplayed()));

        // Scroll and check the quantity input
        onView(withId(R.id.product_quantity_input)).check(matches(isDisplayed()));

        // Scroll and check the add-to-cart button
        onView(withId(R.id.product_add_to_cart_button)).check(matches(isDisplayed()));

        // Scroll and check the buy-now button
        onView(withId(R.id.product_buy_now_button)).check(matches(isDisplayed()));

        // Scroll and check the product detail
        onView(withId(R.id.product_detail)).check(matches(isDisplayed()));


        onView(withId(R.id.see_feedback_button))
                .perform(scrollTo())
                .check(matches(isDisplayed()));
    }

    @Test
    public void testClickProductImage() {
        onView(withId(R.id.dt_display_image)).check(matches(isDisplayed())).perform(click());

        intended(hasComponent(FullScreenImageActivity.class.getName()));
    }

    @Test
    public void testChangeQuantity_invalid_null() {
        onView(withId(R.id.product_quantity_input)).check(matches(isDisplayed())).perform(replaceText(""));

        onView(withId(R.id.product_quantity_input)).check(matches(withText("1")));
    }

    @Test
    public void testChangeQuantity_invalid_1000() {
        onView(withId(R.id.product_quantity_input)).check(matches(isDisplayed())).perform(replaceText("1000"));

        onView(withId(R.id.product_quantity_input)).check(matches(withText("100")));
    }

    @Test
    public void testChangeQuantity_valid() {
        onView(withId(R.id.product_quantity_input)).check(matches(isDisplayed())).perform(replaceText("12"));

        onView(withId(R.id.product_quantity_input)).check(matches(withText("12")));
    }

    @Test
    public void testChangeQuantity_valid_1() {
        onView(withId(R.id.product_quantity_input)).check(matches(isDisplayed())).perform(replaceText("1"));

        onView(withId(R.id.product_quantity_input)).check(matches(withText("1")));
    }

    @Test
    public void testChangeQuantity_valid_999() {
        onView(withId(R.id.product_quantity_input)).check(matches(isDisplayed())).perform(replaceText("999"));

        onView(withId(R.id.product_quantity_input)).check(matches(withText("999")));
    }

    @Test
    public void testBuyWithSufficientQuantity() {
        onView(withId(R.id.product_quantity_input)).check(matches(isDisplayed())).perform(replaceText("1"));

        onView(withId(R.id.product_buy_now_button)).perform(click());
        intended(hasComponent(CartPage.class.getName()));
    }

    @Test
    public void testBuyWithInSufficientQuantity() throws InterruptedException {
        onView(withId(R.id.product_quantity_input)).check(matches(isDisplayed())).perform(replaceText("999"));

        onView(withId(R.id.product_buy_now_button)).perform(click());
        Thread.sleep(1000);
        intended(hasComponent(CartPage.class.getName()),times(0));

    }

    @Test
    public void testClickProductFeedbackButton()  {
        onView(withId(R.id.see_feedback_button))
                .perform(scrollTo())
                .check(matches(isDisplayed()))
                .perform(click());

        intended(allOf(
                hasComponent(ProductFeedbackPage.class.getName()),
                hasExtra("PRODUCT_ID", "17fc5a34-9f8a-4dc1-b7bd-944a95fd9d6c")));

    }


}
