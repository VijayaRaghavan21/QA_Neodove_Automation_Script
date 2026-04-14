import { Given, When, Then } from '@cucumber/cucumber';
import { CampaignDeletion } from '../pages/campaign_deletion.js';

/** @typedef {import('../support/hooks.js').CustomWorld} World */

Given('Go to the pipeline', /** @this {World} */ async function () {
  try {
    this.campaigndeletion = new CampaignDeletion(this.page);
    await this.campaigndeletion.navigate_to_pipeline();
    const screenshot = await this.page.screenshot();
    await this.attach(screenshot, 'image/png');
    await this.attach('Navigated to Automation Pipeline successfully', 'text/plain');
  } catch (err) {
    console.error('Step failed:', err.message);
    const screenshot = await this.page.screenshot();
    await this.attach(screenshot, 'image/png');
    await this.attach('Step failed: ' + err.message, 'text/plain');
    throw err;
  }
});

When('Select the checkbox and delete the campaign', /** @this {World} */ async function () {
  try {
    await this.campaigndeletion.delete_all_campaigns();
    const screenshot = await this.page.screenshot();
    await this.attach(screenshot, 'image/png');
    await this.attach('All three campaigns selected and deleted one by one', 'text/plain');
  } catch (err) {
    console.error('Step failed:', err.message);
    const screenshot = await this.page.screenshot();
    await this.attach(screenshot, 'image/png');
    await this.attach('Step failed: ' + err.message, 'text/plain');
    throw err;
  }
});

Then('Campaign should be deleted successfully', /** @this {World} */ async function () {
  try {
    await this.campaigndeletion.verify_all_campaigns_deleted();
    const screenshot = await this.page.screenshot();
    await this.attach(screenshot, 'image/png');
    await this.attach('VERIFIED: All campaigns deleted successfully', 'text/plain');
  } catch (err) {
    console.error('Step failed:', err.message);
    const screenshot = await this.page.screenshot();
    await this.attach(screenshot, 'image/png');
    await this.attach('Step failed: ' + err.message, 'text/plain');
    throw err;
  }
});
