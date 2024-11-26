package com.example.electrohive.utils.format;

import android.graphics.Bitmap;
import android.util.Base64;

import java.io.ByteArrayOutputStream;
import java.text.DecimalFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.TimeZone;

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

    public static String formatToISO8601(String inputDate) {
        try {
            // Parse the input date (dd/MM/yyyy format from the DatePicker)
            SimpleDateFormat inputFormat = new SimpleDateFormat("dd/MM/yyyy", Locale.getDefault());
            Date date = inputFormat.parse(inputDate);

            // Convert to ISO 8601 format
            SimpleDateFormat isoFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.getDefault());
            isoFormat.setTimeZone(TimeZone.getTimeZone("UTC")); // Ensure it's in UTC
            return isoFormat.format(date);
        } catch (Exception e) {
            e.printStackTrace();
            return null; // Return null or handle the error
        }
    }

    // Helper method to convert Bitmap to Base64
    public static String encodeImageToBase64(Bitmap bitmap) {
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        bitmap.compress(Bitmap.CompressFormat.JPEG, 100, byteArrayOutputStream); // Compress image
        byte[] imageBytes = byteArrayOutputStream.toByteArray();
        return Base64.encodeToString(imageBytes, Base64.DEFAULT); // Convert to Base64
    }
}
