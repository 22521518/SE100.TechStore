package com.example.electrohive.UIs;

import android.content.Context;

import androidx.test.core.app.ApplicationProvider;
import androidx.test.espresso.intent.Intents;
import androidx.test.ext.junit.rules.ActivityScenarioRule;

import com.example.electrohive.Activities.AccountPage;
import com.example.electrohive.Activities.CartPage;
import com.example.electrohive.Activities.DrawerBasePage;
import com.example.electrohive.Activities.HomePage;
import com.example.electrohive.Activities.SearchPage;
import com.example.electrohive.Activities.SupportChatPage;
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

import static androidx.test.espresso.Espresso.onView;
import static androidx.test.espresso.action.ViewActions.click;
import static androidx.test.espresso.action.ViewActions.replaceText;
import static androidx.test.espresso.assertion.ViewAssertions.matches;
import static androidx.test.espresso.intent.Intents.intended;
import static androidx.test.espresso.intent.matcher.IntentMatchers.hasComponent;
import static androidx.test.espresso.matcher.ViewMatchers.isDisplayed;
import static androidx.test.espresso.matcher.ViewMatchers.withContentDescription;
import static androidx.test.espresso.matcher.ViewMatchers.withId;
import static androidx.test.espresso.matcher.ViewMatchers.withText;
import static org.hamcrest.CoreMatchers.allOf;

public class DrawerTest {

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


    @Rule
    public ActivityScenarioRule<DrawerBasePage> activityRule = new ActivityScenarioRule<>(DrawerBasePage.class);

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

    @Test
    public void testDrawerIsVisible() throws InterruptedException {
        onView(withId(R.id.menuButton)).perform(click());
        Thread.sleep(500); // Add a short wait to ensure the drawer has time to open

        onView(withId(R.id.drawer_layout))
                .check(matches(isDisplayed()));
    }

    @Test
    public void testProfileImageIsVisible() throws InterruptedException {
        onView(withId(R.id.menuButton)).perform(click());
        Thread.sleep(500); // Add a short wait to ensure the drawer has time to open
        onView(withId(R.id.profile_image))
                .check(matches(isDisplayed()));
    }

    @Test
    public void testUsernameIsVisible() throws InterruptedException {
        onView(withId(R.id.menuButton)).perform(click());
        Thread.sleep(500); // Add a short wait to ensure the drawer has time to open
        onView(withId(R.id.user_name))
                .check(matches(isDisplayed())).check(matches(withText(mockCustomer.getUsername())));
    }


    @Test
    public void testSignOutButtonIsVisible() throws InterruptedException {
        onView(withId(R.id.menuButton)).perform(click());
        Thread.sleep(500); // Add a short wait to ensure the drawer has time to open
        onView(withId(R.id.sign_out_button))
                .check(matches(isDisplayed()));
    }

    @Test
    public void testNavigationViewIsVisible() throws InterruptedException {
        onView(withId(R.id.menuButton)).perform(click());
        Thread.sleep(500); // Add a short wait to ensure the drawer has time to open
        onView(withId(R.id.nav_view))
                .check(matches(isDisplayed()));
    }

    @Test
    public void testMenuButtonIsVisible() {
        onView(withId(R.id.menuButton))
                .check(matches(isDisplayed()));
    }

    @Test
    public void testSearchInputIsVisible() {
        onView(withId(R.id.search_input))
                .check(matches(isDisplayed()));
    }
    @Test
    public void testSearching() throws InterruptedException {
        onView(withId(R.id.search_input))
                .perform(replaceText("product"));
        onView(withId(R.id.search_button)).perform(click());

        Thread.sleep(1000);

        // Verify that the intent to navigate to the SignUpPage is fired
        intended(hasComponent(SearchPage.class.getName()));

    }

    @Test
    public void testSearchButtonIsVisible() {
        onView(withId(R.id.search_button))
                .check(matches(isDisplayed()));
    }


    @Test
    public void testNavigationItemsAreVisible() {
        onView(allOf(withId(R.id.nav_home), isDisplayed()));
        onView(allOf(withId(R.id.nav_product), isDisplayed()));
        onView(allOf(withId(R.id.nav_cart), isDisplayed()));
        onView(allOf(withId(R.id.nav_track), isDisplayed()));
        onView(allOf(withId(R.id.nav_support), isDisplayed()));
    }

    @Test
    public void testNavigationItemClickHome() throws InterruptedException {
        onView(withId(R.id.menuButton)).perform(click());
        Thread.sleep(500); // Add a short wait to ensure the drawer has time to open
        onView(withId(R.id.nav_home)).perform(click());
        intended(hasComponent(HomePage.class.getName()));
    }

    @Test
    public void testNavigationItemClickProduct() throws InterruptedException {
        onView(withId(R.id.menuButton)).perform(click());
        Thread.sleep(500); // Add a short wait to ensure the drawer has time to open
        onView(withId(R.id.nav_product)).perform(click());
        intended(hasComponent(SearchPage.class.getName())); // Adjust according to your app structure
    }

    @Test
    public void testNavigationItemClickAccount() throws InterruptedException {
        onView(withId(R.id.menuButton)).perform(click());
        Thread.sleep(500); // Add a short wait to ensure the drawer has time to open
        onView(withId(R.id.nav_account)).perform(click());
        intended(hasComponent(AccountPage.class.getName())); // Adjust according to your app structure
    }

    @Test
    public void testNavigationItemClickCart() throws InterruptedException {
        onView(withId(R.id.menuButton)).perform(click());
        Thread.sleep(500); // Add a short wait to ensure the drawer has time to open
        onView(withId(R.id.nav_cart)).perform(click());
        intended(hasComponent(CartPage.class.getName())); // Adjust according to your app structure
    }

    @Test
    public void testNavigationItemClickTrack() throws InterruptedException {
        onView(withId(R.id.menuButton)).perform(click());
        Thread.sleep(500); // Add a short wait to ensure the drawer has time to open
        onView(withId(R.id.nav_track)).perform(click());
        intended(hasComponent(TrackPage.class.getName())); // Adjust according to your app structure
    }

    @Test
    public void testNavigationItemClickSupport() throws InterruptedException {
        onView(withId(R.id.menuButton)).perform(click());
        Thread.sleep(500); // Add a short wait to ensure the drawer has time to open
        onView(withId(R.id.nav_support)).perform(click());
        intended(hasComponent(SupportChatPage.class.getName())); // Adjust according to your app structure
    }

}
