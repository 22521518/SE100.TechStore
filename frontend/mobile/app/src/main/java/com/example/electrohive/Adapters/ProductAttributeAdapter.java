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

import com.example.electrohive.Models.Product;
import com.example.electrohive.Models.ProductAttribute;
import com.example.electrohive.R;

import java.util.List;

public class ProductAttributeAdapter extends RecyclerView.Adapter<ProductAttributeAdapter.AttributeHolder> {

    private final Context context;
    private final List<ProductAttribute> attributes;

    public static class AttributeHolder extends RecyclerView.ViewHolder {
        TextView attributeName;
        TextView attributeDetail;

        public AttributeHolder(@NonNull View itemView) {
            super(itemView);
            attributeName = itemView.findViewById(R.id.attribute_name);
            attributeDetail = itemView.findViewById(R.id.attribute_detail);

        }
    }
    // Constructor
    public ProductAttributeAdapter(Context context, List<ProductAttribute> attributes) {
        this.context = context;
        this.attributes = attributes;
    }


    @NonNull
    @Override
    public AttributeHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        // Inflate the item layout
        View view = LayoutInflater.from(context).inflate(R.layout.product_attribute_item, parent, false);
        return new AttributeHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull AttributeHolder holder, int position) {
        // Get the current ProductAttribute
        ProductAttribute attribute = attributes.get(position);

        // Bind data to views
        holder.attributeName.setText(attribute.getName());
        holder.attributeDetail.setText(attribute.getDetail());
    }

    @Override
    public int getItemCount() {
        // Return the number of items in the list
        return attributes.size();
    }

    public void updateAttribute(List<ProductAttribute> attributes) {
        if (attributes != null) {
            this.attributes.clear();
            this.attributes.addAll(attributes);
            notifyDataSetChanged();
        } else {
            // Handle the case where products are null or empty
            this.attributes.clear();
            notifyDataSetChanged();
        }
    }



}
