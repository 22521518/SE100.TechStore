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
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.Observer;
import androidx.lifecycle.ViewModelProvider;

import com.example.electrohive.Models.District;
import com.example.electrohive.Models.Province;
import com.example.electrohive.Models.Ward;
import com.example.electrohive.R;
import com.example.electrohive.ViewModel.LocationViewModel;
import com.example.electrohive.api.LocationService;
import com.google.gson.JsonObject;
import com.google.gson.JsonArray;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

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


        viewModel.getDistricts(province.getProvinceId()).observe(this, new Observer<List<District>>() {
            @Override
            public void onChanged(List<District> updatedDistricts) {
                districts = updatedDistricts;

                // Update UI
                List<String> districtNames = new ArrayList<>();
                for (District district : districts) {
                    districtNames.add(district.getDistrictName());
                }

                // Create adapter if null, otherwise update data
                if (adapter == null) {
                    adapter = new ArrayAdapter<>(DistrictPage.this, android.R.layout.simple_list_item_1, districtNames);
                    districtListView.setAdapter(adapter);
                } else {
                    adapter.clear();
                    adapter.addAll(districtNames);
                    adapter.notifyDataSetChanged();
                }
                loadingSpinner.setVisibility(View.GONE); // Hide spinner once data loads

            }
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
