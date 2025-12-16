import { expect } from '@playwright/test';
import { AUTOMATION_CONSTANTS } from "../enums/enum.js";
import path from "path";

export class Campaigncreation {
    constructor(page) {

        this.page = page;

        //locators for create Campaign

        //Choosing the pipeline 

        this.select_pipeline_list = "//a[@id='nd-campaigns']//span[@class='mat-list-item-content']";

        //selecting the pipleine from the list

        this.select_pipeline = `//span[contains(text(),'${AUTOMATION_CONSTANTS.PIPELINE_NAME}')]`;


        //locators for create Campaign

        this.create_campaign_button = "//span[normalize-space()='Create Campaign']";

        this.campaign_name_input_field = "//input[@matinput and contains(@class,'mat-input-element')]";

        this.select_agents = "(//input[contains(@class,'mat-chip-input') and contains(@class,'mat-autocomplete-trigger')])[2]";

        this.select_agent_name = `//span[@class='mat-option-text' and contains(.,'${AUTOMATION_CONSTANTS.Agent_Name}')]`;

        //Locators for lead distribution type

        this.selecting_lead_distribution_type = `//div[normalize-space()='${AUTOMATION_CONSTANTS.Campaign_lead_distribution_type}']`;

        //Create button in Campaign creation dialog box

        this.Campaign_create_button = "//button[normalize-space()='Create']";

        //campagin creation verification message
        this.campaign_creation_success_message = `//span[contains(@class,'alert-message') and contains(text(),'Campaign Saved!')]`;

        //Locators for Upload Leads
        this.upload_leads_button = "//span[normalize-space()='Upload Leads']";

        this.broswer_file_button = "//span[normalize-space()='Browse']";

        // Continue button

      //   this.continue_button = "//span[normalize-space()='Continue']";   -- it is not required beacuse after uploading itself , it will redirect to the next page

        // Locators for mapping the  contact name

        this.mapping_the_column_Contact_name = "//label[normalize-space()='Contact name']/following::div[contains(@class,'mat-select-value')][1]";

        this.select_name_column = "//span[normalize-space()='Name']";

        //Locators for mapping the phone number

        this.mapping_the_column_Phone_number = "//label[normalize-space()='Primary contact number']/following::div[contains(@id,'mat-select-value')][1]";

        this.select_phone_number_column = "//span[normalize-space()='Phone Number']";

        //Locator for mapping the email address(optional - )

        this.mapping_the_email_address_column = "//label[normalize-space()='Email address']/following::div[contains(@id,'mat-select-value')][1]";

        this.select_email_address_column = "//span[contains(@class, 'mat-select-min-line') and text()='Email']";

        this.select_next_button_for_lead_upload = "//span[@class='mat-button-wrapper' and contains(normalize-space(text()), 'Next')]";

        // Submit button

        this.sumbit_button_for_lead_upload = this.page.getByRole('button', { name: 'Submit' });

        //verification after upload

        this.dialog_box_after_file_upload = this.page.getByRole('dialog', { name: 'Almost there...' });

        this.ok_button = this.page.getByRole('button', { name: 'Ok' });

        // verify total lead uploaded in campaign

        this.total_leads = "await page.getByText('TOTAL').first()";

    }


    async select_pipeline_for_campaign_creation() {

        await this.page.click(this.select_pipeline_list);
        await this.page.click(this.select_pipeline);
        await this.page.waitForTimeout(2000);
        console.log("Pipeline selected for Campaign creation");
    }

    async create_new_campaign() {

        await this.page.click(this.create_campaign_button);
        await this.page.waitForTimeout(2000);
        console.log("Create Campaign button clicked");
    }

    async give_campaign_name(Campaign_name) {

        const input = this.page.locator(this.campaign_name_input_field);
        await input.click();
        await this.page.waitForTimeout(2000);
        await input.press('Control+A');
        await input.press('Delete');
        await input.fill(Campaign_name);
        console.log("Campaign name entered");



    }
    async select_users_for_campaign_creation() {

        await this.page.click(this.select_agents);
        await this.page.click(this.select_agent_name);
        console.log("Agent selected for Campaign creation");
    }

    async select_lead_distribution_type() {

        await this.page.click(this.selecting_lead_distribution_type);
        console.log("Lead Distribution type selected for Campaign creation");
    }


    async click_on_create_button() {

        await this.page.click(this.Campaign_create_button);
        console.log("Create button clicked in Campaign creation dialog box");
    }


    async verify_campaign_creation() {
        const success_message = await this.page.locator(this.campaign_creation_success_message).innerText();
        expect(success_message).toContain('Campaign Saved!');
        console.log("Campaign created successfully and verified.");
    }

    async upload_leads_to_campaign() {

        const filePath = path.join(
            process.cwd(),
            "src",
            "test_files_data",
            "TestFile_Upload_Leads.xlsx"
        );

        // 1. Click "Upload Leads" button
    await this.page.click(this.upload_leads_button);
    await this.page.waitForTimeout(1000);

     // Click "Upload Leads"
    // await this.page.click(this.broswer_file_button);
    // await this.page.waitForTimeout(1000);

    // File input (it is hidden but that is OK)
    const fileInput = this.page.locator("input[type='file']");

    // Upload file directly, no need for visibility
    await fileInput.setInputFiles(filePath);

    await this.page.waitForTimeout(1000);
        //await this.page.click(this.continue_button);
        console.log("Leads uploaded to Campaign successfully.");

        await this.page.waitForTimeout(3000);
    }

    async mapping_the_columns_for_uploading_leads() {


        //Mapping Contact Name

        await this.page.click(this.mapping_the_column_Contact_name);

        await this.page.click(this.select_name_column);

        //mapping Phone Number
        await this.page.click(this.mapping_the_column_Phone_number);

        await this.page.click(this.select_phone_number_column);

        //Mapping Email Address(optional)

        // await this.page.click(this.mapping_the_email_address_column);
        // await this.page.click(this.select_email_address_column);
        await this.page.waitForTimeout(2000);
        await this.page.click(this.select_next_button_for_lead_upload);
        await this.sumbit_button_for_lead_upload.click();
        
        console.log("Fields mapped with excel columns for uploading leads successfully.");

    }

    async verify_campaign_creation_for_lead_uploads() {

    await expect(this.dialog_box_after_file_upload).toBeVisible();
    await expect(this.dialog_box_after_file_upload).toContainText("Almost there...");

    console.log("Lead upload to Campaign verified successfully.");

    await this.ok_button.click();

    await this.page.reload();

    await this.page.waitForTimeout(3000);

}

}

