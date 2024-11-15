package com.example.electrohive.Models;

public class ProductAttribute {
    private int id;
    private String name;
    private String detail;

    // Constructor
    public ProductAttribute(int id, String name, String detail) {
        this.id = id;
        this.name = name;
        this.detail = detail;
    }

    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDetail() {
        return detail;
    }

    public void setDetail(String detail) {
        this.detail = detail;
    }

    // Optionally, toString method for better printing
    @Override
    public String toString() {
        return "ProductAttribute{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", detail='" + detail + '\'' +
                '}';
    }
}
