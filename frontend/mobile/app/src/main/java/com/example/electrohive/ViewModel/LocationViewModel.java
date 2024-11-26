package com.example.electrohive.ViewModel;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.ViewModel;

import com.example.electrohive.Models.District;
import com.example.electrohive.Models.Province;
import com.example.electrohive.Models.Ward;
import com.example.electrohive.Repository.LocationRepository;

import java.util.List;

public class LocationViewModel extends ViewModel {
    private final LocationRepository repository;
    private LiveData<List<Province>> provinces;
    private LiveData<List<District>> districts;

    private LiveData<List<Ward>> wards;


    public LocationViewModel() {
        repository = new LocationRepository();
    }

    public LiveData<List<Province>> getProvinces() {
        if (provinces == null) {
            provinces = repository.getProvinces();
        }
        return provinces;
    }

    // Getter for districts
    public LiveData<List<District>> getDistricts(String provinceId) {
        if (districts == null || !districts.hasObservers()) {
            districts = repository.getDistricts(provinceId); // Ensure repository method is implemented
        }
        return districts;
    }

    // Getter for wards
    public LiveData<List<Ward>> getWards(String districtId) {
        if (wards == null || !wards.hasObservers()) {
            wards = repository.getWards(districtId); // Ensure repository method is implemented
        }
        return wards;
    }
}