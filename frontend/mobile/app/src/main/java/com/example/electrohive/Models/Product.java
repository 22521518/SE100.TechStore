package com.example.electrohive.Models;

import java.util.ArrayList;
import java.util.Map;

public class Product {
    private String productId;
    private ArrayList<String> images;
    private String product_name;
    private int price;
    private Map<String,Integer> SizeMap;

    private int total;
    private String type;
    private String accessory;
    private Double weight;
    private String material;
    private int sold;
    private String description;
    private Double ratingStar;
    private int ratingAmount;
    private String publisher;
    private String state;
    // demo


    public Product() {
    }

    public Product(String productId, String type,String productName, String material,ArrayList<String> imagelist  ,Map<String,Integer> sizemap, String accessory,Double weight, int productPrice,   String description,   String publisher) {
        this.productId = productId;
        this.product_name = productName;
        this.images = imagelist;
        this.price = productPrice;
        this.SizeMap= sizemap;
        this.sold = 0;
        this.description = description;
        this.type = type;
        this.accessory= accessory;
        this.material= material;
        this.weight = weight;
        this.ratingAmount = 0;
        this.publisher = publisher;
        this.state = "Còn hàng";
    }



    public String getProductId() {
        return productId;
    }

    public void setProductId(String productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return product_name;
    }

    public void setProductName(String productName) {
        this.product_name = productName;
    }

    public String getAccessory() {
        return accessory;
    }

    public void setAccessory(String accessory) {
        this.accessory = accessory;
    }

    public Double getWeight() {
        return weight;
    }

    public void setWeight(Double weight) {
        this.weight = weight;
    }

    public String getMaterial() {
        return material;
    }

    public void setMaterial(String material) {
        this.material = material;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public int getProductPrice() {
        return price;
    }

    public void setProductPrice(int productPrice) {
        this.price = productPrice;
    }


    public int getSold() {
        return sold;
    }

    public void setSold(int sold) {
        this.sold = sold;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ArrayList<String> getImagelist() {
        return images;
    }

    public void setImagelist(ArrayList<String> imagelist) {
        this.images = imagelist;
    }

    public Map<String, Integer> getSizeMap() {
        return SizeMap;
    }

    public void setSizeMap(Map<String, Integer> sizeMap) {
        SizeMap = sizeMap;
    }

    public int getTotal() {
        return total;
    }

    public void setTotal(int total) {
        this.total = total;
    }

    public String getPublisher() {
        return publisher;
    }

    public void setPublisher(String publisher) {
        this.publisher = publisher;
    }

    public Double getRatingStar() {
        return ratingStar;
    }

    public void setRatingStar(Double ratingStar) {
        this.ratingStar = ratingStar;
    }

    public int getRatingAmount() {
        return ratingAmount;
    }

    public void setRatingAmount(int ratingAmount) {
        this.ratingAmount = ratingAmount;
    }


    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    @Override
    public String toString() {
        return "Product{" +
                "productId='" + productId + '\'' +
                ", imagelist=" + images +
                ", productName='" + product_name + '\'' +
                ", productPrice=" + price +
                ", SizeMap=" + SizeMap +
                ", total=" + total +
                ", sold=" + sold +
                ", description='" + description + '\'' +
                ", ratingStar=" + ratingStar +
                ", ratingAmount=" + ratingAmount +
                ", publisher='" + publisher + '\'' +
                ", state='" + state + '\'' +
                '}';
    }
}



