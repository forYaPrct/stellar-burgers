import { getFeedsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

interface IFeed {
  orders: TOrder[];
  total: number;
  today: number;
  isLoading: boolean;
  error: string | undefined;
}

const initialState: IFeed = {
  orders: [],
  total: 0,
  today: 0,
  isLoading: false,
  error: undefined
};

export const getFeed = createAsyncThunk('feed/orders', async () => {
  const data = await getFeedsApi();
  return data;
});

const feedSlice = createSlice({
  name: 'feedSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeed.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(getFeed.fulfilled, (state, action) => {
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.today = action.payload.totalToday;
        state.isLoading = false;
      })
      .addCase(getFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
  selectors: {
    getOrdersSelector: (state) => state.orders
  }
});

export const { getOrdersSelector } = feedSlice.selectors;
export default feedSlice.reducer;
