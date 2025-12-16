import { expect } from '@playwright/test';
import { AUTOMATION_CONSTANTS } from "../enums/enum.js";

export class Pipelinecreation {

    constructor(page) {

        this.page = page;

        // Locators
        this.settings_icon = "//span[contains(text(),'Settings')]";
        this.pipeline_tab = "//div[contains(text(),'Pipelines')]";
        this.create_pipeline_button = "//span[normalize-space()='Create Pipeline']";
        this.pipeline_name_input = "//div[contains(@class,'mat-form-field-infix') and .//mat-label[normalize-space() = 'Pipeline Name']]//input";  // FIXED
        this.save_pipeline_button = "//span[normalize-space()='Create']";
        this.pipeline_list = "//a[@id='nd-campaigns']//span[@class='mat-list-item-content']"; // FIXED
    }

    async navigate_to_pipeline_creation_page() {
        await this.page.click(this.settings_icon);
        await this.page.click(this.pipeline_tab);
    }

    async create_new_pipeline(pipeline_name) {

        await this.page.click(this.create_pipeline_button);

        const input = this.page.locator(this.pipeline_name_input);

        await input.click();
       await this.page.waitForTimeout(2000);
        await input.press('Control+A');
        await input.press('Delete');
        await input.fill(pipeline_name);

        await this.page.click(this.save_pipeline_button);
        await this.page.waitForTimeout(3000);
    }

    async pipeline_creation_verification() {

        await this.page.click(this.pipeline_list);

        await this.page.waitForTimeout(2000);

        await expect(
            this.page.locator(`//span[contains(text(),'${AUTOMATION_CONSTANTS.PIPELINE_NAME}')]`)
        ).toBeVisible();

        console.log("Pipeline created successfully and verified.");
    }
}