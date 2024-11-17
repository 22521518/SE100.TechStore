package com.example.electrohive.Adapters;

import android.graphics.Color;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.recyclerview.widget.RecyclerView;

import com.example.electrohive.Models.Voucher;
import com.example.electrohive.R;
import com.example.electrohive.utils.format.Format;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class VoucherAdapter extends RecyclerView.Adapter<VoucherAdapter.VoucherViewHolder> {
    private List<Voucher> voucherList;

    // Constructor to pass the list of vouchers to the adapter
    public VoucherAdapter(List<Voucher> voucherList) {
        this.voucherList = voucherList;
    }

    @Override
    public VoucherViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        // Inflate the item layout for each voucher
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.voucher_item, parent, false);
        return new VoucherViewHolder(view);
    }

    @Override
    public void onBindViewHolder(VoucherViewHolder holder, int position) {
        Voucher voucher = voucherList.get(position);

        // Set the voucher information to the corresponding views
        holder.voucherCode.setText(voucher.getVoucherCode());
        holder.voucherDescription.setText(voucher.getDescription());

        holder.voucherExpireDate.setText(Format.getFormattedDate(voucher.getValidTo()));

        // Check if the voucher has expired
        if (voucher.getValidTo().before(new Date())) {
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

        public VoucherViewHolder(View itemView) {
            super(itemView);

            // Initialize the views
            voucherCode = itemView.findViewById(R.id.voucherCode);
            voucherDescription = itemView.findViewById(R.id.voucherDescription);
            voucherExpireDate = itemView.findViewById(R.id.voucherExpireDate);
            voucherBackground = itemView.findViewById(R.id.voucherBackground);  // Initialize the background view
        }
    }

    // Method to update the list of vouchers in the adapter
    public void updateVouchers(List<Voucher> updatedVouchers) {
        this.voucherList = updatedVouchers != null ? updatedVouchers : new ArrayList<>();
        notifyDataSetChanged();
    }
}
