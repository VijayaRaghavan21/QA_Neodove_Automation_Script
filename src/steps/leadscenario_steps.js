import { Given, When, Then } from '@cucumber/cucumber';
import { Leadscenario } from '../pages/Leadscenario.js';
import { Pipelinecreation } from '../pages/Pipelinecreation.js';
import { Campaigncreation } from '../pages/Campaigncreation.js';
import { AUTOMATION_CONSTANTS } from '../enums/enum.js';

/** @typedef {import('../support/hooks.js').CustomWorld} World */

// -----------------------------------------------------------------------
// Pipeline creation — reuses existing page object with the same pipeline
// -----------------------------------------------------------------------

Given('a Pipeline has been created for Leads Scenario', /** @this {World} */ async function () {
    try {
        this.pipelinecreation = new Pipelinecreation(this.page);
        await this.pipelinecreation.navigate_to_pipeline_creation_page();
        await this.pipelinecreation.create_new_pipeline(AUTOMATION_CONSTANTS.PIPELINE_NAME);
        await this.attach('Pipeline created for Leads Scenario', 'text/plain');
    } catch (err) {
        console.error('Step failed:', err.message);
        await this.attach('Step failed: ' + err.message, 'text/plain');
        throw err;
    }
});

// -----------------------------------------------------------------------
// Campaign creation with "Leads Scenario Campaign" name
// -----------------------------------------------------------------------

When('Give the Name for Leads Scenario Campaign', /** @this {World} */ async function () {
    try {
        this.campaigncreation = new Campaigncreation(this.page);
        await this.campaigncreation.give_campaign_name(
            AUTOMATION_CONSTANTS.Campaign_name_for_leads_scenario
        );
        await this.attach(
            `Campaign name set to: ${AUTOMATION_CONSTANTS.Campaign_name_for_leads_scenario}`,
            'text/plain'
        );
    } catch (err) {
        console.error('Step failed:', err.message);
        await this.attach('Step failed: ' + err.message, 'text/plain');
        throw err;
    }
});

// -----------------------------------------------------------------------
// Add 10 Walk-In leads via Actions → Add Lead
// -----------------------------------------------------------------------

When('the user adds 10 Walk-In leads into the Campaign via Actions', /** @this {World} */ async function () {
    try {
        this.leadscenario = new Leadscenario(this.page);
        await this.leadscenario.add_10_walkin_leads();
        await this.attach(
            `10 Walk-In leads added:\n${AUTOMATION_CONSTANTS.Walk_In_Lead_Numbers.join('\n')}`,
            'text/plain'
        );
    } catch (err) {
        console.error('Step failed:', err.message);
        await this.attach('Step failed: ' + err.message, 'text/plain');
        throw err;
    }
});

// -----------------------------------------------------------------------
// Verify leads are visible inside the Campaign
// -----------------------------------------------------------------------

Then('all Walk-In leads should be displayed inside the Campaign', /** @this {World} */ async function () {
    try {
        this.leadscenario = new Leadscenario(this.page);
        await this.leadscenario.verify_leads_displayed_in_campaign();
        await this.attach('Walk-In leads are visible inside the Campaign', 'text/plain');
    } catch (err) {
        console.error('Step failed:', err.message);
        await this.attach('Step failed: ' + err.message, 'text/plain');
        throw err;
    }
});

// -----------------------------------------------------------------------
// Navigate to Lead Summary, verify and print phone numbers
// -----------------------------------------------------------------------

Then('the Lead Summary should show all added phone numbers', /** @this {World} */ async function () {
    try {
        this.leadscenario = new Leadscenario(this.page);

        // Navigate to Lead Summary
        await this.leadscenario.navigate_to_lead_summary();

        // Verify the page loaded
        await this.leadscenario.verify_lead_summary_page();

        // Read, cross-check, and console-print phone numbers
        const result = await this.leadscenario.verify_and_print_lead_summary_numbers();

        // Attach to Allure report
        await this.attach(
            `Numbers displayed in Lead Summary (Number column):\n\n${result.displayedNumbers.join('\n')}`,
            'text/plain'
        );

        await this.attach(
            `Numbers we added (Walk-In leads):\n\n${result.addedNumbers.join('\n')}`,
            'text/plain'
        );

        if (result.missing.length > 0) {
            await this.attach(
                `Missing numbers (not found in Lead Summary):\n\n${result.missing.join('\n')}`,
                'text/plain'
            );
        } else {
            await this.attach(
                'All 10 Walk-In lead numbers are present in Lead Summary.',
                'text/plain'
            );
        }

    } catch (err) {
        console.error('Step failed:', err.message);
        await this.attach('Step failed: ' + err.message, 'text/plain');
        throw err;
    }
});

// -----------------------------------------------------------------------
// Dialer Portal — Switch, Start Calling, Dispose, Break, Switch Back
// -----------------------------------------------------------------------

Given('Go to My campaign', /** @this {World} */ async function () {
    try {
        this.leadscenario = new Leadscenario(this.page);
        await this.leadscenario.go_to_my_campaign();
        const screenshot = await this.page.screenshot();
        await this.attach(screenshot, 'image/png');
        await this.attach('Navigated to My Campaigns in Dialer Portal', 'text/plain');
    } catch (err) {
        console.error('Step failed:', err.message);
        const screenshot = await this.page.screenshot();
        await this.attach(screenshot, 'image/png');
        await this.attach('Step failed: ' + err.message, 'text/plain');
        throw err;
    }
});

When('Click on Lead Scenario Campaign Start Calling', /** @this {World} */ async function () {
    try {
        this.leadscenario = new Leadscenario(this.page);
        await this.leadscenario.start_calling_lead_scenario_campaign();
        const screenshot = await this.page.screenshot();
        await this.attach(screenshot, 'image/png');
        await this.attach(
            `Start Calling clicked for: ${AUTOMATION_CONSTANTS.Campaign_name_for_leads_scenario}`,
            'text/plain'
        );
    } catch (err) {
        console.error('Step failed:', err.message);
        const screenshot = await this.page.screenshot();
        await this.attach(screenshot, 'image/png');
        await this.attach('Step failed: ' + err.message, 'text/plain');
        throw err;
    }
});

Then('Dispose upto 5 leads and verify they are the created Walk-In leads', /** @this {World} */ async function () {
    try {
        this.leadscenario = new Leadscenario(this.page);
        const verifiedNumbers = await this.leadscenario.dispose_5_leads_and_verify();
        const screenshot = await this.page.screenshot();
        await this.attach(screenshot, 'image/png');
        await this.attach(
            `Disposed and verified ${verifiedNumbers.length} leads:\n${verifiedNumbers.join('\n')}`,
            'text/plain'
        );
    } catch (err) {
        console.error('Step failed:', err.message);
        const screenshot = await this.page.screenshot();
        await this.attach(screenshot, 'image/png');
        await this.attach('Step failed: ' + err.message, 'text/plain');
        throw err;
    }
});

Then('Take a Break and refresh the page', /** @this {World} */ async function () {
    try {
        this.leadscenario = new Leadscenario(this.page);
        await this.leadscenario.take_a_break();
        await this.leadscenario.refresh_page();
        const screenshot = await this.page.screenshot();
        await this.attach(screenshot, 'image/png');
        await this.attach('Break taken (OTHER) and page refreshed', 'text/plain');
    } catch (err) {
        console.error('Step failed:', err.message);
        const screenshot = await this.page.screenshot();
        await this.attach(screenshot, 'image/png');
        await this.attach('Step failed: ' + err.message, 'text/plain');
        throw err;
    }
});

Then('Switch back to Admin portal', /** @this {World} */ async function () {
    try {
        this.leadscenario = new Leadscenario(this.page);
        await this.leadscenario.switch_back_to_admin_portal();
        const screenshot = await this.page.screenshot();
        await this.attach(screenshot, 'image/png');
        await this.attach('Switched back to Admin Portal successfully', 'text/plain');
    } catch (err) {
        console.error('Step failed:', err.message);
        const screenshot = await this.page.screenshot();
        await this.attach(screenshot, 'image/png');
        await this.attach('Step failed: ' + err.message, 'text/plain');
        throw err;
    }
});

// -----------------------------------------------------------------------
// Call Logs — Classic View Verification
// -----------------------------------------------------------------------

Given('Go to the Lead Scenario Campaign', /** @this {World} */ async function () {
    try {
        this.leadscenario = new Leadscenario(this.page);
        await this.leadscenario.go_to_lead_scenario_campaign();
        const screenshot = await this.page.screenshot();
        await this.attach(screenshot, 'image/png');
        await this.attach(
            `Navigated into campaign: ${AUTOMATION_CONSTANTS.Campaign_name_for_leads_scenario}`,
            'text/plain'
        );
    } catch (err) {
        console.error('Step failed:', err.message);
        const screenshot = await this.page.screenshot();
        await this.attach(screenshot, 'image/png');
        await this.attach('Step failed: ' + err.message, 'text/plain');
        throw err;
    }
});

When('Go to Call Logs', /** @this {World} */ async function () {
    try {
        this.leadscenario = new Leadscenario(this.page);
        await this.leadscenario.go_to_call_logs();
        const screenshot = await this.page.screenshot();
        await this.attach(screenshot, 'image/png');
        await this.attach('Call Logs section opened successfully', 'text/plain');
    } catch (err) {
        console.error('Step failed:', err.message);
        const screenshot = await this.page.screenshot();
        await this.attach(screenshot, 'image/png');
        await this.attach('Step failed: ' + err.message, 'text/plain');
        throw err;
    }
});

When('Go to Classic View', /** @this {World} */ async function () {
    try {
        this.leadscenario = new Leadscenario(this.page);
        await this.leadscenario.go_to_classic_view();
        const screenshot = await this.page.screenshot();
        await this.attach(screenshot, 'image/png');
        await this.attach('Classic View activated successfully', 'text/plain');
    } catch (err) {
        console.error('Step failed:', err.message);
        const screenshot = await this.page.screenshot();
        await this.attach(screenshot, 'image/png');
        await this.attach('Step failed: ' + err.message, 'text/plain');
        throw err;
    }
});

Then('Verify whether 5 disposition leads are present', /** @this {World} */ async function () {
    try {
        this.leadscenario = new Leadscenario(this.page);
        const result = await this.leadscenario.verify_5_disposition_leads();
        const screenshot = await this.page.screenshot();
        await this.attach(screenshot, 'image/png');

        // Attachment 1 — concise summary
        await this.attach(
            `Call Log — Classic View Summary\n` +
            `────────────────────────────────────\n` +
            `Disposition entries in table : ${result.rowCount}\n` +
            `All entries are Walk-In leads: ${result.allAreWalkInLeads ? 'YES ✅' : 'NO ❌'}\n` +
            `────────────────────────────────────`,
            'text/plain'
        );

        // Attachment 2 — the exact disposed lead numbers (scoped table only)
        await this.attach(
            `Disposed Lead Numbers (${result.disposedNumbers.length}) from Call Log:\n\n` +
            result.disposedNumbers.join('\n'),
            'text/plain'
        );

    } catch (err) {
        console.error('Step failed:', err.message);
        const screenshot = await this.page.screenshot();
        await this.attach(screenshot, 'image/png');
        await this.attach('Step failed: ' + err.message, 'text/plain');
        throw err;
    }
});

// -----------------------------------------------------------------------
// Lead Statistics — Distribution Count Verification
// -----------------------------------------------------------------------

Given('I navigate to the Leads Scenario Pipeline', /** @this {World} */ async function () {
    try {
        this.leadscenario = new Leadscenario(this.page);
        await this.leadscenario.navigate_to_leads_scenario_pipeline();
        const screenshot = await this.page.screenshot();
        await this.attach(screenshot, 'image/png');
        await this.attach(`Navigated to pipeline: ${AUTOMATION_CONSTANTS.PIPELINE_NAME}`, 'text/plain');
    } catch (err) {
        console.error('Step failed:', err.message);
        const screenshot = await this.page.screenshot();
        await this.attach(screenshot, 'image/png');
        await this.attach('Step failed: ' + err.message, 'text/plain');
        throw err;
    }
});

Given('I navigate to the Lead Scenario Campaign', /** @this {World} */ async function () {
    try {
        this.leadscenario = new Leadscenario(this.page);
        await this.leadscenario.go_to_lead_scenario_campaign();
        const screenshot = await this.page.screenshot();
        await this.attach(screenshot, 'image/png');
        await this.attach(`Navigated into campaign: ${AUTOMATION_CONSTANTS.Campaign_name_for_leads_scenario}`, 'text/plain');
    } catch (err) {
        console.error('Step failed:', err.message);
        const screenshot = await this.page.screenshot();
        await this.attach(screenshot, 'image/png');
        await this.attach('Step failed: ' + err.message, 'text/plain');
        throw err;
    }
});

When('I check the lead count in the campaign distribution', /** @this {World} */ async function () {
    try {
        this.leadscenario = new Leadscenario(this.page);
        await this.leadscenario.click_leads_statistics_section();
        const screenshot = await this.page.screenshot();
        await this.attach(screenshot, 'image/png');
        await this.attach('LEADS STATISTICS section opened', 'text/plain');
    } catch (err) {
        console.error('Step failed:', err.message);
        const screenshot = await this.page.screenshot();
        await this.attach(screenshot, 'image/png');
        await this.attach('Step failed: ' + err.message, 'text/plain');
        throw err;
    }
});

Then('the lead count should be displayed according to the lead status', /** @this {World} */ async function () {
    try {
        this.leadscenario = new Leadscenario(this.page);
        const stats = await this.leadscenario.verify_lead_distribution_statistics();
        const screenshot = await this.page.screenshot();
        await this.attach(screenshot, 'image/png');
        await this.attach(
            `Lead Distribution Statistics — Verified\n` +
            `─────────────────────────────────────────\n` +
            `TOTAL         : ${stats.total}   ✅\n` +
            `UNCONTACTED   : ${stats.uncontacted}    ✅\n` +
            `IN-PROGRESS   : ${stats.inProgress}    ✅\n` +
            `NOT CONNECTED : ${stats.notConnected}    ✅\n` +
            `─────────────────────────────────────────\n` +
            `10 Walk-In leads added → 5 disposed (Not Connected) → 5 Uncontacted`,
            'text/plain'
        );
    } catch (err) {
        console.error('Step failed:', err.message);
        const screenshot = await this.page.screenshot();
        await this.attach(screenshot, 'image/png');
        await this.attach('Step failed: ' + err.message, 'text/plain');
        throw err;
    }
});

// -----------------------------------------------------------------------
// Deletion — Leads Scenario Campaign & Pipeline
// -----------------------------------------------------------------------

Given('Navigate to the Leads Scenario Pipeline', /** @this {World} */ async function () {
    try {
        this.leadscenario = new Leadscenario(this.page);
        await this.leadscenario.navigate_to_leads_scenario_pipeline();
        const screenshot = await this.page.screenshot();
        await this.attach(screenshot, 'image/png');
        await this.attach('Navigated to Leads Scenario Pipeline successfully', 'text/plain');
    } catch (err) {
        console.error('Step failed:', err.message);
        const screenshot = await this.page.screenshot();
        await this.attach(screenshot, 'image/png');
        await this.attach('Step failed: ' + err.message, 'text/plain');
        throw err;
    }
});

When('Delete the Leads Scenario Campaign', /** @this {World} */ async function () {
    try {
        this.leadscenario = new Leadscenario(this.page);
        await this.leadscenario.delete_leads_scenario_campaign();
        const screenshot = await this.page.screenshot();
        await this.attach(screenshot, 'image/png');
        await this.attach(
            `Campaign "${AUTOMATION_CONSTANTS.Campaign_name_for_leads_scenario}" selected and deleted`,
            'text/plain'
        );
    } catch (err) {
        console.error('Step failed:', err.message);
        const screenshot = await this.page.screenshot();
        await this.attach(screenshot, 'image/png');
        await this.attach('Step failed: ' + err.message, 'text/plain');
        throw err;
    }
});

Then('Leads Scenario Campaign should be deleted successfully', /** @this {World} */ async function () {
    try {
        this.leadscenario = new Leadscenario(this.page);
        await this.leadscenario.verify_leads_scenario_campaign_deleted();
        const screenshot = await this.page.screenshot();
        await this.attach(screenshot, 'image/png');
        await this.attach('VERIFIED: Leads Scenario Campaign deleted successfully', 'text/plain');
    } catch (err) {
        console.error('Step failed:', err.message);
        const screenshot = await this.page.screenshot();
        await this.attach(screenshot, 'image/png');
        await this.attach('Step failed: ' + err.message, 'text/plain');
        throw err;
    }
});
