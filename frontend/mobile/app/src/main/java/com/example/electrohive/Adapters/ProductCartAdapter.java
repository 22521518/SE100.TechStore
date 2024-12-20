package com.example.electrohive.Adapters;

import android.app.AlertDialog;
import android.content.Context;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.lifecycle.LifecycleOwner;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.example.electrohive.Models.CartItem;
import com.example.electrohive.R;
import com.example.electrohive.ViewModel.CartViewModel;

import java.text.NumberFormat;
import java.util.List;
import java.util.Locale;

public class ProductCartAdapter extends RecyclerView.Adapter<ProductCartAdapter.ProductViewHolder> {

    private List<CartItem> cartItems;
    private Context context;

    private CartViewModel cartViewModel;

    private final CartItemCheckboxListener listener;

    public interface CartItemCheckboxListener {
        void onItemCheckedChanged();
    }
    private Runnable updateTotalCallback;

    // Constructor
    public ProductCartAdapter(Context context, List<CartItem> cartItems, CartViewModel cartViewModel, CartItemCheckboxListener listener,Runnable updateTotalCallback) {
        this.context = context;
        this.cartItems = cartItems;
        this.cartViewModel = cartViewModel;
        this.listener=listener;
        this.updateTotalCallback=updateTotalCallback;
    }



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
        if (cartItems == null || cartItems.isEmpty()) {
            holder.itemView.setVisibility(View.GONE);
            return;
        }

        CartItem cartitem = cartItems.get(position);

        // Set data to views
        holder.quantity.setText(String.valueOf(cartitem.getQuantity()));
        holder.quantity.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {
                holder.quantity.post(() -> {
                    holder.quantity.setSelection(holder.quantity.getText().length());
                });
            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {

            }

            @Override
            public void afterTextChanged(Editable s) {
                if (!s.toString().isEmpty()) {
                    int newQuantity = Integer.parseInt(s.toString());
                    if (newQuantity > 0) {
                        cartitem.setQuantity(newQuantity);
                    } else {
                        // Reset to 1 if the input is invalid (e.g., 0)
                        holder.quantity.removeTextChangedListener(this);
                        holder.quantity.setText("1");
                        holder.quantity.setSelection(holder.quantity.getText().length());
                        cartitem.setQuantity(1);
                        holder.quantity.addTextChangedListener(this);
                    }
                } else {
                    // Reset to 1 if the input is empty
                    holder.quantity.removeTextChangedListener(this);
                    holder.quantity.setText("1");
                    holder.quantity.setSelection(holder.quantity.getText().length());
                    cartitem.setQuantity(1);
                    holder.quantity.addTextChangedListener(this);
                }
                updateTotalCallback.run();
            }
        });

        holder.name.setText(cartitem.getProduct().getProductName());
        if (cartitem.getProduct().getCategories() != null && !cartitem.getProduct().getCategories().isEmpty()) {
            holder.category.setText(cartitem.getProduct().getCategories().get(0).getCategoryName());
        }
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

        holder.checkBox.setChecked(cartitem.getChecked());
        holder.checkBox.setOnCheckedChangeListener((buttonView, isChecked) -> {
            cartitem.setChecked(isChecked);
            listener.onItemCheckedChanged();
        });

        holder.deleteItem.setOnClickListener(v -> {
            Context context = v.getContext();

            // Create an AlertDialog to ask for confirmation
            new AlertDialog.Builder(context)
                    .setTitle("Confirm Deletion")
                    .setMessage("Are you sure you want to remove this item from the cart?")
                    .setPositiveButton("Yes", (dialog, which) -> {
                        cartViewModel.deleteCartItem(cartitem.getProductId()).observe((LifecycleOwner) context, res-> {
                            if(!res.isSuccess()) {
                                Toast.makeText(context, res.getMessage(), Toast.LENGTH_SHORT).show();
                            }
                        });
                        cartItems.remove(position);
                        notifyItemRemoved(position);
                    })
                    .setNegativeButton("No", (dialog, which) -> {
                        // If user cancels, dismiss the dialog
                        dialog.dismiss();
                    })
                    .show();
        });


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
        TextView name, category, price;
        ImageView imageView;
        CheckBox checkBox;
        ImageButton deleteItem;
        EditText quantity;

        public ProductViewHolder(View itemView) {
            super(itemView);
            name = itemView.findViewById(R.id.name_product);
            category = itemView.findViewById(R.id.category_product);
            price = itemView.findViewById(R.id.price_product);
            imageView = itemView.findViewById(R.id.image);
            checkBox=itemView.findViewById(R.id.checkbox);
            deleteItem=itemView.findViewById(R.id.delete_item);
            quantity=itemView.findViewById(R.id.quantity);
        }
    }
}
