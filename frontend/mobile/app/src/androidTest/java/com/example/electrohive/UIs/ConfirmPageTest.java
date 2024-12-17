package com.example.electrohive.UIs;

import static androidx.test.espresso.Espresso.onView;
import static androidx.test.espresso.action.ViewActions.click;
import static androidx.test.espresso.assertion.ViewAssertions.matches;
import static androidx.test.espresso.matcher.ViewMatchers.isDisplayed;
import static androidx.test.espresso.matcher.ViewMatchers.withId;
import static androidx.test.espresso.matcher.ViewMatchers.withText;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;

import androidx.test.core.app.ActivityScenario;
import androidx.test.core.app.ApplicationProvider;
import androidx.test.espresso.intent.Intents;
import androidx.test.ext.junit.rules.ActivityScenarioRule;
import androidx.test.ext.junit.runners.AndroidJUnit4;

import com.example.electrohive.Activities.ConfirmPage;
import com.example.electrohive.Models.CheckoutAddress;
import com.example.electrohive.Models.Customer;
import com.example.electrohive.Models.Enum.PAYMENT_METHOD;
import com.example.electrohive.Models.Voucher;
import com.example.electrohive.R;
import com.example.electrohive.ViewModel.CustomerViewModel;
import com.example.electrohive.utils.PreferencesHelper;
import com.example.electrohive.utils.format.Format;
import com.google.gson.Gson;

import org.junit.After;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.openqa.selenium.devtools.v85.indexeddb.model.DataEntry;

import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.Date;
import java.util.Locale;

@RunWith(AndroidJUnit4.class)
public class ConfirmPageTest {

    private static final CheckoutAddress testAddress = new CheckoutAddress(
            "123 Main St", "New York", "Brooklyn", "Ward 1", "John Doe", "1234567890"
    );

    private static final String  formattedAddress = String.format("%s, %s %s, %s", testAddress.getAddress(),testAddress.getWard(),testAddress.getDistrict(),testAddress.getCity());
    private static String createDateNow() {
        LocalDate currentDate = LocalDate.now();

        // Lấy tên thứ (Monday, Tuesday, ...)
        String dayOfWeek = currentDate.getDayOfWeek().getDisplayName(TextStyle.FULL, Locale.ENGLISH);

        // Lấy tháng (October, November, ...)
        String month = currentDate.getMonth().getDisplayName(TextStyle.FULL, Locale.ENGLISH);

        // Lấy ngày (9, 10, ...)
        int day = currentDate.getDayOfMonth();

        // Lấy năm (2024, ...)
        int year = currentDate.getYear();

        // Tạo chuỗi theo định dạng
        return  String.format("%s, %s %d, %d", dayOfWeek, month, day, year);
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
    public static void setUpClass() {
        Context context = ApplicationProvider.getApplicationContext();
        PreferencesHelper.init(context);
        PreferencesHelper.saveCustomerData(mockCustomer);
        CustomerViewModel.getInstance().setSessionCustomer(mockCustomer);
    }

    @Before
    public void setUpForEachTest() {
        Intents.init(); // Initialize intents for testing navigation
    }

    @After
    public void tearDown() {
        Intents.release();
    }

    private Intent createTestIntent(String paymentMethod) {
        Intent intent = new Intent(ApplicationProvider.getApplicationContext(), ConfirmPage.class);

        Gson gson = new Gson();
        String json = gson.toJson(new ArrayList<>()); // Empty "checkedItems"

        intent.putExtra("checkedItems", json);
        intent.putExtra("address", testAddress);
        intent.putExtra("subtotal","1000 VNĐ");
        intent.putExtra("discount", "1000 VNĐ");
        intent.putExtra("grandTotal", "1000 VNĐ");
        intent.putExtra("payment_method", paymentMethod);
        intent.putExtra("voucher",new Voucher("123","hello","holidays",10, null, null, true));

        return intent;
    }

    @Test
    public void testVisibilityOfViewsWithCOD(){
        Intent intent = createTestIntent(PAYMENT_METHOD.COD.name());

        try (ActivityScenario<Activity> scenario = ActivityScenario.launch(intent)) {
            // Verify views are displayed
            onView(withId(R.id.date)).check(matches(withText(createDateNow())));
            onView(withId(R.id.payment_method)).check(matches(withText("COD")));
            onView(withId(R.id.address)).check(matches(withText(formattedAddress)));
            onView(withId(R.id.receipt_discount_code)).check(matches(withText("hello")));
            onView(withId(R.id.receipt_subtotal)).check(matches(isDisplayed()));
            onView(withId(R.id.receipt_discount_percentage)).check(matches(withText("(10.0%)")));
            onView(withId(R.id.receipt_discount)).check(matches(isDisplayed()));
            onView(withId(R.id.receipt_shipment_cost)).check(matches(isDisplayed()));
            onView(withId(R.id.receipt_grand_total)).check(matches(isDisplayed()));
            onView(withId(R.id.confirm )).check(matches(isDisplayed()));
        }


    }

    @Test
    public void testVisibilityOfViewsWithWallet(){
        Intent intent = createTestIntent(PAYMENT_METHOD.ZALOPAY.name());

        try (ActivityScenario<Activity> scenario = ActivityScenario.launch(intent)) {
            // Verify views are displayed
            onView(withId(R.id.date)).check(matches(withText(createDateNow())));
            onView(withId(R.id.payment_method)).check(matches(withText("ZALOPAY")));
            onView(withId(R.id.address)).check(matches(withText(formattedAddress)));
            onView(withId(R.id.receipt_discount_code)).check(matches(withText("hello")));
            onView(withId(R.id.receipt_subtotal)).check(matches(isDisplayed()));
            onView(withId(R.id.receipt_discount_percentage)).check(matches(withText("(10.0%)")));
            onView(withId(R.id.receipt_discount)).check(matches(isDisplayed()));
            onView(withId(R.id.receipt_shipment_cost)).check(matches(isDisplayed()));
            onView(withId(R.id.receipt_grand_total)).check(matches(isDisplayed()));
            onView(withId(R.id.confirm )).check(matches(isDisplayed()));
        }


    }





}
