package com.example.electrohive.Models;

import java.util.Date;

public class Voucher {
    private String voucherCode;
    private String voucherName;
    private String description;
    private double discountAmount;
    private Date validFrom;
    private Date validTo;
    private boolean isActive;

    // Constructor
    public Voucher(String voucherCode, String voucherName, String description,
                   double discountAmount, Date validFrom, Date validTo, boolean isActive) {
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

    public Date getValidFrom() {
        return validFrom;
    }

    public void setValidFrom(Date validFrom) {
        this.validFrom = validFrom;
    }

    public Date getValidTo() {
        return validTo;
    }

    public void setValidTo(Date validTo) {
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