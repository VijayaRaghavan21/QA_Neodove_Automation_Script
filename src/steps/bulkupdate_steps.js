import { Given, When, Then } from '@cucumber/cucumber';
import { BulkUpdate } from '../pages/bulkupdate.js';
import { Campaigncreation } from '../pages/Campaigncreation.js';
import { AUTOMATION_CONSTANTS } from '../enums/enum.js';
import { MoveLeadsBulkUpdate } from '../pages/moveleads_bulkupdate.js';
import { BulkUpdateDelete } from '../pages/bulkupdate_delete.js';

/** @typedef {import('../support/hooks.js').CustomWorld} World */

Given('Go to the Campaign lead summary page', /** @this {World} */ async function () {
  try {
    this.bulkupdate = new BulkUpdate(this.page);
    await this.bulkupdate.open_the_campaign_page();
    await this.attach('Campaign Lead Summary Page Opened Successfully', 'text/plain');
  } catch (err) {
    console.error('Step failed:', err.message);
    await this.attach('Step failed: ' + err.message, 'text/plain');
    throw err;
  }
});

When('I select the lead Summary page', /** @this {World} */ async function () {
  try {
    await this.bulkupdate.open_lead_Summary_page();
    await this.attach('Campaign Lead Summary Page Opened Successfully', 'text/plain');
  } catch (err) {
    console.error('Step failed:', err.message);
    await this.attach('Step failed: ' + err.message, 'text/plain');
    throw err;
  }
});

When('Update the lead Stage to inprogress and update the follow up date', /** @this {World} */ async function () {
  try {
    await this.bulkupdate.bulk_update_stage();
    await this.attach('Bulk update completed successfully', 'text/plain');
  } catch (err) {
    console.error('Step failed:', err.message);
    await this.attach('Step failed: ' + err.message, 'text/plain');
    throw err;
  }
});

Then('all the leads should be updated to In Progress in the lead summary page', /** @this {World} */ async function () {
  try {
    await this.bulkupdate.verify_all_leads_changed_to_inprogress();
    await this.attach('All leads updated to In Progress and follow up date set successfully', 'text/plain');
  } catch (err) {
    console.error('Step failed:', err.message);
    await this.attach('Step failed: ' + err.message, 'text/plain');
    throw err;
  }
});

Given('Switch to Dialer Portal', /** @this {World} */ async function () {
  try {
    this.bulkupdate = new BulkUpdate(this.page);
    await this.bulkupdate.switch_to_dialer_portal();
    await this.attach('Switched to Dialer Portal successfully', 'text/plain');
  } catch (err) {
    console.error('Step failed:', err.message);
    await this.attach('Step failed: ' + err.message, 'text/plain');
    throw err;
  }
});

When('I Click the My Leads', /** @this {World} */ async function () {
  try {
    await this.bulkupdate.navigate_to_my_leads_page();
    await this.attach('Clicked on My Leads successfully', 'text/plain');
  } catch (err) {
    console.error('Step failed:', err.message);
    await this.attach('Step failed: ' + err.message, 'text/plain');
    throw err;
  }
});

When('I Click on Start Calling under Follow up leads', /** @this {World} */ async function () {
  try {
    await this.bulkupdate.verify_all_the_leads_in_followup_section();
    await this.attach('Clicked on Start Calling under Follow up leads successfully', 'text/plain');
  } catch (err) {
    console.error('Step failed:', err.message);
    await this.attach('Step failed: ' + err.message, 'text/plain');
    throw err;
  }
});

Then('All Leads Should display in the Start Calling Flow', /** @this {World} */ async function () {
  try {
    await this.bulkupdate.verifyAllLeadsInFollowupStartCalling();
    await this.attach('All Leads are displayed in the Start Calling Flow successfully', 'text/plain');
  } catch (err) {
    console.error('Step failed:', err.message);
    await this.attach('Step failed: ' + err.message, 'text/plain');
    throw err;
  }
});

Given('Switch to admin Portal and select the Pipeline', /** @this {World} */ async function () {
  try {
    this.bulkupdate = new BulkUpdate(this.page);
    //await this.bulkupdate.switch_to_dialer_portal(); -- it is not required beacuse the previosu scenario we have skipped 
    await this.bulkupdate.open_the_pipeline_page();
    await this.attach('Switched to Admin Portal successfully', 'text/plain');
  } catch (err) {
    console.error('Step failed:', err.message);
    await this.attach('Step failed: ' + err.message, 'text/plain');
    throw err;
  }
});

When('Creating a New Campaign for copy leads', /** @this {World} */ async function () {
  try {
    this.campaigncreation = new Campaigncreation(this.page);
    await this.campaigncreation.create_new_campaign();
    await this.attach('Create Campaign Button Clicked', 'text/plain');
    await this.campaigncreation.give_campaign_name(AUTOMATION_CONSTANTS.Campaign_name_for_copy_leads);
    await this.attach('Campaign Name Entered', 'text/plain');
    await this.campaigncreation.select_users_for_campaign_creation();
    await this.attach('Users Selected for Campaign Creation', 'text/plain');
    await this.campaigncreation.select_lead_distribution_type();
    await this.attach('Lead Distribution Type Selected for Campaign Creation', 'text/plain');
    await this.campaigncreation.click_on_create_button();
    await this.campaigncreation.verify_campaign_creation();
    await this.attach('Campaign Created and Verified Successfully', 'text/plain');
  } catch (err) {
    console.error('Step failed:', err.message);
    await this.attach('Step failed: ' + err.message, 'text/plain');
    throw err;
  }
});

When('Copying Leads from existing campaign to Another Campaign', /** @this {World} */ async function () {
  try {
    await this.bulkupdate.open_the_pipeline_page();
    await this.bulkupdate.bulkupdate_for_copy_leads();
    await this.attach('Leads copied to another campaign successfully', 'text/plain');
  } catch (err) {
    console.error('Step failed:', err.message);
    await this.attach('Step failed: ' + err.message, 'text/plain');
    throw err;
  }
});

Then('Verify all the leads are copied to the destination Campaign', /** @this {World} */ async function () {
  try {
    await this.bulkupdate.verify_leads_copied_successfully_in_Dialer_start_calling();
    await this.bulkupdate.verifyAllLeadsInFollowupStartCalling();
    await this.attach('All leads copied to the destination Campaign and verified successfully', 'text/plain');
  } catch (err) {
    console.error('Step failed:', err.message);
    await this.attach('Step failed: ' + err.message, 'text/plain');
    throw err;
  }
});

Given('Switch to admin Portal for move leads and select the Pipeline', /** @this {World} */ async function () {
  try {
    this.bulkupdate = new BulkUpdate(this.page);
    await this.bulkupdate.ensure_on_admin_portal(); // switch back to admin if on dialer
    await this.bulkupdate.open_the_pipeline_page();
    await this.attach('Switched to Admin Portal successfully', 'text/plain');
  } catch (err) {
    console.error('Step failed:', err.message);
    await this.attach('Step failed: ' + err.message, 'text/plain');
    throw err;
  }
});

When('Creating a New Campaign for move leads', /** @this {World} */ async function () {
  try {
    this.campaigncreation = new Campaigncreation(this.page);
    await this.campaigncreation.create_new_campaign();
    await this.attach('Create Campaign Button Clicked', 'text/plain');
    await this.campaigncreation.give_campaign_name(AUTOMATION_CONSTANTS.Campaign_name_for_move_leads);
    await this.attach('Campaign Name Entered', 'text/plain');
    await this.campaigncreation.select_users_for_campaign_creation();
    await this.attach('Users Selected for Campaign Creation', 'text/plain');
    await this.campaigncreation.select_lead_distribution_type();
    await this.attach('Lead Distribution Type Selected for Campaign Creation', 'text/plain');
    await this.campaigncreation.click_on_create_button();
    await this.campaigncreation.verify_campaign_creation();
    await this.attach('Campaign Created and Verified Successfully', 'text/plain');
  } catch (err) {
    console.error('Step failed:', err.message);
    await this.attach('Step failed: ' + err.message, 'text/plain');
    throw err;
  }
});

When('Move Leads from existing campaign to Another Campaign', /** @this {World} */ async function () {
  try {
    this.moveleads_bulkupdate = new MoveLeadsBulkUpdate(this.page);
    await this.moveleads_bulkupdate.bulkupdate_for_move_leads();
    await this.attach('Leads moved to another campaign successfully', 'text/plain');
  } catch (err) {
    console.error('Step failed:', err.message);
    await this.attach('Step failed: ' + err.message, 'text/plain');
    throw err;
  }
});

Then('Verify all the leads are moved to the destination Campaign', /** @this {World} */ async function () {
  try {
    await this.moveleads_bulkupdate.verify_leads_moved_successfully();
    await this.bulkupdate.verifyAllLeadsInFollowupStartCalling();

    await this.attach('Switched to Dialer and clicked Start Calling for move leads campaign', 'text/plain');
  } catch (err) {
    console.error('Step failed:', err.message);
    await this.attach('Step failed: ' + err.message, 'text/plain');
    throw err;
  }
});

// ── Delete Leads Scenario ────────────────────────────────────────────────────

Given('Switch to admin Portal', /** @this {World} */ async function () {
  try {
    this.bulkupdatedelete = new BulkUpdateDelete(this.page);
    await this.bulkupdatedelete.switch_to_admin_portal();
    const screenshot = await this.page.screenshot();
    await this.attach(screenshot, 'image/png');
    await this.attach('Switched to Admin Portal successfully', 'text/plain');
  } catch (err) {
    console.error('Step failed:', err.message);
    const screenshot = await this.page.screenshot();
    await this.attach(screenshot, 'image/png');
    await this.attach('Step failed: ' + err.message, 'text/plain');
    throw err;
  }
});

When('clicking on pipeline and go to the campaing', /** @this {World} */ async function () {
  try {
    await this.bulkupdatedelete.navigate_to_move_leads_campaign();
    const screenshot = await this.page.screenshot();
    await this.attach(screenshot, 'image/png');
    await this.attach('Navigated to Move Leads Campaign - Lead Summary page opened', 'text/plain');
  } catch (err) {
    console.error('Step failed:', err.message);
    const screenshot = await this.page.screenshot();
    await this.attach(screenshot, 'image/png');
    await this.attach('Step failed: ' + err.message, 'text/plain');
    throw err;
  }
});

When('select all the leads and click bulk update', /** @this {World} */ async function () {
  try {
    await this.bulkupdatedelete.select_all_leads_and_open_bulk_actions();
    const screenshot = await this.page.screenshot();
    await this.attach(screenshot, 'image/png');
    await this.attach('All leads selected via checkbox and Bulk Actions menu opened', 'text/plain');
  } catch (err) {
    console.error('Step failed:', err.message);
    const screenshot = await this.page.screenshot();
    await this.attach(screenshot, 'image/png');
    await this.attach('Step failed: ' + err.message, 'text/plain');
    throw err;
  }
});

When('Select Delete', /** @this {World} */ async function () {
  try {
    await this.bulkupdatedelete.select_delete_and_confirm();
    const screenshot = await this.page.screenshot();
    await this.attach(screenshot, 'image/png');
    await this.attach('Delete option selected, typed DELETE in confirmation input and clicked Yes I\'m sure', 'text/plain');
  } catch (err) {
    console.error('Step failed:', err.message);
    const screenshot = await this.page.screenshot();
    await this.attach(screenshot, 'image/png');
    await this.attach('Step failed: ' + err.message, 'text/plain');
    throw err;
  }
});

Then('verify all Leads deleted Sucessully', /** @this {World} */ async function () {
  try {
    await this.bulkupdatedelete.verify_leads_deleted_successfully();
    const screenshot = await this.page.screenshot();
    await this.attach(screenshot, 'image/png');
    await this.attach('VERIFIED: All leads deleted successfully - success toast confirmed', 'text/plain');
  } catch (err) {
    console.error('Step failed:', err.message);
    const screenshot = await this.page.screenshot();
    await this.attach(screenshot, 'image/png');
    await this.attach('Step failed: ' + err.message, 'text/plain');
    throw err;
  }
});
