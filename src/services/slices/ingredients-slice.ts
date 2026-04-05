import { TIngredient } from '../../utils/types';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '../../utils/burger-api';

export interface IIngredientsList {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | undefined;
}

const initialState: IIngredientsList = {
  ingredients: [],
  isLoading: false,
  error: undefined
};

export const getIngredients = createAsyncThunk(
  'ingredients/getIngredients',
  async () => {
    const data = await getIngredientsApi();
    return data;
  }
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.ingredients = action.payload;
        state.isLoading = false;
        state.error = undefined;
      })
      .addCase(getIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
  selectors: {
    getIngredientsSelector: (state) => state.ingredients
  }
});

export const { getIngredientsSelector } = ingredientsSlice.selectors;
export default ingredientsSlice.reducer;
