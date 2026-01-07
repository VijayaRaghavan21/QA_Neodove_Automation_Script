const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { loginpage } = require('../pages/loginpage');


Given('I open the login page', async function () {
    this.loginPage = new loginpage(this.page);
    await this.loginPage.navigate_to_login_Url();
    await this.attach('Navigated to Login Page', 'text/plain');


});

When('I login with valid credentials', async function () {
    await this.loginPage.login('5432154321', '12345');
    await this.attach('Logged in successfully', 'text/plain');



});

Then('I should see the dashboard', async function () {
    // Verify we're on the dashboard by checking for a dashboard-specific element

    await this.loginPage.verify_dashboard_page();
    await this.attach('Dashboard page verified', 'text/plain');


});
