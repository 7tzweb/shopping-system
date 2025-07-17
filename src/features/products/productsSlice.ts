import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchProductsByCategory = createAsyncThunk(
  'products/fetchByCategory',
  async (categoryId: number) => {
    const res = await fetch(`/api/products?categoryId=${categoryId}`);
    return await res.json();
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    status: 'idle',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProductsByCategory.rejected, (state) => {
        state.status = 'failed';
      });
  }
});

export default productsSlice.reducer;
