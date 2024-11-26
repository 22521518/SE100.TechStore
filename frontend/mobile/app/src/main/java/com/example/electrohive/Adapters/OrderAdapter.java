package com.example.electrohive.Adapters;

import static androidx.core.content.ContextCompat.startActivities;

import android.app.AlertDialog;
import android.content.Context;
import android.content.Intent;
import android.content.res.ColorStateList;
import android.graphics.Color;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

import androidx.core.content.ContextCompat;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.electrohive.Activities.TrackPage;
import com.example.electrohive.Models.Enum.ORDER_STATUS;
import com.example.electrohive.Models.Order;
import com.example.electrohive.Models.OrderItem;
import com.example.electrohive.R;
import com.example.electrohive.ViewModel.OrderViewModel;
import com.example.electrohive.utils.format.Format;

import java.util.List;

public class OrderAdapter extends RecyclerView.Adapter<OrderAdapter.OrderViewHolder> {

    private List<Order> orderList;
    private Context context;

    // Constructor
    public OrderAdapter(Context context, List<Order> orderList) {
        this.context = context;
        this.orderList = orderList;
    }


    @Override
    public OrderViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View itemView = LayoutInflater.from(parent.getContext()).inflate(R.layout.account_orders_order_list_item, parent, false);
        return new OrderViewHolder(itemView);
    }

    @Override
    public void onBindViewHolder(OrderViewHolder holder, int position) {
        Order order = orderList.get(position);
        holder.orderId.setText("OrderId: " + order.getOrderId());
        holder.orderStatus.setText(order.getOrderStatus().toString());
        holder.orderTotalPrice.setText("Total: " + Format.getFormattedTotalPrice(order.getTotalPrice()) + " VND");

        OrderItemAdapter orderItemsAdapter = new OrderItemAdapter(context, order.getOrderItems());
        holder.orderItemsRecyclerView.setLayoutManager(new LinearLayoutManager(holder.itemView.getContext()));
        holder.orderItemsRecyclerView.setAdapter(orderItemsAdapter);
        // Conditionally render the button based on order status
        ORDER_STATUS orderStatus = order.getOrderStatus();
        switch (orderStatus) {
            case PENDING:
                holder.orderStatus.setBackgroundTintList(ColorStateList.valueOf(Color.parseColor("#808080"))); // Grey tint for pending
                holder.actionButton.setText("Cancel Order");
                holder.actionButton.setVisibility(View.VISIBLE);
                holder.actionButton.setOnClickListener(v -> cancelOrder(order.getOrderId(),position));
                break;

            case CONFIRMED:
                holder.orderStatus.setBackgroundTintList(ColorStateList.valueOf(Color.parseColor("#000000"))); // Black tint for confirmed
                holder.actionButton.setText("Track Order");
                holder.actionButton.setVisibility(View.VISIBLE);
                holder.actionButton.setOnClickListener(v -> trackOrder(order.getOrderId()));
                break;

            case SHIPPED:
                holder.orderStatus.setBackgroundTintList(ColorStateList.valueOf(Color.parseColor("#0000FF"))); // Blue tint for shipped
                holder.actionButton.setText("Track Order");
                holder.actionButton.setVisibility(View.VISIBLE);
                holder.actionButton.setOnClickListener(v -> trackOrder(order.getOrderId()));
                break;

            case DELIVERED:
                holder.orderStatus.setBackgroundTintList(ColorStateList.valueOf(Color.parseColor("#008000"))); // Green tint for delivered
                holder.actionButton.setText("Reorder");
                holder.actionButton.setVisibility(View.VISIBLE);
                holder.actionButton.setOnClickListener(v -> {
                    // Handle reorder
                });
                break;

            case CANCELLED:
                holder.orderStatus.setBackgroundTintList(ColorStateList.valueOf(Color.parseColor("#FF0000"))); // Red tint for cancelled
                holder.actionButton.setText("Reorder");
                holder.actionButton.setVisibility(View.VISIBLE);
                holder.actionButton.setOnClickListener(v -> {
                    // Handle reorder
                });
                break;

            default:
                holder.orderStatus.setBackgroundTintList(ColorStateList.valueOf(Color.parseColor("#D3D3D3"))); // Default grey for unknown status
                holder.actionButton.setVisibility(View.GONE);
                break;
        }
    }

    @Override
    public int getItemCount() {
        return orderList.size();
    }


    public void updateOrders(List<Order> orders) {
        this.orderList = orders;
        notifyDataSetChanged();
    }

    public static class OrderViewHolder extends RecyclerView.ViewHolder {
        TextView orderId, orderStatus, orderTotalPrice,actionButton;
        RecyclerView orderItemsRecyclerView;

        public OrderViewHolder(View view) {
            super(view);
            orderId = view.findViewById(R.id.order_id);
            orderStatus = view.findViewById(R.id.order_status);
            orderTotalPrice = view.findViewById(R.id.order_totalprice);
            actionButton = itemView.findViewById(R.id.action_button);
            orderItemsRecyclerView = view.findViewById(R.id.order_items_listview);
        }
    }

    public void trackOrder(String orderId) {
        Intent intent = new Intent(context, TrackPage.class);
        intent.putExtra("ORDER_ID",orderId);
        context.startActivity(intent);
    }

    public void cancelOrder(String orderId,int position) {


        // Create an AlertDialog to confirm cancel
        new AlertDialog.Builder(context)
                .setTitle("Cancel Order")
                .setMessage("Are you sure you want to cancel this order?")
                .setPositiveButton("Yes", (dialog, which) -> {
                    // Handle cancellation here, update order status
                    new OrderViewModel().cancelOrder(orderId); // Method to cancel the order

                    // Optionally, rerender the RecyclerView by updating the order list
                    notifyItemChanged(position);
                })
                .setNegativeButton("No", null)
                .show();
    }


}
