import burgerConstructoReducer, {
  addIngredient,
  deleteIngredient,
  changeIngredient
} from './burger-constructor-slice';

import { TIngredient, TConstructorIngredient } from '@utils-types';

const bun: TIngredient = {
  _id: 'testBun',
  name: 'Флюоресцентная булка R2-D3',
  type: 'bun',
  proteins: 44,
  fat: 26,
  carbohydrates: 85,
  calories: 643,
  price: 988,
  image: 'https://code.s3.yandex.net/react/code/bun-01.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png'
};

const main: TIngredient = {
  _id: 'testMain',
  name: 'Говяжий метеорит (отбивная)',
  type: 'main',
  proteins: 800,
  fat: 800,
  carbohydrates: 300,
  calories: 2674,
  price: 3000,
  image: 'https://code.s3.yandex.net/react/code/meat-04.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-04-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-04-large.png'
};

const sauce: TIngredient = {
  _id: 'testSauce',
  name: 'Соус фирменный Space Sauce',
  type: 'sauce',
  proteins: 50,
  fat: 22,
  carbohydrates: 11,
  calories: 14,
  price: 80,
  image: 'https://code.s3.yandex.net/react/code/sauce-04.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/sauce-04-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/sauce-04-large.png'
};

describe('burgerConstructo reducer', () => {
  test('добавление ингредиентов', () => {
    let state = burgerConstructoReducer(undefined, addIngredient(bun));
    state = burgerConstructoReducer(state, addIngredient(main));
    state = burgerConstructoReducer(state, addIngredient(sauce));

    expect(state.bun?.name).toBe(bun.name);
    expect(state.ingredients).toHaveLength(2);
    expect(state.ingredients[0].name).toBe(main.name);
    expect(typeof state.ingredients[1].id).toBe('string');
  });

  test('удаление ингредиента по id', () => {
    let state = burgerConstructoReducer(undefined, addIngredient(bun));
    state = burgerConstructoReducer(state, addIngredient(main));
    state = burgerConstructoReducer(state, addIngredient(sauce));
    const sauceId = state.ingredients[0].id;
    state = burgerConstructoReducer(state, deleteIngredient(sauceId));

    expect(state.ingredients).toHaveLength(1);
  });

  test('изменение порядка ингредиентов', () => {
    let state = burgerConstructoReducer(undefined, addIngredient(bun));
    state = burgerConstructoReducer(state, addIngredient(main));
    state = burgerConstructoReducer(state, addIngredient(sauce));
    state = burgerConstructoReducer(state, addIngredient(sauce));
    state = burgerConstructoReducer(state, addIngredient(main));
    const ingredientId0 = state.ingredients[0].id;
    const ingredientId1 = state.ingredients[1].id;
    const ingredientId2 = state.ingredients[2].id;
    const ingredientId3 = state.ingredients[3].id;

    state = burgerConstructoReducer(
      state,
      changeIngredient({ before: 0, after: 2 })
    );

    expect(state.ingredients[2].id).toBe(ingredientId0);
    expect(state.ingredients[0].id).toBe(ingredientId1);
    expect(state.ingredients[1].id).toBe(ingredientId2);
    expect(state.ingredients[3].id).toBe(ingredientId3);

    state = burgerConstructoReducer(
      state,
      changeIngredient({ before: 2, after: 0 })
    );

    expect(state.ingredients[0].id).toBe(ingredientId0);
    expect(state.ingredients[1].id).toBe(ingredientId1);
    expect(state.ingredients[2].id).toBe(ingredientId2);
    expect(state.ingredients[3].id).toBe(ingredientId3);
  });
});
