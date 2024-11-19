package com.example.electrohive.Activities;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.view.GravityCompat;
import androidx.drawerlayout.widget.DrawerLayout;

import com.bumptech.glide.Glide;
import com.example.electrohive.Models.Customer;
import com.example.electrohive.R;
import com.example.electrohive.utils.PreferencesHelper;
import com.google.android.material.navigation.NavigationView;

public class SearchPage extends AppCompatActivity {

    private DrawerLayout drawerLayout;

    private ImageView profileImage;

    private TextView username;

    private ImageButton signOutButton;

    private Customer sessionCustomer;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.search_page);

        sessionCustomer = PreferencesHelper.getCustomerData();

        // Find the DrawerLayout
        drawerLayout = findViewById(R.id.drawer_layout);
        NavigationView navigationView = findViewById(R.id.nav_view);
        navigationView.setOnApplyWindowInsetsListener((v, insets) -> {
            // Adjust padding for system bars
            v.setPadding(
                    insets.getSystemWindowInsetLeft(),
                    insets.getSystemWindowInsetTop(),
                    insets.getSystemWindowInsetRight(),
                    insets.getSystemWindowInsetBottom()
            );
            return insets.consumeSystemWindowInsets();
        });

        View headerView = navigationView.getHeaderView(0);
        profileImage = headerView.findViewById(R.id.profile_image);
        Glide.with(SearchPage.this)
                .load(sessionCustomer.getImage()) // URL to the image
                .placeholder(R.drawable.ic_user_icon) // Optional placeholder
                .error(R.drawable.ic_image_error_icon) // Optional error image
                .into(profileImage); // Your ImageView
        username = headerView.findViewById(R.id.user_name);
        username.setText(sessionCustomer.getUsername());
        signOutButton = headerView.findViewById(R.id.sign_out_button);
        signOutButton.setOnClickListener(v->signOut());



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
            int id = item.getItemId();

            if (id == R.id.nav_logout) {
                // Account selected (Logout or Account screen)
                Intent intent = new Intent(SearchPage.this,AccountPage.class);
                startActivity(intent);
            } else if (id == R.id.nav_home) {
                // Home selected
            } else if (id == R.id.nav_product) {
                // Cart selectedthis, "Cart Selected", Toast.LENGTH_SHORT).show();
                Intent intent = new Intent(SearchPage.this,SearchPage.class);
                startActivity(intent);
            } else if (id == R.id.nav_track) {
                // Tracking selected
                Intent intent = new Intent(SearchPage.this,TrackPage.class);
                startActivity(intent);
            } else if (id == R.id.nav_cart) {
                // Support selected
            }

            // Close the drawer after a menu item is clicked
            drawerLayout.closeDrawer(GravityCompat.START);
            return true;
        });



    }

    private void showProductDetail(String productId) {
        Intent intent = new Intent(SearchPage.this,ProductDetailPage.class);
        intent.putExtra("PRODUCT_ID",productId);
        startActivity(intent);
    }

    private void signOut() {

        PreferencesHelper.clear();

        Intent intent = new Intent(SearchPage.this, LoginPage.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        startActivity(intent);
        finish(); // Ends the current activity
    }
}