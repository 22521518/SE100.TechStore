package com.example.electrohive.Adapters;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.example.electrohive.Models.CartItem;
import com.example.electrohive.R;

import java.text.NumberFormat;
import java.util.List;
import java.util.Locale;

public class PaymentAdapter extends RecyclerView.Adapter<PaymentAdapter.ProductViewHolder> {

    private List<CartItem> cartItems;
    private Context context;


    // Constructor
    public PaymentAdapter(Context context, List<CartItem> cartItems) {
        this.context = context;
        this.cartItems = cartItems;
    }

    // Create new view holder
    @NonNull
    @Override
    public ProductViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        // Inflate the item layout
        View view = LayoutInflater.from(context).inflate(R.layout.orders_item, parent, false);
        return new ProductViewHolder(view);
    }

    // Bind data to the view holder
    @Override
    public void onBindViewHolder(@NonNull ProductViewHolder holder, int position) {
        if (cartItems == null || cartItems.isEmpty()) {
            holder.itemView.setVisibility(View.GONE);
            return;
        }

        CartItem cartitem = cartItems.get(position);

        // Set data to views
        holder.quantity.setText(String.valueOf(cartitem.getQuantity()));

        holder.name.setText(cartitem.getProduct().getProductName());
        NumberFormat currencyFormat = NumberFormat.getInstance(Locale.US);
        holder.price.setText(currencyFormat.format(cartitem.getProduct().getPrice())+" VNĐ");
//
//        // Load image using Glide
        if (cartitem.getProduct().getImages() != null && !cartitem.getProduct().getImages().isEmpty()) {
            Glide.with(context)
                    .load(cartitem.getProduct().getImages().get(0).getUrl()) // URL to the image
                    .placeholder(R.drawable.placeholder ) // Optional placeholder
                    .error(R.drawable.ic_image_error_icon   ) // Optional error image
                    .into(holder.imageView); // Your ImageView
        } else {
            holder.imageView.setImageResource(R.drawable.placeholder); // Fallback image
        }

    }

    // Return the total number of items
    @Override
    public int getItemCount() {
        if (cartItems==null) {
            return 0; // Trả về 0 nếu danh sách null
        }
        return cartItems.size();
    }

    // ViewHolder class to hold references to the views
    public static class ProductViewHolder extends RecyclerView.ViewHolder {
        TextView name, price;
        ImageView imageView;
        TextView quantity;

        public ProductViewHolder(View itemView) {
            super(itemView);
            name = itemView.findViewById(R.id.order_item_product_name);
            price = itemView.findViewById(R.id.order_item_product_unitprice);
            imageView = itemView.findViewById(R.id.order_item_product_image);
            quantity=itemView.findViewById(R.id.order_item_quantity);
        }
    }
}
