package com.example.electrohive.Activities;

import android.content.Intent;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.EditText;
import android.widget.FrameLayout;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.LayoutRes;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.view.GravityCompat;
import androidx.drawerlayout.widget.DrawerLayout;

import com.bumptech.glide.Glide;
import com.example.electrohive.Models.Customer;
import com.example.electrohive.Models.Message;
import com.example.electrohive.R;
import com.example.electrohive.ViewModel.CartViewModel;
import com.example.electrohive.ViewModel.CustomerViewModel;
import com.example.electrohive.ViewModel.SupportChatViewModel;
import com.example.electrohive.utils.PreferencesHelper;
import com.google.android.material.navigation.NavigationView;

public class DrawerBasePage extends AppCompatActivity {


    CartViewModel cartViewModel = new CartViewModel();
    SupportChatViewModel supportChatViewModel = new SupportChatViewModel();
    private DrawerLayout drawerLayout;
    private ImageView profileImage;


    private TextView username;

    private ImageButton menuButton;

    private EditText searchInput;
    private ImageView searchButton;
    private ImageButton signOutButton;

    private NavigationView navigationView;

    private  Menu menu;
    private Customer sessionCustomer = new Customer();


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.drawer_layout);





        // Find the DrawerLayout
        drawerLayout = findViewById(R.id.drawer_layout);
        navigationView = findViewById(R.id.nav_view);
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


        searchInput = findViewById(R.id.search_input);
        searchButton = findViewById(R.id.search_button);

        searchButton.setOnClickListener(v -> searchProduct());
        menuButton = findViewById(R.id.menuButton);
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

        menu = navigationView.getMenu();
        MenuItem supportChatMenu = menu.findItem(R.id.nav_support);


        supportChatViewModel.fetchMessages().observe(this,messages -> {
            if(messages!=null) {
                boolean hasUnseen = false;
                for (Message msg : messages) {
                    if (!msg.isSeen()) {
                        hasUnseen = true;
                        break;
                    }
                }
                // Update menu title based on unseen status
                supportChatMenu.setTitle(hasUnseen ? "Support (New)" : "Support");
            }
        });



        // You can set up the navigation item listener here if needed
        navigationView.setNavigationItemSelectedListener(item -> {
            int id = item.getItemId();

            if (id == R.id.nav_logout) {
                // Account selected (Logout or Account screen)
                Intent intent = new Intent(getApplicationContext(), AccountPage.class);
                startActivity(intent);
            } else if (id == R.id.nav_home) {
                // Check if already on HomePage
                if (!(this instanceof HomePage)) {
                    Intent intent = new Intent(getApplicationContext(), HomePage.class);
                    startActivity(intent);

                }
                // Home selected
            } else if (id == R.id.nav_product) {
                if (!(this instanceof SearchPage)) {
                    Intent intent = new Intent(getApplicationContext(), SearchPage.class);
                    startActivity(intent);
                }
                // Home selected
            } else if (id == R.id.nav_cart) {
                // Cart selected this, "Cart Selected", Toast.LENGTH_SHORT).show();
                Intent intent = new Intent(getApplicationContext(), SearchPage.class);
                startActivity(intent);
            } else if (id == R.id.nav_track) {
                // Tracking selected
                Intent intent = new Intent(getApplicationContext(), TrackPage.class);
                startActivity(intent);
            } else if (id == R.id.nav_support) {
                Intent intent = new Intent(getApplicationContext(), SupportChatPage.class);
                startActivity(intent);
            }

            // Close the drawer after a menu item is clicked
            drawerLayout.closeDrawer(GravityCompat.START);
            return true;
        });

        View headerView = navigationView.getHeaderView(0);
        profileImage = headerView.findViewById(R.id.profile_image);
        username = headerView.findViewById(R.id.user_name);


        setUpUI();
        signOutButton = headerView.findViewById(R.id.sign_out_button);
        signOutButton.setOnClickListener(v -> signOut());


    }

    @Override
    protected void onResume() {
        super.onResume();
        setUpUI();
    }

    protected void setUpUI() {

        MenuItem cartMenu = menu.findItem(R.id.nav_cart);


        cartViewModel.getCart().observe(this, cartItems -> {
            if (cartItems != null) {
                int itemCount = cartItems.size(); // Assuming `getCart()` returns a list of cart items
                cartMenu.setTitle("Cart (" + itemCount + ")"); // Update the cart menu title with the item count
            }
        });

        sessionCustomer = PreferencesHelper.getCustomerData();
        username.setText(sessionCustomer.getUsername());
        Glide.with(DrawerBasePage.this)
                .load(sessionCustomer.getImage()) // URL to the image
                .placeholder(R.drawable.ic_user_icon) // Optional placeholder
                .error(R.drawable.ic_user_icon) // Optional error image
                .into(profileImage); // Your ImageView

    }

    public void searchProduct() {
        String searchText = searchInput.getText().toString().trim();

        Intent intent = new Intent(DrawerBasePage.this, SearchPage.class);

        intent.putExtra("SEARCH_TEXT", searchText);

        startActivity(intent);
    }

    public void setContent(@LayoutRes int layoutResID) {
        FrameLayout contentFrame = findViewById(R.id.fragment_container);
        getLayoutInflater().inflate(layoutResID, contentFrame, true);
    }

    private void signOut() {

        PreferencesHelper.clear();

        Intent intent = new Intent(DrawerBasePage.this, LoginPage.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        startActivity(intent);
        finish(); // Ends the current activity
    }
}
