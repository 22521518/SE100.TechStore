package com.example.electrohive;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.view.GravityCompat;
import androidx.drawerlayout.widget.DrawerLayout;
import com.google.android.material.navigation.NavigationView;

import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.WindowManager;

public class MainActivity extends AppCompatActivity {
    private DrawerLayout drawerLayout;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_search_page);

        // Find the DrawerLayout
        drawerLayout = findViewById(R.id.drawer_layout);
        NavigationView navigationView = findViewById(R.id.nav_view);

        // You can set up the navigation item listener here if needed
        navigationView.setNavigationItemSelectedListener(item -> {
            // Handle navigation item clicks here
            int id = item.getItemId();
            // Handle your menu item actions
            drawerLayout.closeDrawer(GravityCompat.START);
            return true;
        });
    }
}
