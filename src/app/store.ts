import { configureStore } from '@reduxjs/toolkit'
import cartReducer from '../features/cart/cartSlice'
import categoriesReducer from '../features/categories/categoriesSlice'
import productsReducer from '../features/products/productsSlice'
 

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    categories: categoriesReducer, // ✅ נוסף כאן
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
