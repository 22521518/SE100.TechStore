package com.example.electrohive.Adapters;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.example.electrohive.Models.OrderItem;
import com.example.electrohive.R;
import com.example.electrohive.utils.format.Format;

import java.util.List;

public class OrderItemAdapter extends RecyclerView.Adapter<OrderItemAdapter.OrderItemViewHolder> {

    private Context context;
    private List<OrderItem> orderItemList;

    // Constructor
    public OrderItemAdapter(Context context, List<OrderItem> orderItemList) {
        this.context = context;
        this.orderItemList = orderItemList;
    }



    @Override
    public OrderItemViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View itemView = LayoutInflater.from(parent.getContext()).inflate(R.layout.orders_item, parent, false);
        return new OrderItemViewHolder(itemView);
    }

    @Override
    public void onBindViewHolder(OrderItemViewHolder holder, int position) {
        OrderItem orderItem = orderItemList.get(position);
        Glide.with(context)
                .load(orderItem.getProduct().getImages().get(0).getUrl()) // URL to the image
                .placeholder(R.drawable.banner) // Optional placeholder
                .error(R.drawable.banner) // Optional error image
                .into(holder.productImage); // Your ImageView

        holder.productName.setText(orderItem.getProduct().getProductName());
        holder.productCategory.setText(orderItem.getProduct().getCategories().get(0).getCategoryName());
        holder.productUnitPrice.setText(Format.getFormattedTotalPrice(orderItem.getUnitPrice()) + " VND");
        holder.productQuantity.setText("x " + orderItem.getQuantity());

        // Set product image if available
        // holder.productImage.setImageResource(orderItem.getProduct().getImageResId()); // Uncomment and implement if needed
    }

    @Override
    public int getItemCount() {
        return orderItemList.size();
    }

    public static class OrderItemViewHolder extends RecyclerView.ViewHolder {
        ImageView productImage;
        TextView productName, productCategory, productUnitPrice, productQuantity;

        public OrderItemViewHolder(View view) {
            super(view);
            productImage = view.findViewById(R.id.order_item_product_image);
            productName = view.findViewById(R.id.order_item_product_name);
            productCategory = view.findViewById(R.id.order_item_product_category);
            productUnitPrice = view.findViewById(R.id.order_item_product_unitprice);
            productQuantity = view.findViewById(R.id.order_item_quantity);
        }
    }
}
