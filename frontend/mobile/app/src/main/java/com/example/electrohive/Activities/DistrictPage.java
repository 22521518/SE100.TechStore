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
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AppCompatActivity;

import com.example.electrohive.Models.District;
import com.example.electrohive.Models.Province;
import com.example.electrohive.Models.Ward;
import com.example.electrohive.R;
import com.example.electrohive.api.ApiService;
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

    private ListView districtListView;
    private ArrayList<District> districts;

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
        EdgeToEdge.enable(this);
        setContentView(R.layout.district_page);

        Intent intent = getIntent();
        province = (Province) intent.getSerializableExtra("PROVINCE");

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

        // Set up Retrofit
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl("https://vapi.vnappmob.com/") // Base URL
                .addConverterFactory(GsonConverterFactory.create()) // Use Gson for JSON parsing
                .build();

        // Create an instance of the API service
        ApiService apiService = retrofit.create(ApiService.class);

        // Make the API call
        Call<JsonObject> call = apiService.getDistricts(province.getProvinceId());  // This now returns JsonObject

        call.enqueue(new Callback<JsonObject>() {
            @Override
            public void onResponse(Call<JsonObject> call, Response<JsonObject> response) {
                if (response.isSuccessful() && response.body() != null) {
                    try {
                        // Extract the "results" array from the response body
                        JsonArray resultsArray = response.body().getAsJsonArray("results");

                        // Iterate over the "results" array to extract each province's data
                        for (int i = 0; i < resultsArray.size(); i++) {
                            JsonObject districtJson = resultsArray.get(i).getAsJsonObject();
                            String districtId = districtJson.get("district_id").getAsString();
                            String districtName = districtJson.get("district_name").getAsString();

                            // Create a new Province object
                            District district = new District(districtId, districtName);

                            // Add the Province object to the provinces list
                            districts.add(district);
                        }


                        // Create a list of province names for display
                        List<String> districtNames = new ArrayList<>();
                        for (District district : districts) {
                            String districtName = district.getDistrictName();
                            if (districtName == null) {
                                districtName = "Unknown District"; // Default if null
                            }
                            districtNames.add(districtName);
                        }

                        // Set up ArrayAdapter for the ListView
                        ArrayAdapter<String> adapter = new ArrayAdapter<>(DistrictPage.this, android.R.layout.simple_list_item_1, districtNames);
                        districtListView.setAdapter(adapter);

                        // Set an onClickListener to handle item clicks
                        districtListView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
                            @Override
                            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                                District clickedDistrict = districts.get(position);

                                // Create an Intent to start DistrictPage
                                Intent intent = new Intent(DistrictPage.this, WardPage.class);
                                intent.putExtra("DISTRICT", clickedDistrict); // Pass provinceId to DistrictPage
                                intent.putExtra("PROVINCE",province);
                                resultLauncher.launch(intent);
                            }
                        });

                    } catch (Exception e) {
                        Log.e("API Error", "Error parsing response: " + e.getMessage());
                        Toast.makeText(DistrictPage.this, "Error parsing data", Toast.LENGTH_SHORT).show();
                    }
                } else {
                    // Handle unsuccessful response
                    Log.e("API Error", "Failed to load districts: " + response.code());
                    Toast.makeText(DistrictPage.this, "Failed to load data", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<JsonObject> call, Throwable t) {
                // Handle failure (e.g., network error, server issue)
                Log.e("API Error", "Error making request: " + t.getMessage());
                Toast.makeText(DistrictPage.this, "Failed to load data", Toast.LENGTH_SHORT).show();
            }
        });
    }
}
