package com.example.electrohive.utils.Model;

import com.example.electrohive.Models.Address;
import com.example.electrohive.Models.Enum.ORDER_STATUS;
import com.example.electrohive.Models.Enum.SHIPPING_STATUS;
import com.example.electrohive.Models.ShippingAddress;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

public class AddressUtils {

    public static Address parseAddress (JsonObject addressJson) {
        Address address = null;

        String address_id = addressJson.get("address_id").getAsString();
        String address_address = addressJson.get("address").getAsString();
        String address_city = addressJson.get("city").getAsString();
        String address_district = addressJson.get("district").getAsString();
        String address_ward = addressJson.get("ward").getAsString();
        String address_full_name = addressJson.get("full_name").getAsString();
        String address_phone_number = addressJson.get("phone_number").getAsString();

        Boolean address_is_primary = addressJson.get("is_primary").getAsBoolean();

        address = new Address(address_id,  address_address,address_city, address_district, address_ward, address_full_name, address_phone_number,address_is_primary);
        return address;
    }

    public static List<Address> parseAddresses (JsonArray addressJsonArray) {
        List<Address> addressList = new ArrayList<>();

        for (int i = 0; i < addressJsonArray.size(); i++) {
            JsonObject addressJson = addressJsonArray.get(i).getAsJsonObject();
            Address address = parseAddress(addressJson);

            // Add the voucher to the list
            addressList.add(address);
        }
        return addressList;
    }

    public static ShippingAddress parseShippingAddress(JsonObject shippingJson) {
        String shippingId = shippingJson.get("shipping_id").getAsString();
        String shippingStatus = shippingJson.get("shipping_status").getAsString();
        String deliveryDate = shippingJson.has("delivery_date") && !shippingJson.get("delivery_date").isJsonNull()
                ? shippingJson.get("delivery_date").getAsString()
                :LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSS")); // Use today's date formatted if null

        // Parse nested address
        Address address = new Address(
                "",
               shippingJson.get("address").getAsString(),
               shippingJson.get("city").getAsString(),
               shippingJson.get("district").getAsString(),
               shippingJson.get("ward").getAsString(),
               shippingJson.get("full_name").getAsString(),
               shippingJson.get("phone_number").getAsString(),
               false
        );

        return new ShippingAddress(shippingId, SHIPPING_STATUS.valueOf(shippingStatus) , deliveryDate, address);
    }
}
