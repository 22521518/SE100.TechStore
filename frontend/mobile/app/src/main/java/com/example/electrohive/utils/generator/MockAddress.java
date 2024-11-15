package com.example.electrohive.utils.generator;

import com.example.electrohive.Models.Address;

import java.util.*;

public class MockAddress {

    // Predefined address data
    private static final Map<String, Map<String, List<String>>> PROVINCE_DISTRICT_WARD_MAP = new HashMap<>();

    static {
        // Populate with predefined province -> district -> ward structure
        PROVINCE_DISTRICT_WARD_MAP.put("Thành phố Đà Nẵng", Map.of(
                "Huyện Hòa Vang", List.of("Xã Hòa Bắc"),
                "Quận Hải Châu", List.of("Phường Bình Hiên", "Phường Thạch Thang")
        ));

        PROVINCE_DISTRICT_WARD_MAP.put("Thành phố Hồ Chí Minh", Map.of(
                "Quận 1", List.of("Phường Bến Nghé", "Phường Nguyễn Thái Bình"),
                "Quận 2", List.of("Phường Thủ Thiêm", "Phường An Khánh")
        ));

        PROVINCE_DISTRICT_WARD_MAP.put("Thành phố Hà Nội", Map.of(
                "Quận Hoàn Kiếm", List.of("Phường Hàng Bạc", "Phường Tràng Tiền"),
                "Quận Đống Đa", List.of("Phường Văn Chương", "Phường Thịnh Quang")
        ));
    }

    // Method to generate random mock customer addresses
    public static List<Address> createMockAddressData(int numAddresses) {
        Random random = new Random();
        List<Address> addressSet = new ArrayList<>();

        for (int i = 0; i < numAddresses; i++) {
            // Select a random province
            String province = getRandomProvince(random);

            // Select a random district from the selected province
            String district = getRandomDistrict(random, province);

            // Select a random ward from the selected district
            String ward = getRandomWard(random, province, district);

            // Randomly generate address details
            String address = generateRandomStreetAddress(random);
            String fullName = "Customer " + random.nextInt(1000);
            String phoneNumber = generateRandomPhoneNumber(random);

            // Create the Address object
            Address mockAddress = new Address(
                    String.valueOf(i + 1), // addressId
                    address, // address
                    province, // city
                    district, // district
                    ward, // ward
                    fullName, // fullName
                    phoneNumber, // phoneNumber
                    i == 0 // Make the first address the primary one
            );

            addressSet.add(mockAddress);
        }

        return addressSet;
    }

    // Helper method to get a random province
    private static String getRandomProvince(Random random) {
        List<String> provinces = new ArrayList<>(PROVINCE_DISTRICT_WARD_MAP.keySet());
        return provinces.get(random.nextInt(provinces.size()));
    }

    // Helper method to get a random district based on selected province
    private static String getRandomDistrict(Random random, String province) {
        List<String> districts = new ArrayList<>(PROVINCE_DISTRICT_WARD_MAP.get(province).keySet());
        return districts.get(random.nextInt(districts.size()));
    }

    // Helper method to get a random ward based on selected province and district
    private static String getRandomWard(Random random, String province, String district) {
        List<String> wards = PROVINCE_DISTRICT_WARD_MAP.get(province).get(district);
        return wards.get(random.nextInt(wards.size()));
    }

    // Helper method to generate a random street address
    private static String generateRandomStreetAddress(Random random) {
        // Example format "123 đường Nguyễn Văn Cừ"
        String streetName = "Đường " + getRandomStreetName(random);
        return random.nextInt(1000) + " " + streetName;
    }

    // Helper method to generate a random street name
    private static String getRandomStreetName(Random random) {
        List<String> streetNames = Arrays.asList(
                "Nguyễn Văn Cừ", "Trường Chinh", "Lê Duẩn", "Hoàng Văn Thụ", "Lý Thường Kiệt"
        );
        return streetNames.get(random.nextInt(streetNames.size()));
    }


    // Helper method to generate a random phone number
    private static String generateRandomPhoneNumber(Random random) {
        return "+84" + (random.nextInt(900000000) + 100000000);
    }

}
