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


    // Method to generate random order items
    private static List<OrderItem> generateRandomOrderItems() {
        Random random = new Random();
        int numberOfItems = random.nextInt(5) + 1; // Random number of items between 1 and 5
        List<OrderItem> items = new ArrayList<>();
        for (int i = 0; i < numberOfItems; i++) {
            Product product = MockProduct.createMockProductData(i + 1);
            int quantity = random.nextInt(5) + 1; // Random quantity between 1 and 5
            double unitPrice = product.getPrice() - (product.getPrice() * product.getDiscount() / 100);
            double totalPrice = quantity * unitPrice;
            items.add(new OrderItem("order_12345", product.getProductId(), product, quantity, unitPrice, totalPrice));
        }
        return items;
    }

    // Method to generate random order data
    public static Order createMockOrderData() {
        Random random = new Random();
        // Dummy customer
        Customer dummyCustomer = MockCustomer.createMockCustomerData();


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
            ordersList.add(createMockOrderData());
        }
        return ordersList;
    }

}

