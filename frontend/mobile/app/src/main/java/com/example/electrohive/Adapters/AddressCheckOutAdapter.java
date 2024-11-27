package com.example.electrohive.Adapters;

import android.content.Context;
import android.content.Intent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.RadioButton;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.result.ActivityResultLauncher;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.electrohive.Activities.AccountEditAddressPage;
import com.example.electrohive.Activities.DistrictPage;
import com.example.electrohive.Activities.ProvincePage;
import com.example.electrohive.Models.Address;
import com.example.electrohive.Models.Province;
import com.example.electrohive.R;

import java.util.List;

import io.appium.java_client.android.StartsActivity;

public class AddressCheckOutAdapter extends RecyclerView.Adapter<AddressCheckOutAdapter.AddressViewHolder> {

    private Context context;
    private List<Address> addressList;
    private int radioButtonPosition;
    private OnRadioButtonSelectedListener listener;

    public interface OnRadioButtonSelectedListener {
        void onRadioButtonSelected();
    }

    public void setOnRadioButtonSelectedListener(OnRadioButtonSelectedListener listener) {
        this.listener = listener;
    }

    public AddressCheckOutAdapter(Context context, List<Address> addressList) {
        this.context = context;
        this.addressList = addressList;
    }

    @NonNull
    @Override
    public AddressViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View itemView = LayoutInflater.from(context).inflate(R.layout.checkout_address_item, parent, false);
        return new AddressViewHolder(itemView);
    }

    @Override
    public void onBindViewHolder(@NonNull AddressViewHolder holder, int position) {
        Address address = addressList.get(position);
        holder.radioButton.setChecked(position==radioButtonPosition);
        holder.radioButton.setOnClickListener(v -> {
            // Cập nhật trạng thái đã chọn
            radioButtonPosition = holder.getAdapterPosition();
            notifyDataSetChanged(); // Cập nhật toàn bộ RecyclerView

            if (listener != null) {
                listener.onRadioButtonSelected();
            }
        });
        holder.name_phone.setText(address.getFullName()+" | "+address.getPhoneNumber());
        holder.address.setText(address.getAddress()+", "+address.getWard() + ", " + address.getDistrict() + ", " + address.getCity());

    }

    @Override
    public int getItemCount() {
        return addressList.size();
    }

    public void setRadioButtonPosition(int position)
    {
        radioButtonPosition=position;
    }

    // ViewHolder class to hold the item views
    public static class AddressViewHolder extends RecyclerView.ViewHolder {

        TextView name_phone,address;
        RadioButton radioButton;

        public AddressViewHolder(View itemView) {
            super(itemView);
            name_phone=itemView.findViewById(R.id.name_phone);
            address=itemView.findViewById(R.id.address);
            radioButton=itemView.findViewById(R.id.radio);
        }
    }

}
