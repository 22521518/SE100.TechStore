package com.example.electrohive.Adapters;

import android.app.AlertDialog;
import android.content.Context;
import android.content.Intent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.result.ActivityResultLauncher;
import androidx.annotation.NonNull;
import androidx.lifecycle.LifecycleOwner;
import androidx.recyclerview.widget.RecyclerView;

import com.example.electrohive.Activities.AccountEditAddressPage;
import com.example.electrohive.Models.Address;
import com.example.electrohive.R;
import com.example.electrohive.ViewModel.AddressViewModel;

import java.util.List;

public class AddressAdapter extends RecyclerView.Adapter<AddressAdapter.AddressViewHolder> {

    private Context context;
    private List<Address> addressList;

    private AddressViewModel addressViewModel;


    // Define ActivityResultLauncher
    private ActivityResultLauncher resultLauncher;


    public AddressAdapter(Context context, List<Address> addressList, ActivityResultLauncher<Intent> resultLauncher,AddressViewModel addressViewModel) {
        this.context = context;
        this.addressList = addressList;
        this.resultLauncher = resultLauncher;
        this.addressViewModel = addressViewModel;
    }

    @NonNull
    @Override
    public AddressViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View itemView = LayoutInflater.from(parent.getContext()).inflate(R.layout.account_address_item, parent, false);
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
            addressViewModel.setDefaultAddress(address.getAddressId()).observe((LifecycleOwner) context, apiResponse -> {
                if (apiResponse != null && apiResponse.isSuccess()) {
                    // Assuming `isSuccessful()` checks if the operation was successful
                    Toast.makeText(context, apiResponse.getMessage(), Toast.LENGTH_SHORT).show();
                } else {
                    // Handle failure case, assuming `getErrorMessage()` can give you a reason
                    String errorMessage = apiResponse != null ? apiResponse.getMessage() : "Failed to update default address";
                    Toast.makeText(context, errorMessage, Toast.LENGTH_SHORT).show();
                }
            });

            notifyDataSetChanged();  // Notify the adapter to refresh the views
        });

        // Handle update address button click
        holder.updateButton.setOnClickListener(v -> {
            Intent intent = new Intent(context, AccountEditAddressPage.class);
            intent.putExtra("ADDRESS", address);
            resultLauncher.launch(intent);

        });

        holder.deleteAddressButton.setOnClickListener(v -> {

            // Create an AlertDialog to confirm deletion
            new AlertDialog.Builder(context)
                    .setTitle("Delete Address")
                    .setMessage("Are you sure you want to delete this address?")
                    .setPositiveButton("Yes", (dialog, which) -> {
                        // Proceed with deletion if user confirms
                        addressViewModel.deleteAddress(address.getAddressId()).observe((LifecycleOwner) context, apiResponse -> {
                            if (apiResponse != null && apiResponse.isSuccess()) {
                                Toast.makeText(context, "Address deleted", Toast.LENGTH_SHORT).show();
                            } else {
                                String errorMessage = apiResponse != null ? apiResponse.getMessage() : "Failed to delete address";
                                Toast.makeText(context, errorMessage, Toast.LENGTH_SHORT).show();
                            }
                        });
                        notifyDataSetChanged(); // Update UI
                    })
                    .setNegativeButton("No", (dialog, which) -> {
                        // Do nothing if user cancels
                        dialog.dismiss();
                    })
                    .create()
                    .show();


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

        ImageButton deleteAddressButton;
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
            deleteAddressButton = itemView.findViewById(R.id.deleteAddressButton);
        }
    }

    // Method to set the selected address as default

}
