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
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.activity.result.ActivityResultCallback;
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

public class ProvincePage extends AppCompatActivity {


    private ListView provinceListView;
    private ArrayList<Province> provinces;

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
                            String finalAddress =   resultWard.getWardName() + resultDistrict.getDistrictName() + resultProvince.getProvinceName();

                            Toast.makeText(ProvincePage.this, "Received result: "+finalAddress, Toast.LENGTH_SHORT).show();
                        }

                    }
            });
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.province_page);

        provinceListView = findViewById(R.id.province_listview);

        backButton = findViewById(R.id.backbutton);
        backButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });
        // Initialize the list to hold provinces
        provinces = new ArrayList<>();

        // Set up Retrofit
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl("https://vapi.vnappmob.com/") // Base URL
                .addConverterFactory(GsonConverterFactory.create()) // Use Gson for JSON parsing
                .build();

        // Create an instance of the API service
        ApiService apiService = retrofit.create(ApiService.class);

        // Make the API call
        Call<JsonObject> call = apiService.getProvinces();  // This now returns JsonObject

        call.enqueue(new Callback<JsonObject>() {
            @Override
            public void onResponse(Call<JsonObject> call, Response<JsonObject> response) {
                if (response.isSuccessful() && response.body() != null) {
                    try {
                        // Extract the "results" array from the response body
                        JsonArray resultsArray = response.body().getAsJsonArray("results");

                        // Iterate over the "results" array to extract each province's data
                        for (int i = 0; i < resultsArray.size(); i++) {
                            JsonObject provinceJson = resultsArray.get(i).getAsJsonObject();
                            String provinceId = provinceJson.get("province_id").getAsString();
                            String provinceName = provinceJson.get("province_name").getAsString();

                            // Create a new Province object
                            Province province = new Province(provinceId, provinceName);

                            // Add the Province object to the provinces list
                            provinces.add(province);
                        }



                        // Create a list of province names for display
                        List<String> provinceNames = new ArrayList<>();
                        for (Province province : provinces) {
                            String provinceName = province.getProvinceName();
                            if (provinceName == null) {
                                provinceName = "Unknown Province"; // Default if null
                            }
                            provinceNames.add(provinceName);
                        }

                        // Set up ArrayAdapter for the ListView
                        ArrayAdapter<String> adapter = new ArrayAdapter<>(ProvincePage.this, android.R.layout.simple_list_item_1, provinceNames);
                        provinceListView.setAdapter(adapter);

                        // Set an onClickListener to handle item clicks
                        provinceListView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
                            @Override
                            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                                Province clickedProvince = provinces.get(position);

                                Intent intent = new Intent(ProvincePage.this, DistrictPage.class);
                                intent.putExtra("PROVINCE", clickedProvince);

                                // Use the ActivityResultLauncher to start the new activity
                                resultLauncher.launch(intent);
                            }
                        });

                    } catch (Exception e) {
                        Log.e("API Error", "Error parsing response: " + e.getMessage());
                        Toast.makeText(ProvincePage.this, "Error parsing data", Toast.LENGTH_SHORT).show();
                    }
                } else {
                    // Handle unsuccessful response
                    Log.e("API Error", "Failed to load provinces: " + response.code());
                    Toast.makeText(ProvincePage.this, "Failed to load data", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<JsonObject> call, Throwable t) {
                // Handle failure (e.g., network error, server issue)
                Log.e("API Error", "Error making request: " + t.getMessage());
                Toast.makeText(ProvincePage.this, "Failed to load data", Toast.LENGTH_SHORT).show();
            }
        });
    }

}
