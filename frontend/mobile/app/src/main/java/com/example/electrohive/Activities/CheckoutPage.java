package com.example.electrohive.Activities;

import android.os.Bundle;
import android.widget.ImageButton;
import android.widget.RadioButton;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.electrohive.Adapters.AddressAdapter;
import com.example.electrohive.Adapters.AddressCheckOutAdapter;
import com.example.electrohive.Models.Address;
import com.example.electrohive.R;
import com.example.electrohive.ViewModel.AddressViewModel;

import java.util.ArrayList;
import java.util.List;

public class CheckoutPage extends AppCompatActivity {
    private AddressCheckOutAdapter addressAdapter;
    private List<Address> addressList;
    private AddressViewModel addressViewModel;

    private int defaultPosition=-1;

    private RadioButton radioButton5;
    @Override
    protected void  onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.checkout_page);
        ImageButton back=findViewById(R.id.backbutton);
        back.setOnClickListener(v->{
            finish();
        });
        radioButton5=findViewById(R.id.radioButton5);
        radioButton5.setOnClickListener(v->{
            defaultPosition=-1;
            addressAdapter.setRadioButtonPosition(defaultPosition);
            addressAdapter.notifyDataSetChanged();
        });
        addressList=new ArrayList<>();
        addressViewModel=new AddressViewModel();
        RecyclerView recyclerView = findViewById(R.id.rc_trend);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));
        addressAdapter=new AddressCheckOutAdapter(this,addressList);
        addressAdapter.setOnRadioButtonSelectedListener(() -> {
            // Bỏ tích RadioButton riêng khi một RadioButton trong danh sách được chọn
            if (radioButton5.isChecked()) {
                radioButton5.setChecked(false);
            }
        });
        recyclerView.setAdapter(addressAdapter);

        addressViewModel.getAddress().observe(this,addresses -> {

            if (addresses != null && !addresses.isEmpty()) {
                addressList.clear();
                addressList.addAll(addresses);
                for(int i=0;i<addresses.size();i++)
                {
                    if(addresses.get(i).getIsPrimary())
                    {
                        defaultPosition=i;
                        break;
                    }
                }
                addressAdapter.setRadioButtonPosition(defaultPosition);
                addressAdapter.notifyDataSetChanged();
            }
        });
    }
}
