import { TOrder } from '@utils-types';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrderByNumberApi, orderBurgerApi } from '@api';

export interface IOrder {
  order: TOrder | null;
  orderNumber: number | null;
  isLoading: boolean;
  error: string | undefined;
}

const initialState: IOrder = {
  order: null,
  orderNumber: null,
  isLoading: false,
  error: undefined
};

export const createOrder = createAsyncThunk(
  'order/create',
  async (ingredients: string[]) => {
    const data = await orderBurgerApi(ingredients);
    return data;
  }
);

export const getOrderByNumber = createAsyncThunk(
  'order/getNumber',
  async (orderNumber: number) => {
    const data = await getOrderByNumberApi(orderNumber);
    return data.orders[0];
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.order = null;
      state.orderNumber = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.order = action.payload.order;
        state.orderNumber = action.payload.order.number;
        state.isLoading = false;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(getOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.order = action.payload;
        state.isLoading = false;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
  selectors: {
    getOrder: (state) => state
  }
});

export const { clearOrder } = orderSlice.actions;
export const { getOrder } = orderSlice.selectors;
export default orderSlice.reducer;
