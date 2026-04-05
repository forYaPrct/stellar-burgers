import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { nanoid } from '@reduxjs/toolkit';

export interface IBurgerConstructor {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
  totalPrice: number;
}

const initialState: IBurgerConstructor = {
  bun: null,
  ingredients: [],
  totalPrice: 0
};

const countTotalPrice = (
  bun: TConstructorIngredient | null,
  ingredients: TConstructorIngredient[]
) => {
  const sumPriceBuns = bun ? bun.price * 2 : 0;
  const sumIngredients = ingredients.reduce((acc, val) => acc + val.price, 0);
  return sumIngredients + sumPriceBuns;
};

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
        state.totalPrice = countTotalPrice(state.bun, state.ingredients);
      },
      prepare: (ingredient: TIngredient) => {
        const id = nanoid();
        return { payload: { ...ingredient, id } };
      }
    },
    deleteIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
      state.totalPrice = countTotalPrice(state.bun, state.ingredients);
    },
    changeIngredient: (
      state,
      action: PayloadAction<{ before: number; after: number }>
    ) => {
      const ing = [...state.ingredients];
      const { before, after } = action.payload;
      const [moveIngredient] = ing.splice(before, 1);
      ing.splice(after, 0, moveIngredient);
      state.ingredients = ing;
    },
    clearConstructor: () => initialState
  }
});

export const {
  addIngredient,
  deleteIngredient,
  changeIngredient,
  clearConstructor
} = burgerConstructorSlice.actions;
export default burgerConstructorSlice.reducer;
