package com.example.electrohive.Models;

import java.io.Serializable;

public class CheckoutAddress implements Serializable {
    private String city;
    private String address;
    private String district;  // quận
    private String ward;      // phường
    private String fullName;
    private String phoneNumber;

    // Constructor
    public CheckoutAddress(String address,String city, String district, String ward,
                   String fullName, String phoneNumber) {
        this.city = city;
        this.address = address;
        this.district = district;
        this.ward = ward;
        this.fullName = fullName;
        this.phoneNumber = phoneNumber;
    }




    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public String getWard() {
        return ward;
    }

    public void setWard(String ward) {
        this.ward = ward;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }



    // Optionally, toString method for better printing
    @Override
    public String toString() {
        return "Address{" +
                ", city='" + city + '\'' +
                ", address='" + address + '\'' +
                ", district='" + district + '\'' +
                ", ward='" + ward + '\'' +
                ", fullName='" + fullName + '\'' +
                ", phoneNumber='" + phoneNumber + '\'' +
                '}';
    }
}

