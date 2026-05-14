const { BeforeAll, AfterAll, Before, After, AfterStep, setDefaultTimeout, setWorldConstructor, World } = require('@cucumber/cucumber');
const { chromium } = require('@playwright/test');

setDefaultTimeout(120000);

let browser, context, page;

class CustomWorld extends World {
  constructor(options) {
    super(options);
    this.browser = browser;
    this.context = context;
    this.page = page;
    /** @type {import('../pages/bulkupdate.js').BulkUpdate | undefined} */
    this.bulkupdate = undefined;
    /** @type {import('../pages/Campaigncreation.js').Campaigncreation | undefined} */
    this.campaigncreation = undefined;
    /** @type {import('../pages/moveleads_bulkupdate.js').MoveLeadsBulkUpdate | undefined} */
    this.moveleads_bulkupdate = undefined;
    /** @type {import('../pages/bulkupdate_delete.js').BulkUpdateDelete | undefined} */
    this.bulkupdatedelete = undefined;
    /** @type {import('../pages/Leadsverify.js').Leadsverify | undefined} */
    this.leadsverify = undefined;
    /** @type {import('../pages/loginpage.js').loginpage | undefined} */
    this.loginPage = undefined;
    /** @type {import('../pages/Pipelinecreation.js').Pipelinecreation | undefined} */
    this.pipelinecreation = undefined;
    /** @type {import('../pages/PipelineScenarios.js').PipelineScenarios | undefined} */
    this.pipelinescenarios = undefined;
    /** @type {import('../pages/campaign_deletion.js').CampaignDeletion | undefined} */
    this.campaigndeletion = undefined;
    /** @type {import('../pages/Leadscenario.js').Leadscenario | undefined} */
    this.leadscenario = undefined;
  }
}

module.exports.CustomWorld = CustomWorld;

setWorldConstructor(CustomWorld);

// Launch browser once before all tests
BeforeAll(async function () {
  browser = await chromium.launch({ headless: true, args: ['--start-maximized'] });
  context = await browser.newContext({ viewport: null });
  page = await context.newPage();
  page.setDefaultTimeout(60000);
  page.setDefaultNavigationTimeout(60000);
 
});

// Assign the same page to every scenario
// Recover gracefully if the previous scenario caused the page to close (e.g. dialer auto-closes its tab)
Before(async function () {
  this.browser = browser;
  this.context = context;

  if (!page || page.isClosed()) {
    const openPages = context.pages().filter(p => !p.isClosed());
    if (openPages.length > 0) {
      page = openPages[0];
    } else {
      page = await context.newPage();
      page.setDefaultTimeout(60000);
      page.setDefaultNavigationTimeout(60000);
    }
  }

  this.page = page;

  // Dismiss any blocking overlay dialogs (e.g. Neo WhatsApp "Use here" dialog)
  try {
    const useHereBtn = this.page.locator('button:has-text("Use here")');
    if (await useHereBtn.isVisible({ timeout: 2000 })) {
      await useHereBtn.click();
      await this.page.waitForTimeout(1000);
      console.log("Dismissed blocking overlay dialog");
    }
  } catch (e) { /* no dialog present */ }

  // Dismiss any remaining cdk overlay backdrop with Escape key
  try {
    const backdrop = this.page.locator('.cdk-overlay-backdrop-showing');
    if (await backdrop.isVisible({ timeout: 1000 })) {
      await this.page.keyboard.press('Escape');
      await this.page.waitForTimeout(500);
    }
  } catch (e) { /* no backdrop present */ }
});

// Take screenshot on failure but don't close browser
After(async function (scenario) {
  if (scenario.result?.status === 'FAILED') {

    // ✅ 1️⃣ ALWAYS log failure clearly
    console.error('\n❌ SCENARIO FAILED ❌');
    console.error('Scenario:', scenario.pickle?.name);

    if (scenario.result?.exception) {
      console.error('Error:', scenario.result.exception.stack || scenario.result.exception);
    } else {
      console.error('Result:', scenario.result);
    }

    // ✅ 2️⃣ Screenshot (NON-BLOCKING)
    try {
      if (this.page && !this.page.isClosed()) {
        const screenshot = await this.page.screenshot({ timeout: 5000 });
        await this.attach(screenshot, 'image/png');
        console.log('📸 Screenshot attached');
      }
    } catch (err) {
      console.log('⚠️ Screenshot skipped:', err.message);
    }
  }
});

// Log failed steps and continue to next step if possible
AfterStep(async function (step) {
  if (step.result?.status === 'FAILED') {
    console.error('❌ STEP FAILED:', step.text);
    if (step.result?.exception) {
      console.error('Error:', step.result.exception.message || step.result.exception);
    }
    // Note: Scenario will still fail, but logging allows visibility
    // To continue the scenario, wrap step definitions in try-catch
  }
});


// Close browser only after all scenarios are finished
AfterAll(async function () {
  await page.close();
  await context.close();
  await browser.close();

});
