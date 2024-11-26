package com.example.electrohive;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.view.GravityCompat;
import androidx.drawerlayout.widget.DrawerLayout;

import com.example.electrohive.utils.PreferencesHelper;
import com.google.android.material.navigation.NavigationView;

import android.app.Application;
import android.os.Bundle;
import android.view.View;
import android.widget.ImageButton;

public class MainActivity extends Application {
    @Override
    public void onCreate() {
        super.onCreate();
        PreferencesHelper.init(this);
    }
}
