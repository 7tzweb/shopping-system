import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const fetchCategories = createAsyncThunk(
  'categories/fetch',
  async () => {
    const res = await fetch('/api/categories')
    return await res.json()
  }
)

const categoriesSlice = createSlice({
  name: 'categories',
  initialState: {
    items: [],
    status: 'idle',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchCategories.rejected, (state) => {
        state.status = 'failed'
      })
  }
})

export default categoriesSlice.reducer
export {}