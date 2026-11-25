import { expect, test } from '@playwright/test';
import {
  SauceDemoCartPage,
  SauceDemoCheckoutPage,
  SauceDemoInventoryPage,
  SauceDemoLoginPage,
  SauceDemoMenu,
} from '../../pages/sauceDemoPages';

const credentials = {
  standardUser: 'standard_user',
  lockedOutUser: 'locked_out_user',
  password: 'secret_sauce',
};

const productNames = [
  'Sauce Labs Backpack',
  'Sauce Labs Bike Light',
  'Sauce Labs Bolt T-Shirt',
  'Sauce Labs Fleece Jacket',
  'Sauce Labs Onesie',
  'Test.allTheThings() T-Shirt (Red)',
];

async function logIn(page: import('@playwright/test').Page) {
  const loginPage = new SauceDemoLoginPage(page);
  await loginPage.goto();
  await loginPage.login(credentials.standardUser, credentials.password);
}

async function addBackpackAndStartCheckout(page: import('@playwright/test').Page) {
  const inventoryPage = new SauceDemoInventoryPage(page);
  await inventoryPage.addProduct('Sauce Labs Backpack');
  await inventoryPage.openCart();
  await new SauceDemoCartPage(page).checkoutButton.click();
}

test.describe('SauceDemo UI', { tag: '@ui' }, () => {
  test('standard user can log in and see the product catalog', async ({ page }) => {
    await logIn(page);

    const inventoryPage = new SauceDemoInventoryPage(page);
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(inventoryPage.heading).toBeVisible();
    await expect(inventoryPage.productCards).toHaveCount(6);
  });

  test('invalid credentials show a login error', async ({ page }) => {
    const loginPage = new SauceDemoLoginPage(page);
    await loginPage.goto();
    await loginPage.login('unknown_user', 'wrong_password');

    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(loginPage.errorMessage).toContainText(
      'Username and password do not match any user in this service'
    );
  });

  test('username is required to log in', async ({ page }) => {
    const loginPage = new SauceDemoLoginPage(page);
    await loginPage.goto();
    await loginPage.login('', credentials.password);

    await expect(loginPage.errorMessage).toContainText('Username is required');
  });

  test('password is required to log in', async ({ page }) => {
    const loginPage = new SauceDemoLoginPage(page);
    await loginPage.goto();
    await loginPage.login(credentials.standardUser, '');

    await expect(loginPage.errorMessage).toContainText('Password is required');
  });

  test('locked-out user is prevented from logging in', async ({ page }) => {
    const loginPage = new SauceDemoLoginPage(page);
    await loginPage.goto();
    await loginPage.login(credentials.lockedOutUser, credentials.password);

    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(loginPage.errorMessage).toContainText('locked out');
  });

  test('inventory displays the expected products and prices', async ({ page }) => {
    await logIn(page);

    const inventoryPage = new SauceDemoInventoryPage(page);
    await expect(inventoryPage.productNames).toHaveText(productNames);
    await expect(inventoryPage.productPrices).toHaveText([
      '$29.99',
      '$9.99',
      '$15.99',
      '$49.99',
      '$7.99',
      '$15.99',
    ]);
  });

  test('products can be sorted by each supported order', async ({ page }) => {
    await logIn(page);

    const inventoryPage = new SauceDemoInventoryPage(page);
    const expectedBySort = [
      {
        value: 'za',
        names: [...productNames].reverse(),
      },
      {
        value: 'lohi',
        prices: ['$7.99', '$9.99', '$15.99', '$15.99', '$29.99', '$49.99'],
      },
      {
        value: 'hilo',
        prices: ['$49.99', '$29.99', '$15.99', '$15.99', '$9.99', '$7.99'],
      },
      {
        value: 'az',
        names: productNames,
      },
    ];

    for (const order of expectedBySort) {
      await inventoryPage.sortSelect.selectOption(order.value);
      if (order.names) {
        await expect(inventoryPage.productNames).toHaveText(order.names);
      }
      if (order.prices) {
        await expect(inventoryPage.productPrices).toHaveText(order.prices);
      }
    }
  });

  test('product details can be opened and returned from', async ({ page }) => {
    await logIn(page);

    const inventoryPage = new SauceDemoInventoryPage(page);
    await inventoryPage.openProduct('Sauce Labs Backpack');
    await expect(page.locator('.inventory_details_name')).toHaveText('Sauce Labs Backpack');
    await expect(page.locator('.inventory_details_desc')).toContainText('carry.allTheThings');
    await expect(page.locator('.inventory_details_price')).toHaveText('$29.99');
    await page.getByRole('button', { name: 'Back to products' }).click();
    await expect(page).toHaveURL(/\/inventory\.html$/);
  });

  test('adding a product updates the cart badge and contents', async ({ page }) => {
    await logIn(page);

    const inventoryPage = new SauceDemoInventoryPage(page);
    await inventoryPage.addProduct('Sauce Labs Backpack');
    await expect(inventoryPage.cartBadge).toHaveText('1');
    await inventoryPage.openCart();

    const cartPage = new SauceDemoCartPage(page);
    await expect(cartPage.itemNames).toHaveText(['Sauce Labs Backpack']);
    await expect(cartPage.item('Sauce Labs Backpack').locator('.cart_quantity')).toHaveText('1');
    await expect(cartPage.item('Sauce Labs Backpack').locator('.inventory_item_price')).toHaveText('$29.99');
  });

  test('multiple products can be added to the cart', async ({ page }) => {
    await logIn(page);

    const inventoryPage = new SauceDemoInventoryPage(page);
    await inventoryPage.addProduct('Sauce Labs Backpack');
    await inventoryPage.addProduct('Sauce Labs Bike Light');
    await expect(inventoryPage.cartBadge).toHaveText('2');
    await inventoryPage.openCart();

    await expect(new SauceDemoCartPage(page).itemNames).toHaveText([
      'Sauce Labs Backpack',
      'Sauce Labs Bike Light',
    ]);
  });

  test('removing a cart item updates cart contents', async ({ page }) => {
    await logIn(page);

    const inventoryPage = new SauceDemoInventoryPage(page);
    await inventoryPage.addProduct('Sauce Labs Backpack');
    await inventoryPage.openCart();
    const cartPage = new SauceDemoCartPage(page);
    await cartPage.removeItem('Sauce Labs Backpack');

    await expect(cartPage.cartItems).toHaveCount(0);
    await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
  });

  test('continue shopping returns to inventory without losing the cart', async ({ page }) => {
    await logIn(page);

    const inventoryPage = new SauceDemoInventoryPage(page);
    await inventoryPage.addProduct('Sauce Labs Backpack');
    await inventoryPage.openCart();
    await new SauceDemoCartPage(page).continueShoppingButton.click();

    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test('checkout requires a first name', async ({ page }) => {
    await logIn(page);
    await addBackpackAndStartCheckout(page);
    const checkoutPage = new SauceDemoCheckoutPage(page);
    await checkoutPage.lastNameInput.fill('Tester');
    await checkoutPage.postalCodeInput.fill('12345');
    await checkoutPage.continueButton.click();

    await expect(checkoutPage.errorMessage).toContainText('First Name is required');
    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
  });

  test('checkout requires a last name', async ({ page }) => {
    await logIn(page);
    await addBackpackAndStartCheckout(page);
    const checkoutPage = new SauceDemoCheckoutPage(page);
    await checkoutPage.firstNameInput.fill('Demo');
    await checkoutPage.postalCodeInput.fill('12345');
    await checkoutPage.continueButton.click();

    await expect(checkoutPage.errorMessage).toContainText('Last Name is required');
    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
  });

  test('checkout requires a postal code', async ({ page }) => {
    await logIn(page);
    await addBackpackAndStartCheckout(page);
    const checkoutPage = new SauceDemoCheckoutPage(page);
    await checkoutPage.firstNameInput.fill('Demo');
    await checkoutPage.lastNameInput.fill('Tester');
    await checkoutPage.continueButton.click();

    await expect(checkoutPage.errorMessage).toContainText('Postal Code is required');
    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
  });

  test('checkout can be cancelled without losing the cart', async ({ page }) => {
    await logIn(page);
    await addBackpackAndStartCheckout(page);
    await new SauceDemoCheckoutPage(page).cancelButton.click();

    await expect(page).toHaveURL(/\/cart\.html$/);
    await expect(new SauceDemoCartPage(page).itemNames).toHaveText(['Sauce Labs Backpack']);
  });

  test('a complete purchase displays the order confirmation', async ({ page }) => {
    await logIn(page);
    await addBackpackAndStartCheckout(page);

    const checkoutPage = new SauceDemoCheckoutPage(page);
    await checkoutPage.enterCustomerInformation('Demo', 'Tester', '12345');
    await checkoutPage.continueButton.click();
    await expect(checkoutPage.summaryItems.locator('.inventory_item_name')).toHaveText([
      'Sauce Labs Backpack',
    ]);
    await expect(checkoutPage.subtotal).toHaveText('Item total: $29.99');
    await expect(checkoutPage.total).toHaveText('Total: $32.39');
    await checkoutPage.finishButton.click();

    await expect(checkoutPage.confirmationHeading).toHaveText('Thank you for your order!');
    await expect(page.getByText('Your order has been dispatched', { exact: false })).toBeVisible();
  });

  test('logging out prevents access to inventory', async ({ page }) => {
    await logIn(page);
    await new SauceDemoMenu(page).logout();

    const loginPage = new SauceDemoLoginPage(page);
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(loginPage.loginButton).toBeVisible();
    await page.goto('https://www.saucedemo.com/inventory.html');
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(loginPage.loginButton).toBeVisible();
  });
});
