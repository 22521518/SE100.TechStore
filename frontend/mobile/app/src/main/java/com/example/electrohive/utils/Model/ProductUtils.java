package com.example.electrohive.utils.Model;

import android.util.Log;

import com.example.electrohive.Models.Category;
import com.example.electrohive.Models.Product;
import com.example.electrohive.Models.ProductAttribute;
import com.example.electrohive.Models.ProductImage;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import java.util.ArrayList;
import java.util.List;

public class ProductUtils {

    public static Product parseProduct(JsonObject productJson) {
        Product product = null;

        // Use JsonObject's safe method to check for the presence of keys before accessing
        String productId = productJson.has("product_id") ? productJson.get("product_id").getAsString() : "";
        String productName = productJson.has("product_name") ? productJson.get("product_name").getAsString() : "";
        JsonArray imagesArray = productJson.has("images") ? productJson.get("images").getAsJsonArray() : new JsonArray();
        String description = productJson.has("description") ? productJson.get("description").getAsString() : "";
        float price = productJson.has("price") ? productJson.get("price").getAsFloat() : 0;
        float discount = productJson.has("discount") ? productJson.get("discount").getAsFloat() : 0;
        int stockQuantity = productJson.has("stock_quantity") ? productJson.get("stock_quantity").getAsInt() : 0;
        JsonArray categoriesArray = productJson.has("categories") ? productJson.get("categories").getAsJsonArray() : new JsonArray();
        float averageRating = productJson.has("average_rating") ? productJson.get("average_rating").getAsFloat() : 0;
        JsonArray attributesArray = productJson.has("attributes") ? productJson.get("attributes").getAsJsonArray() : new JsonArray();

        // Convert JSON arrays to lists of objects
        List<ProductImage> imageList = parseImages(imagesArray);
        List<Category> categoryList = parseCategories(categoriesArray);
        List<ProductAttribute> attributeList = parseAttributes(attributesArray);

        // Create Product object and add it to the list
        product = new Product(
                productId, productName, imageList, description, price, discount,
                stockQuantity, categoryList, new ArrayList<>());
        product.setAverageRating(averageRating);

        return product;
    }

    public static List<Product> parseProducts(JsonArray resultsArray) {
        List<com.example.electrohive.Models.Product> products = new ArrayList<>();
        for (JsonElement element : resultsArray) {
            JsonObject productJson = element.getAsJsonObject();
            Product product = parseProduct(productJson);
            if(product!=null){
                products.add(product);
            }
        }
        return products;
    }


    public static List<ProductImage> parseImages(JsonArray imagesArray) {
        List<ProductImage> imageList = new ArrayList<>();
        for (int j = 0; j < imagesArray.size(); j++) {
            String imageUrl = imagesArray.get(j).getAsString();
            imageList.add(new ProductImage(imageUrl));
        }
        return imageList;
    }

    public static List<Category> parseCategories(JsonArray categoriesArray) {
        List<Category> categoryList = new ArrayList<>();
        for (int k = 0; k < categoriesArray.size(); k++) {
            JsonObject categoryJson = categoriesArray.get(k).getAsJsonObject();
            int categoryId = categoryJson.get("category_id").getAsInt();
            String categoryName = categoryJson.get("category_name").getAsString();
            String categoryDescription = categoryJson.get("description").getAsString();
            categoryList.add(new Category(categoryId, categoryName, categoryDescription));
        }
        return categoryList;
    }

    public static List<ProductAttribute> parseAttributes(JsonArray attributesArray) {
        List<ProductAttribute> attributeList = new ArrayList<>();
        for (int l = 0; l < attributesArray.size(); l++) {
            JsonObject attributeJson = attributesArray.get(l).getAsJsonObject();
            String attributeId = attributeJson.get("_id").getAsString();
            String productId = attributeJson.has("product_id")?attributeJson.get("product_id").getAsString():"product_"+l;
            String attributeName = attributeJson.get("name").getAsString();
            String attributeValue = attributeJson.get("detail").getAsString();
            attributeList.add(new ProductAttribute(attributeId, productId, attributeName, attributeValue));
        }
        return attributeList;
    }


    public static List<com.example.electrohive.Models.Product> filterBySearchText(List<com.example.electrohive.Models.Product> products, String searchText) {
        List<com.example.electrohive.Models.Product> filteredList = new ArrayList<>();
        // If searchText is null or empty, the list is not filtered and returned as is
        if (searchText != null && !searchText.isEmpty()) {
            for (com.example.electrohive.Models.Product product : products) {
                if (product.getProductName().toLowerCase().contains(searchText.toLowerCase())) {
                    filteredList.add(product);
                }
            }
        } else {
            // No filtering, return the original list
            filteredList = new ArrayList<>(products);
        }
        return filteredList;
    }

    public static List<com.example.electrohive.Models.Product> filterByCategory(List<com.example.electrohive.Models.Product> products, String category) {
        List<com.example.electrohive.Models.Product> filteredList = new ArrayList<>();

        // If the category is "All", null, or empty, return the original list
        if (category == null || category.isEmpty() || category.equalsIgnoreCase("All")) {
            return new ArrayList<>(products); // Return a copy of the original list
        }

        // Filter products by category
        for (com.example.electrohive.Models.Product product : products) {
            for (Category cat : product.getCategories()) {
                if (cat.getCategoryName().equalsIgnoreCase(category)) {
                    filteredList.add(product);
                    break; // Stop checking other categories for this product
                }
            }
        }

        return filteredList;
    }

    public static List<com.example.electrohive.Models.Product> filterByPriceRange(List<com.example.electrohive.Models.Product> products, String priceRange) {
        List<com.example.electrohive.Models.Product> filteredList = new ArrayList<>();

        for (com.example.electrohive.Models.Product product : products) {
            double price = product.getPrice();

            switch (priceRange) {
                case "-10,000,000 VNĐ":
                    if (price >= 0 && price <= 10000000) {
                        filteredList.add(product);
                    }
                    break;
                case "10,000,000-50,000,000 VNĐ":
                    if (price > 10000000 && price <= 50000000) {
                        filteredList.add(product);
                    }
                    break;
                case "50,000,000+":
                    if (price > 50000000) {
                        filteredList.add(product);
                    }
                    break;
                case "All":
                    // No filtering, add all products
                    filteredList.add(product);
                    break;
                default:
                    filteredList.add(product);
                    break;
            }
        }

        return filteredList;
    }
}
