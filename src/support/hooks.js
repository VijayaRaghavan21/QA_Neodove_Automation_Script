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
  }
}

setWorldConstructor(CustomWorld);

// Launch browser once before all tests
BeforeAll(async function () {
  browser = await chromium.launch({ headless: false, args: ['--start-maximized'] });
  context = await browser.newContext({ viewport: null });
  page = await context.newPage();
  page.setDefaultTimeout(60000);
  page.setDefaultNavigationTimeout(60000);
 
});

// Assign the same page to every scenario
Before(async function () {
  this.browser = browser;
  this.context = context;
  this.page = page;
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
