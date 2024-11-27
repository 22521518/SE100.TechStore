package com.example.electrohive.Activities;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.ImageButton;
import android.widget.TextView;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.electrohive.Adapters.ProductCartAdapter;
import com.example.electrohive.Models.CartItem;
import com.example.electrohive.R;
import com.example.electrohive.ViewModel.CartViewModel;

import java.util.ArrayList;

public class CartPage extends AppCompatActivity {

    private ProductCartAdapter adapter;
    private ArrayList<CartItem> cartItems;
    private CheckBox checkAll;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.cart_page);
        ImageButton backbutton=findViewById(R.id.backbutton);
        backbutton.setOnClickListener(v->{
            finish();
        });
        cartItems = new ArrayList<>();
        checkAll = findViewById(R.id.checkAll);
        TextView checkout=findViewById(R.id.checkout);
        checkout.setOnClickListener(v->{
            ArrayList<CartItem> checkedItems=getCheckedItem();
            Intent intent=new Intent(getApplicationContext(),CheckoutPage.class);
            intent.putExtra("checkedItems",checkedItems);
            startActivity(intent);

        });
        CartViewModel cartViewModel = new CartViewModel();

        // Khởi tạo RecyclerView
        RecyclerView recyclerView = findViewById(R.id.rc_trend);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));

        // Tạo Adapter và truyền đối tượng checkAll để cập nhật trạng thái của nó khi cần thiết
        adapter = new ProductCartAdapter(this, cartItems, cartViewModel, this::updateCheckAllState);
        recyclerView.setAdapter(adapter);

        // Lắng nghe sự kiện thay đổi dữ liệu từ ViewModel
        cartViewModel.getCart().observe(this, cartItemsFromViewModel -> {
            if (cartItemsFromViewModel != null && !cartItemsFromViewModel.isEmpty()) {
                cartItems.clear();
                cartItems.addAll(cartItemsFromViewModel);
                adapter.notifyDataSetChanged();
            }
        });

        // Lắng nghe sự kiện "Check All"
        checkAll.setOnCheckedChangeListener((buttonView, isChecked) -> {
            // Cập nhật trạng thái cho tất cả các item khi checkbox "Check All" thay đổi
            for (CartItem item : cartItems) {
                item.setChecked(isChecked);
            }
            adapter.notifyDataSetChanged();  // Cập nhật RecyclerView
        });
    }

    // Cập nhật trạng thái của checkbox "Check All" dựa trên trạng thái các item
    private void updateCheckAllState() {
        boolean allChecked = true;
        for (CartItem item : cartItems) {
            if (!item.getChecked()) {
                allChecked = false;  // Nếu có bất kỳ item nào chưa được tick
                break;
            }
        }

        // Cập nhật checkbox "Check All" dựa trên kết quả kiểm tra
        checkAll.setChecked(allChecked);
    }

    // Lấy danh sách các item đã được chọn
    private ArrayList<CartItem> getCheckedItem() {
        ArrayList<CartItem> checkedItems = new ArrayList<>();
        for (CartItem item : cartItems) {
            if (item.getChecked()) {
                checkedItems.add(item);
            }
        }
        return checkedItems;
    }
}
