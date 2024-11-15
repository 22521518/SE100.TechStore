package com.example.electrohive.utils.format;

import java.text.DecimalFormat;

public class Format {
    public static String getFormattedTotalPrice(double totalPrice) {
        DecimalFormat formatter = new DecimalFormat("#,###");
        return formatter.format(totalPrice);
    }
}
