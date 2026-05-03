import { rootReducer } from './store';

import userReducer from './slices/user-slice';
import ingredientsReducer from './slices/ingredients-slice';
import orderReducer from './slices/order-slice';
import profileOrdersReducer from './slices/profile-orders-slice';
import burgerReducer from './slices/burger-constructor-slice';
import feedsReducer from './slices/feeds-slice';

describe('rootReducer', () => {
  it('should return correct initial state for unknown action', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state).toEqual({
      user: userReducer(undefined, { type: 'UNKNOWN_ACTION' }),
      burgerConstructor: burgerReducer(undefined, { type: 'UNKNOWN_ACTION' }),
      ingredients: ingredientsReducer(undefined, { type: 'UNKNOWN_ACTION' }),
      order: orderReducer(undefined, { type: 'UNKNOWN_ACTION' }),
      profileOrders: profileOrdersReducer(undefined, {
        type: 'UNKNOWN_ACTION'
      }),
      feedOrder: feedsReducer(undefined, { type: 'UNKNOWN_ACTION' })
    });
  });
});
