import { TOrder } from '@utils-types';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrdersApi } from '@api';

export interface IOrder {
  order: TOrder[];
  isLoading: boolean;
  error: string | undefined;
}

const initialState: IOrder = {
  order: [],
  isLoading: false,
  error: undefined
};

export const profileOrders = createAsyncThunk('profile/orders', async () => {
  const data = await getOrdersApi();
  return data;
});

const profileOrdersSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(profileOrders.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(profileOrders.fulfilled, (state, action) => {
        state.order = action.payload;
        state.isLoading = false;
      })
      .addCase(profileOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
  selectors: {
    getProfileOrders: (state) => state.order
  }
});

export const { getProfileOrders } = profileOrdersSlice.selectors;
export default profileOrdersSlice.reducer;
