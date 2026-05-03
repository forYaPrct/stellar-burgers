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
    cy.contains('button', 'Оформить заказ')
      .closest('section')
      .as('burgerConstructorSection');
  });

  it('ингридиенты из списка добавляются в конструктор', () => {
    cy.contains('li', 'Флюоресцентная булка R2-D3')
      .contains('button', 'Добавить')
      .click();
    cy.contains('li', 'Говяжий метеорит (отбивная)')
      .contains('button', 'Добавить')
      .click();
    cy.contains('li', 'Соус фирменный Space Sauce')
      .contains('button', 'Добавить')
      .click();

    cy.get('@burgerConstructorSection').within(() => {
      cy.contains('Флюоресцентная булка R2-D3 (верх)').should('exist');
      cy.contains('Флюоресцентная булка R2-D3 (низ)').should('exist');
      cy.contains('Говяжий метеорит (отбивная)').should('exist');
      cy.contains('Соус фирменный Space Sauce').should('exist');
    });
  });

  it('модальное окно открывается и закрывается при клике на крестик', () => {
    cy.contains('a', 'Говяжий метеорит (отбивная)').click();
    cy.get('#modals').contains('Белки, г').should('be.visible');
    cy.get('#modals')
      .contains('Говяжий метеорит (отбивная)')
      .should('be.visible');

    cy.get('#modals').find('svg').closest('button').click();
  });

  it('создается заказ, открывается модальное окно с номером заказа и очищается конструктор', () => {
    cy.visit('/');
    cy.setCookie('accessToken', 'testAccessToken');
    cy.window().then((window) => {
      window.localStorage.setItem('refreshToken', 'testRefreshToken');
    });

    cy.wait('@getUser');

    cy.contains('li', 'Флюоресцентная булка R2-D3')
      .contains('button', 'Добавить')
      .click();
    cy.contains('li', 'Говяжий метеорит (отбивная)')
      .contains('button', 'Добавить')
      .click();
    cy.contains('li', 'Соус фирменный Space Sauce')
      .contains('button', 'Добавить')
      .click();

    cy.contains('button', 'Оформить заказ').click();
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
