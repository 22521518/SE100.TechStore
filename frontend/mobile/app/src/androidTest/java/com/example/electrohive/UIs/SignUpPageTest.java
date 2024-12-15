package com.example.electrohive.UIs;
import androidx.test.espresso.intent.Intents;
import androidx.test.ext.junit.rules.ActivityScenarioRule;
import androidx.test.ext.junit.runners.AndroidJUnit4;

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
import static androidx.test.espresso.intent.Intents.intended;
import static androidx.test.espresso.intent.matcher.IntentMatchers.hasComponent;
import static androidx.test.espresso.matcher.ViewMatchers.*;
import static androidx.test.espresso.assertion.ViewAssertions.matches;

@RunWith(AndroidJUnit4.class)
public class SignUpPageTest {

    @Rule
    public ActivityScenarioRule<SignUpPage> activityRule = new ActivityScenarioRule<>(SignUpPage.class);


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
        // Check visibility of Signup TextView
        onView(withId(R.id.signupTextView)).check(matches(isDisplayed()));

        // Check visibility of First name input field
        onView(withId(R.id.firstNameInput)).check(matches(isDisplayed()));

        // Check visibility of Last name input field
        onView(withId(R.id.lastNameInput)).check(matches(isDisplayed()));

        // Check visibility of RadioGroup (Gender selection)
        onView(withId(R.id.radioGroup)).check(matches(isDisplayed()));

        // Check visibility of Birth date input field
        onView(withId(R.id.birthDateInput)).check(matches(isDisplayed()));

        // Check visibility of Username input field
        onView(withId(R.id.usernameInput)).check(matches(isDisplayed()));

        // Check visibility of Phone number input field
        onView(withId(R.id.phoneNumberInput)).check(matches(isDisplayed()));

        // Check visibility of Email input field
        onView(withId(R.id.emailInput)).check(matches(isDisplayed()));

        // Check visibility of Password input field
        onView(withId(R.id.passwordInput)).check(matches(isDisplayed()));

        // Check visibility of Confirm Password input field
        onView(withId(R.id.confirmPasswordInput)).check(matches(isDisplayed()));

        // Check visibility of Signup button
        onView(withId(R.id.signupButton)).check(matches(isDisplayed()));

        // Check visibility of login back TextView and link
        onView(withId(R.id.loginBackTextView)).check(matches(isDisplayed()));
        onView(withId(R.id.loginBackLinkTextView)).check(matches(isDisplayed()));
    }

    @Test
    public void testMoveToLoginPage() {
        // Perform a click on the "Sign Up" button
        onView(withId(R.id.loginBackLinkTextView)).perform(click());


        // Verify that the intent to navigate to the SignUpPage is fired
        intended(hasComponent(LoginPage.class.getName()));
    }

    @Test
    public void testSignUp_withInvalidEmail() throws InterruptedException {
        // Fill invalid email and other fields with valid data
        onView(withId(R.id.emailInput)).perform(replaceText("invalid-email"));
        onView(withId(R.id.passwordInput)).perform(replaceText("password123"));
        onView(withId(R.id.confirmPasswordInput)).perform(replaceText("password123"));
        onView(withId(R.id.firstNameInput)).perform(replaceText("John"));
        onView(withId(R.id.lastNameInput)).perform(replaceText("Doe"));
        onView(withId(R.id.usernameInput)).perform(replaceText("john_doe"));
        onView(withId(R.id.phoneNumberInput)).perform(replaceText("1234567890"));
        onView(withId(R.id.birthDateInput)).perform(replaceText("01/01/2000"));

        // Select gender
        onView(withId(R.id.radioMale)).perform(click());

        // Click on the sign-up button
        onView(withId(R.id.signupButton)).perform(click());

        // Wait for 1 second
        Thread.sleep(1000);

        // Check if the sign-up button is still there
        onView(withId(R.id.signupButton)).check(matches(isDisplayed()));
    }

    @Test
    public void testSignUp_withMismatchedPasswords() throws InterruptedException {
        // Fill mismatched passwords and other fields with valid data
        onView(withId(R.id.emailInput)).perform(replaceText("test@example.com"));
        onView(withId(R.id.passwordInput)).perform(replaceText("password123"));
        onView(withId(R.id.confirmPasswordInput)).perform(replaceText("password321"));
        onView(withId(R.id.firstNameInput)).perform(replaceText("John"));
        onView(withId(R.id.lastNameInput)).perform(replaceText("Doe"));
        onView(withId(R.id.usernameInput)).perform(replaceText("john_doe"));
        onView(withId(R.id.phoneNumberInput)).perform(replaceText("1234567890"));
        onView(withId(R.id.birthDateInput)).perform(replaceText("01/01/2000"));

        // Select gender
        onView(withId(R.id.radioMale)).perform(click());

        // Click on the sign-up button
        onView(withId(R.id.signupButton)).perform(click());

        // Wait for 1 second
        Thread.sleep(1000);
        // Check if the sign-up button is still there
        onView(withId(R.id.signupButton)).check(matches(isDisplayed()));
    }

    @Test
    public void testSignUp_withShortPassword() throws InterruptedException {
        // Fill short password and valid email
        onView(withId(R.id.emailInput)).perform(replaceText("test@example.com"));
        onView(withId(R.id.passwordInput)).perform(replaceText("short"));
        onView(withId(R.id.confirmPasswordInput)).perform(replaceText("short"));
        onView(withId(R.id.firstNameInput)).perform(replaceText("John"));
        onView(withId(R.id.lastNameInput)).perform(replaceText("Doe"));
        onView(withId(R.id.usernameInput)).perform(replaceText("john_doe"));
        onView(withId(R.id.phoneNumberInput)).perform(replaceText("1234567890"));
        onView(withId(R.id.birthDateInput)).perform(replaceText("01/01/2000"));

        // Select gender
        onView(withId(R.id.radioMale)).perform(click());

        // Click on the sign-up button
        onView(withId(R.id.signupButton)).perform(click());

        // Wait for 1 second
        Thread.sleep(1000);
        // Check if the sign-up button is still there
        onView(withId(R.id.signupButton)).check(matches(isDisplayed()));
    }

    @Test
    public void testSignUp_withInvalidPhoneNumber() throws InterruptedException {
        // Fill invalid phone number and valid email, password
        onView(withId(R.id.emailInput)).perform(replaceText("test@example.com"));
        onView(withId(R.id.passwordInput)).perform(replaceText("password123"));
        onView(withId(R.id.confirmPasswordInput)).perform(replaceText("password123"));
        onView(withId(R.id.phoneNumberInput)).perform(replaceText("12345")); // Invalid phone number
        onView(withId(R.id.firstNameInput)).perform(replaceText("John"));
        onView(withId(R.id.lastNameInput)).perform(replaceText("Doe"));
        onView(withId(R.id.usernameInput)).perform(replaceText("john_doe"));
        onView(withId(R.id.birthDateInput)).perform(replaceText("01/01/2000"));

        // Select gender
        onView(withId(R.id.radioMale)).perform(click());

        // Click on the sign-up button
        onView(withId(R.id.signupButton)).perform(click());

        // Wait for 1 second
        Thread.sleep(1000);

        // Check if the sign-up button is still there
        onView(withId(R.id.signupButton)).check(matches(isDisplayed()));
    }


    @Test
    public void testSignUp_withValidInputs() throws InterruptedException {
        // Fill all fields with valid data
        onView(withId(R.id.emailInput)).perform(replaceText("test@gmail.com"));
        onView(withId(R.id.passwordInput)).perform(replaceText("password123"));
        onView(withId(R.id.confirmPasswordInput)).perform(replaceText("password123"));
        onView(withId(R.id.firstNameInput)).perform(replaceText("John"));
        onView(withId(R.id.lastNameInput)).perform(replaceText("Doe"));
        onView(withId(R.id.usernameInput)).perform(replaceText("john_doe"));
        onView(withId(R.id.phoneNumberInput)).perform(replaceText("1234567890"));
        onView(withId(R.id.birthDateInput)).perform(replaceText("01/01/2000"));

        // Select gender
        onView(withId(R.id.radioMale)).perform(click());

        // Click on the sign-up button
        onView(withId(R.id.signupButton)).perform(click());

        // Wait for 1 second
        Thread.sleep(2000);

        // Verify that the intent to navigate to the SignUpPage is fired
        intended(hasComponent(LoginPage.class.getName()));
    }
}

