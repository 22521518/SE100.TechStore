package com.example.electrohive.Adapters;

import static android.app.Activity.RESULT_OK;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.recyclerview.widget.RecyclerView;

import com.example.electrohive.Models.Voucher;
import com.example.electrohive.R;
import com.example.electrohive.utils.format.Format;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class PaymentVoucherAdapter extends RecyclerView.Adapter<PaymentVoucherAdapter.VoucherViewHolder> {
    private List<Voucher> voucherList;

    // Constructor to pass the list of vouchers to the adapter
    public PaymentVoucherAdapter(List<Voucher> voucherList) {
        this.voucherList = voucherList;
    }

    @Override
    public VoucherViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        // Inflate the item layout for each voucher
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.voucher_payment_item, parent, false);
        return new VoucherViewHolder(view);
    }

    @Override
    public void onBindViewHolder(VoucherViewHolder holder, int position) {
        Voucher voucher = voucherList.get(position);

        // Set the voucher information to the corresponding views
        holder.voucherCode.setText(voucher.getVoucherCode());
        holder.voucherDescription.setText(voucher.getDescription());

        Object voucherValidTo = voucher.getValidTo();  // This returns an Object

        holder.voucher.setOnClickListener(v -> {
            Context context = v.getContext();
            Intent intent=new Intent();
            intent.putExtra("voucherName",voucher.getVoucherName());
            intent.putExtra("discount",voucher.getDiscountAmount());
            ((Activity) context).setResult(Activity.RESULT_OK, intent);
            ((Activity) context).finish();
        });

        if (voucherValidTo != null) {
            String formattedDate = null;

            // Check if the object is a Date
            if (voucherValidTo instanceof Date) {
                formattedDate = Format.getFormattedDate((Date) voucherValidTo);
            } else if (voucherValidTo instanceof String) {
                // If it's a String, try parsing it
                formattedDate = Format.getFormattedDateFromString((String) voucherValidTo);
            }

            // Set the formatted date to the EditText
            if (formattedDate != null) {
                holder.voucherExpireDate.setText(formattedDate);
            }
        }

        // Check if the voucher has expired
        if (voucherValidTo instanceof Date && ((Date) voucherValidTo).before(new Date())) {
            // Set background to grey if expired
            holder.voucherBackground.setBackgroundColor(Color.GRAY);
        } else {
            // Set default background
            holder.voucherBackground.setBackgroundResource(R.drawable.voucher_background);
        }
    }

    @Override
    public int getItemCount() {
        return voucherList.size();
    }

    // ViewHolder class to hold the views for each voucher item
    public static class VoucherViewHolder extends RecyclerView.ViewHolder {
        private TextView voucherCode, voucherDescription, voucherExpireDate;
        private ImageView clockIcon;
        private View voucherBackground;  // Add reference to the background view
        private LinearLayout voucher;

        public VoucherViewHolder(View itemView) {
            super(itemView);

            // Initialize the views
            voucherCode = itemView.findViewById(R.id.voucherCode);
            voucherDescription = itemView.findViewById(R.id.voucherDescription);
            voucherExpireDate = itemView.findViewById(R.id.voucherExpireDate);
            voucherBackground = itemView.findViewById(R.id.voucherBackground);  // Initialize the background view
            voucher=itemView.findViewById(R.id.voucher);
        }
    }

    // Method to update the list of vouchers in the adapter
    public void updateVouchers(List<Voucher> updatedVouchers) {
        this.voucherList = updatedVouchers != null ? updatedVouchers : new ArrayList<>();
        notifyDataSetChanged();
    }
}