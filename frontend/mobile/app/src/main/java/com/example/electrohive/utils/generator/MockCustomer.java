package com.example.electrohive.utils.generator;

import com.example.electrohive.Models.Customer;
import com.example.electrohive.utils.format.Format;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Random;
import java.util.UUID;

public class MockCustomer {

    // Method to generate random mock customer data
    public static Customer createMockCustomerData() {
        Random random = new Random();

        // Generate random customerId and accountId using UUID for uniqueness
        String customerId = "cust_" + UUID.randomUUID().toString().substring(0, 8); // Random customer ID
        String accountId = UUID.randomUUID().toString().substring(0, 8); // Random account ID

        // Generate random username (simple pattern for now)
        String username = "user_" + UUID.randomUUID().toString().substring(0, 8);

        // Generate random full name
        String[] firstNames = {"John", "Jane", "Alex", "Chris", "Kate"};
        String[] lastNames = {"Doe", "Smith", "Johnson", "Lee", "Brown"};
        String fullName = firstNames[random.nextInt(firstNames.length)] + " " + lastNames[random.nextInt(lastNames.length)];

        // Generate random phone number (simple pattern for now)
        String phoneNumber = "+1-" + (random.nextInt(900) + 100) + "-" + (random.nextInt(900) + 100) + "-" + (random.nextInt(9000) + 1000);

        // Generate random birth date between 18 and 65 years old
        long minDate = new Date().getTime() - (long)(65 * 365.25 * 24 * 60 * 60 * 1000); // 65 years ago
        long maxDate = new Date().getTime() - (long)(18 * 365.25 * 24 * 60 * 60 * 1000); // 18 years ago
        long randomDateInMillis = minDate + (long)(random.nextDouble() * (maxDate - minDate));
        Date birthDate = new Date(randomDateInMillis);

        // Generate random date joined in the past (up to 1000 days ago)
        long randomJoinedDateInMillis = new Date().getTime() - (long)(random.nextDouble() * 1000 * 24 * 60 * 60 * 1000);
        Date dateJoined = new Date(randomJoinedDateInMillis);

        // Format the birth date and date joined as ISO strings
        String birthDateFormatted = Format.getFormattedDate(birthDate);
        String dateJoinedFormatted = Format.getFormattedDate(dateJoined);

        String[] imageUrls = {
                "https://www.foto-bern.ch/wp-content/uploads/2022/07/Portrait-357.-vorschau.jpg",
                "https://franchisematch.com/wp-content/uploads/2015/02/john-doe.jpg",
                "https://ih1.redbubble.net/image.3150723596.2110/raf,360x360,075,t,fafafa:ca443f4786.jpg"
        };
        String image = imageUrls[random.nextInt(imageUrls.length)];

        // Return the mock customer
        return new Customer(
                customerId,
                accountId,
                username,
                fullName,
                phoneNumber,
                image,
                birthDateFormatted,
                dateJoinedFormatted
        );
    }
}
