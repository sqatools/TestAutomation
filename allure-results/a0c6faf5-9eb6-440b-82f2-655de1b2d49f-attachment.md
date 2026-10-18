# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: saucedemo\saucedemo.spec.ts >> SauceDemo UI >> continue shopping returns to inventory without losing the cart
- Location: tests\saucedemo\saucedemo.spec.ts:171:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByTestId('username')

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e4]: Swag Labs
  - main [ref=e5]:
    - form "Login" [ref=e9]:
      - textbox "Username" [ref=e11]
      - textbox "Password" [ref=e13]
      - button "Login" [ref=e15] [cursor=pointer]
    - generic [ref=e17]:
      - generic [ref=e18]:
        - heading "Accepted usernames are:" [level=4] [ref=e19]
        - text: standard_user
        - text: locked_out_user
        - text: problem_user
        - text: performance_glitch_user
        - text: error_user
        - text: visual_user
      - generic [ref=e20]:
        - heading "Password for all users:" [level=4] [ref=e21]
        - text: secret_sauce
```

# Test source

```ts
  1   | import type { Locator, Page } from '@playwright/test';
  2   | 
  3   | export class SauceDemoLoginPage {
  4   |   readonly page: Page;
  5   |   readonly usernameInput: Locator;
  6   |   readonly passwordInput: Locator;
  7   |   readonly loginButton: Locator;
  8   |   readonly errorMessage: Locator;
  9   | 
  10  |   constructor(page: Page) {
  11  |     this.page = page;
  12  |     this.usernameInput = page.getByTestId('username');
  13  |     this.passwordInput = page.getByTestId('password');
  14  |     this.loginButton = page.getByTestId('login-button');
  15  |     this.errorMessage = page.getByTestId('error');
  16  |   }
  17  | 
  18  |   async goto() {
  19  |     await this.page.goto('https://www.saucedemo.com/');
  20  |   }
  21  | 
  22  |   async login(username: string, password: string) {
> 23  |     await this.usernameInput.fill(username);
      |                              ^ Error: locator.fill: Test timeout of 30000ms exceeded.
  24  |     await this.passwordInput.fill(password);
  25  |     await this.loginButton.click();
  26  |   }
  27  | }
  28  | 
  29  | export class SauceDemoInventoryPage {
  30  |   readonly page: Page;
  31  |   readonly heading: Locator;
  32  |   readonly productCards: Locator;
  33  |   readonly productNames: Locator;
  34  |   readonly productPrices: Locator;
  35  |   readonly sortSelect: Locator;
  36  |   readonly cartLink: Locator;
  37  |   readonly cartBadge: Locator;
  38  | 
  39  |   constructor(page: Page) {
  40  |     this.page = page;
  41  |     this.heading = page.getByText('Products', { exact: true });
  42  |     this.productCards = page.locator('.inventory_item');
  43  |     this.productNames = page.locator('.inventory_item_name');
  44  |     this.productPrices = page.locator('.inventory_item_price');
  45  |     this.sortSelect = page.getByTestId('product-sort-container');
  46  |     this.cartLink = page.locator('.shopping_cart_link');
  47  |     this.cartBadge = page.locator('.shopping_cart_badge');
  48  |   }
  49  | 
  50  |   productCard(name: string) {
  51  |     return this.productCards.filter({ has: this.page.getByText(name, { exact: true }) });
  52  |   }
  53  | 
  54  |   async addProduct(name: string) {
  55  |     await this.productCard(name).getByRole('button', { name: 'Add to cart' }).click();
  56  |   }
  57  | 
  58  |   async openProduct(name: string) {
  59  |     await this.productCard(name).getByRole('link', { name }).click();
  60  |   }
  61  | 
  62  |   async openCart() {
  63  |     await this.cartLink.click();
  64  |   }
  65  | }
  66  | 
  67  | export class SauceDemoCartPage {
  68  |   readonly page: Page;
  69  |   readonly cartItems: Locator;
  70  |   readonly itemNames: Locator;
  71  |   readonly continueShoppingButton: Locator;
  72  |   readonly checkoutButton: Locator;
  73  | 
  74  |   constructor(page: Page) {
  75  |     this.page = page;
  76  |     this.cartItems = page.locator('.cart_item');
  77  |     this.itemNames = page.locator('.cart_item .inventory_item_name');
  78  |     this.continueShoppingButton = page.getByTestId('continue-shopping');
  79  |     this.checkoutButton = page.getByTestId('checkout');
  80  |   }
  81  | 
  82  |   item(name: string) {
  83  |     return this.cartItems.filter({ has: this.page.getByText(name, { exact: true }) });
  84  |   }
  85  | 
  86  |   async removeItem(name: string) {
  87  |     await this.item(name).getByRole('button', { name: 'Remove' }).click();
  88  |   }
  89  | }
  90  | 
  91  | export class SauceDemoCheckoutPage {
  92  |   readonly page: Page;
  93  |   readonly firstNameInput: Locator;
  94  |   readonly lastNameInput: Locator;
  95  |   readonly postalCodeInput: Locator;
  96  |   readonly continueButton: Locator;
  97  |   readonly cancelButton: Locator;
  98  |   readonly errorMessage: Locator;
  99  |   readonly summaryItems: Locator;
  100 |   readonly subtotal: Locator;
  101 |   readonly total: Locator;
  102 |   readonly finishButton: Locator;
  103 |   readonly confirmationHeading: Locator;
  104 | 
  105 |   constructor(page: Page) {
  106 |     this.page = page;
  107 |     this.firstNameInput = page.getByTestId('firstName');
  108 |     this.lastNameInput = page.getByTestId('lastName');
  109 |     this.postalCodeInput = page.getByTestId('postalCode');
  110 |     this.continueButton = page.getByTestId('continue');
  111 |     this.cancelButton = page.getByTestId('cancel');
  112 |     this.errorMessage = page.getByTestId('error');
  113 |     this.summaryItems = page.locator('.cart_item');
  114 |     this.subtotal = page.locator('.summary_subtotal_label');
  115 |     this.total = page.locator('.summary_total_label');
  116 |     this.finishButton = page.getByTestId('finish');
  117 |     this.confirmationHeading = page.locator('.complete-header');
  118 |   }
  119 | 
  120 |   async enterCustomerInformation(firstName: string, lastName: string, postalCode: string) {
  121 |     await this.firstNameInput.fill(firstName);
  122 |     await this.lastNameInput.fill(lastName);
  123 |     await this.postalCodeInput.fill(postalCode);
```