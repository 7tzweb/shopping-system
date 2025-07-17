import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface CartItem {
  id: number
  name: string
  quantity: number
  price: number 
}

interface CartState {
  items: CartItem[]
}

const initialState: CartState = {
  items: [],
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addProduct: (state, action: PayloadAction<CartItem>) => {
      const item = state.items.find((i) => i.id === action.payload.id)
      if (item) {
        item.quantity += action.payload.quantity
      } else {
        state.items.push(action.payload)
      }
    },
    removeProduct: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ id: number; quantity: number }>
    ) => {
      const item = state.items.find((i) => i.id === action.payload.id)
      if (item) {
        item.quantity = action.payload.quantity
      }
    },
  },
})

export const { addProduct, removeProduct, updateQuantity } = cartSlice.actions
export default cartSlice.reducer
