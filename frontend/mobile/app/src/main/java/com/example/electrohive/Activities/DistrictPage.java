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

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;

import com.example.electrohive.Models.District;
import com.example.electrohive.Models.Province;
import com.example.electrohive.Models.Ward;
import com.example.electrohive.R;
import com.example.electrohive.ViewModel.LocationViewModel;

import java.util.ArrayList;
import java.util.List;

public class DistrictPage extends AppCompatActivity {
    private ProgressBar loadingSpinner;

    private ListView districtListView;
    private LocationViewModel viewModel;

    private ArrayAdapter<String> adapter;
    private List<District> districts = new ArrayList<>();
    private TextView provinceName;

    private Province province = null;

    private ImageButton backButton;
    private final ActivityResultLauncher<Intent> resultLauncher = registerForActivityResult (
            new ActivityResultContracts.StartActivityForResult(),
            result -> {
                if (result.getResultCode() == RESULT_OK) {
                    Intent data =result.getData();
                    if (data != null) {
                        Ward resultWard = (Ward) data.getSerializableExtra("WARD");
                        District resultDistrict = (District) data.getSerializableExtra("DISTRICT");
                        Province resultProvince = (Province) data.getSerializableExtra("PROVINCE");

                        Intent resultIntent = new Intent();
                        resultIntent.putExtra("WARD", resultWard);
                        resultIntent.putExtra("DISTRICT",resultDistrict);
                        resultIntent.putExtra("PROVINCE",resultProvince);
                        setResult(RESULT_OK, resultIntent);
                        finish();
                    }

                }
            });

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.district_page);

        Intent intent = getIntent();
        province = (Province) intent.getSerializableExtra("PROVINCE");
        loadingSpinner = findViewById(R.id.loading_spinner);

        viewModel = new ViewModelProvider(this).get(LocationViewModel.class);


        provinceName = findViewById(R.id.selectedProvinceText);
        provinceName.setText(province.getProvinceName());
        districtListView = findViewById(R.id.district_listview);

        backButton = findViewById(R.id.backbutton);
        backButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });
        // Initialize the list to hold provinces
        districts = new ArrayList<>();

        loadingSpinner.setVisibility(View.VISIBLE); // Hide spinner once data loads


        viewModel.getDistricts(province.getProvinceId()).observe(this, apiResponse -> {
            // Check if apiResponse is not null and if the request was successful
            if (apiResponse != null && apiResponse.isSuccess()) {
                districts = apiResponse.getData();  // Get the actual data (list of districts)

                if (districts != null && !districts.isEmpty()) {
                    // Prepare the list of district names
                    List<String> districtNames = new ArrayList<>();
                    for (District district : districts) {
                        districtNames.add(district.getDistrictName());
                    }

                    // Create or update the adapter
                    if (adapter == null) {
                        adapter = new ArrayAdapter<>(DistrictPage.this, android.R.layout.simple_list_item_1, districtNames);
                        districtListView.setAdapter(adapter);
                    } else {
                        adapter.clear();
                        adapter.addAll(districtNames);
                        adapter.notifyDataSetChanged();
                    }
                } else {
                    // Handle empty or null data scenario
                    Toast.makeText(DistrictPage.this, "No districts found.", Toast.LENGTH_SHORT).show();
                }
            } else {
                // Handle failure scenario (success = false)
                String errorMessage = apiResponse != null ? apiResponse.getMessage() : "Failed to load districts.";
                Toast.makeText(DistrictPage.this, errorMessage, Toast.LENGTH_SHORT).show();
            }

            // Hide loading spinner after data has been processed
            loadingSpinner.setVisibility(View.GONE);
        });


        districtListView.setOnItemClickListener((parent, view, position, id) -> {
            District clickedDistrict = districts.get(position);
            Intent newIntent = new Intent(DistrictPage.this, WardPage.class);
            newIntent.putExtra("DISTRICT", clickedDistrict);
            newIntent.putExtra("PROVINCE",province);

            resultLauncher.launch(newIntent);
        });

    }
}
