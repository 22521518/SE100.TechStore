import { createSlice } from '@reduxjs/toolkit';
import { generateDummyCart } from '@util/generator/cart';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    quantity: 0,
  },
  reducers: {
    setCart(state,action) {
      state.items = action.payload.cart
      state.quantity = action.payload.cart.length
    },
    addItem(state, action) {
      const productId = action.payload.id;
      const existingItem = state.items.find(item => item.product_id === productId);
      if (!existingItem) {
        state.items.push(generateDummyCart()[0] );
        state.quantity = state.items.length;
      } else {
        existingItem.quantity++;
      }
    },
    removeItem(state, action) {
      const productId = action.payload.id;
      const existingItem = state.items.find(item => item.product_id === productId);
      
      if (existingItem) {
        state.items = state.items.filter(item => item.product_id !== productId); // Remove the item
        state.quantity = state.items.length;
      }
    },
    // Define other actions like updateQuantity, clearCart, etc.
  },
});

export const { addItem, removeItem,setCart } = cartSlice.actions;
export default cartSlice.reducer;
