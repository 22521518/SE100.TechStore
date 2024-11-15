package com.example.electrohive.utils.generator;

import com.example.electrohive.Models.Account;
import com.example.electrohive.Models.Address;
import com.example.electrohive.Models.Category;
import com.example.electrohive.Models.Customer;
import com.example.electrohive.Models.Enum.ORDER_STATUS;
import com.example.electrohive.Models.Enum.PAYMENT_METHOD;
import com.example.electrohive.Models.Order;
import com.example.electrohive.Models.OrderItem;
import com.example.electrohive.Models.Product;
import com.example.electrohive.Models.ProductAttribute;
import com.example.electrohive.Models.ProductImage;
import com.example.electrohive.Models.Enum.SHIPPING_STATUS;
import com.example.electrohive.Models.ShippingAddress;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Random;

public class MockOrder {

    private static final ORDER_STATUS[] ORDER_STATUS_ARRAY = {ORDER_STATUS.PENDING,ORDER_STATUS.CANCELLED,ORDER_STATUS.CONFIRMED,ORDER_STATUS.SHIPPED,ORDER_STATUS.DELIVERED};
    private static final PAYMENT_METHOD[] PAYMENT_METHOD_ARRAY = {PAYMENT_METHOD.COD,PAYMENT_METHOD.MOMO};

    // Customer object


    // Method to generate random product
    private static Product generateRandomProduct(int id) {
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

        // Create product images (using ProductImage objects)
        List<ProductImage> images = new ArrayList<>();
        images.add(new ProductImage("","https://cdn.viettelstore.vn/Images/Product/ProductImage/1743276577.jpeg"));

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


    // Method to generate random order items
    private static List<OrderItem> generateRandomOrderItems() {
        Random random = new Random();
        int numberOfItems = random.nextInt(5) + 1; // Random number of items between 1 and 5
        List<OrderItem> items = new ArrayList<>();
        for (int i = 0; i < numberOfItems; i++) {
            Product product = generateRandomProduct(i + 1);
            int quantity = random.nextInt(5) + 1; // Random quantity between 1 and 5
            double unitPrice = product.getPrice() - (product.getPrice() * product.getDiscount() / 100);
            double totalPrice = quantity * unitPrice;
            items.add(new OrderItem("order_12345", product.getProductId(), product, quantity, unitPrice, totalPrice));
        }
        return items;
    }

    // Method to generate random order data
    public static Order generateDummyOrderData() {
        Random random = new Random();
        // Dummy customer
        Customer dummyCustomer = new Customer(
                "cust_12345",
                "john_doe",
                "John Doe",
                "123-456-7890",
                "2024-11-15T10:00:00Z"
        );


        // Create the Address object
        Address address = new Address(
                "1",                           // addressId
                "Thành Phố Hồ Chí Minh",        // city
                "123 Main St",                  // address
                "Huyện Cần Giờ",                // district
                "Xã Bình Khánh",                // ward
                "John Doe",                     // fullName (example)
                "123456789",                    // phoneNumber (example)
                true                            // isPrimary (example)
        );

        // Create the ShippingAddress object
        ShippingAddress dummyShippingAddress = new ShippingAddress(
                SHIPPING_STATUS.SHIPPED,       // Example: SHIPPED
                new Date(),                  // Parsed shipping date
                address                        // Address object
        );

        // Generate random order items
        List<OrderItem> dummyOrderItems = generateRandomOrderItems();

        // Create dummy order
        double totalPrice = dummyOrderItems.stream().mapToDouble(item -> item.getTotalPrice()).sum();
        return new Order(
                "order_" + (random.nextInt(1000) + 1),
                dummyCustomer.getCustomerId(),
                dummyCustomer,
                ORDER_STATUS_ARRAY[random.nextInt(ORDER_STATUS_ARRAY.length)],
                totalPrice,
                "DISCOUNT10",
                "2024-11-15T10:00:00Z",
                dummyShippingAddress,
                dummyOrderItems,
                PAYMENT_METHOD_ARRAY[random.nextInt(PAYMENT_METHOD_ARRAY.length)]
        );

    }

    // Method to generate multiple dummy orders
    public static List<Order> createMockOrdersData(int num) {
        List<Order> ordersList = new ArrayList<>();
        for (int i = 0; i < num; i++) {
            ordersList.add(generateDummyOrderData());
        }
        return ordersList;
    }

    // Main method for testing
    public static void main(String[] args) {
        List<Order> dummyOrders = createMockOrdersData(5);
        for (Order order : dummyOrders) {
            System.out.println(order.getOrderId());
        }
    }
}

