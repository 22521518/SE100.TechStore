package com.example.electrohive.Models;

import android.os.Parcel;
import android.os.Parcelable;

public class ProductImage implements Parcelable {
    private String name;
    private String url;

    // Constructor
    public ProductImage(String url) {
        this.name = "";
        this.url = url;
    }

    public ProductImage(String name, String url) {
        this.name = name;
        this.url = url;
    }

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    // Parcelable implementation

    protected ProductImage(Parcel in) {
        name = in.readString();
        url = in.readString();
    }

    public static final Creator<ProductImage> CREATOR = new Creator<ProductImage>() {
        @Override
        public ProductImage createFromParcel(Parcel in) {
            return new ProductImage(in);
        }

        @Override
        public ProductImage[] newArray(int size) {
            return new ProductImage[size];
        }
    };

    @Override
    public void writeToParcel(Parcel dest, int flags) {
        dest.writeString(name);
        dest.writeString(url);
    }

    @Override
    public int describeContents() {
        return 0;
    }

    // Optionally, toString method for better printing
    @Override
    public String toString() {
        return "ProductImage{" +
                "name='" + name + '\'' +
                ", url='" + url + '\'' +
                '}';
    }
}
