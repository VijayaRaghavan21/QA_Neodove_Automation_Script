import { Given, When, Then } from '@cucumber/cucumber';
import { LeadSummaryFilter } from '../pages/LeadSummaryFilter.js';
import { AUTOMATION_CONSTANTS } from '../enums/enum.js';

/** @typedef {import('../support/hooks.js').CustomWorld} World */

// -----------------------------------------------------------------------
// Navigation — Campaign → Lead Summary
// -----------------------------------------------------------------------

Given('I go to the Lead Scenario Campaign', /** @this {World} */ async function () {
    try {
        this.leadsummaryfilter = new LeadSummaryFilter(this.page);
        await this.leadsummaryfilter.go_to_lead_scenario_campaign();
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

Given('I click on the Lead summary', /** @this {World} */ async function () {
    try {
        this.leadsummaryfilter = new LeadSummaryFilter(this.page);
        await this.leadsummaryfilter.click_lead_summary();
        const screenshot = await this.page.screenshot();
        await this.attach(screenshot, 'image/png');
        await this.attach('Lead Summary Report page opened successfully', 'text/plain');
    } catch (err) {
        console.error('Step failed:', err.message);
        const screenshot = await this.page.screenshot();
        await this.attach(screenshot, 'image/png');
        await this.attach('Step failed: ' + err.message, 'text/plain');
        throw err;
    }
});

// -----------------------------------------------------------------------
// Open Date filter dropdown
// -----------------------------------------------------------------------

Given('I click on the Date filter', /** @this {World} */ async function () {
    try {
        this.leadsummaryfilter = new LeadSummaryFilter(this.page);
        await this.leadsummaryfilter.open_date_filter_dropdown();
        const screenshot = await this.page.screenshot();
        await this.attach(screenshot, 'image/png');
        await this.attach('Date filter dropdown opened — options visible', 'text/plain');
    } catch (err) {
        console.error('Step failed:', err.message);
        const screenshot = await this.page.screenshot();
        await this.attach(screenshot, 'image/png');
        await this.attach('Step failed: ' + err.message, 'text/plain');
        throw err;
    }
});

// -----------------------------------------------------------------------
// Apply all 6 filters in sequence and capture results
// -----------------------------------------------------------------------

When('I apply each filter and verify the Lead creation date matches the selected filter',
    /** @this {World} */ async function () {
    try {
        this.leadsummaryfilter = new LeadSummaryFilter(this.page);
        this.filterResults = await this.leadsummaryfilter.apply_all_filters_and_verify();

        const screenshot = await this.page.screenshot();
        await this.attach(screenshot, 'image/png');

        // Attach per-filter detail rows
        const detail = Object.entries(this.filterResults)
            .map(([f, d]) => `  ${f.padEnd(15)} : ${d.rowCount} lead(s)  | first date: ${d.firstDate}`)
            .join('\n');

        await this.attach(
            `Date Filter Results — All Filters Applied\n` +
            `──────────────────────────────────────────────────\n` +
            detail + '\n' +
            `──────────────────────────────────────────────────`,
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
// Final verification — assert and summarise for Allure
// -----------------------------------------------------------------------

Then('the Leads should be displayed successfully according to the applied filter',
    /** @this {World} */ async function () {
    try {
        const results = this.filterResults;

        // Today and This Month must show at least 1 lead (leads were added today)
        if ((results['Today']?.rowCount ?? 0) === 0) {
            throw new Error('"Today" filter returned 0 leads — expected at least 1');
        }
        if ((results['This Month']?.rowCount ?? 0) === 0) {
            throw new Error('"This Month" filter returned 0 leads — expected at least 1');
        }

        // Fail if any filter's dates did not match its expected range
        const dateFails = Object.entries(results).filter(([, r]) => r.pass === false);
        if (dateFails.length > 0) {
            throw new Error(
                `Date mismatch for filter(s): ${dateFails.map(([f, r]) => `${f} (${r.note})`).join(', ')}`
            );
        }

        const screenshot = await this.page.screenshot();
        await this.attach(screenshot, 'image/png');

        // Allure summary table — rows + date-range verification per filter
        const filterNames = ['Today', 'Yesterday', 'Last 7 days', 'Last 30 days', 'This Month', 'Custom Range'];
        const tableRows = filterNames.map(f => {
            const r      = results[f] ?? {};
            const count  = String(r.rowCount ?? 0).padStart(4);
            const date   = (r.firstDate ?? '–').padEnd(24);
            const status = r.pass !== false ? '✅ PASS' : '❌ FAIL';
            const note   = r.note ?? '';
            return `  ${f.padEnd(15)} ${count} leads  | ${date} | ${status}  ${note}`;
        }).join('\n');

        await this.attach(
            `Lead Summary — Date Filter Verification\n` +
            `══════════════════════════════════════════════════════════════════\n` +
            `  Filter           Leads  First Creation Date       Dates Match\n` +
            `  ────────────────────────────────────────────────────────────────\n` +
            tableRows + '\n' +
            `  ────────────────────────────────────────────────────────────────\n` +
            `  NOTE: Today = 0 rows is acceptable when leads were created before today\n` +
            `══════════════════════════════════════════════════════════════════`,
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
// Users filter — Lead Summary
// -----------------------------------------------------------------------

Given('the user clicks on the {string} filter', /** @this {World} */ async function (filterName) {
    try {
        this.leadsummaryfilter = new LeadSummaryFilter(this.page);
        if (filterName !== 'Users') {
            throw new Error(`Unsupported filter for this step: "${filterName}"`);
        }
        await this.leadsummaryfilter.open_users_filter();
        const screenshot = await this.page.screenshot();
        await this.attach(screenshot, 'image/png');
        await this.attach('Users filter opened', 'text/plain');
    } catch (err) {
        console.error('Step failed:', err.message);
        const screenshot = await this.page.screenshot();
        await this.attach(screenshot, 'image/png');
        await this.attach('Step failed: ' + err.message, 'text/plain');
        throw err;
    }
});

When('the user selects a user from the list', /** @this {World} */ async function () {
    try {
        this.leadsummaryfilter = this.leadsummaryfilter ?? new LeadSummaryFilter(this.page);
        const assignee = AUTOMATION_CONSTANTS.Agent_Name;
        await this.leadsummaryfilter.select_user_after_empty_state_probe(assignee);
        this.selectedLeadAssignee = assignee;

        const screenshot = await this.page.screenshot();
        await this.attach(screenshot, 'image/png');
        await this.attach(
            `User filter applied for assignee: ${assignee} (after NO USER ASSIGNED empty-state check)`,
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

Then('only leads assigned to the selected user should be displayed',
    /** @this {World} */ async function () {
    try {
        this.leadsummaryfilter = this.leadsummaryfilter ?? new LeadSummaryFilter(this.page);
        const assignee = this.selectedLeadAssignee ?? AUTOMATION_CONSTANTS.Agent_Name;
        const leadCount =
            await this.leadsummaryfilter.assert_all_table_rows_assigned_to_user(assignee);

        const screenshot = await this.page.screenshot();
        await this.attach(screenshot, 'image/png');
        await this.attach(
            `All ${leadCount} displayed lead(s) show User Assigned = ${assignee}`,
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
// Stage filter — Lead Summary
// -----------------------------------------------------------------------

Given('I click on the Stage filter', /** @this {World} */ async function () {
    try {
        this.leadsummaryfilter = new LeadSummaryFilter(this.page);
        await this.leadsummaryfilter.open_stage_filter();
        const screenshot = await this.page.screenshot();
        await this.attach(screenshot, 'image/png');
        await this.attach('Stage filter opened', 'text/plain');
    } catch (err) {
        console.error('Step failed:', err.message);
        const screenshot = await this.page.screenshot();
        await this.attach(screenshot, 'image/png');
        await this.attach('Step failed: ' + err.message, 'text/plain');
        throw err;
    }
});

When('I select OPEN stage and apply the filter', /** @this {World} */ async function () {
    try {
        this.leadsummaryfilter = this.leadsummaryfilter ?? new LeadSummaryFilter(this.page);
        await this.leadsummaryfilter.select_open_stage_and_apply();
        this.selectedLeadStage = 'OPEN';

        const screenshot = await this.page.screenshot();
        await this.attach(screenshot, 'image/png');
        await this.attach('Stage filter OPEN applied', 'text/plain');
    } catch (err) {
        console.error('Step failed:', err.message);
        const screenshot = await this.page.screenshot();
        await this.attach(screenshot, 'image/png');
        await this.attach('Step failed: ' + err.message, 'text/plain');
        throw err;
    }
});

Then('all displayed leads should show Lead Stage as OPEN',
    /** @this {World} */ async function () {
    try {
        this.leadsummaryfilter = this.leadsummaryfilter ?? new LeadSummaryFilter(this.page);
        const stage = this.selectedLeadStage ?? 'OPEN';
        const rowCount = await this.leadsummaryfilter.assert_all_table_rows_lead_stage(stage);

        const screenshot = await this.page.screenshot();
        await this.attach(screenshot, 'image/png');
        await this.attach(
            `All ${rowCount} displayed lead(s) show Lead Stage = ${stage}`,
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
// Filters panel → Lead Status tab
// -----------------------------------------------------------------------

When('I apply Filters with Lead Status {string}', /** @this {World} */ async function (statusLabel) {
    try {
        this.leadsummaryfilter = this.leadsummaryfilter ?? new LeadSummaryFilter(this.page);
        await this.leadsummaryfilter.apply_lead_status_filter(statusLabel);

        const screenshot = await this.page.screenshot();
        await this.attach(screenshot, 'image/png');
        await this.attach(`Filters → Status → ${statusLabel} → Apply`, 'text/plain');
    } catch (err) {
        console.error('Step failed:', err.message);
        const screenshot = await this.page.screenshot();
        await this.attach(screenshot, 'image/png');
        await this.attach('Step failed: ' + err.message, 'text/plain');
        throw err;
    }
});

Then('{int} leads should be displayed with Lead Status {string}',
    /** @this {World} */ async function (expectedCount, statusLabel) {
    try {
        this.leadsummaryfilter = this.leadsummaryfilter ?? new LeadSummaryFilter(this.page);
        await this.leadsummaryfilter.assert_lead_status_column_exact_count(statusLabel, expectedCount);

        const screenshot = await this.page.screenshot();
        await this.attach(screenshot, 'image/png');
        await this.attach(
            `Lead Status column: ${expectedCount} cell(s) = "${statusLabel}"`,
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
// Filters → Lead Details + Status + Stages (single Apply)
// -----------------------------------------------------------------------

When('I apply combined Filters Contact Number Status In-Progress and Stage OPEN',
    /** @this {World} */ async function () {
    try {
        this.leadsummaryfilter = new LeadSummaryFilter(this.page);
        const phone = AUTOMATION_CONSTANTS.Combined_Filter_Contact_Number;
        this.combinedFilterPhone = phone;

        await this.leadsummaryfilter.apply_combined_filters_contact_status_stage(
            phone,
            'In-Progress'
        );

        const screenshot = await this.page.screenshot();
        await this.attach(screenshot, 'image/png');
        await this.attach(
            `Filters: Lead Details → ${phone} → Status In-Progress → Stages OPEN → Apply`,
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

Then('the filtered lead should display with Lead Status {string} and Lead Stage {string}',
    /** @this {World} */ async function (statusLabel, stageLabel) {
    try {
        this.leadsummaryfilter = this.leadsummaryfilter ?? new LeadSummaryFilter(this.page);
        const phone =
            this.combinedFilterPhone ?? AUTOMATION_CONSTANTS.Combined_Filter_Contact_Number;

        await this.leadsummaryfilter.assert_filtered_lead_row_phone_status_stage(
            phone,
            statusLabel,
            stageLabel
        );

        const screenshot = await this.page.screenshot();
        await this.attach(screenshot, 'image/png');
        await this.attach(
            `Row matches phone ${phone}, Lead Status ${statusLabel}, Lead Stage ${stageLabel}`,
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
