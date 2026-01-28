import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { bulkupdate } from '../pages/bulkupdate.js';
import { Campaigncreation } from '../pages/Campaigncreation.js';
import { AUTOMATION_CONSTANTS } from '../enums/enum.js';
import { moveleads_bulkupdate } from '../pages/moveleads_bulkupdate.js';

Given('Go to the Campaign lead summary page', async function () {
  try {
    this.bulkupdate = new bulkupdate(this.page);

    await this.bulkupdate.open_the_campaign_page();

    await this.attach('Campaign Lead Summary Page Opened Successfully', 'text/plain');
  } catch (err) {
    console.error('Step failed:', err.message);
    await this.attach('Step failed: ' + err.message, 'text/plain');
  }
});

When('I select the lead Summary page', async function () {
  try {
    this.bulkupdate = new bulkupdate(this.page);

    await this.bulkupdate.open_lead_Summary_page();
    await this.attach('Campaign Lead Summary Page Opened Successfully', 'text/plain');
  } catch (err) {
    console.error('Step failed:', err.message);
    await this.attach('Step failed: ' + err.message, 'text/plain');
  }
});

When('Update the lead Stage to inprogress and update the follow up date', async function () {
  try {
    this.bulkupdate = new bulkupdate(this.page);

    await this.bulkupdate.bulk_update_stage();
    await this.attach('Bulk update completed successfully', 'text/plain');
  } catch (err) {
    console.error('Step failed:', err.message);
    await this.attach('Step failed: ' + err.message, 'text/plain');
  }
});

Then('all the leads should be updated to In Progress in the lead summary page', async function () {
  try {
    this.bulkupdate = new bulkupdate(this.page);

    await this.bulkupdate.verify_all_leads_changed_to_inprogress();
    await this.attach('All leads updated to In Progress and follow up date set successfully', 'text/plain');
  } catch (err) {
    console.error('Step failed:', err.message);
    await this.attach('Step failed: ' + err.message, 'text/plain');
  }
});

//Follow up leads are coming in the Dialer portal under follow up lead

Given('Switch to Dialer Portal', async function () {
  try {
    this.bulkupdate = new bulkupdate(this.page);
    await this.bulkupdate.swtich_to_Dialer_Portal();
    await this.attach('Switched to Dialer Portal successfully', 'text/plain');
  } catch (err) {
    console.error('Step failed:', err.message);
    await this.attach('Step failed: ' + err.message, 'text/plain');
  }
}
);

When('I Click the My Leads', async function () {
  try {
    this.bulkupdate = new bulkupdate(this.page);
    await this.bulkupdate.navigate_to_my_leads_page();
    await this.attach('Clicked on My Leads successfully', 'text/plain');
  } catch (err) {
    console.error('Step failed:', err.message);
    await this.attach('Step failed: ' + err.message, 'text/plain');
  }
}

);

When('I Click on Start Calling under Follow up leads', async function () {
  try {
    this.bulkupdate = new bulkupdate(this.page);
    await this.bulkupdate.verify_all_the_leads_in_followup_section();
    await this.attach('Clicked on Start Calling under Follow up leads successfully', 'text/plain');
  } catch (err) {
    console.error('Step failed:', err.message);
    await this.attach('Step failed: ' + err.message, 'text/plain');
  }
}
);

Then('All Leads Should display in the Start Calling Flow', async function () {
  try {
    this.bulkupdate = new bulkupdate(this.page);
    await this.bulkupdate.verifyAllLeadsInFollowupStartCalling();
    await this.attach('All Leads are displayed in the Start Calling Flow successfully', 'text/plain');
  } catch (err) {
    console.error('Step failed:', err.message);
    await this.attach('Step failed: ' + err.message, 'text/plain');
  }
}
);

Given('Switch to admin Portal and select the Pipeline', async function () {
  try {
    this.bulkupdate = new bulkupdate(this.page);
    await this.bulkupdate.open_the_pipeline_page();
    await this.attach('Switched to Admin Portal successfully', 'text/plain');
  } catch (err) {
    console.error('Step failed:', err.message);
    await this.attach('Step failed: ' + err.message, 'text/plain');
  }
}
);

When('Creating a New Campaign for copy leads', async function () {
  try {
    this.campaigncreation = new Campaigncreation(this.page);

    await this.campaigncreation.create_new_campaign();
    await this.attach('Create Campaign Button Clicked', 'text/plain');

    await this.campaigncreation.give_campaign_name(
      AUTOMATION_CONSTANTS.Campaign_name_for_copy_leads
    );
    await this.attach('Campaign Name Entered', 'text/plain');

    await this.campaigncreation.select_users_for_campaign_creation();
    await this.attach('Users Selected for Campaign Creation', 'text/plain');

    await this.campaigncreation.select_lead_distribution_type();
    await this.attach(
      'Lead Distribution Type Selected for Campaign Creation',
      'text/plain'
    );

    await this.campaigncreation.click_on_create_button();
    await this.campaigncreation.verify_campaign_creation();

    await this.attach(
      'Campaign Created and Verified Successfully',
      'text/plain'
    );
  } catch (err) {
    console.error('Step failed:', err.message);
    await this.attach('Step failed: ' + err.message, 'text/plain');
  }
});

When('Copying Leads from existing campaign to Another Campaign', async function () {
  try {
    this.bulkupdate = new bulkupdate(this.page);
    await this.bulkupdate.open_the_pipeline_page();

    await this.bulkupdate.bulkupdate_for_copy_leads();
    await this.attach('Opened Lead Summary page in existing Campaign  for copying leads to other', 'text/plain');
    await this.attach('Leads copied to another campaign successfully', 'text/plain');
  }
  catch (err) {
    console.error('Step failed:', err.message);
    await this.attach('Step failed: ' + err.message, 'text/plain');
  }

});

Then('Verify all the leads are copied to the destination Campaign', async function () {
  try {
    this.bulkupdate = new bulkupdate(this.page);
    await this.bulkupdate.verify_leads_copied_successfully_in_Dialer_start_calling();
    await this.bulkupdate.verifyAllLeadsInFollowupStartCalling();
    await this.attach('All leads copied to the destination Campaign and verified successfully', 'text/plain');
  } catch (err) {
    console.error('Step failed:', err.message);
    await this.attach('Step failed: ' + err.message, 'text/plain');
  }
}
);

// Given('Switch to admin Portal and select the Pipeline', async function () {
//   try {
//     this.bulkupdate = new bulkupdate(this.page);
//     await this.bulkupdate.open_the_pipeline_page();
//     await this.attach('Switched to Admin Portal successfully', 'text/plain');
//   } catch (err) {
//     console.error('Step failed:', err.message);
//     await this.attach('Step failed: ' + err.message, 'text/plain');
//   }
// }
// );

When('Creating a New Campaign for move leads', async function () {
  try {
    this.campaigncreation = new Campaigncreation(this.page);

    await this.campaigncreation.create_new_campaign();
    await this.attach('Create Campaign Button Clicked', 'text/plain');

    await this.campaigncreation.give_campaign_name(
      AUTOMATION_CONSTANTS.Campaign_name_for_move_leads
    );
    await this.attach('Campaign Name Entered', 'text/plain');

    await this.campaigncreation.select_users_for_campaign_creation();
    await this.attach('Users Selected for Campaign Creation', 'text/plain');

    await this.campaigncreation.select_lead_distribution_type();
    await this.attach(
      'Lead Distribution Type Selected for Campaign Creation',
      'text/plain'
    );

    await this.campaigncreation.click_on_create_button();
    await this.campaigncreation.verify_campaign_creation();

    await this.attach(
      'Campaign Created and Verified Successfully',
      'text/plain'
    );
  } catch (err) {
    console.error('Step failed:', err.message);
    await this.attach('Step failed: ' + err.message, 'text/plain');
  }
});

When('Move Leads from existing campaign to Another Campaign', async function () {
  try {

    this.moveleads_bulkupdate = new moveleads_bulkupdate(this.page);
    await this.moveleads_bulkupdate.bulkupdate_for_move_leads();
    await this.attach('Opened Lead Summary page in existing Campaign  for moving leads to other', 'text/plain');
    await this.attach('Leads moved to another campaign successfully', 'text/plain');
  } catch (err) {
    console.error('Step failed:', err.message);
    await this.attach('Step failed: ' + err.message, 'text/plain');
  }
});

Then('Verify all the leads are moved to the destination Campaign', async function () {
  try {
    this.moveleads_bulkupdate = new moveleads_bulkupdate(this.page);
    this.bulkupdate = new bulkupdate(this.page);
    await this.moveleads_bulkupdate.verify_leads_moved_successfully_in_Dialer_start_calling();
    await this.bulkupdate.verifyAllLeadsInFollowupStartCalling();
    await this.attach('All leads moved to the destination Campaign and verified successfully', 'text/plain');
  } catch (err) {
    console.error('Step failed:', err.message);
    await this.attach('Step failed: ' + err.message, 'text/plain');
  }
}
);