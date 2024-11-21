package com.example.electrohive.Activities;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.ListView;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.Observer;
import androidx.lifecycle.ViewModelProvider;

import com.example.electrohive.Models.District;
import com.example.electrohive.Models.Province;
import com.example.electrohive.Models.Ward;
import com.example.electrohive.R;
import com.example.electrohive.ViewModel.LocationViewModel;
import com.example.electrohive.api.LocationService;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class WardPage extends AppCompatActivity {

    private ProgressBar loadingSpinner;

    private ListView wardListView;

    private LocationViewModel viewModel;

    private ArrayAdapter<String> adapter;
    private List<Ward> wards = new ArrayList<>();
    private TextView provinceName;

    private TextView districtName;

    private Province province;
    private  District district;

    private ImageButton backButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.ward_page);


        Intent intent = getIntent();
        province = (Province) intent.getSerializableExtra("PROVINCE");
        district = (District) intent.getSerializableExtra("DISTRICT");
        loadingSpinner = findViewById(R.id.loading_spinner);

        viewModel = new ViewModelProvider(this).get(LocationViewModel.class);

        provinceName = findViewById(R.id.selectedProvinceText);
        provinceName.setText(province.getProvinceName());
        districtName = findViewById(R.id.selectedDistrictText);
        districtName.setText(district.getDistrictName());
        wardListView = findViewById(R.id.ward_listview);

        backButton = findViewById(R.id.backbutton);
        backButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });
        // Initialize the list to hold provinces
        wards = new ArrayList<>();
        loadingSpinner.setVisibility(View.VISIBLE); // Hide spinner once data loads


        // Set up Retrofit
        viewModel.getWards(district.getDistrictId()).observe(this, new Observer<List<Ward>>() {
            @Override
            public void onChanged(List<Ward> updatedWards) {
                wards = updatedWards;

                // Update UI
                List<String> wardNames = new ArrayList<>();
                for (Ward ward : wards) {
                    wardNames.add(ward.getWardName());
                }

                // Create adapter if null, otherwise update data
                if (adapter == null) {
                    adapter = new ArrayAdapter<>(WardPage.this, android.R.layout.simple_list_item_1, wardNames);
                    wardListView.setAdapter(adapter);
                } else {
                    adapter.clear();
                    adapter.addAll(wardNames);
                    adapter.notifyDataSetChanged();
                }
                loadingSpinner.setVisibility(View.GONE); // Hide spinner once data loads

            }
        });

// Handle ListView clicks
        wardListView.setOnItemClickListener((parent, view, position, id) -> {

            Ward clickedWard = wards.get(position);

            // Create intent to hold result
            Intent resultIntent = new Intent();

            // Pass selected data back to the previous activity
            resultIntent.putExtra("PROVINCE", province);
            resultIntent.putExtra("DISTRICT", district);
            resultIntent.putExtra("WARD", clickedWard);

            // Set result for the calling activity
            setResult(RESULT_OK, resultIntent);

            // Close this activity
            finish();

        });

    }
}
