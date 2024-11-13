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
import androidx.appcompat.app.AppCompatActivity;

import com.example.electrohive.Models.District;
import com.example.electrohive.Models.Province;
import com.example.electrohive.Models.Ward;
import com.example.electrohive.R;
import com.example.electrohive.api.ApiService;
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


    private ListView wardListView;
    private ArrayList<Ward> wards;
    private TextView provinceName;

    private TextView districtName;

    private Province province;
    private  District district;

    private ImageButton backButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.ward_page);


        Intent intent = getIntent();
        province = (Province) intent.getSerializableExtra("PROVINCE");
        district = (District) intent.getSerializableExtra("DISTRICT");

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

        // Set up Retrofit
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl("https://vapi.vnappmob.com/") // Base URL
                .addConverterFactory(GsonConverterFactory.create()) // Use Gson for JSON parsing
                .build();

        // Create an instance of the API service
        ApiService apiService = retrofit.create(ApiService.class);

        // Make the API call
        Call<JsonObject> call = apiService.getWards(district.getDistrictId());  // This now returns JsonObject

        call.enqueue(new Callback<JsonObject>() {
            @Override
            public void onResponse(Call<JsonObject> call, Response<JsonObject> response) {
                if (response.isSuccessful() && response.body() != null) {
                    try {
                        // Extract the "results" array from the response body
                        JsonArray resultsArray = response.body().getAsJsonArray("results");

                        // Iterate over the "results" array to extract each province's data
                        for (int i = 0; i < resultsArray.size(); i++) {
                            JsonObject wardJson = resultsArray.get(i).getAsJsonObject();
                            String wardId = wardJson.get("ward_id").getAsString();
                            String wardName = wardJson.get("ward_name").getAsString();

                            // Create a new Province object
                            Ward ward = new Ward(wardId, wardName);

                            // Add the Province object to the provinces list
                            wards.add(ward);
                        }


                        // Create a list of province names for display
                        List<String> wardNames = new ArrayList<>();
                        for (Ward ward : wards) {
                            String wardName = ward.getWardName();
                            if (wardName == null) {
                                wardName = "Unknown District"; // Default if null
                            }
                            wardNames.add(wardName);
                        }

                        // Set up ArrayAdapter for the ListView
                        ArrayAdapter<String> adapter = new ArrayAdapter<>(WardPage.this, android.R.layout.simple_list_item_1, wardNames);
                        wardListView.setAdapter(adapter);

                        // Set an onClickListener to handle item clicks
                        wardListView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
                            @Override
                            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                                Ward clickedWard = wards.get(position);

                                Intent resultIntent = new Intent();
                                resultIntent.putExtra("WARD", clickedWard);
                                resultIntent.putExtra("DISTRICT",district);
                                resultIntent.putExtra("PROVINCE",province);
                                setResult(RESULT_OK, resultIntent);

                                // Close WardPage and return to DistrictPage
                                finish();
                            }
                        });

                    } catch (Exception e) {
                        Log.e("API Error", "Error parsing response: " + e.getMessage());
                        Toast.makeText(WardPage.this, "Error parsing data", Toast.LENGTH_SHORT).show();
                    }
                } else {
                    // Handle unsuccessful response
                    Log.e("API Error", "Failed to load wards: " + response.code());
                    Toast.makeText(WardPage.this, "Failed to load data", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<JsonObject> call, Throwable t) {
                // Handle failure (e.g., network error, server issue)
                Log.e("API Error", "Error making request: " + t.getMessage());
                Toast.makeText(WardPage.this, "Failed to load data", Toast.LENGTH_SHORT).show();
            }
        });
    }
}
