package com.example.electrohive.ViewModel;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.example.electrohive.Models.Address;
import com.example.electrohive.Repository.AddressRepository;

import java.util.List;

public class AddressViewModel extends ViewModel {
    private final AddressRepository repository;

    private MutableLiveData<List<Address>> addresses;

    public AddressViewModel() {
        repository = new AddressRepository();
        addresses = new MutableLiveData<>();  // Initialize the MutableLiveData
    }

    // Fetch addresses from repository
    public LiveData<List<Address>> getAddress(String userId) {
        if (addresses.getValue() == null) { // Check if addresses are already fetched
            addresses = repository.getAddress(userId); // Get addresses from repository
        }
        return addresses;
    }

    // Update a specific address
    public void updateAddress(Address updatedAddress) {
        List<Address> currentAddresses = addresses.getValue();  // Get current addresses from LiveData

        if (currentAddresses != null) {
            // Find the address that matches the updated address ID
            for (int i = 0; i < currentAddresses.size(); i++) {
                Address address = currentAddresses.get(i);
                if (address.getAddressId().equals(updatedAddress.getAddressId())) {
                    // Update the address with the new values
                    currentAddresses.set(i, updatedAddress);

                    // Notify LiveData of the change
                    addresses.setValue(currentAddresses);  // Use setValue() to update LiveData

                    // Now update the address in the repository (e.g., Firestore)
                    repository.updateAddress(updatedAddress);  // Ensure the repository method is implemented
                    break;
                }
            }
        }
    }
}
