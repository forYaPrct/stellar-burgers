const INGREDIENTS = {
  BUN: 'Флюоресцентная булка R2-D3',
  MAIN: 'Говяжий метеорит (отбивная)',
  SAUCE: 'Соус фирменный Space Sauce'
};

const BUTTONS = {
  ADD: 'Добавить',
  ORDER: 'Оформить заказ'
};

describe('проверяем работу страницы конструктора бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.intercept('GET', '**/api/auth/user', {
      fixture: 'user.json'
    }).as('getUser');

    cy.intercept('POST', '**/api/orders', {
      fixture: 'order.json'
    }).as('createOrder');

    cy.visit('/');
    cy.wait('@getIngredients');

    cy.contains('button', BUTTONS.ORDER)
      .closest('section')
      .as('burgerConstructorSection');
  });

  const addIngredient = (name) => {
    cy.contains('li', name).contains('button', BUTTONS.ADD).click();
  };

  it('ингридиенты из списка добавляются в конструктор', () => {
    addIngredient(INGREDIENTS.BUN);
    addIngredient(INGREDIENTS.MAIN);
    addIngredient(INGREDIENTS.SAUCE);

    cy.get('@burgerConstructorSection').within(() => {
      cy.contains(`${INGREDIENTS.BUN} (верх)`).should('exist');
      cy.contains(`${INGREDIENTS.BUN} (низ)`).should('exist');
      cy.contains(INGREDIENTS.MAIN).should('exist');
      cy.contains(INGREDIENTS.SAUCE).should('exist');
    });
  });

  it('модальное окно открывается и закрывается при клике на крестик', () => {
    cy.contains('a', INGREDIENTS.MAIN).click();

    cy.get('#modals').contains('Белки, г').should('be.visible');
    cy.get('#modals').contains(INGREDIENTS.MAIN).should('be.visible');

    cy.get('#modals').find('svg').closest('button').click();
  });

  it('создается заказ, открывается модальное окно с номером заказа и очищается конструктор', () => {
    cy.visit('/');

    cy.setCookie('accessToken', 'testAccessToken');
    cy.window().then((window) => {
      window.localStorage.setItem('refreshToken', 'testRefreshToken');
    });

    cy.wait('@getUser');

    addIngredient(INGREDIENTS.BUN);
    addIngredient(INGREDIENTS.MAIN);
    addIngredient(INGREDIENTS.SAUCE);

    cy.contains('button', BUTTONS.ORDER).click();
    cy.wait('@createOrder');

    cy.contains('104789').should('exist');
    cy.contains('Ваш заказ начали готовить').should('exist');

    cy.get('#modals').find('svg').closest('button').click();
    cy.contains('Ваш заказ начали готовить').should('not.exist');

    cy.contains('Выберите начинку').should('exist');

    cy.get('div:contains("Выберите булки")')
      .not(':has(*:contains("Выберите булки"))')
      .should('have.length', 2);

    cy.clearCookie('accessToken');
    cy.window().then((win) => {
      win.localStorage.removeItem('refreshToken');
    });
  });
});
