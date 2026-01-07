export class loginpage{

    constructor (login_page){

        this.login_page =login_page;

        this.username="//input[@placeholder='Email/Phone Number']";

        this.password="//input[@placeholder='Password']";

        this.Enable_checkbox ="//span[@class='mat-checkbox-inner-container']";

        this.login_button ="//button[normalize-space()='Log in']";

        this.confirm_login ="//h2[text()='Confirm Login']";

        this.confirm_login_continue_button="//span[normalize-space()='Continue']"

        this.verify_dashboard ="//span[contains(text(),'Dashboard')]";

        
    }

    async navigate_to_login_Url (){

        await this.login_page.goto("https://connect.neodove.com/login");
    }

    async login(username,password){

        await this.login_page.fill(this.username,username);

        await this.login_page.fill(this.password,password);

        await this.login_page.click(this.Enable_checkbox);

        await this.login_page.click(this.login_button);

        const confirmLoginVisible = await this.login_page
        .locator(this.confirm_login)
        .waitFor({ state: 'visible', timeout: 60000 }) 
        .then(() => true)
        .catch(() => false);
        
        if (confirmLoginVisible) {
            await this.login_page
                .locator(this.confirm_login_continue_button)
                .click({ timeout: 60000 });
            console.log("Clicked the confirm login pop-up Continue button");
        } else {
            console.log("No confirm login pop-up, login successful");
        }

    }

    async verify_dashboard_page(){

        const dashboard_visible =await this.login_page
        .locator(this.verify_dashboard)
        .waitFor({ state: 'visible', timeout: 60000 })
        .then(() => true)
        .catch(() => false);

        if (dashboard_visible) {
            console.log("Successfully Logged in and Dashboard is Displayed Successfully");
        } else {
            console.error("Dashboard not visible within timeout period");
            throw new Error("Dashboard not visible within 60 seconds");
        }
    }


}