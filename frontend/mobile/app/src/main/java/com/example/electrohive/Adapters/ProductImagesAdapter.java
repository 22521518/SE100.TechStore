package com.example.electrohive.Adapters;

import static androidx.core.content.ContextCompat.startActivity;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.FragmentActivity;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;

import com.example.electrohive.Activities.FullScreenImageActivity;
import com.example.electrohive.Models.ProductAttribute;
import com.example.electrohive.Models.ProductImage;
import com.example.electrohive.R;

import java.util.ArrayList;
import java.util.List;

public class ProductImagesAdapter extends RecyclerView.Adapter<ProductImagesAdapter.ViewHolder> {

    private List<ProductImage> images;


    private Context context;

    public ProductImagesAdapter(Context context, List<ProductImage> images) {
        this.context = context;
        this.images = images;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.product_image_slider_item, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        // Load the image using Glide
        Glide.with(context)
                .load(images.get(position).getUrl()) // Load the image from the URL
                .placeholder(R.drawable.placeholder) // Show placeholder while loading
                .error(R.drawable.ic_image_error_icon) // Show error icon if load fails
                .into(holder.sliderImage);

        // Handle image click inside the adapter
        holder.sliderImage.setOnClickListener(v -> {
            // Check if the context is an instance of FullScreenImageActivity (or your fragment activity)
            if (context instanceof Activity) {
                Activity activity = (Activity) context;

                // Prevent opening FullScreenImageActivity if we are already in it
                if (!(activity instanceof FullScreenImageActivity)) {
                    // Start FullScreenImageActivity if it's not already open
                    Intent intent = new Intent(context, FullScreenImageActivity.class);
                    intent.putParcelableArrayListExtra("image_urls", new ArrayList<>(images));
                    intent.putExtra("position", position);
                    context.startActivity(intent);
                }
            }
        });
    }

    @Override
    public int getItemCount() {
        return images.size();
    }

    public interface OnImageClickListener {
        void onImageClick(List<ProductImage> images, int position);
    }

    public static class ViewHolder extends RecyclerView.ViewHolder {
        ImageView sliderImage;

        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            sliderImage = itemView.findViewById(R.id.sliderImage);
        }
    }

    public void updateImages(List<ProductImage> images) {
        if (images != null) {
            this.images.clear();
            this.images.addAll(images);
            notifyDataSetChanged();
        } else {
            // Handle the case where products are null or empty
            this.images.clear();
            notifyDataSetChanged();
        }
    }

}
