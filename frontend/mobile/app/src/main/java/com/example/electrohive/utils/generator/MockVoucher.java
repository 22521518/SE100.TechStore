package com.example.electrohive.utils.generator;

import com.example.electrohive.Models.Voucher;

import java.util.ArrayList;
import java.util.Date;

public class MockVoucher {
    public static ArrayList<Voucher> createMockVoucherData() {
        ArrayList<Voucher> voucherList = new ArrayList<>();

        // Sample vouchers (Some are expired)
        voucherList.add(new Voucher(
                "VOUCHER1",
                "10% Off",
                "Get 10% off on electronics",
                10.0,
                new Date(),
                new Date(System.currentTimeMillis() + 86400000L), // valid for 1 day
                true
        ));

        voucherList.add(new Voucher(
                "VOUCHER2",
                "Free Shipping",
                "Free shipping on orders over 500k",
                0.0,
                new Date(),
                new Date(System.currentTimeMillis() + 172800000L), // valid for 2 days
                true
        ));

        voucherList.add(new Voucher(
                "VOUCHER3",
                "20% Off",
                "Get 20% off on all items",
                20.0,
                new Date(),
                new Date(System.currentTimeMillis() - 86400000L), // expired (valid 1 day ago)
                false
        ));

        // Expired Voucher 1
        voucherList.add(new Voucher(
                "VOUCHER4",
                "30% Off",
                "Get 30% off on your next purchase",
                30.0,
                new Date(),
                new Date(System.currentTimeMillis() - 172800000L), // expired (valid 2 days ago)
                false
        ));

        // Expired Voucher 2
        voucherList.add(new Voucher(
                "VOUCHER5",
                "Buy 1 Get 1 Free",
                "Buy one, get one free on selected items",
                0.0,
                new Date(),
                new Date(System.currentTimeMillis() - 259200000L), // expired (valid 3 days ago)
                false
        ));

        // Expired Voucher 3
        voucherList.add(new Voucher(
                "VOUCHER6",
                "50% Off",
                "Get 50% off on all electronics",
                50.0,
                new Date(),
                new Date(System.currentTimeMillis() - 432000000L), // expired (valid 5 days ago)
                false
        ));

        // Expired Voucher 4
        voucherList.add(new Voucher(
                "VOUCHER7",
                "15% Off",
                "Get 15% off on clothing items",
                15.0,
                new Date(),
                new Date(System.currentTimeMillis() - 604800000L), // expired (valid 7 days ago)
                false
        ));

        return voucherList;
    }

}
