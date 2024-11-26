package com.example.electrohive.utils.format;

import java.text.DecimalFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class Format {
    public static String getFormattedTotalPrice(double totalPrice) {
        DecimalFormat formatter = new DecimalFormat("#,###");
        return formatter.format(totalPrice);
    }

    public static String getFormattedDate(Date date) {
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
        return sdf.format(date);
    }

    public static String getFormattedDateFromString(String dateString) {
        try {
            SimpleDateFormat inputFormat = new SimpleDateFormat("yyyy-MM-dd");  // Adjust based on actual string format
            Date date = inputFormat.parse(dateString);  // Parse the string into Date
            return getFormattedDate(date);  // Use the getFormattedDate method to format the Date
        } catch (ParseException e) {
            e.printStackTrace();
            return null;
        }
    }
}
