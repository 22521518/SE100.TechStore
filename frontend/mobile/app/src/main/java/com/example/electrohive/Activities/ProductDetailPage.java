package com.example.electrohive.Activities;

import android.content.Intent;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.util.Log;
import android.view.View;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.RatingBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.Observer;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.viewpager2.widget.ViewPager2;


import com.example.electrohive.Adapters.ProductAdapter;
import com.example.electrohive.Adapters.ProductImagesAdapter;
import com.example.electrohive.Adapters.ProductAttributeAdapter;
import com.example.electrohive.Models.CartItem;
import com.example.electrohive.Models.Product;
import com.example.electrohive.Models.ProductAttribute;
import com.example.electrohive.Models.ProductFeedback;
import com.example.electrohive.Models.ProductImage;
import com.example.electrohive.R;
import com.example.electrohive.ViewModel.CartViewModel;
import com.example.electrohive.ViewModel.ProductViewModel;
import com.example.electrohive.utils.PreferencesHelper;
import com.example.electrohive.utils.format.Format;
import com.google.android.material.tabs.TabLayout;
import com.google.android.material.tabs.TabLayoutMediator;
import com.google.gson.Gson;

import java.util.ArrayList;
import java.util.List;

import me.relex.circleindicator.CircleIndicator3;

public class ProductDetailPage extends DrawerBasePage {


}
