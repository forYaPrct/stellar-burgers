import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/user-slice';
import ingredientsReducer from './slices/ingredients-slice';
import orderReducer from './slices/order-slice';
import profileOrdersReducer from './slices/profile-orders-slice';
import burgerReducer from './slices/burger-constructor-slice';
import feedsReducer from './slices/feeds-slice';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

export const rootReducer = combineReducers({
  user: userReducer,
  burgerConstructor: burgerReducer,
  ingredients: ingredientsReducer,
  order: orderReducer,
  profileOrders: profileOrdersReducer,
  feedOrder: feedsReducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
