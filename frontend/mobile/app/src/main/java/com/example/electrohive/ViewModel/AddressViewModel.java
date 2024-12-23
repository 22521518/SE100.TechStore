package com.example.electrohive.ViewModel;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.example.electrohive.Models.Address;
import com.example.electrohive.Models.ApiResponse;
import com.example.electrohive.Repository.AddressRepository;
import com.example.electrohive.utils.PreferencesHelper;
import com.google.gson.JsonObject;

import java.util.ArrayList;
import java.util.List;

public class AddressViewModel extends ViewModel {
    private static AddressRepository repository;

    private final MutableLiveData<ApiResponse<List<Address>>> addresses = new MutableLiveData<>();

    public AddressViewModel() {
        repository = new AddressRepository();
    }

    // Fetch addresses from repository
    public LiveData<ApiResponse<List<Address>>> getAddress() {
        if (addresses.getValue() == null || addresses.getValue().getData() == null) {
            // Check if addresses are already fetched or the data is null
            repository.getAddress(PreferencesHelper.getCustomerData().getCustomerId()).observeForever( res -> {
                if (res != null && res.isSuccess()) {
                    addresses.postValue(res); // Update the LiveData with the fetched data
                }
            });
        }
        return addresses;
    }
    // Add a new address
    public LiveData<ApiResponse<Boolean>> addAddress(Address newAddress) {
        MutableLiveData<ApiResponse<Boolean>> resultAddress = new MutableLiveData<>();
        List<Address> currentAddresses = addresses.getValue().getData();

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
                .observeForever(addedAddressResponse -> {
                    if (addedAddressResponse != null && addedAddressResponse.isSuccess()) {
                        // Add the successfully added address to the current list
                        for(Address address:finalCurrentAddresses) {
                            address.setIsPrimary(false);
                        }
                        finalCurrentAddresses.add(addedAddressResponse.getData());
                        addresses.postValue(new ApiResponse<>(true, finalCurrentAddresses, "Address added successfully", 200)); // Notify LiveData observers
                        resultAddress.postValue(new ApiResponse<>(true, true, "Address added successfully", 200)); // Notify the caller of success
                    } else {
                        resultAddress.postValue(new ApiResponse<>(false, false, "Failed to add address", 500)); // Notify the caller of failure
                    }
                });

        return resultAddress; // Return the result LiveData
    }



    // Update a specific address
    public LiveData<ApiResponse<Boolean>> updateAddress(Address updatedAddress) {
        MutableLiveData<ApiResponse<Boolean>> updateRes = new MutableLiveData<>();
        List<Address> currentAddresses = addresses.getValue().getData();  // Get current addresses from LiveData

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
                        if (result != null && result.isSuccess()) {
                            // Update the local address list
                            currentAddresses.set(index, updatedAddress);
                            addresses.postValue(new ApiResponse<>(true, currentAddresses, "Address updated successfully", 200));  // Notify LiveData observers
                            updateRes.postValue(new ApiResponse<>(true, true, "Address updated successfully", 200));  // Notify success
                        } else {
                            updateRes.postValue(new ApiResponse<>(false, false, "Failed to update address", 500));  // Notify failure
                        }
                    });

                    return updateRes;  // Return immediately after scheduling the update
                }
            }
        }

        // If the address list is null or the address ID is not found, notify failure
        updateRes.setValue(new ApiResponse<>(false, false, "Address not found", 404));
        return updateRes;
    }

    public  LiveData<ApiResponse<Boolean>> deleteAddress(String addressId) {
        MutableLiveData<ApiResponse<Boolean>> result = new MutableLiveData<>();
        List<Address> currentAddresses = addresses.getValue().getData(); // Get the current list of addresses

        if (currentAddresses == null || currentAddresses.isEmpty()) {
            result.setValue(new ApiResponse<>(false, false, "No addresses found", 404)); // Fail if no addresses exist
            return result;
        }

        // Use a final variable to store the address to delete
        final Address addressToDelete = currentAddresses.stream()
                .filter(address -> address.getAddressId().equals(addressId))
                .findFirst()
                .orElse(null);

        if (addressToDelete == null) {
            result.setValue(new ApiResponse<>(false, false, "Address not found", 404)); // Fail if the addressId does not exist
            return result;
        }

        // Call the repository to delete the address
        repository.deleteAddress(PreferencesHelper.getCustomerData().getCustomerId(), addressId)
                .observeForever(deleteResult -> {
                    if (deleteResult != null && deleteResult.isSuccess() && deleteResult.getData()) {
                        // Remove the deleted address from the local list
                        List<Address> updatedAddresses = new ArrayList<>(currentAddresses);
                        updatedAddresses.remove(addressToDelete);
                        addresses.postValue(new ApiResponse<>(true, updatedAddresses, "Address deleted successfully", 200)); // Notify observers
                        result.postValue(new ApiResponse<>(true, true, "Address deleted successfully", 200)); // Success
                    } else {
                        result.postValue(new ApiResponse<>(false, false, "Failed to delete address", 500)); // Fail on deletion
                    }
                });

        return result;
    }




    public LiveData<ApiResponse<Boolean>> setDefaultAddress(String addressId) {
        MutableLiveData<ApiResponse<Boolean>> result = new MutableLiveData<>();
        List<Address> currentAddresses = addresses.getValue().getData(); // Get the current list of addresses

        if (currentAddresses == null || currentAddresses.isEmpty()) {
            result.setValue(new ApiResponse<>(false, null, "No addresses found", 404)); // Return error response if no addresses exist
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
            result.setValue(new ApiResponse<>(false, null, "Address not found", 404)); // Return error if the addressId does not exist
            return result;
        }

        // Prepare payloads for the updates
        JsonObject newDefaultPayload = new JsonObject();
        newDefaultPayload.addProperty("is_primary", true);

        JsonObject oldDefaultPayload = new JsonObject();
        oldDefaultPayload.addProperty("is_primary", false);

        // Perform updates independently
        MutableLiveData<ApiResponse<Boolean>> oldDefaultResult = new MutableLiveData<>(); // Default to success if no old default
        MutableLiveData<ApiResponse<Boolean>> newDefaultResult = new MutableLiveData<>();

        if (oldDefaultAddress != null) {
            Address finalOldDefaultAddress = oldDefaultAddress;
            repository.updateAddress(
                    PreferencesHelper.getCustomerData().getCustomerId(),
                    oldDefaultAddress.getAddressId(),
                    oldDefaultPayload
            ).observeForever(resultOld -> {
                if (resultOld != null && resultOld.isSuccess()) {
                    finalOldDefaultAddress.setIsPrimary(false); // Update the old address locally
                    oldDefaultResult.setValue(new ApiResponse<>(true, null, "Old default address updated", 200)); // Successful update
                } else {
                    oldDefaultResult.setValue(new ApiResponse<>(false, null, "Failed to update old default address", 500));
                }
            });
        }

        Address finalNewDefaultAddress = newDefaultAddress;
        repository.updateAddress(
                PreferencesHelper.getCustomerData().getCustomerId(),
                newDefaultAddress.getAddressId(),
                newDefaultPayload
        ).observeForever(resultNew -> {
            if (resultNew != null && resultNew.isSuccess()) {
                finalNewDefaultAddress.setIsPrimary(true); // Update the new address locally
                addresses.setValue(new ApiResponse<>(true,currentAddresses,"Updated Addresses",200)); // Notify observers of the updated list
                newDefaultResult.setValue(new ApiResponse<>(true, null, "New default address updated", 200)); // Successful update
            } else {
                newDefaultResult.setValue(new ApiResponse<>(false, null, "Failed to update new default address", 500));
            }
        });

        // Combine results for success or failure
        oldDefaultResult.observeForever(oldSuccess -> {
            if (!oldSuccess.isSuccess()) {
                result.setValue(new ApiResponse<>(false, null, oldSuccess.getMessage(), oldSuccess.getStatusCode())); // Return error if old address update failed
                return;
            }

            newDefaultResult.observeForever(newSuccess -> {
                if (newSuccess != null && newSuccess.isSuccess()) {
                    result.setValue(new ApiResponse<>(true, null, "Address successfully updated", 200)); // Both updates succeeded
                } else {
                    result.setValue(new ApiResponse<>(false, null, newSuccess != null ? newSuccess.getMessage() : "Unknown error", 500)); // Handle failure in the new address update
                }
            });
        });

        return result;
    }





}
