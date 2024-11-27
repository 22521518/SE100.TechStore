package com.example.electrohive.Activities;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.RadioButton;
import android.widget.TextView;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.electrohive.Adapters.AddressAdapter;
import com.example.electrohive.Adapters.AddressCheckOutAdapter;
import com.example.electrohive.Models.Address;
import com.example.electrohive.Models.CheckoutAddress;
import com.example.electrohive.Models.District;
import com.example.electrohive.Models.Province;
import com.example.electrohive.Models.Ward;
import com.example.electrohive.R;
import com.example.electrohive.ViewModel.AddressViewModel;
import com.google.android.material.textfield.TextInputEditText;

import java.util.ArrayList;
import java.util.List;

public class CheckoutPage extends AppCompatActivity {
    private AddressCheckOutAdapter addressAdapter;
    private List<Address> addressList;
    private AddressViewModel addressViewModel;
    private int defaultPosition=-1;
    private RadioButton radioButton5;
    private TextInputEditText address_location;
    private TextInputEditText address_fullname;
    private TextInputEditText address_phone;
    private TextInputEditText address_address;

    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (requestCode == 1) {
            if (resultCode == RESULT_OK) {
                // Nhận dữ liệu trả về từ WardPage
                Province province = (Province) data.getSerializableExtra("PROVINCE");
                District district = (District) data.getSerializableExtra("DISTRICT");
                Ward ward = (Ward) data.getSerializableExtra("WARD");

                address_location.setText(province.getProvinceName()+", "+district.getDistrictName()+", "+ward.getWardName());
            }
        }
    }



    @Override
    protected void  onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.checkout_page);
        address_location=findViewById(R.id.addressInput);
        address_fullname=findViewById(R.id.fullname);
        address_phone=findViewById(R.id.phone);
        address_address=findViewById(R.id.address);
        address_location.setOnClickListener(v->{
            Intent intent=new Intent(getApplicationContext(),ProvincePage.class);
            startActivityForResult(intent, 1);
        });
        TextView continuebutton=findViewById(R.id.continue_button);
        continuebutton.setOnClickListener(v->{
            CheckoutAddress tmp;
            String[] split= address_location.getText().toString().split(", ");
            if(radioButton5.isChecked())
            {
                tmp=new CheckoutAddress(address_address.getText().toString(),split[0],split[1],split[2],address_fullname.getText().toString(),address_phone.getText().toString());
            }
            else {
                Address tmp1=addressAdapter.getAddress();
                tmp=new CheckoutAddress(tmp1.getAddress(),tmp1.getCity(),tmp1.getDistrict(),tmp1.getWard(),tmp1.getFullName(),tmp1.getPhoneNumber());
            }
            System.out.println(tmp);
        });
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
