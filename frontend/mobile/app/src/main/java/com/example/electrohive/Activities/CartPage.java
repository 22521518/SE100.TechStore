package com.example.electrohive.Activities;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.ImageButton;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.electrohive.Adapters.ProductCartAdapter;
import com.example.electrohive.Models.CartItem;
import com.example.electrohive.R;
import com.example.electrohive.ViewModel.CartViewModel;
import com.google.gson.Gson;

import java.text.DecimalFormat;
import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.Locale;

public class CartPage extends AppCompatActivity {

    private ProductCartAdapter adapter;
    private ArrayList<CartItem> cartItems;
    private CheckBox checkAll;

    private TextView Subtotal,Discount,Grandtotal;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.cart_page);
        Subtotal=findViewById(R.id.subtotal);
        Discount=findViewById(R.id.discount);
        Grandtotal=findViewById(R.id.grandtotal);
        ImageButton backbutton=findViewById(R.id.backbutton);
        backbutton.setOnClickListener(v->{
            finish();
        });
        cartItems = new ArrayList<>();
        checkAll = findViewById(R.id.checkAll);
        TextView checkout=findViewById(R.id.checkout);
        checkout.setOnClickListener(v->{
            if(Grandtotal.getText().toString().equals("0 VNĐ"))
            {
                Toast.makeText(this, "Please Choose Item", Toast.LENGTH_SHORT).show();
                return;
            }
            ArrayList<CartItem> checkedItems=getCheckedItem();
            Gson gson = new Gson();
            String json = gson.toJson(checkedItems);
            Intent intent=new Intent(getApplicationContext(),CheckoutPage.class);
            intent.putExtra("checkedItems",json);
            startActivity(intent);

        });
        CartViewModel cartViewModel = new CartViewModel();

        // Khởi tạo RecyclerView
        RecyclerView recyclerView = findViewById(R.id.rc_trend);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));

        // Tạo Adapter và truyền đối tượng checkAll để cập nhật trạng thái của nó khi cần thiết
        adapter = new ProductCartAdapter(this, cartItems, cartViewModel, this::updateCheckAllState,this::updateTotal);
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
            adapter.notifyDataSetChanged();
            updateTotal();
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

        checkAll.setChecked(allChecked);
        updateTotal();
    }

    private void updateTotal(){
        double grandtotal=0;
        double subtotal=0;
        double discount=0;
        for(CartItem item : cartItems)
        {
            if(item.getChecked())
            {
                subtotal+=item.getProduct().getPrice()*item.getQuantity();
                discount+=(item.getProduct().getDiscount()*item.getProduct().getPrice()*item.getQuantity())/100;
            }
        }
        grandtotal=subtotal-discount;
        NumberFormat currencyFormat = NumberFormat.getInstance(Locale.US);
        Grandtotal.setText(currencyFormat.format(grandtotal)+" VNĐ");
        Subtotal.setText(currencyFormat.format(subtotal)+" VNĐ");
        Discount.setText(currencyFormat.format(discount)+" VNĐ");
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
