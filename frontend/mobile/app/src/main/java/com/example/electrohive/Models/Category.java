package com.example.electrohive.Models;

public class Category {
    private int categoryId; // Optional field, can be null
    private String categoryName;
    private String description;

    // Constructor
    public Category(int id,String categoryName, String description) {
        this.categoryId = id;
        this.categoryName = categoryName;
        this.description = description;
    }
    public Category(String categoryName, String description) {
        this.categoryName = categoryName;
        this.description = description;
    }


    public int getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(int categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    // Optionally, toString method for better printing
    @Override
    public String toString() {
        return "Category{" +
                "categoryId=" + categoryId +
                ", categoryName='" + categoryName + '\'' +
                ", description='" + description + '\'' +
                '}';
    }
}
