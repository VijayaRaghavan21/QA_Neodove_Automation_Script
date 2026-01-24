import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { Campaigncreation } from '../pages/Campaigncreation.js';
import { AUTOMATION_CONSTANTS } from '../enums/enum.js';

Given('Choosing the Pipeline where to Create the Campaign', async function() {
  try {
    this.campaigncreation = new Campaigncreation(this.page);

    await this.campaigncreation.select_pipeline_for_campaign_creation();
    await this.attach('Pipeline Selected for Campaign Creation', 'text/plain');
  } catch (err) {
    console.error('Step failed:', err.message);
    await this.attach('Step failed: ' + err.message, 'text/plain');
  }
});

When('Click on Create Campaign', async function () {
  try {
    this.campaigncreation = new Campaigncreation(this.page);

    await this.campaigncreation.create_new_campaign();
    await this.attach('Create Campaign Button Clicked', 'text/plain');
  } catch (err) {
    console.error('Step failed:', err.message);
    await this.attach('Step failed: ' + err.message, 'text/plain');
  }
});

When('Give the Name for Campaign', async function () {
  try {
    this.campaigncreation = new Campaigncreation(this.page);

    await this.campaigncreation.give_campaign_name(AUTOMATION_CONSTANTS.Campaign_name);
    await this.attach('Campaign Name Entered', 'text/plain');
  } catch (err) {
    console.error('Step failed:', err.message);
    await this.attach('Step failed: ' + err.message, 'text/plain');
  }
});

When ('Choosing the Users to assign inside the Campaign', async function () {
  try {
    this.campaigncreation = new Campaigncreation(this.page);

    await this.campaigncreation.select_users_for_campaign_creation();
    await this.attach('Users Selected for Campaign Creation', 'text/plain');
  } catch (err) {
    console.error('Step failed:', err.message);
    await this.attach('Step failed: ' + err.message, 'text/plain');
  }
});

When('Choosing the Lead Distribution type', async function () {
  try {
    this.campaigncreation = new Campaigncreation(this.page);

    await this.campaigncreation.select_lead_distribution_type();
    await this.attach('Lead Distribution Type Selected for Campaign Creation', 'text/plain');
  } catch (err) {
    console.error('Step failed:', err.message);
    await this.attach('Step failed: ' + err.message, 'text/plain');
  }
});

Then('Campaign should create successfully', async function () {
  try {
    this.campaigncreation = new Campaigncreation(this.page);    

    await this.campaigncreation.click_on_create_button();

    await this.campaigncreation.verify_campaign_creation();

    await this.attach('Campaign Created and Verified Successfully', 'text/plain');
  } catch (err) {
    console.error('Step failed:', err.message);
    await this.attach('Step failed: ' + err.message, 'text/plain');
  }
}

);

Given('Upload Leads After Campaign Creation', async function () {
  try {
    this.campaigncreation = new Campaigncreation(this.page);

    await this.campaigncreation.upload_leads_to_campaign();
    await this.attach('Leads Uploaded to Campaign Successfully', 'text/plain');
  } catch (err) {
    console.error('Step failed:', err.message);
    await this.attach('Step failed: ' + err.message, 'text/plain');
  }
});

When ('Mapping the Fields the with the Column in the excel', async function () {
  try {
    this.campaigncreation =new Campaigncreation(this.page);

    await this.campaigncreation.mapping_the_columns_for_uploading_leads();
    await this.attach('Mapping of Columns for Uploading Leads Completed Successfully', 'text/plain');
  } catch (err) {
    console.error('Step failed:', err.message);
    await this.attach('Step failed: ' + err.message, 'text/plain');
  }
});

Then ('Lead Should Upload successfully', async function () {

  try {

    this.campaigncreation = new Campaigncreation(this.page);

    await this.campaigncreation.verify_campaign_creation_for_lead_uploads();
    await this.attach('Leads Upload to Campaign Verified Successfully', 'text/plain');

  } catch (err) {

    console.error('Step failed:', err.message);

    await this.attach('Step failed: ' + err.message, 'text/plain');

  }  

}
);



