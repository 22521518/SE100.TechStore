package com.example.electrohive.UIs;

import static androidx.test.espresso.Espresso.onView;
import static androidx.test.espresso.action.ViewActions.click;
import static androidx.test.espresso.assertion.ViewAssertions.matches;
import static androidx.test.espresso.intent.Intents.intended;
import static androidx.test.espresso.intent.matcher.IntentMatchers.hasAction;
import static androidx.test.espresso.intent.matcher.IntentMatchers.hasData;
import static androidx.test.espresso.intent.matcher.IntentMatchers.hasExtra;
import static androidx.test.espresso.intent.matcher.IntentMatchers.hasType;
import static androidx.test.espresso.matcher.ViewMatchers.isChecked;
import static androidx.test.espresso.matcher.ViewMatchers.isDisplayed;
import static androidx.test.espresso.matcher.ViewMatchers.withId;
import static androidx.test.espresso.matcher.ViewMatchers.withText;

import static org.hamcrest.CoreMatchers.not;

import static java.util.EnumSet.allOf;

import android.content.Context;
import android.content.Intent;

import androidx.test.core.app.ApplicationProvider;
import androidx.test.espresso.intent.Intents;
import androidx.test.ext.junit.rules.ActivityScenarioRule;

import com.example.electrohive.Activities.AccountInfoPage;
import com.example.electrohive.Activities.AccountPage;
import com.example.electrohive.Models.Customer;
import com.example.electrohive.R;
import com.example.electrohive.ViewModel.CustomerViewModel;
import com.example.electrohive.utils.PreferencesHelper;
import com.example.electrohive.utils.format.Format;

import org.hamcrest.CoreMatchers;
import org.junit.After;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Rule;
import org.junit.Test;

public class AccountInfoPageTest {
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
    public ActivityScenarioRule<AccountInfoPage> activityRule = new ActivityScenarioRule<>(new Intent(ApplicationProvider.getApplicationContext(), AccountInfoPage.class));

    @Test
    public void testVisibilityOfViews(){
        onView(withId(R.id.userInfoImage)).check(matches(isDisplayed()));
        onView(withId(R.id.userInfoChangePhotoButton)).check(matches(isDisplayed()));
        onView(withId(R.id.lastnameInput)).check(matches(isDisplayed()));
        onView(withId(R.id.firstnameInput)).check(matches(isDisplayed()));
        onView(withId(R.id.usernameInput)).check(matches(isDisplayed()));
        onView(withId(R.id.phonenumberInput)).check(matches(isDisplayed()));
        onView(withId(R.id.birthDateInput)).check(matches(isDisplayed()));
        onView(withId(R.id.genderRadioGroup)).check(matches(isDisplayed()));
        onView(withId(R.id.radioMale)).check(matches(isDisplayed()));
        onView(withId(R.id.radioFemale)).check(matches(isDisplayed()));
        onView(withId(R.id.updateCustomerButton)).check(matches(isDisplayed()));
    }
    @Test
    public void testSignInInfoDisplay(){
        onView(withId(R.id.lastnameInput)).check(matches(isDisplayed())).check(matches(withText(mockCustomer.getFullName().split("\\s+")[mockCustomer.getFullName().split("\\s+").length -1])));
        onView(withId(R.id.firstnameInput)).check(matches(isDisplayed())).check(matches(withText(mockCustomer.getFullName().split("\\s+")[0])));
        onView(withId(R.id.usernameInput)).check(matches(isDisplayed())).check(matches(withText(mockCustomer.getUsername())));
        onView(withId(R.id.phonenumberInput)).check(matches(isDisplayed())).check(matches(withText(mockCustomer.getPhoneNumber())));
        onView(withId(R.id.birthDateInput)).check(matches(isDisplayed())).check(matches(withText(Format.getFormattedDateFromString((String) mockCustomer.getBirthDate()))));
        onView(withId(R.id.radioMale)).check(matches(not(isChecked())));
        onView(withId(R.id.radioFemale)).check(matches(isChecked()));
    }

    @Test
    public void testChangeImage(){
        onView(withId(R.id.userInfoChangePhotoButton)).check(matches(isDisplayed())).perform(click());
// Verify that an intent to open the image picker is launched
        intended(CoreMatchers.allOf(
                hasAction(Intent.ACTION_CHOOSER),
                hasExtra(Intent.EXTRA_INTENT, CoreMatchers.allOf(
                        hasAction(Intent.ACTION_GET_CONTENT),
                        hasType("image/*")
                ))
        ));
    }

}
