# SauceDemo UI Test Plan

## Application Overview

A prioritized end-to-end UI test plan for the public SauceDemo storefront, covering authentication, inventory browsing and sorting, cart behavior, checkout validation and purchase completion, and logout/session protection. All automated cases are tagged @ui for selective pipeline execution.

## Test Scenarios

### 1. Authentication

**Seed:** `tests/seed.spec.ts`

#### 1.1. Standard user can log in and see the product catalog

**File:** `tests/saucedemo/saucedemo.spec.ts`

**Steps:**
  1. Open https://www.saucedemo.com/ and sign in as standard_user with secret_sauce.
    - expect: The browser navigates to /inventory.html.
    - expect: The Products heading is visible and six inventory products are shown.

#### 1.2. Invalid credentials show a login error

**File:** `tests/saucedemo/saucedemo.spec.ts`

**Steps:**
  1. Submit an unrecognized username and password.
    - expect: Login remains visible.
    - expect: An error message indicates the username or password does not match.

#### 1.3. Username is required to log in

**File:** `tests/saucedemo/saucedemo.spec.ts`

**Steps:**
  1. Submit a password without a username.
    - expect: Login remains visible.
    - expect: A username-required validation message is shown.

#### 1.4. Password is required to log in

**File:** `tests/saucedemo/saucedemo.spec.ts`

**Steps:**
  1. Submit a username without a password.
    - expect: Login remains visible.
    - expect: A password-required validation message is shown.

#### 1.5. Locked-out user is prevented from logging in

**File:** `tests/saucedemo/saucedemo.spec.ts`

**Steps:**
  1. Submit locked_out_user with secret_sauce.
    - expect: The user remains on the login page.
    - expect: A locked-out error message is displayed.

### 2. Inventory

**Seed:** `tests/seed.spec.ts`

#### 2.1. Inventory displays the expected products and prices

**File:** `tests/saucedemo/saucedemo.spec.ts`

**Steps:**
  1. Log in as standard_user.
    - expect: All six expected SauceDemo products and prices are displayed.

#### 2.2. Products can be sorted by each supported order

**File:** `tests/saucedemo/saucedemo.spec.ts`

**Steps:**
  1. Select Name (Z to A), Price (low to high), Price (high to low), and Name (A to Z) in turn.
    - expect: Product names and prices follow the selected order each time.

#### 2.3. Product details can be opened and returned from

**File:** `tests/saucedemo/saucedemo.spec.ts`

**Steps:**
  1. Open the Sauce Labs Backpack details, verify its description and price, then return to products.
    - expect: The correct product details are visible.
    - expect: Back to products returns to /inventory.html.

### 3. Shopping cart

**Seed:** `tests/seed.spec.ts`

#### 3.1. Adding a product updates the cart badge and contents

**File:** `tests/saucedemo/saucedemo.spec.ts`

**Steps:**
  1. Add the Sauce Labs Backpack from inventory and open the cart.
    - expect: The cart badge shows 1.
    - expect: The cart contains the selected backpack with quantity 1 and its price.

#### 3.2. Multiple products can be added to the cart

**File:** `tests/saucedemo/saucedemo.spec.ts`

**Steps:**
  1. Add the Backpack and Bike Light and open the cart.
    - expect: Both selected products appear in the cart.
    - expect: The badge and item quantities are correct.

#### 3.3. Removing a cart item updates cart contents

**File:** `tests/saucedemo/saucedemo.spec.ts`

**Steps:**
  1. Add a product, remove it from the cart.
    - expect: The removed product is absent and the cart is empty.

#### 3.4. Continue shopping returns to inventory

**File:** `tests/saucedemo/saucedemo.spec.ts`

**Steps:**
  1. Add a product, open the cart, then choose Continue Shopping.
    - expect: The browser returns to /inventory.html.
    - expect: The previously added product remains in the cart badge.

### 4. Checkout

**Seed:** `tests/seed.spec.ts`

#### 4.1. Checkout requires a first name

**File:** `tests/saucedemo/saucedemo.spec.ts`

**Steps:**
  1. Add a product, start checkout, leave First Name empty, and continue.
    - expect: Checkout remains on the customer-information step.
    - expect: A first-name-required validation message is shown.

#### 4.2. Checkout requires a last name

**File:** `tests/saucedemo/saucedemo.spec.ts`

**Steps:**
  1. Add a product, start checkout, enter a first name and postal code, leave Last Name empty, and continue.
    - expect: Checkout remains on the customer-information step.
    - expect: A last-name-required validation message is shown.

#### 4.3. Checkout requires a postal code

**File:** `tests/saucedemo/saucedemo.spec.ts`

**Steps:**
  1. Add a product, start checkout, enter first and last names, leave Postal Code empty, and continue.
    - expect: Checkout remains on the customer-information step.
    - expect: A postal-code-required validation message is shown.

#### 4.4. Checkout can be cancelled without losing the cart

**File:** `tests/saucedemo/saucedemo.spec.ts`

**Steps:**
  1. Add a product, begin checkout, then cancel.
    - expect: The browser returns to the cart.
    - expect: The product remains in the cart.

#### 4.5. A complete purchase displays the order confirmation

**File:** `tests/saucedemo/saucedemo.spec.ts`

**Steps:**
  1. Add the Backpack, complete customer information, verify the order overview, and finish checkout.
    - expect: The order overview contains the selected product and correct totals.
    - expect: The completion page confirms the order.

### 5. Navigation and session

**Seed:** `tests/seed.spec.ts`

#### 5.1. Logging out prevents access to inventory

**File:** `tests/saucedemo/saucedemo.spec.ts`

**Steps:**
  1. Log in, use the side menu to log out, then attempt to navigate back to inventory.
    - expect: Logout returns to the login page.
    - expect: The inventory remains inaccessible until login.
