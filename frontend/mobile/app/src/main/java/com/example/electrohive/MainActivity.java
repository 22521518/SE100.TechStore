package com.example.electrohive;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.view.GravityCompat;
import androidx.drawerlayout.widget.DrawerLayout;

import com.example.electrohive.Activities.Cart_page;
import com.google.android.material.navigation.NavigationView;


import android.os.Build;
import android.os.Bundle;
import android.view.Gravity;
import android.view.View;
import android.view.WindowManager;
import android.widget.ImageButton;
import android.content.Intent;

public class MainActivity extends AppCompatActivity {
    private DrawerLayout drawerLayout;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home_page);

        // Find the DrawerLayout
        drawerLayout = findViewById(R.id.drawer_layout);
        NavigationView navigationView = findViewById(R.id.nav_view);

        ImageButton menuButton = findViewById(R.id.menuButton);
        menuButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (!drawerLayout.isDrawerOpen(GravityCompat.START)) {
                    drawerLayout.openDrawer(GravityCompat.START); // Open the drawer from the start (left side)
                } else {
                    drawerLayout.closeDrawer(GravityCompat.START); // Close the drawer if it's already open
                }
            }
        });
        // You can set up the navigation item listener here if needed
        navigationView.setNavigationItemSelectedListener(item -> {
            // Handle navigation item clicks here
            int id = item.getItemId();
            // Handle your menu item actions
            if(id==R.id.nav_product)
            {
                startActivity(new Intent(this, Cart_page.class));
            }
            drawerLayout.closeDrawer(GravityCompat.START);
            return true;
        });
    }
}
