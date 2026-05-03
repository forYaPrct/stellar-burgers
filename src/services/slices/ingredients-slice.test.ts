import { TIngredient } from '@utils-types';
import ingredientsReducer, { getIngredients } from './ingredients-slice';

const ingredients: TIngredient[] = [
  {
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
  }
];

describe('ingredients reducer', () => {
  it('при начале запроса устанавливается флаг isLoading в true', () => {
    const state = ingredientsReducer(
      undefined,
      getIngredients.pending('fakeId')
    );

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeUndefined();
  });

  it('при успешном запросе записываются ингредиенты в store и устанавливается флаг isLoading в false', () => {
    const state = ingredientsReducer(
      undefined,
      getIngredients.fulfilled(ingredients, 'fakeId')
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBeUndefined();
    expect(state.ingredients).toEqual(ingredients);
  });

  it('при ошибке запроса записывается ошибка в store и устанавливается флаг isLoading в false', () => {
    const error = new Error('Network error');

    const state = ingredientsReducer(
      undefined,
      getIngredients.rejected(error, 'fakeId')
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Network error');
    expect(state.ingredients).toEqual([]);
  });
});
