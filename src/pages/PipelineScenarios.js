import { expect } from '@playwright/test';
import { AUTOMATION_CONSTANTS } from "../enums/enum.js";

export class PipelineScenarios {

    constructor(page) {

        this.page = page;

        this.settings_icon = "//span[contains(text(),'Settings')]";
        this.pipeline_tab = "//div[contains(text(),'Pipelines')]";
        this.choose_pipeline_from_list = "(//div[contains(@class, 'mat-select-arrow')])[1]";
        this.select_pipeline = `//mat-option//span[contains(@class, 'mat-option-text') and normalize-space(text())='${AUTOMATION_CONSTANTS.PIPELINE_NAME}']`;
        this.edit_pipeline_button = "//span[normalize-space()='Edit']";
        this.update_pipeline_button = "//span[normalize-space()='UPDATE']";
        this.pipeline_update_success_message = "//span[@class='alert-message' and contains(text(), 'Pipeline updated successfully.')]";
        this.pipeline_creation_error_message = "//span[@class='alert-message' and contains(text(), 'Pipeline already exists, kindly update the name and try again.')]";
        this.create_pipeline_button = "//span[normalize-space()='Create Pipeline']";
        this.pipeline_name_input = "//div[contains(@class,'mat-form-field-infix') and .//mat-label[normalize-space() = 'Pipeline Name']]//input";
        this.save_pipeline_button = "//span[normalize-space()='Create']";
        this.close_pipeline_dialog_box="//mat-icon[normalize-space()='close']";
        this.delete_pipeline_button = "//span[normalize-space()='Delete']";

    }

    async navigate_to_pipeline_page() {

        await this.page.click(this.settings_icon);
        await this.page.click(this.pipeline_tab);

        await this.page.waitForTimeout(3000);

    }


    async edit_existing_pipeline() {


        await this.page.click(this.choose_pipeline_from_list);
        await this.page.click(this.select_pipeline);

        await this.page.waitForTimeout(3000);
        await this.page.click(this.edit_pipeline_button);


    }

    async verify_pipeline_update_success() {
        await this.page.waitForTimeout(3000);
        await this.page.click(this.update_pipeline_button);

        await this.page.waitForTimeout(3000);

        const success_message = await this.page.locator(this.pipeline_update_success_message).innerText();
        expect(success_message).toContain('Pipeline updated successfully.');

        console.log('Pipeline updated successfully verified.');

    }


    async create_pipeline_with_existing_name(pipeline_name) {

        await this.page.click(this.create_pipeline_button);

        const input = this.page.locator(this.pipeline_name_input);

        await input.click();
        await this.page.waitForTimeout(2000);
        await input.press('Control+A');
        await input.press('Delete');
        await input.fill(pipeline_name);

       
    }

    async verify_existing_pipeline_error() {

        await this.page.click(this.save_pipeline_button);
        await this.page.waitForTimeout(3000);

        const error_message = await this.page.locator(this.pipeline_creation_error_message).innerText();
        expect(error_message).toContain('Pipeline already exists, kindly update the name and try again.');
        console.log("Pipeline creation with existing name error verified.");

        await this.page.waitForTimeout(3000);

        await this.page.click(this.close_pipeline_dialog_box);

        
}

async delete_existing_pipeline() {

    await this.page.click(this.delete_pipeline_button);

    await this.page.waitForTimeout(2000);

    await this.page.click(this.delete_pipeline_button);

    await this.page.waitForTimeout(3000);

    const expectedMessage = `Pipeline - ${AUTOMATION_CONSTANTS.PIPELINE_NAME} removed successfully.`;

    // Use proper variable interpolation in XPath
    const locator = this.page.locator(`//span[@class='alert-message' and contains(text(), "${expectedMessage}")]`);
    
    const deleteSuccessMessage = await locator.innerText();

    expect(deleteSuccessMessage).toContain(expectedMessage);

    console.log("Pipeline deleted successfully verified.");


}

}

