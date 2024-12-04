package com.example.electrohive.ViewModel;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.ViewModel;

import com.example.electrohive.Models.ApiResponse;
import com.example.electrohive.Models.District;
import com.example.electrohive.Models.Province;
import com.example.electrohive.Models.Ward;
import com.example.electrohive.Repository.LocationRepository;

import java.util.List;

public class LocationViewModel extends ViewModel {
    private final LocationRepository repository;
    private LiveData<ApiResponse<List<Province>>> provinces;
    private LiveData<ApiResponse<List<District>>> districts;
    private LiveData<ApiResponse<List<Ward>>> wards;


    public LocationViewModel() {
        repository = new LocationRepository();
    }

    // Getter for provinces with ApiResponse
    public LiveData<ApiResponse<List<Province>>> getProvinces() {
        if (provinces == null) {
            provinces = repository.getProvinces(); // Retrieve provinces from repository
        }
        return provinces;
    }

    // Getter for districts with ApiResponse
    public LiveData<ApiResponse<List<District>>> getDistricts(String provinceId) {
        if (districts == null || !districts.hasObservers()) {
            districts = repository.getDistricts(provinceId); // Retrieve districts based on province ID
        }
        return districts;
    }

    // Getter for wards with ApiResponse
    public LiveData<ApiResponse<List<Ward>>> getWards(String districtId) {
        if (wards == null || !wards.hasObservers()) {
            wards = repository.getWards(districtId); // Retrieve wards based on district ID
        }
        return wards;
    }
}