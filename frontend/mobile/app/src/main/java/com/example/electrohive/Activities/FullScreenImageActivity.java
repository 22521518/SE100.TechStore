package com.example.electrohive.Activities;

import android.os.Bundle;
import android.view.Window;
import android.view.WindowManager;

import androidx.fragment.app.FragmentActivity;
import androidx.viewpager2.widget.ViewPager2;

import com.example.electrohive.Adapters.ProductImagesAdapter;
import com.example.electrohive.Models.ProductImage;
import com.example.electrohive.R;

import java.util.List;

import me.relex.circleindicator.CircleIndicator3;

public class FullScreenImageActivity extends FragmentActivity {

    private static final String ARG_IMAGE_URLS = "image_urls";
    private static final String ARG_POSITION = "position";
    private ViewPager2 viewPager;
    private CircleIndicator3 indicator;
    private ProductImagesAdapter imageAdapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Inflate the layout for full screen
        setContentView(R.layout.fragment_full_screen_image);

        // Get the image URLs and the current position from the Intent
        List<ProductImage> images = getIntent().getParcelableArrayListExtra(ARG_IMAGE_URLS);
        int position = getIntent().getIntExtra(ARG_POSITION, 0);

        // Initialize ViewPager2 and Adapter
        viewPager = findViewById(R.id.display_image);
        imageAdapter = new ProductImagesAdapter(FullScreenImageActivity.this, images);
        viewPager.setAdapter(imageAdapter);
        indicator = findViewById(R.id.display_image_indicator);
        indicator.setViewPager(viewPager);
        viewPager.setCurrentItem(position);

        // Set the activity to full screen
        Window window = getWindow();
        if (window != null) {
            // Full-screen layout
            window.setLayout(WindowManager.LayoutParams.MATCH_PARENT, WindowManager.LayoutParams.MATCH_PARENT);
            window.setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
            window.setBackgroundDrawableResource(android.R.color.black);
        }
    }
}
