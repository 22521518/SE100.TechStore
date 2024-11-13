package com.example.electrohive.Models;

import com.google.gson.annotations.SerializedName;

import java.io.Serializable;

public class Province implements Serializable {
    @SerializedName("province_id")
    private String provinceId;

    @SerializedName("province_name")
    private String provinceName;

    // Constructor
    public Province(String provinceId, String provinceName) {
        this.provinceId = provinceId;
        this.provinceName = provinceName;
    }

    // Getters and Setters
    public String getProvinceId() {
        return provinceId;
    }

    public void setProvinceId(String provinceId) {
        this.provinceId = provinceId;
    }

    public String getProvinceName() {
        return provinceName;
    }

    public void setProvinceName(String provinceName) {
        this.provinceName = provinceName;
    }

    @Override
    public String toString() {
        return "Address{" +
                "provinceId='" + provinceId + '\'' +
                ", provinceName='" + provinceName + '\'' +
                '}';
    }
}
