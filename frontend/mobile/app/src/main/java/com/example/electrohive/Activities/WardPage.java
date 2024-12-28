package com.example.electrohive.Activities;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.ImageButton;
import android.widget.ListView;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;

import com.example.electrohive.Models.District;
import com.example.electrohive.Models.Province;
import com.example.electrohive.Models.Ward;
import com.example.electrohive.R;
import com.example.electrohive.ViewModel.LocationViewModel;

import java.util.ArrayList;
import java.util.List;

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


        viewModel.getWards(district.getDistrictId()).observe(this, apiResponse -> {
            // Check if apiResponse is not null and if the request was successful
            if (apiResponse != null && apiResponse.isSuccess()) {
                wards = apiResponse.getData();  // Get the actual data (list of wards)

                if (wards != null && !wards.isEmpty()) {
                    // Prepare the list of ward names
                    List<String> wardNames = new ArrayList<>();
                    for (Ward ward : wards) {
                        wardNames.add(ward.getWardName());
                    }

                    // Create or update the adapter
                    if (adapter == null) {
                        adapter = new ArrayAdapter<>(WardPage.this, android.R.layout.simple_list_item_1, wardNames);
                        wardListView.setAdapter(adapter);
                    } else {
                        adapter.clear();
                        adapter.addAll(wardNames);
                        adapter.notifyDataSetChanged();
                    }
                } else {
                    // Handle empty or null data scenario
                    Toast.makeText(WardPage.this, "No wards found.", Toast.LENGTH_SHORT).show();
                }
            } else {
                // Handle failure scenario (success = false)
                String errorMessage = apiResponse != null ? apiResponse.getMessage() : "Failed to load wards.";
                Toast.makeText(WardPage.this, errorMessage, Toast.LENGTH_SHORT).show();
            }

            // Hide loading spinner after data has been processed
            loadingSpinner.setVisibility(View.GONE);
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
