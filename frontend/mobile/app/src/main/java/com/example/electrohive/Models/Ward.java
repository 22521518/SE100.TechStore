package com.example.electrohive.Models;

import com.google.gson.annotations.SerializedName;

import java.io.Serializable;

public class Ward implements Serializable {
    @SerializedName("ward_id")
    private String wardId;

    @SerializedName("ward_name")
    private String wardName;

    // Constructor
    public Ward(String wardId, String wardName) {
        this.wardId = wardId;
        this.wardName = wardName;
    }

    // Getters and Setters
    public String getWardId() {
        return wardId;
    }

    public void setWardName(String wardId) {
        this.wardId = wardId;
    }

    public String getWardName() {
        return wardName;
    }

    public void serWardName(String wardName) {
        this.wardName = wardName;
    }

    @Override
    public String toString() {
        return "Address{" +
                "wardId='" + wardId + '\'' +
                ", wardName='" + wardName + '\'' +
                '}';
    }
}
