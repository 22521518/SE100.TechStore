package com.example.electrohive;

import io.appium.java_client.AppiumBy;
import io.appium.java_client.AppiumDriver;
import io.appium.java_client.android.AndroidDriver;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.remote.DesiredCapabilities;

import java.net.URL;

import static org.junit.Assert.assertNotNull;

import android.widget.Button;

public class AppTest {

    private AppiumDriver driver;

    @Before
    public void setUp() throws Exception {
        DesiredCapabilities caps = new DesiredCapabilities();
        caps.setCapability("platformName", "Android");
        caps.setCapability("appium:deviceName", "Pixel 4 API 31");
        caps.setCapability("appium:automationName", "UiAutomator2");
        caps.setCapability("appium:appPackage", "com.example.electrohive");
        caps.setCapability("appium:appActivity", "com.example.electrohive.MainActivity");

        // Initialize the driver
        URL appiumServerUrl = new URL("http://127.0.0.1:4723");
        driver = new AndroidDriver(appiumServerUrl, caps);
    }

    @Test
    public void testClickElement() {
        // Find the element by ID and click on it
        WebElement element = driver.findElement(AppiumBy.id("com.example.electrohive:id/menuButton"));
        assertNotNull("Element not found", element);
        element.click();

        // Additional assertions or actions can go here, for example:
        // assertEquals("ExpectedText", element.getText());
    }

    @After
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}
