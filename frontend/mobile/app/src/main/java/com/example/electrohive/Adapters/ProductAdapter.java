package com.example.electrohive.Adapters;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.cardview.widget.CardView;
import androidx.recyclerview.widget.RecyclerView;

import com.example.electrohive.R;
import com.example.electrohive.Models.Product;

import java.util.ArrayList;

public class ProductAdapter  extends RecyclerView.Adapter<RecyclerView.ViewHolder> {

    private IClickListener mIClicklistener;
    public interface IClickListener{
        void OnClickItem(String productType, String productID);
    }
    Context context;
    ArrayList<Product> productList;

    int type =0;
    public ProductAdapter(Context context, ArrayList<Product> productList, IClickListener listener){
        this.mIClicklistener = listener;
        this.context=context;
        this.productList=productList;
    }
    public ProductAdapter(Context context, ArrayList<Product> productList,int type,IClickListener listener){
        this.mIClicklistener = listener;
        this.context=context;
        this.productList=productList;
        this.type=1;
    }


    @NonNull
    @Override
    public RecyclerView.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        return null;
    }

    @Override
    public void onBindViewHolder(@NonNull RecyclerView.ViewHolder holder, int position) {

    }

    @Override
    public int getItemCount() {
        return productList.size();
    }

    public class ProductViewHolder extends RecyclerView.ViewHolder{


        ImageView img_product;
        TextView name_product,original_price,retail_price;
        public ProductViewHolder(@NonNull View itemView) {
            super(itemView);
            img_product=itemView.findViewById(R.id.img_product);
            name_product=itemView.findViewById(R.id.name_product);
            original_price=itemView.findViewById(R.id.original_price);
            retail_price=itemView.findViewById(R.id.retail_price);
        }
    }
    public static String formatNumber(int number) {
        String strNumber = String.valueOf(number); // Chuyển đổi số thành chuỗi
        int length = strNumber.length(); // Độ dài của chuỗi số

        // Xây dựng chuỗi kết quả từ phải sang trái, thêm dấu chấm sau mỗi 3 ký tự
        StringBuilder result = new StringBuilder();
        for (int i = length - 1; i >= 0; i--) {
            result.insert(0, strNumber.charAt(i));
            if ((length - i) % 3 == 0 && i != 0) {
                result.insert(0, ".");
            }
        }

        return result.toString(); // Trả về chuỗi kết quả
    }
}
