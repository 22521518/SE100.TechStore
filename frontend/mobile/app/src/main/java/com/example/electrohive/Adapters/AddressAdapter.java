package com.example.electrohive.Adapters;

import android.content.Context;
import android.content.Intent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
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

public class AddressAdapter extends RecyclerView.Adapter<AddressAdapter.AddressViewHolder> {

    private Context context;
    private List<Address> addressList;


    // Define ActivityResultLauncher
    private ActivityResultLauncher resultLauncher;


    public AddressAdapter(Context context, List<Address> addressList, ActivityResultLauncher<Intent> resultLauncher) {
        this.context = context;
        this.addressList = addressList;
        this.resultLauncher = resultLauncher;
    }

    @NonNull
    @Override
    public AddressViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View itemView = LayoutInflater.from(context).inflate(R.layout.account_address_item, parent, false);
        return new AddressViewHolder(itemView);
    }

    @Override
    public void onBindViewHolder(@NonNull AddressViewHolder holder, int position) {
        Address address = addressList.get(position);

        holder.fullName.setText(address.getFullName());
        holder.phoneNumber.setText(address.getPhoneNumber());
        holder.specificAddress.setText(address.getAddress());
        holder.addressDetails.setText(address.getWard() + ", " + address.getDistrict() + ", " + address.getCity());

        // Set default label visibility based on the isPrimary flag
        if (address.getIsPrimary()) {
            holder.primaryText.setText("Default");
            holder.primaryText.setVisibility(View.VISIBLE);
            holder.setDefaultButton.setVisibility(View.GONE); // Hide the set default button if primary
        } else {
            holder.primaryText.setVisibility(View.GONE);
            holder.setDefaultButton.setVisibility(View.VISIBLE); // Show the set default button if not primary
        }

        // Optionally, handle set default button clicks
        holder.setDefaultButton.setOnClickListener(v -> {
            setDefaultAddress(position);  // Set the selected address as default
            Toast.makeText(context, "Update Default Address", Toast.LENGTH_SHORT).show();
            notifyDataSetChanged();  // Notify the adapter to refresh the views
        });

        // Handle update address button click
        holder.updateButton.setOnClickListener(v -> {
            Intent intent = new Intent(context, AccountEditAddressPage.class);
            intent.putExtra("ADDRESS",address );
            resultLauncher.launch(intent);

        });
    }

    @Override
    public int getItemCount() {
        return addressList.size();
    }

    public void updateAddress(List<Address> newAddressList) {
        this.addressList = newAddressList;
        notifyDataSetChanged();
    }

    // ViewHolder class to hold the item views
    public static class AddressViewHolder extends RecyclerView.ViewHolder {

        TextView fullName, phoneNumber, specificAddress, addressDetails, primaryText;
        TextView setDefaultButton, updateButton;

        public AddressViewHolder(View itemView) {
            super(itemView);
            fullName = itemView.findViewById(R.id.addressFullname);
            phoneNumber = itemView.findViewById(R.id.addressNumber);
            specificAddress = itemView.findViewById(R.id.addressSpecificAddress);
            addressDetails = itemView.findViewById(R.id.addressAddress);
            primaryText = itemView.findViewById(R.id.primaryText);
            setDefaultButton = itemView.findViewById(R.id.setDefaultButton);
            updateButton = itemView.findViewById(R.id.updateButton);
        }
    }

    // Method to set the selected address as default
    private void setDefaultAddress(int position) {
        // Loop through the list and set the isPrimary flag
        for (int i = 0; i < addressList.size(); i++) {
            Address address = addressList.get(i);
            if (i == position) {
                address.setIsPrimary(true);  // Set this address as primary
            } else {
                address.setIsPrimary(false);  // Set other addresses as non-primary
            }
        }
    }
}
