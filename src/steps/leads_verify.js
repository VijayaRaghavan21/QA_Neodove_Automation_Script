import { Given, When, Then } from '@cucumber/cucumber';
import { Leadsverify } from '../pages/Leadsverify.js';

/** @typedef {import('../support/hooks.js').CustomWorld} World */

Given ('Opening the lead Summary page inside the campaign', /** @this {World} */ async function () {
  try {
    this.leadsverify = new Leadsverify (this.page);
    await this.leadsverify.navigate_to_leads_summary();
    await this.attach('Navigated to Lead Summary Page', 'text/plain');
  } catch (err) {
    console.error('Step failed:', err.message);
    await this.attach('Step failed: ' + err.message, 'text/plain');
    throw err;
  }
});

When('All the Leads will Display', /** @this {World} */ async function () {
  try {
    this.leadsverify = new Leadsverify (this.page);
    await this.leadsverify.verify_leads_summary_page();
    await this.attach('Leads Summary Page Displayed', 'text/plain');
  } catch (err) {
    console.error('Step failed:', err.message);
    await this.attach('Step failed: ' + err.message, 'text/plain');
    throw err;
  }
});

Then(
  'Confirm the Lead in the Excel File are displayed inside the campaign',
  /** @this {World} */ async function () {
  try {
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
        ` Missing Mobile Numbers:\n\n${result.missingMobiles.join('\n')}`,
        'text/plain'
      );
    } else {
      await this.attach(
        '✅ All Excel mobile numbers are present in CRM',
        'text/plain'
      );
    }
  } catch (err) {
    console.error('Step failed:', err.message);
    await this.attach('Step failed: ' + err.message, 'text/plain');
    throw err;
  }
}
);

Then(
  'Verify All the Leads in Start Calling flow in Dialer Portal',
  /** @this {World} */ async function () {
  try {
    this.leadsverify = new Leadsverify(this.page);

    // 1️⃣ Get CRM mobiles BEFORE switching portal
    const crmMobiles = await this.leadsverify.getCRMMobiles();

    if (crmMobiles.length === 0) {
      console.log('No CRM leads found. Skipping Start Calling validation.');
      return;
    }

    // 2️⃣ Start Calling
    await this.leadsverify.openStartCalling();

    // 3️⃣ Validate + Dispose ALL leads
    await this.leadsverify.verifyAllLeadsInStartCalling(crmMobiles);

    // 4️⃣ Safe attachment
    try {
      await this.attach(
        'All Start Calling leads validated against CRM mobiles',
        'text/plain'
      );
    } catch {
      console.log('Attach skipped');
    }

    return; // explicit finish
  } catch (err) {
    console.error('Step failed:', err.message);
    await this.attach('Step failed: ' + err.message, 'text/plain');
    throw err;
  }
}
);
