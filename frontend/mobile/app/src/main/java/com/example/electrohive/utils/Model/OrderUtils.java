package com.example.electrohive.utils.Model;

import static com.example.electrohive.utils.Model.AddressUtils.parseShippingAddress;

import android.util.Log;

import com.example.electrohive.Models.Customer;
import com.example.electrohive.Models.Enum.ORDER_STATUS;
import com.example.electrohive.Models.Enum.PAYMENT_METHOD;
import com.example.electrohive.Models.Order;
import com.example.electrohive.Models.OrderItem;
import com.example.electrohive.Models.Product;
import com.example.electrohive.Models.ShippingAddress;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import java.util.ArrayList;
import java.util.List;

public class OrderUtils {

    public static List<Order> parseOrders(JsonArray ordersJson) {
        List<Order> orderList = new ArrayList<>();

        for(int i=0;i<ordersJson.size(); i++) {
            JsonObject orderObject = ordersJson.get(i).getAsJsonObject();
            Order order = parseOrder(orderObject);
            orderList.add(order);
        }

        return orderList;
    }

    public static Order parseOrder(JsonObject orderJson) {
        // Extract basic order details
        String orderId = orderJson.get("order_id").getAsString();
        String customerId = orderJson.get("customer_id").getAsString();
        ORDER_STATUS orderStatus = ORDER_STATUS.valueOf(orderJson.get("order_status").getAsString());
        double totalPrice = orderJson.get("total_price").getAsDouble();
        String voucherCode = orderJson.has("voucher_code") && !orderJson.get("voucher_code").isJsonNull()
                ? orderJson.get("voucher_code").getAsString()
                : "";
        String paymentMethodStr = orderJson.get("payment_method").getAsString();
        PAYMENT_METHOD paymentMethod = PAYMENT_METHOD.valueOf(paymentMethodStr);

        // Parse created_at as a Date or String (depends on implementation)
        Object createdAt = orderJson.get("created_at").getAsString();

        // Parse customer
        Customer customer = CustomerUtils.parseCustomer(orderJson.getAsJsonObject("customer"));

        // Parse shipping address
        ShippingAddress shippingAddress = null;
        if (orderJson.has("shipping_address") && !orderJson.get("shipping_address").isJsonNull()) {
            shippingAddress = AddressUtils.parseShippingAddress(orderJson.getAsJsonObject("shipping_address"));
        }

        // Parse order items
        List<OrderItem> orderItems = parseOrderItems(orderJson.getAsJsonArray("order_items"));

        // Construct and return the Order object
        return new Order(orderId, customerId, customer, orderStatus, totalPrice, voucherCode, createdAt,
                shippingAddress, orderItems, paymentMethod);
    }



    private static List<OrderItem> parseOrderItems(JsonArray orderItemsJsonArray) {
        List<OrderItem> orderItems = new ArrayList<>();
        for (JsonElement itemElement : orderItemsJsonArray) {
            JsonObject itemJson = itemElement.getAsJsonObject();

            String orderId = itemJson.get("order_id").getAsString();
            String productId = itemJson.get("product_id").getAsString();
            int quantity = itemJson.get("quantity").getAsInt();
            double unitPrice = itemJson.get("unit_price").getAsDouble();
            double totalPrice = itemJson.get("total_price").getAsDouble();

            // Parse nested product
            JsonObject productJson = itemJson.getAsJsonObject("product");

            Product product = ProductUtils.parseProduct(productJson);

            orderItems.add(new OrderItem(orderId, productId, product, quantity, unitPrice, totalPrice));
        }
        return orderItems;
    }
}
