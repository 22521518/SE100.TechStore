package com.example.electrohive.utils.generator;

import com.example.electrohive.Models.Category;

import java.util.ArrayList;
import java.util.List;

public class MockCategory {
    public static List<Category> createMockCategoryData(int n) {
        List<Category> cateList = new ArrayList<>();

        for (int i = 0; i < n; i++) {
            // Create mock data for each category
            String categoryName = "Category " + (i + 1);
            String description = "Description for Category " + (i + 1);

            // Add the mock category to the list
            cateList.add(new Category(categoryName, description));
        }

        return cateList;
    }
}
