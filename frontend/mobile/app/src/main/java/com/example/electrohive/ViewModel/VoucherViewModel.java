package com.example.electrohive.ViewModel;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.ViewModel;

import com.example.electrohive.Models.Province;
import com.example.electrohive.Models.Voucher;
import com.example.electrohive.Repository.LocationRepository;
import com.example.electrohive.Repository.VoucherRepository;

import java.util.List;

public class VoucherViewModel extends ViewModel {
    private final VoucherRepository repository;

    private LiveData<List<Voucher>> vouchers;

    public VoucherViewModel() {
        repository = new VoucherRepository();
    }

    public LiveData<List<Voucher>> getVouchers() {
        if (vouchers == null || !vouchers.hasObservers()) {
            vouchers = repository.getVouchers(); // Ensure repository method is implemented
        }
        return vouchers;
    }
}
