package com.example.electrohive.Adapters;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.CheckBox;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.example.electrohive.Models.CartItem;
import com.example.electrohive.Models.Product;
import com.example.electrohive.R;
import com.example.electrohive.api.ApiService;
import com.google.gson.JsonArray;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class ProductCartAdapter extends RecyclerView.Adapter<ProductCartAdapter.ProductViewHolder> {

    private List<CartItem> cartItems;
    private Context context;

    // Constructor
    public ProductCartAdapter(Context context, List<CartItem> cartItems) {
        this.context = context;
        this.cartItems = cartItems;
    }
    Retrofit retrofit = new Retrofit.Builder()
            .baseUrl("https://se100-techstore.onrender.com/") // Base URL
            .addConverterFactory(GsonConverterFactory.create()) // Use Gson for JSON parsing
            .build();

    ApiService apiService = retrofit.create(ApiService.class);



    // Create new view holder
    @NonNull
    @Override
    public ProductViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        // Inflate the item layout
        View view = LayoutInflater.from(context).inflate(R.layout.cart_item, parent, false);
        return new ProductViewHolder(view);
    }

    // Bind data to the view holder
    @Override
    public void onBindViewHolder(@NonNull ProductViewHolder holder, int position) {
        CartItem cartitem = cartItems.get(position);

        // Set data to views
        holder.name.setText(cartitem.getProduct().getProductName());
        holder.category.setText("null");
        holder.price.setText(String.valueOf(cartitem.getProduct().getProductPrice()));
//
//        // Load image using Glide
        Glide.with(context)
                .load(cartitem.getProduct().getImagelist().get(0))  // Assuming getImagelist() returns a list of image URLs
                .into(holder.imageView);

        holder.checkBox.setOnCheckedChangeListener(null); // Xóa listener cũ trước khi gán trạng thái
        holder.checkBox.setChecked(cartitem.isChecked()); // Gán trạng thái từ CartItem
        holder.checkBox.setOnCheckedChangeListener((buttonView, isChecked) -> {
            cartitem.setChecked(isChecked); // Cập nhật trạng thái CartItem
        });

        holder.deleteItem.setOnClickListener(v->{
            Call<Void> call = apiService.deleteCart(cartitem.getCustomer_id(),cartitem.getProduct_id());
            System.out.println(call.request().url());
            System.out.println("productId:"+cartitem.getProduct_id());
            System.out.println("customerId:"+cartitem.getCustomer_id());
            call.enqueue(new Callback<Void>() {
                @Override
                public void onResponse(Call<Void> call, Response<Void> response) {
                    if (response.isSuccessful()) {
                        // Thành công
                        int removedPosition = holder.getAdapterPosition();
                        cartItems.remove(removedPosition); // Xóa item khỏi danh sách
                        notifyItemRemoved(removedPosition); // Cập nhật RecyclerView
                        System.out.println("Item deleted successfully!");
                    } else {
                        // Lỗi từ server
                        System.out.println("Failed to delete item: " + response.code());
                    }
                }

                @Override
                public void onFailure(Call<Void> call, Throwable t) {
                    // Lỗi kết nối
                    t.printStackTrace();
                    System.out.println("Error: " + t.getMessage());
                }
            });
        });
    }

    // Return the total number of items
    @Override
    public int getItemCount() {
        return cartItems.size();
    }

    // ViewHolder class to hold references to the views
    public static class ProductViewHolder extends RecyclerView.ViewHolder {
        TextView name, category, price;
        ImageView imageView;
        CheckBox checkBox;
        ImageButton deleteItem;

        public ProductViewHolder(View itemView) {
            super(itemView);
            name = itemView.findViewById(R.id.name_product);
            category = itemView.findViewById(R.id.category_product);
            price = itemView.findViewById(R.id.price_product);
            imageView = itemView.findViewById(R.id.image);
            checkBox=itemView.findViewById(R.id.checkbox);
            deleteItem=itemView.findViewById(R.id.delete_item);
        }
    }
}
