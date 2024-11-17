package com.example.electrohive.utils.generator;

import com.example.electrohive.Models.Category;
import com.example.electrohive.Models.Product;
import com.example.electrohive.Models.ProductAttribute;
import com.example.electrohive.Models.ProductImage;

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

    public static Product generateRandomProduct(int id) {
        Random random = new Random();
        int price = random.nextInt(100000000) + 5000000; // Random price between 5,000,000 and 100,000,000
        int discount = random.nextInt(70) + 10; // Random discount between 10 and 80
        int stockQuantity = random.nextInt(50) + 1; // Random stock quantity between 1 and 50

        // Create categories
        List<Category> categories = new ArrayList<>();
        categories.add(new Category("Electronics", "Electronic devices and gadgets"));

        // Create product attributes
        List<ProductAttribute> attributes = new ArrayList<>();
        attributes.add(new ProductAttribute(1, "Color", "Black"));
        attributes.add(new ProductAttribute(2, "Size", "Medium"));

        // Random image set
        List<String> selectedImageSet = imageSets.get(random.nextInt(imageSets.size()));
        List<ProductImage> images = new ArrayList<>();
        for (String imageUrl : selectedImageSet) {
            images.add(new ProductImage("", imageUrl));
        }

        // Return a new Product object with all the required parameters
        return new Product(
                "prod_" + id, // productId
                "Sample Product " + id, // productName
                images, // images
                "This is a sample product description.", // description
                price, // price
                (double) discount, // discount
                stockQuantity, // stockQuantity
                categories, // categories
                attributes // attributes
        );
    }
}
