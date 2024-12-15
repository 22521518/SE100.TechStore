package com.example.electrohive.UIs;

import androidx.test.espresso.intent.Intents;
import androidx.test.ext.junit.rules.ActivityScenarioRule;
import androidx.test.ext.junit.runners.AndroidJUnit4;

import com.example.electrohive.Activities.HomePage;
import com.example.electrohive.Activities.LoginPage;
import com.example.electrohive.Activities.SignUpPage;
import com.example.electrohive.R;

import org.junit.After;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

import static androidx.test.espresso.Espresso.onView;
import static androidx.test.espresso.action.ViewActions.click;
import static androidx.test.espresso.action.ViewActions.replaceText;
import static androidx.test.espresso.assertion.ViewAssertions.matches;
import static androidx.test.espresso.intent.Intents.intended;
import static androidx.test.espresso.intent.matcher.IntentMatchers.hasComponent;
import static androidx.test.espresso.matcher.ViewMatchers.isDisplayed;
import static androidx.test.espresso.matcher.ViewMatchers.withId;
import static androidx.test.espresso.matcher.ViewMatchers.withText;
import static org.junit.Assert.assertNotNull;

@RunWith(AndroidJUnit4.class)
public class LoginPageTest {

    @Rule
    public ActivityScenarioRule<LoginPage> activityScenarioRule = new ActivityScenarioRule<>(LoginPage.class);


    @Before
    public void setUp() {
        Intents.init(); // Initialize intents for testing navigation

    }


    @After
    public void tearDown() {
        Intents.release();
    }
    @Test
    public void testVisibilityOfViews() {
        // Check if the logo is displayed
        onView(withId(R.id.app_logo)).check(matches(isDisplayed()));

        // Check if the app name is displayed
        onView(withId(R.id.app_name)).check(matches(isDisplayed()));

        // Check if the "Email" TextInputLayout and EditText are displayed
        onView(withId(R.id.emailInput)).check(matches(isDisplayed()));
        onView(withId(R.id.emailInput)).check(matches(isDisplayed()));

        // Check if the "Password" TextInputLayout and EditText are displayed
        onView(withId(R.id.passwordInput)).check(matches(isDisplayed()));
        onView(withId(R.id.passwordInput)).check(matches(isDisplayed()));

        // Check if the "Login" button is displayed
        onView(withId(R.id.loginButton)).check(matches(isDisplayed()));

        // Check if the "Sign up" link is displayed
        onView(withId(R.id.signupTextView)).check(matches(isDisplayed()));

        // Check if the "Sign up" link TextView is displayed
        onView(withId(R.id.signupLinkTextView)).check(matches(isDisplayed()));
    }

    @Test
    public void testSignUpButtonClick() {

        // Perform a click on the "Sign Up" button
        onView(withId(R.id.signupLinkTextView)).perform(click());

        // Verify that the intent to navigate to the SignUpPage is fired
        intended(hasComponent(SignUpPage.class.getName()));

    }

    @Test
    public void testLoginButtonPressWithNoInput() throws InterruptedException {
        // Perform a click on the "Sign Up" button
        onView(withId(R.id.loginButton)).perform(click());


        Thread.sleep(1000);
        // Verify that the current activity remains the same (no navigation occurs)
        onView(withId(R.id.loginButton)).check(matches(isDisplayed()));
    }

    @Test
    public void testLoginWithCorrectCredentials() throws InterruptedException {
        // Type valid email and password into the input fields
        onView(withId(R.id.emailInput)).perform(replaceText("notfuny4927@gmail.com"));
        onView(withId(R.id.passwordInput)).perform(replaceText("11111111"));
        onView(withId(R.id.loginButton)).perform(click());

        // Wait for 3 seconds to allow any potential navigation to complete
        Thread.sleep(1000);

        // Verify that the user has navigated to the HomePage after successful login
        intended(hasComponent(HomePage.class.getName()));
    }

    @Test
    public void testLoginWithIncorrectCredentials() throws InterruptedException {
        // Type invalid email and password into the input fields
        onView(withId(R.id.emailInput)).perform(replaceText("wrongemail@example.com"));
        onView(withId(R.id.passwordInput)).perform(replaceText("wrongpassword"));
        onView(withId(R.id.loginButton)).perform(click());

        // Wait for any possible UI updates
        Thread.sleep(1000);

        // Verify that the current activity remains the same (no navigation occurs)
        onView(withId(R.id.loginButton)).check(matches(isDisplayed()));
    }

    @Test
    public void testLoginWithCorrectEmailAndIncorrectPassword() throws InterruptedException {
        // Type correct email and incorrect password into the input fields
        onView(withId(R.id.emailInput)).perform(replaceText("correctemail@example.com"));
        onView(withId(R.id.passwordInput)).perform(replaceText("wrongpassword"));
        onView(withId(R.id.loginButton)).perform(click());

        // Wait for any possible UI updates
        Thread.sleep(1000);

        // Verify that the current activity remains the same (no navigation occurs)
        onView(withId(R.id.loginButton)).check(matches(isDisplayed()));
    }
}
