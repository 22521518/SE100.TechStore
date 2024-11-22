package com.example.electrohive.Activities;

import android.content.Intent;
import android.os.Bundle;
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
import com.example.electrohive.Models.Product;
import com.example.electrohive.Models.ProductAttribute;
import com.example.electrohive.Models.ProductFeedback;
import com.example.electrohive.Models.ProductImage;
import com.example.electrohive.R;
import com.example.electrohive.ViewModel.CartViewModel;
import com.example.electrohive.ViewModel.ProductViewModel;
import com.example.electrohive.utils.format.Format;
import com.google.android.material.tabs.TabLayout;
import com.google.android.material.tabs.TabLayoutMediator;

import java.util.ArrayList;
import java.util.List;

import me.relex.circleindicator.CircleIndicator3;

public class ProductDetailPage extends DrawerBasePage {

    private ProgressBar loadingSpinner;

    private ProductViewModel productViewModel;

    private CartViewModel cartViewModel;

    private RatingBar product_average_rating;
    private TextView product_name;
    private TextView product_feedback_count_1;
    private TextView product_feedback_count_2;
    private TextView product_price;
    private TextView product_original_price;
    private TextView product_discount;
    private TextView product_stock_count;
    private TextView product_add_to_cart_button;
    private TextView product_buy_now_button;
    private TextView product_detail;
    private TextView product_rating;
    private TextView product_5_star_count;
    private TextView product_4_star_count;
    private TextView product_3_star_count;
    private TextView product_2_star_count;
    private TextView product_1_star_count;
    private TextView product_0_star_count;
    private TextView see_feedback_button;

    private EditText product_quantity_input;
    private RecyclerView product_attribute_listview;
    private RecyclerView product_listview;

    private  ViewPager2 imageSlider;
    private CircleIndicator3 indicator ;



    private List<Product> productList = new ArrayList<>();
    private List<ProductImage> productImages = new ArrayList<>(3);

    private List<ProductAttribute> productAttributes = new ArrayList<>();

    private ProductImagesAdapter imagesAdapter;

    private ProductAttributeAdapter attributeAdapter;

    private ProductAdapter productAdapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContent(R.layout.product_detail);



        loadingSpinner = findViewById(R.id.loading_spinner);
        loadingSpinner.setVisibility(View.VISIBLE);

        imageSlider = findViewById(R.id.display_image);
        indicator  = findViewById(R.id.display_image_indicator );

        product_average_rating = findViewById(R.id.product_average_rating);
        product_name = findViewById(R.id.product_name);
        product_feedback_count_1 = findViewById(R.id.product_feedback_count_1);
        product_price = findViewById(R.id.product_price);
        product_original_price = findViewById(R.id.product_original_price);
        product_discount = findViewById(R.id.product_discount);
        product_stock_count = findViewById(R.id.product_stock_count);
        product_add_to_cart_button = findViewById(R.id.product_add_to_cart_button);
        product_buy_now_button = findViewById(R.id.product_buy_now_button);
        product_detail = findViewById(R.id.product_detail);
        product_rating = findViewById(R.id.product_rating);
        product_5_star_count = findViewById(R.id.product_5_star_count);
        product_4_star_count = findViewById(R.id.product_4_star_count);
        product_3_star_count = findViewById(R.id.product_3_star_count);
        product_2_star_count = findViewById(R.id.product_2_star_count);
        product_1_star_count = findViewById(R.id.product_1_star_count);
        product_0_star_count = findViewById(R.id.product_0_star_count);
        see_feedback_button = findViewById(R.id.see_feedback_button);
        product_quantity_input = findViewById(R.id.product_quantity_input);
        product_attribute_listview = findViewById(R.id.product_attribute_listview);

        product_listview = findViewById(R.id.product_listview);

        Intent intent = getIntent();
        String productId = intent.getStringExtra("PRODUCT_ID");
        productViewModel = new ProductViewModel();
        cartViewModel = new CartViewModel();

        productAdapter = new ProductAdapter(
                ProductDetailPage.this,
                productList,
                product -> showProductDetail(product.getProductId())
        );
        product_listview.setLayoutManager(new GridLayoutManager(ProductDetailPage.this, 2));
        product_listview.setAdapter(productAdapter);

        attributeAdapter = new ProductAttributeAdapter(
                ProductDetailPage.this,
                productAttributes
        );
        product_attribute_listview.setLayoutManager(new LinearLayoutManager(ProductDetailPage.this));
        product_attribute_listview.setAdapter(attributeAdapter);

        imagesAdapter = new ProductImagesAdapter(
                ProductDetailPage.this,
                productImages
        );
        imageSlider.setAdapter(imagesAdapter);
        indicator.setViewPager(imageSlider);

        productViewModel.getProducts(16).observe(this, new Observer<List<Product>>() {
            @Override
            public void onChanged(List<Product> products) {
                if (products != null) {
                    productAdapter.updateProducts(products);  // Method to update the adapter data
                }
                loadingSpinner.setVisibility(View.GONE);
            }
        });

        productViewModel.getProductDetail(productId).observe(this, new Observer<Product>() {
            @Override
            public void onChanged(Product product) {
                if (product != null) {
                    productImages = product.getImages();
                    imagesAdapter.updateImages(productImages);
                    indicator.setViewPager(imageSlider);

                    product_name.setText(product.getProductName());
                    product_feedback_count_1.setText(product.getProductFeedbacks().size() + " reviews");
                    product_average_rating.setRating(calculateAverageRating(product.getProductFeedbacks()));
                    product_price.setText(Format.getFormattedTotalPrice(product.getRetailPrice()) + " VNĐ");
                    product_original_price.setText(Format.getFormattedTotalPrice(product.getPrice()) + "  VNĐ");
                    product_discount.setText("-" + product.getDiscount() + "%");
                    product_stock_count.setText(product.getStockQuantity() + " in-stocks");
                    product_add_to_cart_button.setOnClickListener(v -> addItemToCart(productId, Integer.parseInt(product_quantity_input.getText().toString())));
                    product_buy_now_button.setOnClickListener(v -> buyProduct(productId, Integer.parseInt(product_quantity_input.getText().toString())));
                    product_detail.setText(product.getDescription());
                    product_rating.setText(calculateAverageRating(product.getProductFeedbacks())+" / 5");
                    product_5_star_count.setText("★★★★★ (" + countRating(5, product.getProductFeedbacks()) + ")");
                    product_4_star_count.setText("★★★★ (" + countRating(4, product.getProductFeedbacks()) + ")");
                    product_3_star_count.setText("★★★ (" + countRating(3, product.getProductFeedbacks()) + ")");
                    product_2_star_count.setText("★★ (" + countRating(2, product.getProductFeedbacks()) + ")");
                    product_1_star_count.setText("★ (" + countRating(1, product.getProductFeedbacks()) + ")");
                    product_0_star_count.setText("(" + countRating(0, product.getProductFeedbacks()) + ")");
                    see_feedback_button.setOnClickListener(v -> seeFeedback(productId));
                    Log.d("ProductAttributes", product.getAttributes().toString());

                    attributeAdapter.updateAttribute(product.getAttributes());
                }
            }
        });
    }


    private void addItemToCart(String productId, int quantity) {
        if (quantity <= 0) {
            Toast.makeText(this, "Please enter a valid quantity", Toast.LENGTH_SHORT).show();
            return;
        }
        cartViewModel.addItemToCart(productId, quantity).observe(this, new Observer<Boolean>() {
            @Override
            public void onChanged(Boolean isAdded) {
                if (isAdded) {
                    Toast.makeText(getApplicationContext(), "Product added to cart", Toast.LENGTH_SHORT).show();
                } else {
                    Toast.makeText(getApplicationContext(), "Failed to add product to cart", Toast.LENGTH_SHORT).show();
                }
            }
        });

    }


    private String countRating(int i, List<ProductFeedback> list) {
        if (list == null || list.isEmpty()) {
            return "0";  // Return "0" if the list is empty or null
        }

        int count = 0;
        for (ProductFeedback fb : list) {
            if (fb.getRating() == i) {
                count++;
            }
        }


        // Return the average rating as a String
        return Integer.toString(count);  // Returns the rating rounded to one decimal place
    }


    private float calculateAverageRating(List<ProductFeedback> list) {
        if (list == null || list.isEmpty()) {
            return 0;  // Return "0" if the list is empty or null
        }

        float rating = 0;
        for (ProductFeedback fb : list) {
            rating += fb.getRating();
        }

        // Calculate the average rating
        rating /= list.size();

        // Round to 1 decimal place
        return Math.round(rating * 10) / 10.0f;
    }


    private void buyProduct(String productId, int quantity) {
        addItemToCart(productId, quantity);

        Intent intent = new Intent(ProductDetailPage.this, CartPage.class);
        startActivity(intent);

    }

    private void seeFeedback(String productId) {
        Intent intent = new Intent(ProductDetailPage.this, ProductFeedbackPage.class);
        intent.putExtra("PRODUCT_ID", productId);

        startActivity(intent);
    }

    private void showProductDetail(String productId) {
        Intent intent = new Intent(ProductDetailPage.this, ProductDetailPage.class);
        intent.putExtra("PRODUCT_ID", productId);
        startActivity(intent);
    }

}
