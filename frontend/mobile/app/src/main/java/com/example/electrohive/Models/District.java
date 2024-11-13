package com.example.electrohive.Models;

import com.google.gson.annotations.SerializedName;

import java.io.Serializable;

public class District implements Serializable {
    @SerializedName("district_id")
    private String districtId;

    @SerializedName("district_name")
    private String districtName;

    // Constructor
    public District(String districtId, String districtName) {
        this.districtId = districtId;
        this.districtName = districtName;
    }

    // Getters and Setters
    public String getDistrictId() {
        return districtId;
    }

    public void setDistrictId(String districtId) {
        this.districtId = districtId;
    }

    public String getDistrictName() {
        return districtName;
    }

    public void setDistrictName(String districtName) {
        this.districtName = districtName;
    }

    @Override
    public String toString() {
        return "Address{" +
                "districtId='" + districtId + '\'' +
                ", districtName='" + districtName + '\'' +
                '}';
    }
}
