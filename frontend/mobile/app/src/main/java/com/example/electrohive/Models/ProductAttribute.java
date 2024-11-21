package com.example.electrohive.Models;

public class ProductAttribute {
    private String id;
    private String name;

    private String product_id;
    private String detail;

    // Constructor
    public ProductAttribute(String id, String product_id, String name, String detail) {
        this.id = id;
        this.product_id = product_id;
        this.name = name;
        this.detail = detail;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
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
