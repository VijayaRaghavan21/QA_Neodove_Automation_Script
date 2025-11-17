import { expect } from '@playwright/test';
import { AUTOMATION_CONSTANTS } from "../enums/enum.js";

export class PipelineScenarios {

    constructor(page) {

        this.page = page;

        // Locators
        this.settings_icon = "//span[contains(text(),'Settings')]";
        this.pipeline_tab = "//div[contains(text(),'Pipelines')]";
        this.choose_pipeline_from_list = "(//div[contains(@class, 'mat-select-arrow')])[1]";
        this.select_pipeline =
            `//mat-option//span[contains(@class, 'mat-option-text') 
                and normalize-space(text())='${AUTOMATION_CONSTANTS.PIPELINE_NAME}']`;

        this.edit_pipeline_button = "//span[normalize-space()='Edit']";
        this.update_pipeline_button = "//span[normalize-space()='UPDATE']";
        this.pipeline_update_success_message =
            "//span[@class='alert-message' and contains(text(), 'Pipeline updated successfully.')]";
    }


    async edit_existing_pipeline() {

        await this.page.click(this.settings_icon);
        await this.page.click(this.pipeline_tab);
        await this.page.click(this.choose_pipeline_from_list);
        await this.page.click(this.select_pipeline);

        await this.page.waitForTimeout(2000);

        await this.page.click(this.edit_pipeline_button);
        await this.page.waitForTimeout(2000);

        await this.page.click(this.update_pipeline_button);
        await this.page.waitForTimeout(2000);

        const successMessage =
            await this.page.locator(this.pipeline_update_success_message).innerText();

        expect(successMessage).toContain("Pipeline updated successfully.");

        console.log("Pipeline updated successfully verified.");
    }
}
