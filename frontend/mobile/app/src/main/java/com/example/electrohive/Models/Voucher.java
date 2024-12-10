package com.example.electrohive.Models;

import java.io.Serializable;
import java.util.Date;

public class Voucher implements Serializable {
    private String voucherCode;
    private String voucherName;
    private String description;
    private double discountAmount;
    private Object validFrom;
    private Object validTo;
    private boolean isActive;

    // Constructor
    public Voucher(String voucherCode, String voucherName, String description,
                   double discountAmount, Object validFrom, Object validTo, boolean isActive) {
        this.voucherCode = voucherCode;
        this.voucherName = voucherName;
        this.description = description;
        this.discountAmount = discountAmount;
        this.validFrom = validFrom;
        this.validTo = validTo;
        this.isActive = isActive;
    }

    // Getters and Setters
    public String getVoucherCode() {
        return voucherCode;
    }

    public void setVoucherCode(String voucherCode) {
        this.voucherCode = voucherCode;
    }

    public String getVoucherName() {
        return voucherName;
    }

    public void setVoucherName(String voucherName) {
        this.voucherName = voucherName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getDiscountAmount() {
        return discountAmount;
    }

    public void setDiscountAmount(double discountAmount) {
        this.discountAmount = discountAmount;
    }

    public Object getValidFrom() {
        return validFrom;
    }

    public void setValidFrom(Object validFrom) {
        this.validFrom = validFrom;
    }

    public Object getValidTo() {
        return validTo;
    }

    public void setValidTo(Object validTo) {
        this.validTo = validTo;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean isActive) {
        this.isActive = isActive;
    }

    // Optional: toString method to represent the object
    @Override
    public String toString() {
        return "VoucherWithoutCode{" +
                "voucherCode='" + voucherCode + '\'' +
                ", voucherName='" + voucherName + '\'' +
                ", description='" + description + '\'' +
                ", discountAmount=" + discountAmount +
                ", validFrom=" + validFrom +
                ", validTo=" + validTo +
                ", isActive=" + isActive +
                '}';
    }
}