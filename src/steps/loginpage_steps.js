import { Given, When, Then } from '@cucumber/cucumber';
import { loginpage } from '../pages/loginpage.js';

/** @typedef {import('../support/hooks.js').CustomWorld} World */

Given('I open the login page', /** @this {World} */ async function () {
  try {
    this.loginPage = new loginpage(this.page);
    await this.loginPage.navigate_to_login_Url();
    await this.attach('Navigated to Login Page', 'text/plain');
  } catch (err) {
    console.error('Step failed:', err.message);
    await this.attach('Step failed: ' + err.message, 'text/plain');
    throw err;
  }
});

When('I login with valid credentials', /** @this {World} */ async function () {
  try {
    await this.loginPage.login('5432154321', '12345');
    await this.attach('Logged in successfully', 'text/plain');
  } catch (err) {
    console.error('Step failed:', err.message);
    await this.attach('Step failed: ' + err.message, 'text/plain');
    throw err;
  }
});

Then('I should see the dashboard', /** @this {World} */ async function () {
  try {
    await this.loginPage.verify_dashboard_page();
    await this.attach('Dashboard page verified', 'text/plain');
  } catch (err) {
    console.error('Step failed:', err.message);
    await this.attach('Step failed: ' + err.message, 'text/plain');
    throw err;
  }
});
