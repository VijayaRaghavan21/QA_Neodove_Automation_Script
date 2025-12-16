import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { Leadsverify } from '../pages/Leadsverify.js';


Given ('Opening the lead Summary page inside the campaign', async function () {

    this.leadsverify = new Leadsverify (this.page);

    await this.leadsverify.navigate_to_leads_summary();
    await this.attach('Navigated to Lead Summary Page', 'text/plain');
});

When('All the Leads will Display', async function () {

     this.leadsverify = new Leadsverify (this.page);
    await this.leadsverify.verify_leads_summary_page();
    await this.attach('Leads Summary Page Displayed', 'text/plain');
});

Then(
  'Confirm the Lead in the Excel File are displayed inside the campaign',
  async function () {

    const result =
      await this.leadsverify.validateAllExcelMobilesPresent();

    // Summary
    await this.attach(
      `Excel Count: ${result.excelCount}\nCRM Count: ${result.crmCount}`,
      'text/plain'
    );

    // Excel mobiles
    await this.attach(
      `Excel Mobile Numbers:\n\n${result.excelMobiles.join('\n')}`,
      'text/plain'
    );

    // CRM mobiles
    await this.attach(
      `CRM Mobile Numbers:\n\n${result.crmMobiles.join('\n')}`,
      'text/plain'
    );

    // Missing mobiles
    if (result.missingMobiles.length > 0) {
      await this.attach(
        `❌ Missing Mobile Numbers:\n\n${result.missingMobiles.join('\n')}`,
        'text/plain'
      );
    } else {
      await this.attach(
        '✅ All Excel mobile numbers are present in CRM',
        'text/plain'
      );
    }
  }
);



