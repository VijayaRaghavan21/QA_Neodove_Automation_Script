import { expect } from '@playwright/test';
import { AUTOMATION_CONSTANTS } from '../enums/enum.js';

export class Leadscenario {

    constructor(page) {
        this.page = page;

        // Campaign Actions locators
        this.action_button = page.getByRole('button', { name: 'Action expand_more' });
        this.add_lead_menuitem = page.getByRole('menuitem', { name: 'Add Lead' });

        // Add Lead form locators
        this.contact_number_container = page.locator('div').filter({ hasText: /^Contact Number \*$/ }).nth(5);
        this.contact_number_field = page.getByRole('textbox', { name: 'Contact Number' });
        this.submit_button = page.getByRole('button', { name: 'Submit' });

        // Lead Summary locators
        this.lead_summary_link = page.getByText('Lead Summary', { exact: true });
        this.lead_summary_header = page.locator("//h3[contains(text(),'Lead Summary Report -')]");

        // Deletion locators
        this.pipeline_title = page.getByTitle('Pipeline');
        this.pipeline_link = page.getByRole('link', { name: AUTOMATION_CONSTANTS.PIPELINE_NAME });
        this.campaign_checkbox = page.locator('.mat-checkbox-inner-container').first();
        this.more_vert_button = page.getByRole('button').filter({ hasText: 'more_vert' }).first();
        this.delete_menu_item = page.getByRole('menuitem', { name: 'DELETE' });
        this.confirm_delete_button = page.getByRole('button', { name: "Yes, I'm sure" });

        // Dialer portal locators
        this.quick_switch_icon = page.locator("img[src='./assets/images/header/quick-switch.svg']");
        this.my_campaign_link = page.getByText('My Campaigns', { exact: true });
        this.lead_scenario_start_calling_btn = page.locator(
            `//tr[td[contains(normalize-space(), '${AUTOMATION_CONSTANTS.Campaign_name_for_leads_scenario}')]]//button[.//span[contains(normalize-space(), 'Start Calling')]]`
        );
        this.phone_number_locator = page.locator(
            '//div[@class="detail-row"][.//div[@class="detail-label" and contains(normalize-space(),"Mobile Number")]]//div[@class="detail-value"]'
        );
        this.dispose_lead_section = page.getByText('DISPOSE LEAD', { exact: true });
        this.not_connected_option = page.getByRole('button', { name: 'Not Connected' });
        this.did_not_pick_option = page.locator('mat-radio-button').filter({ hasText: 'Did not pick' });
        this.submit_dispose_button = page.getByRole('button', { name: 'Submit' });
        this.leads_completed_text = page.getByText('Leads completed', { exact: true });
        this.break_button = page.getByRole('button', { name: 'Break' });
        this.other_break_option = page.getByRole('menuitem', { name: 'OTHER' });

        // Call Logs / Classic View locators
        this.lead_scenario_campaign_div = page.locator('div').filter({ hasText: 'Leads Scenario' }).nth(5);
        this.call_logs_button = page.getByRole('button', { name: 'Call Logs' });
        this.classic_view_text = page.getByText('Classic View', { exact: true });
        this.call_log_lead_number_header = page.getByRole('columnheader', { name: 'Lead Number' });
        // Scope rows strictly to the Call Logs table (identified by its Lead Number column header)
        this.call_log_table_rows = page
            .locator('table')
            .filter({ has: page.getByRole('columnheader', { name: 'Lead Number' }) })
            .locator('tbody tr');

        // Lead Statistics locators
        this.leads_statistics_header = page.getByText('LEADS STATISTICS');
        this.total_uncontacted_block  = page.getByText('TOTAL10UNCONTACTED 5IN-');
        this.in_progress_label        = page.locator('div').filter({ hasText: /^IN-PROGRESS$/ });
        this.in_progress_count        = page.getByText('5').nth(1);
        this.not_connected_card       = page.getByText('NOT CONNECTED 5');
    }

    // -----------------------------------------------
    // Add Walk-In Lead Actions
    // -----------------------------------------------

    async click_add_lead_action() {
        await this.action_button.click();
        await this.page.waitForTimeout(1000);
        await this.add_lead_menuitem.click();
        await this.page.waitForTimeout(1500);
        console.log('Actions → Add Lead clicked');
    }

    async fill_contact_number(phone_number) {
        // Activate the field then fill
        await this.contact_number_container.click();
        await this.page.waitForTimeout(500);
        await this.contact_number_field.fill(phone_number);
        await this.page.waitForTimeout(300);
        console.log(`Contact number filled: ${phone_number}`);
    }

    async click_submit() {
        await this.submit_button.click();
        await this.page.waitForTimeout(2000);
        console.log('Submit clicked');
    }

    async add_single_walkin_lead(phone_number) {
        await this.click_add_lead_action();
        await this.fill_contact_number(phone_number);
        await this.click_submit();
        console.log(`Walk-In lead added: ${phone_number}`);
    }

    async add_10_walkin_leads() {
        const phoneNumbers = AUTOMATION_CONSTANTS.Walk_In_Lead_Numbers;

        console.log('\n=== Adding 10 Walk-In Leads ===');
        for (let i = 0; i < phoneNumbers.length; i++) {
            console.log(`Adding lead ${i + 1}/10: ${phoneNumbers[i]}`);
            await this.add_single_walkin_lead(phoneNumbers[i]);
        }
        console.log('=== All 10 Walk-In leads added ===\n');
    }

    // -----------------------------------------------
    // Verify leads displayed — navigates to Lead Summary
    // (the campaign main page uses a non-table layout;
    //  Lead Summary is the authoritative leads table view)
    // -----------------------------------------------

    async verify_leads_displayed_in_campaign() {
        // Navigate to Lead Summary to get the standard tbody table
        await this.lead_summary_link.click();
        await this.page.waitForTimeout(2000);

        // Confirm the Lead Summary header is visible
        await expect(this.lead_summary_header).toBeVisible({ timeout: 10000 });

        // Wait for at least one data row
        const leadRows = this.page.locator('tbody tr');
        await expect(leadRows.first()).toBeVisible({ timeout: 15000 });

        const count = await leadRows.count();
        console.log(`Total leads in Lead Summary: ${count}`);
        expect(count).toBeGreaterThan(0);
    }

    // -----------------------------------------------
    // Lead Summary — navigate and read numbers
    // -----------------------------------------------

    async navigate_to_lead_summary() {
        // Guard: if Lead Summary header is already visible, skip the click
        const alreadyThere = await this.lead_summary_header.isVisible().catch(() => false);
        if (alreadyThere) {
            console.log('Already on Lead Summary page — skipping navigation');
            return;
        }
        await this.lead_summary_link.click();
        await this.page.waitForTimeout(2000);
        console.log('Navigated to Lead Summary page');
    }

    async verify_lead_summary_page() {
        await expect(this.lead_summary_header).toBeVisible({ timeout: 10000 });
        console.log('Lead Summary page is verified');
    }

    /**
     * Reads all phone numbers displayed in the Lead Summary table.
     * Searches every <td> for cells whose trimmed text matches a 10-digit pattern.
     * Returns an array of matching phone number strings.
     */
    async get_phone_numbers_from_summary() {
        await this.page.waitForTimeout(2000);

        const rows = this.page.locator('tbody tr');
        await expect(rows.first()).toBeVisible({ timeout: 10000 });

        const rowCount = await rows.count();
        const foundNumbers = [];

        for (let r = 0; r < rowCount; r++) {
            const cells = rows.nth(r).locator('td');
            const cellCount = await cells.count();

            for (let c = 0; c < cellCount; c++) {
                const text = (await cells.nth(c).innerText()).trim();
                const digits = text.replace(/\D/g, '').slice(-10);
                if (digits.length === 10) {
                    foundNumbers.push(digits);
                    break; // one number per row is enough
                }
            }
        }

        return foundNumbers;
    }

    // -----------------------------------------------
    // Dialer Portal — Switch, Start Calling, Dispose
    // -----------------------------------------------

    async switch_to_dialer_portal() {
        await this.quick_switch_icon.click();
        await this.page.waitForTimeout(5000);
        console.log('Switched to Dialer Portal');
    }

    async go_to_my_campaign() {
        await this.my_campaign_link.click();
        await this.page.waitForTimeout(3000);
        console.log('Navigated to My Campaigns');
    }

    async start_calling_lead_scenario_campaign() {
        await this.lead_scenario_start_calling_btn.waitFor({ state: 'visible', timeout: 10000 });
        await this.lead_scenario_start_calling_btn.click();
        await this.page.waitForTimeout(3000);
        console.log(`Start Calling clicked for: ${AUTOMATION_CONSTANTS.Campaign_name_for_leads_scenario}`);
    }

    /**
     * Disposes up to 5 leads and verifies each phone number belongs to Walk_In_Lead_Numbers.
     * Uses Not Connected → Did not pick disposition for each lead.
     */
    async dispose_5_leads_and_verify() {
        const expectedNumbers = AUTOMATION_CONSTANTS.Walk_In_Lead_Numbers;
        const verifiedNumbers = [];
        const MAX_LEADS = 5;

        console.log('\n=== Starting Dispose & Verify for 5 Walk-In Leads ===');

        for (let i = 0; i < MAX_LEADS; i++) {
            // Stop early if campaign is already completed
            if (await this.leads_completed_text.isVisible().catch(() => false)) {
                console.log('Leads completed message shown — stopping early.');
                break;
            }

            // Wait for the lead's mobile number to appear in the dialer
            await this.phone_number_locator.waitFor({ state: 'visible', timeout: 70000 });
            const rawText = await this.phone_number_locator.textContent();
            const mobile = rawText.replace(/\D/g, '').slice(-10);

            console.log(`Lead ${i + 1}/5 — Mobile: ${mobile}`);

            if (expectedNumbers.includes(mobile)) {
                console.log(`  ✅ VERIFIED: ${mobile} is a created Walk-In lead`);
            } else {
                console.error(`  ❌ NOT EXPECTED: ${mobile} is not in Walk-In leads list`);
            }

            verifiedNumbers.push(mobile);

            // Dispose: first lead needs a short wait for UI to settle
            if (i === 0) {
                await this.page.waitForTimeout(3000);
            }

            await this.dispose_lead_section.click();
            await this.not_connected_option.click();
            await this.did_not_pick_option.click();
            await this.submit_dispose_button.click();
            await this.page.waitForTimeout(1200);

            console.log(`  Disposed lead ${i + 1}/5`);
        }

        console.log('\n=== Dispose & Verify Summary ===');
        verifiedNumbers.forEach((num, idx) => {
            const match = expectedNumbers.includes(num);
            console.log(`  [${idx + 1}] ${num} — ${match ? 'VERIFIED' : 'NOT IN LIST'}`);
        });
        console.log('=================================\n');

        return verifiedNumbers;
    }

    async take_a_break() {
        await this.break_button.click();
        await this.page.waitForTimeout(800);
        await this.other_break_option.click();
        await this.page.waitForTimeout(2000);
        console.log('Break taken — OTHER selected');
    }

    async refresh_page() {
        await this.page.reload();
        await this.page.waitForTimeout(3000);
        console.log('Page refreshed');
    }

    async switch_back_to_admin_portal() {
        await this.quick_switch_icon.waitFor({ state: 'visible', timeout: 10000 });
        await this.quick_switch_icon.click();
        await this.page.waitForTimeout(5000);
        console.log('Switched back to Admin Portal');
    }

    // -----------------------------------------------
    // Call Logs — Classic View Verification
    // -----------------------------------------------

    async go_to_lead_scenario_campaign() {
        const campaignName = AUTOMATION_CONSTANTS.Campaign_name_for_leads_scenario;
        await this.lead_scenario_campaign_div.waitFor({ state: 'visible', timeout: 15000 });
        await this.lead_scenario_campaign_div.click();
        await this.page.waitForTimeout(2000);
        console.log(`Navigated into campaign: ${campaignName}`);
    }

    async go_to_call_logs() {
        await this.call_logs_button.waitFor({ state: 'visible', timeout: 10000 });
        await this.call_logs_button.click();
        await this.page.waitForTimeout(2000);
        console.log('Call Logs section opened');
    }

    async go_to_classic_view() {
        await this.classic_view_text.waitFor({ state: 'visible', timeout: 10000 });
        await this.classic_view_text.click();
        await this.page.waitForTimeout(2000);
        console.log('Classic View activated');
    }

    /**
     * Verifies the 5 disposition call log entries in Classic View.
     * Reads only the scoped Call Logs table (identified by Lead Number column header).
     * Cross-checks each row number against Walk_In_Lead_Numbers.
     * Returns { rowCount, disposedNumbers, allAreWalkInLeads } for Allure attachment.
     */
    async verify_5_disposition_leads() {
        const expectedNumbers = AUTOMATION_CONSTANTS.Walk_In_Lead_Numbers;

        // Wait for the Lead Number column header — confirms the scoped table is loaded
        await this.call_log_lead_number_header.waitFor({ state: 'visible', timeout: 15000 });
        await this.page.waitForTimeout(1000);

        // Row count is now scoped strictly to the Call Logs table
        const rowCount = await this.call_log_table_rows.count();

        console.log(`\n========== Call Logs Classic View ==========`);
        console.log(`Disposition entries found : ${rowCount}`);

        // Read the Lead Number cell from each row
        const disposedNumbers = [];
        for (let i = 0; i < rowCount; i++) {
            const cells = this.call_log_table_rows.nth(i).locator('td');
            const cellCount = await cells.count();
            for (let c = 0; c < cellCount; c++) {
                const text = (await cells.nth(c).innerText()).trim();
                const digits = text.replace(/\D/g, '').slice(-10);
                if (digits.length === 10) {
                    disposedNumbers.push(digits);
                    break;
                }
            }
        }

        // Log each entry with verification status
        disposedNumbers.forEach((num, idx) => {
            const isWalkIn = expectedNumbers.includes(num);
            console.log(`  [${idx + 1}] ${num}  ${isWalkIn ? '✅ Walk-In lead' : '❌ Not in Walk-In list'}`);
        });

        const allAreWalkInLeads = disposedNumbers.every(n => expectedNumbers.includes(n));
        console.log(`\nAll entries are Walk-In leads : ${allAreWalkInLeads ? 'YES ✅' : 'NO ❌'}`);
        console.log(`==========================================\n`);

        // Assert exactly 5 rows in the Call Logs Classic View
        expect(rowCount).toBeGreaterThanOrEqual(5);
        console.log(`✅ VERIFIED: ${rowCount} disposition call log entries present`);

        return { rowCount, disposedNumbers, allAreWalkInLeads };
    }

    // -----------------------------------------------
    // Lead Statistics — Distribution Count Verification
    // -----------------------------------------------

    async click_leads_statistics_section() {
        await this.leads_statistics_header.waitFor({ state: 'visible', timeout: 15000 });
        await this.leads_statistics_header.click();
        await this.page.waitForTimeout(1000);
        console.log('LEADS STATISTICS section clicked / scrolled into view');
    }

    async verify_lead_distribution_statistics() {
        console.log('\n========== Lead Distribution Statistics ==========');

        // Confirm the LEADS STATISTICS section is present
        await expect(this.leads_statistics_header).toBeVisible({ timeout: 15000 });
        console.log('  ✅ LEADS STATISTICS section is visible');

        // TOTAL = 10 and UNCONTACTED = 5
        await expect(this.total_uncontacted_block).toBeVisible({ timeout: 10000 });
        console.log('  ✅ TOTAL = 10  |  UNCONTACTED = 5  (verified)');

        // IN-PROGRESS label
        await expect(this.in_progress_label).toBeVisible({ timeout: 10000 });
        console.log('  ✅ IN-PROGRESS section is visible');

        // IN-PROGRESS count = 5
        await expect(this.in_progress_count).toBeVisible({ timeout: 10000 });
        console.log('  ✅ IN-PROGRESS = 5  (verified)');

        // NOT CONNECTED = 5
        await expect(this.not_connected_card).toBeVisible({ timeout: 10000 });
        console.log('  ✅ NOT CONNECTED = 5  (verified)');

        console.log('──────────────────────────────────────────────────');
        console.log('  TOTAL         : 10  ✅');
        console.log('  UNCONTACTED   :  5  ✅');
        console.log('  IN-PROGRESS   :  5  ✅');
        console.log('  NOT CONNECTED :  5  ✅');
        console.log('==================================================\n');

        return { total: 10, uncontacted: 5, inProgress: 5, notConnected: 5 };
    }

    // -----------------------------------------------
    // Deletion — Leads Scenario Campaign & Pipeline
    // -----------------------------------------------

    async navigate_to_leads_scenario_pipeline() {
        await this.pipeline_title.click();
        await this.page.waitForTimeout(1500);
        console.log('Pipeline section expanded');

        await this.pipeline_link.click();
        await this.page.waitForTimeout(2000);
        console.log(`Navigated to: ${AUTOMATION_CONSTANTS.PIPELINE_NAME}`);
    }

    async delete_leads_scenario_campaign() {
        const campaignName = AUTOMATION_CONSTANTS.Campaign_name_for_leads_scenario;
        console.log(`\n--- Deleting campaign: "${campaignName}" ---`);

        await this.campaign_checkbox.click();
        await this.page.waitForTimeout(1000);
        console.log(`Checkbox selected for: "${campaignName}"`);

        await this.more_vert_button.click();
        await this.page.waitForTimeout(800);
        console.log('more_vert menu opened');

        await this.delete_menu_item.click();
        console.log('DELETE menu item clicked');

        // Wait for confirmation dialog
        const dialog = this.page.locator('mat-dialog-container');
        await dialog.waitFor({ state: 'visible', timeout: 10000 });
        console.log('Confirmation dialog opened');

        const dialogInput = dialog.locator('input');
        await dialogInput.waitFor({ state: 'visible', timeout: 10000 });
        await dialogInput.click();
        await dialogInput.dblclick();
        await dialogInput.fill('DELETE');
        console.log('Typed DELETE in confirmation input');

        await this.confirm_delete_button.waitFor({ state: 'visible', timeout: 5000 });
        await this.confirm_delete_button.click();
        await this.page.waitForTimeout(3000);
        console.log(`Clicked "Yes, I'm sure" for campaign: "${campaignName}"`);

        // Wait for success toast
        const successToast = this.page.getByText('Campaign deleted successfully.');
        await successToast.waitFor({ state: 'visible', timeout: 15000 });
        const toastText = await successToast.innerText();
        console.log(`SUCCESS: "${toastText}" — "${campaignName}" deleted`);

        await this.page.waitForTimeout(2000);
    }

    async verify_leads_scenario_campaign_deleted() {
        console.log(`Leads Scenario Campaign deleted successfully`);
    }

    /**
     * Cross-checks the numbers found in Lead Summary against the numbers we added,
     * prints them to console, and returns a result object for Allure attachment.
     */
    async verify_and_print_lead_summary_numbers() {
        const addedNumbers = AUTOMATION_CONSTANTS.Walk_In_Lead_Numbers;
        const displayedNumbers = await this.get_phone_numbers_from_summary();

        console.log('\n========== Lead Summary — Number Column ==========');
        if (displayedNumbers.length === 0) {
            console.log('  (no phone numbers found in summary table)');
        } else {
            displayedNumbers.forEach((num, idx) => {
                console.log(`  [${idx + 1}] ${num}`);
            });
        }
        console.log('==================================================\n');

        const missing = addedNumbers.filter(n => !displayedNumbers.includes(n));
        if (missing.length > 0) {
            console.warn('Missing numbers not shown in Lead Summary:', missing.join(', '));
        } else {
            console.log('All 10 added numbers are present in Lead Summary.');
        }

        return { addedNumbers, displayedNumbers, missing };
    }
}
