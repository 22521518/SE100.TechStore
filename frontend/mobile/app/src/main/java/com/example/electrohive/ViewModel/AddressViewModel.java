package com.example.electrohive.ViewModel;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.example.electrohive.Models.Address;
import com.example.electrohive.Repository.AddressRepository;
import com.example.electrohive.utils.PreferencesHelper;
import com.google.gson.JsonObject;

import java.util.ArrayList;
import java.util.List;

public class AddressViewModel extends ViewModel {
    private static AddressRepository repository;

    private static MutableLiveData<List<Address>> addresses;

    public AddressViewModel() {
        repository = new AddressRepository();
        addresses = new MutableLiveData<>();  // Initialize the MutableLiveData
    }

    // Fetch addresses from repository
    public LiveData<List<Address>> getAddress() {
        if (addresses.getValue() == null) { // Check if addresses are already fetched
            addresses = repository.getAddress(PreferencesHelper.getCustomerData().getCustomerId()); // Get addresses from repository
        }
        return addresses;
    }

    // Add a new address
    public LiveData<Boolean> addAddress(Address newAddress) {
        MutableLiveData<Boolean> resultAddress = new MutableLiveData<>();
        List<Address> currentAddresses = addresses.getValue();

        if (currentAddresses == null) {
            currentAddresses = new ArrayList<>(); // Initialize the list if it's null
        }

        JsonObject addressPayload = new JsonObject();
        addressPayload.addProperty("city", newAddress.getCity());
        addressPayload.addProperty("district", newAddress.getDistrict());
        addressPayload.addProperty("ward", newAddress.getWard());
        addressPayload.addProperty("address", newAddress.getAddress());
        addressPayload.addProperty("full_name", newAddress.getFullName());
        addressPayload.addProperty("phone_number", newAddress.getPhoneNumber());

        // Call the repository to add the address
        List<Address> finalCurrentAddresses = currentAddresses;
        repository.addAddress(PreferencesHelper.getCustomerData().getCustomerId(), addressPayload)
                .observeForever(addedAddress -> {
                    if (addedAddress != null) {
                        // Add the successfully added address to the current list
                        finalCurrentAddresses.add(addedAddress);
                        addresses.postValue(finalCurrentAddresses); // Notify LiveData observers
                        resultAddress.postValue(true); // Notify the caller of success
                    } else {
                        resultAddress.postValue(false); // Notify the caller of failure
                    }
                });

        return resultAddress; // Return the result LiveData
    }



    // Update a specific address
    public LiveData<Boolean> updateAddress(Address updatedAddress) {
        MutableLiveData<Boolean> updateRes = new MutableLiveData<>();
        List<Address> currentAddresses = addresses.getValue();  // Get current addresses from LiveData

        if (currentAddresses != null) {
            // Find the address that matches the updated address ID
            for (int i = 0; i < currentAddresses.size(); i++) {
                Address address = currentAddresses.get(i);
                if (address.getAddressId().equals(updatedAddress.getAddressId())) {
                    final int index = i;

                    // Prepare the payload for the repository call
                    JsonObject addressPayload = new JsonObject();
                    addressPayload.addProperty("city", updatedAddress.getCity());
                    addressPayload.addProperty("district", updatedAddress.getDistrict());
                    addressPayload.addProperty("ward", updatedAddress.getWard());
                    addressPayload.addProperty("address", updatedAddress.getAddress());
                    addressPayload.addProperty("full_name", updatedAddress.getFullName());
                    addressPayload.addProperty("phone_number", updatedAddress.getPhoneNumber());

                    // Call the repository to update the address
                    repository.updateAddress(
                            PreferencesHelper.getCustomerData().getCustomerId(),
                            updatedAddress.getAddressId(),
                            addressPayload
                    ).observeForever(result -> {
                        if (result != null) {
                            // Update the local address list
                            currentAddresses.set(index, updatedAddress);
                            addresses.postValue(currentAddresses);  // Notify LiveData observers
                            updateRes.postValue(true);  // Notify success
                        } else {
                            updateRes.postValue(false);  // Notify failure
                        }
                    });

                    return updateRes;  // Return immediately after scheduling the update
                }
            }
        }

        // If the address list is null or the address ID is not found, notify failure
        updateRes.setValue(false);
        return updateRes;
    }

    public static LiveData<Boolean> deleteAddress(String addressId) {
        MutableLiveData<Boolean> result = new MutableLiveData<>();
        List<Address> currentAddresses = addresses.getValue(); // Get the current list of addresses

        if (currentAddresses == null || currentAddresses.isEmpty()) {
            result.setValue(false); // Fail if no addresses exist
            return result;
        }

        // Use a final variable to store the address to delete
        final Address addressToDelete = currentAddresses.stream()
                .filter(address -> address.getAddressId().equals(addressId))
                .findFirst()
                .orElse(null);

        if (addressToDelete == null) {
            result.setValue(false); // Fail if the addressId does not exist
            return result;
        }

        // Call the repository to delete the address
        repository.deleteAddress(PreferencesHelper.getCustomerData().getCustomerId(), addressId)
                .observeForever(deleteResult -> {
                    if (deleteResult != null && deleteResult) {
                        // Remove the deleted address from the local list
                        List<Address> updatedAddresses = new ArrayList<>(currentAddresses);
                        updatedAddresses.remove(addressToDelete);
                        addresses.postValue(updatedAddresses); // Notify observers
                        result.postValue(true); // Success
                    } else {
                        result.postValue(false); // Fail on deletion
                    }
                });

        return result;
    }




    public static LiveData<Boolean> setDefaultAddress(String addressId) {
        MutableLiveData<Boolean> result = new MutableLiveData<>();
        List<Address> currentAddresses = addresses.getValue(); // Get the current list of addresses

        if (currentAddresses == null || currentAddresses.isEmpty()) {
            result.setValue(false); // Fail if no addresses exist
            return result;
        }

        Address newDefaultAddress = null;
        Address oldDefaultAddress = null;

        // Find the new default address and the current default address
        for (Address address : currentAddresses) {
            if (address.getIsPrimary()) {
                oldDefaultAddress = address; // Current default address
            }
            if (address.getAddressId().equals(addressId)) {
                newDefaultAddress = address; // Address to be set as default
            }
        }

        if (newDefaultAddress == null) {
            result.setValue(false); // Fail if the addressId does not exist
            return result;
        }

        // Prepare payloads for the updates
        JsonObject newDefaultPayload = new JsonObject();
        newDefaultPayload.addProperty("is_primary", true);

        JsonObject oldDefaultPayload = new JsonObject();
        oldDefaultPayload.addProperty("is_primary", false);

        // Perform updates independently
        MutableLiveData<Boolean> oldDefaultResult = new MutableLiveData<>(true); // Default to true if no old default
        MutableLiveData<Boolean> newDefaultResult = new MutableLiveData<>();

        if (oldDefaultAddress != null) {
            Address finalOldDefaultAddress = oldDefaultAddress;
            repository.updateAddress(
                    PreferencesHelper.getCustomerData().getCustomerId(),
                    oldDefaultAddress.getAddressId(),
                    oldDefaultPayload
            ).observeForever(resultOld -> {
                if (resultOld != null) {
                    finalOldDefaultAddress.setIsPrimary(false); // Update the old address locally
                }
                oldDefaultResult.postValue(resultOld!=null); // Notify result for old address update
            });
        }

        Address finalNewDefaultAddress = newDefaultAddress;
        repository.updateAddress(
                PreferencesHelper.getCustomerData().getCustomerId(),
                newDefaultAddress.getAddressId(),
                newDefaultPayload
        ).observeForever(resultNew -> {
            if (resultNew != null) {
                finalNewDefaultAddress.setIsPrimary(true); // Update the new address locally
                addresses.postValue(currentAddresses); // Notify observers of the updated list
            }
            newDefaultResult.postValue(resultNew!=null); // Notify result for new address update
        });

        // Combine results for success or failure
        oldDefaultResult.observeForever(oldSuccess -> {
            if (oldSuccess == null || !oldSuccess) {
                result.postValue(false); // Fail if old address update failed
                return;
            }

            newDefaultResult.observeForever(newSuccess -> {
                result.postValue(newSuccess != null && newSuccess); // Final result depends on new address update
            });
        });

        return result;
    }




}
