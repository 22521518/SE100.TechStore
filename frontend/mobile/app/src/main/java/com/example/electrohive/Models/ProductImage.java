package com.example.electrohive.Models;

public class ProductImage {
    private String name;
    private String url;

    // Constructor
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

    // Optionally, toString method for better printing
    @Override
    public String toString() {
        return "ProductImage{" +
                "name='" + name + '\'' +
                ", url='" + url + '\'' +
                '}';
    }
}
