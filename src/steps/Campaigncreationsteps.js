import { Given, When, Then } from '@cucumber/cucumber';
import { Campaigncreation } from '../pages/Campaigncreation.js';
import { AUTOMATION_CONSTANTS } from '../enums/enum.js';

/** @typedef {import('../support/hooks.js').CustomWorld} World */

Given('Choosing the Pipeline where to Create the Campaign', /** @this {World} */ async function() {
  try {
    this.campaigncreation = new Campaigncreation(this.page);

    await this.campaigncreation.select_pipeline_for_campaign_creation();
    await this.attach('Pipeline Selected for Campaign Creation', 'text/plain');
  } catch (err) {
    console.error('Step failed:', err.message);
    await this.attach('Step failed: ' + err.message, 'text/plain');
    throw err;
  }
});

When('Click on Create Campaign', /** @this {World} */ async function () {
  try {
    this.campaigncreation = new Campaigncreation(this.page);

    await this.campaigncreation.create_new_campaign();
    await this.attach('Create Campaign Button Clicked', 'text/plain');
  } catch (err) {
    console.error('Step failed:', err.message);
    await this.attach('Step failed: ' + err.message, 'text/plain');
    throw err;
  }
});

When('Give the Name for Campaign', /** @this {World} */ async function () {
  try {
    this.campaigncreation = new Campaigncreation(this.page);

    await this.campaigncreation.give_campaign_name(AUTOMATION_CONSTANTS.Campaign_name);
    await this.attach('Campaign Name Entered', 'text/plain');
  } catch (err) {
    console.error('Step failed:', err.message);
    await this.attach('Step failed: ' + err.message, 'text/plain');
    throw err;
  }
});

When ('Choosing the Users to assign inside the Campaign', /** @this {World} */ async function () {
  try {
    this.campaigncreation = new Campaigncreation(this.page);

    await this.campaigncreation.select_users_for_campaign_creation();
    await this.attach('Users Selected for Campaign Creation', 'text/plain');
  } catch (err) {
    console.error('Step failed:', err.message);
    await this.attach('Step failed: ' + err.message, 'text/plain');
    throw err;
  }
});

When('Choosing the Lead Distribution type', /** @this {World} */ async function () {
  try {
    this.campaigncreation = new Campaigncreation(this.page);

    await this.campaigncreation.select_lead_distribution_type();
    await this.attach('Lead Distribution Type Selected for Campaign Creation', 'text/plain');
  } catch (err) {
    console.error('Step failed:', err.message);
    await this.attach('Step failed: ' + err.message, 'text/plain');
    throw err;
  }
});

Then('Campaign should create successfully', /** @this {World} */ async function () {
  try {
    this.campaigncreation = new Campaigncreation(this.page);

    await this.campaigncreation.click_on_create_button();

    await this.campaigncreation.verify_campaign_creation();

    await this.attach('Campaign Created and Verified Successfully', 'text/plain');
  } catch (err) {
    console.error('Step failed:', err.message);
    await this.attach('Step failed: ' + err.message, 'text/plain');
    throw err;
  }
});

Given('Upload Leads After Campaign Creation', /** @this {World} */ async function () {
  try {
    this.campaigncreation = new Campaigncreation(this.page);

    await this.campaigncreation.upload_leads_to_campaign();
    await this.attach('Leads Uploaded to Campaign Successfully', 'text/plain');
  } catch (err) {
    console.error('Step failed:', err.message);
    await this.attach('Step failed: ' + err.message, 'text/plain');
    throw err;
  }
});

When ('Mapping the Fields the with the Column in the excel', /** @this {World} */ async function () {
  try {
    this.campaigncreation = new Campaigncreation(this.page);

    await this.campaigncreation.mapping_the_columns_for_uploading_leads();
    await this.attach('Mapping of Columns for Uploading Leads Completed Successfully', 'text/plain');
  } catch (err) {
    console.error('Step failed:', err.message);
    await this.attach('Step failed: ' + err.message, 'text/plain');
    throw err;
  }
});

Then ('Lead Should Upload successfully', /** @this {World} */ async function () {
  try {
    this.campaigncreation = new Campaigncreation(this.page);

    await this.campaigncreation.verify_campaign_creation_for_lead_uploads();
    await this.attach('Leads Upload to Campaign Verified Successfully', 'text/plain');
  } catch (err) {
    console.error('Step failed:', err.message);
    await this.attach('Step failed: ' + err.message, 'text/plain');
    throw err;
  }
});
