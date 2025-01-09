package com.example.electrohive.ViewModel;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.ViewModel;

import com.example.electrohive.Models.ApiResponse;
import com.example.electrohive.Models.Voucher;
import com.example.electrohive.Repository.VoucherRepository;

import java.util.List;

public class VoucherViewModel extends ViewModel {
    private final VoucherRepository repository;

    public VoucherViewModel() {
        repository = new VoucherRepository();
    }

    public LiveData<ApiResponse<List<Voucher>>> getVouchers() {
            return repository.getVouchers(); // Ensure repository method is implemented
    }
}
