import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { loginpage } from '../pages/loginpage.js';


Given('I open the login page', async function () {
  try {
    this.loginPage = new loginpage(this.page);
    await this.loginPage.navigate_to_login_Url();
    await this.attach('Navigated to Login Page', 'text/plain');
  } catch (err) {
    console.error('Step failed:', err.message);
    await this.attach('Step failed: ' + err.message, 'text/plain');
  }
});

When('I login with valid credentials', async function () {
  try {
    await this.loginPage.login('5432154321', '12345');
    await this.attach('Logged in successfully', 'text/plain');
  } catch (err) {
    console.error('Step failed:', err.message);
    await this.attach('Step failed: ' + err.message, 'text/plain');
  }
});

Then('I should see the dashboard', async function () {
  try {
    await this.loginPage.verify_dashboard_page();
    await this.attach('Dashboard page verified', 'text/plain');
  } catch (err) {
    console.error('Step failed:', err.message);
    await this.attach('Step failed: ' + err.message, 'text/plain');
  }
});
