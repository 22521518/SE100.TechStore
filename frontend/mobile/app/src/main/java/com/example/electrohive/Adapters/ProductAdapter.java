package com.example.electrohive.Adapters;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.cardview.widget.CardView;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.example.electrohive.Models.Product;
import com.example.electrohive.R;

import java.text.NumberFormat;
import java.util.List;
import java.util.Locale;

public class ProductAdapter extends RecyclerView.Adapter<ProductAdapter.ProductViewHolder> {

    private Context context;
    private List<Product> productList;
    private OnItemClickListener onItemClickListener;

    // Constructor
    public ProductAdapter(Context context, List<Product> productList, OnItemClickListener onItemClickListener) {
        this.context = context;
        this.productList = productList;
        this.onItemClickListener = onItemClickListener;
    }

    // Define the interface for item click handling
    public interface OnItemClickListener {
        void onItemClick(Product product);
    }

    @NonNull
    @Override
    public ProductViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.product_card, parent, false);
        return new ProductViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ProductViewHolder holder, int position) {
        // Check if productList is null or empty before proceeding
        if (productList == null || productList.isEmpty()) {
            holder.itemView.setVisibility(View.GONE);
            return;
        }
            Product product = productList.get(position);

            // Set product name
            holder.productName.setText(product.getProductName());

            NumberFormat currencyFormat = NumberFormat.getInstance(Locale.US);

            holder.productPrice.setText(String.format("%s VNĐ", currencyFormat.format(product.getRetailPrice())));
            holder.productOriginalPrice.setText(String.format("%s VNĐ", currencyFormat.format(product.getPrice())));

            // Set discount if available
            if (product.getDiscount() > 0) {
                holder.productDiscount.setVisibility(View.VISIBLE);
                holder.productDiscount.setText(String.format("-%.0f%%", product.getDiscount()));
            } else {
                holder.productDiscount.setVisibility(View.GONE);
            }

            // Set rating
            holder.productRating.setText(String.format("%.1f", product.getAverageRating()));

            //Ser category
            if (product.getCategories() != null && !product.getCategories().isEmpty()) {
                holder.productCategory.setText(product.getCategories().get(0).getCategoryName());
            }

            // Load product image using Glide
            if (product.getImages() != null && !product.getImages().isEmpty()) {
                Glide.with(context)
                        .load(product.getImages().get(0).getUrl()) // URL to the image
                        .placeholder(R.drawable.placeholder ) // Optional placeholder
                        .error(R.drawable.ic_image_error_icon   ) // Optional error image
                        .into(holder.productImage); // Your ImageView
            } else {
                holder.productImage.setImageResource(R.drawable.placeholder); // Fallback image
            }

            // Set click listener for the card
            holder.cardView.setOnClickListener(v -> onItemClickListener.onItemClick(product));

    }

    @Override
    public int getItemCount() {
        return productList != null ? productList.size() : 0;
    }

    // ViewHolder class
    public static class ProductViewHolder extends RecyclerView.ViewHolder {
        CardView cardView;
        ImageView productImage;
        TextView productName, productPrice,productOriginalPrice, productDiscount, productRating,productCategory;

        public ProductViewHolder(@NonNull View itemView) {
            super(itemView);
            cardView = itemView.findViewById(R.id.layout_product);
            productImage = itemView.findViewById(R.id.product_image);
            productName = itemView.findViewById(R.id.product_name);
            productPrice = itemView.findViewById(R.id.product_price);
            productOriginalPrice = itemView.findViewById(R.id.product_original_price);
            productDiscount = itemView.findViewById(R.id.product_discount);
            productRating = itemView.findViewById(R.id.product_rating);
            productCategory = itemView.findViewById(R.id.product_category);
        }
    }

    public void updateProducts(List<Product> products) {
        if (products != null) {
            this.productList.clear();
            this.productList.addAll(products);
            notifyDataSetChanged();
        } else {
            // Handle the case where products are null or empty
            this.productList.clear();
            notifyDataSetChanged();
        }
    }


}
