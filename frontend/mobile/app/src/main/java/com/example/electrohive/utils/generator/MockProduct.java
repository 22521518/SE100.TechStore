package com.example.electrohive.utils.generator;

import com.example.electrohive.Models.Category;
import com.example.electrohive.Models.Product;
import com.example.electrohive.Models.ProductAttribute;
import com.example.electrohive.Models.ProductImage;
import com.example.electrohive.Models.ProductFeedback;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class MockProduct {

    private static List<List<String>> imageSets = List.of(
            List.of(
                    "https://cdn.viettelstore.vn/Images/Product/ProductImage/1743276577.jpeg",
                    "https://www.apple.com/newsroom/images/product/iphone/standard/Apple-iPhone-14-Pro-iPhone-14-Pro-Max-hero-220907_Full-Bleed-Image.jpg.large.jpg",
                    "https://cdn-media.sforum.vn/storage/app/media/trannghia/iphone-14-hang-tan-trang.jpeg"
            ),
            List.of(
                    "https://toannguyenmobile.com/uploads/source/samsung/s24-ultra/vwh86-sq1-0000000004-black-slf.jpg",
                    "https://images.samsung.com/vn/smartphones/galaxy-s24-ultra/images/galaxy-s24-ultra-highlights-color-titanium-gray-back-mo.jpg?imbypass=true",
                    "https://www.zdnet.com/a/img/2024/02/02/1bfa7d30-112c-4906-83a7-ce12551b7b16/galaxy-s24-ultra.jpg"
            ),
            List.of(
                    "https://bichvanstore.com/wp-content/uploads/2022/10/MacBook-Pro-13-inch-M2-2022-Mi_1.png",
                    "https://www.cnet.com/a/img/resize/9624241ec6785ab68e2092e9656bc16c73d75cb1/hub/2023/01/21/ec79d7fc-9235-4830-8fc1-77db12800b97/apple-macbook-pro-16-2023-3214.jpg?auto=webp&fit=crop&height=1200&width=1200",
                    "https://i.ytimg.com/vi/tmGDx9hVWwo/maxresdefault.jpg"
            )
    );

    private static final String[] feedbackMessages = {
            "Excellent product, highly recommend!",
            "Good value for money.",
            "Very bad quality, I do not recommend.",
            "It’s an okay product, could be better.",
            "Amazing, exceeded my expectations!"
    };

    public static List<Product> createMockProductsData(int n) {
        List<Product> products = new ArrayList<>();
        for (int i = 1; i <= n; i++) {
            products.add(createMockProductData(i));
        }
        return products;
    }



    public static Product createMockProductData(int id) {
        Random random = new Random();
        int price = random.nextInt(100000000) + 5000000; // Random price between 5,000,000 and 100,000,000
        float discount = random.nextInt(70) + 10; // Random discount between 10 and 80
        int stockQuantity = random.nextInt(50) + 1; // Random stock quantity between 1 and 50

        // Create categories
        List<Category> categories = new ArrayList<>();
        categories.add(new Category("Electronics", "Electronic devices and gadgets"));

        // Create product attributes
        List<ProductAttribute> attributes = new ArrayList<>();
        attributes.add(new ProductAttribute(1, "Color", "Black"));
        attributes.add(new ProductAttribute(2, "Size", "Medium"));

        // Random image set
        List<String> selectedImageSet = imageSets.get(random.nextInt(imageSets.size())); // Inclusive selection
        List<ProductImage> images = new ArrayList<>();
        for (String imageUrl : selectedImageSet) {
            images.add(new ProductImage(imageUrl));
        }

        // Generate random feedback
        List<ProductFeedback> feedbacks = generateRandomFeedback(id);

        // Calculate average rating based on feedbacks
        float averageRating = calculateAverageRating(feedbacks);

        // Return a new Product object with all the required parameters
        Product product = new Product(
                "prod_" + id, // productId
                "Sample Product " + id, // productName
                images, // images
                "This is a sample product description.", // description
                price, // price
                discount, // discount
                stockQuantity, // stockQuantity
                categories, // categories
                attributes // attributes
        );
        product.setAverageRating(averageRating); // Set the average rating
        product.setProductFeedbacks(feedbacks);  // Set the feedbacks

        return product;
    }

    private static List<ProductFeedback> generateRandomFeedback(int productId) {
        Random random = new Random();
        int numFeedbacks = random.nextInt(5) + 1; // Random number of feedbacks between 1 and 5
        List<ProductFeedback> feedbacks = new ArrayList<>();
        for (int i = 0; i < numFeedbacks; i++) {
            String feedbackId = "fb_" + random.nextInt(1000);
            String customerId = "cust_" + random.nextInt(1000);
            String message = feedbackMessages[random.nextInt(feedbackMessages.length)];
            int rating = random.nextInt(5) + 1; // Random rating between 1 and 5

            feedbacks.add(new ProductFeedback(feedbackId, customerId, "prod_" + productId, rating, message, "2024-11-19T12:00:00Z"));
        }
        return feedbacks;
    }

    private static float calculateAverageRating(List<ProductFeedback> feedbacks) {
        if (feedbacks.isEmpty()) {
            return 0;
        }
        int totalRating = 0;
        for (ProductFeedback feedback : feedbacks) {
            totalRating += feedback.getRating();
        }
        return totalRating / (float) feedbacks.size();
    }
}
