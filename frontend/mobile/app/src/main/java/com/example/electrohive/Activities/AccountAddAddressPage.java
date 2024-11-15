package com.example.electrohive.Activities;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AppCompatActivity;

import com.example.electrohive.Models.District;
import com.example.electrohive.Models.Province;
import com.example.electrohive.Models.Ward;
import com.example.electrohive.R;

public class AccountAddAddressPage extends AppCompatActivity {

    private EditText addressInput;
    private final ActivityResultLauncher<Intent> resultLauncher = registerForActivityResult (
            new ActivityResultContracts.StartActivityForResult(),
            result -> {
                if (result.getResultCode() == RESULT_OK) {
                    Intent data =result.getData();
                    if (data != null) {
                        Ward resultWard = (Ward) data.getSerializableExtra("WARD");
                        District resultDistrict = (District) data.getSerializableExtra("DISTRICT");
                        Province resultProvince = (Province) data.getSerializableExtra("PROVINCE");
                        String finalAddress =   resultWard.getWardName() +", "+ resultDistrict.getDistrictName() +", "+ resultProvince.getProvinceName();

                        addressInput.setText(finalAddress);
                    }

                }
            });

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.account_add_address_page);

        ImageButton backButton = findViewById(R.id.backbutton);
        backButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });

        addressInput = findViewById(R.id.addressInput);

        addressInput.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(AccountAddAddressPage.this, ProvincePage.class);

                resultLauncher.launch(intent);
            }
        });

    }


}
