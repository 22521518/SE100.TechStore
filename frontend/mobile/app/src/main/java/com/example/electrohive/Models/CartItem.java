package com.example.electrohive.Models;

public class CartItem {
    private String customer_id;
    private String product_id;
    private int quantity;
    private Product product;

    private Boolean Checked;

    public CartItem (){

    }

    public CartItem(String customer_id,String product_id,int quantity,Product product){
        this.customer_id=customer_id;
        this.product_id=product_id;
        this.quantity=quantity;
        this.product=product;
        this.Checked=false;
    }

    public String getProduct_id() {
        return product_id;
    }
    public void setProductId(String productId) {
        this.product_id = productId;
    }

    public String getCustomer_id() {
        return customer_id;
    }
    public void setCustomer_id(String customer_id) {
        this.customer_id = customer_id;
    }

    public int getQuantity() {
        return quantity;
    }
    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public Product getProduct() {return product;}
    public void setProduct(Product product) {
        this.product = product;
    }

    public boolean isChecked() {return Checked;}
    public void setChecked(boolean checked) {
        this.Checked = checked;
    }

}
