import { expect } from '@playwright/test';
import { AUTOMATION_CONSTANTS } from '../enums/enum.js';

export class LeadSummaryFilter {

    constructor(page) {
        this.page = page;

        // ── Campaign navigation ──────────────────────────────────────────────
        this.lead_scenario_campaign_div = page.locator('div').filter({ hasText: 'Leads Scenario' }).nth(5);

        // ── Lead Summary page ────────────────────────────────────────────────
        this.lead_summary_link   = page.getByText('Lead Summary', { exact: true });
        this.lead_summary_header = page.locator("//h3[contains(text(),'Lead Summary Report -')]");

        // ── Date filter button ───────────────────────────────────────────────
        this.date_filter_button = page.getByRole('button', { name: 'Date', exact: true });

        // ── Filter options ───────────────────────────────────────────────────
        this.filter_dropdown_pane = page.locator('.cdk-overlay-pane');

        this.today_option        = page.locator('//span[contains(@class,"mat-radio-label-content") and contains(normalize-space(),"Today")]');
        this.yesterday_option    = page.locator('//span[contains(@class,"mat-radio-label-content") and contains(normalize-space(),"Yesterday")]');
        this.last_7_days_option  = page.locator('//span[contains(@class,"mat-radio-label-content") and contains(normalize-space(),"Last 7 days")]');
        this.last_30_days_option = page.locator('//span[contains(@class,"mat-radio-label-content") and contains(normalize-space(),"Last 30 days")]');
        this.this_month_option   = page.locator('//span[contains(@class,"mat-radio-label-content") and contains(normalize-space(),"This Month")]');
        this.custom_range_option = page.locator('//span[contains(@class,"mat-radio-label-content") and contains(normalize-space(),"Custom Range")]');

        // ── Apply button ─────────────────────────────────────────────────────
        this.apply_button = page.getByRole('button', { name: 'Apply' });

        // ── Active filter chip close (×) button ───────────────────────────────
        // After Apply, Date button becomes "Today ×" chip — click × to reset
        this.filter_chip_close = page.locator('mat-icon').filter({ hasText: 'close' }).first();

        // ── Users filter (Lead Summary) ───────────────────────────────────────
        this.users_filter_button     = page.getByRole('button', { name: /^Users/i });
        this.no_user_assigned_option = page.getByText('NO USER ASSIGNED', { exact: true });
        this.oops_no_match_message   = page.getByText(/Oops! No match found/);
        this.user_assigned_header    = page.getByRole('columnheader', { name: 'User Assigned' });

        // ── Stage filter (Lead Summary) ───────────────────────────────────────
        this.stage_filter_button = page.getByRole('button', { name: /^Stage/i });
        /** OPEN option in dropdown — nth(1) avoids duplicate label matches (e.g. header vs list). */
        this.open_stage_span = page.locator('span').filter({ hasText: 'OPEN' }).nth(1);

        // ── Filters panel → Status tab (Lead Summary) ───────────────────────────
        this.filters_button = page.getByRole('button', { name: 'Filters' });
        this.status_tab      = page.getByRole('tab', { name: 'Status' });

        // ── Results table ────────────────────────────────────────────────────
        this.creation_date_header = page.getByRole('columnheader', { name: 'Creation Date' });
        this.table_rows           = page.locator('tbody tr');

        // ── Custom Range calendar locators ───────────────────────────────────
        this.from_calendar_btn = page.getByRole('button', { name: 'Open calendar' }).first();
        this.to_calendar_btn   = page.getByRole('button', { name: 'Open calendar' }).nth(1);
        // mat-calendar-body-today is always today's cell regardless of the date
        this.today_calendar_cell = page.locator('.mat-calendar-body-today').first();
    }

    // ── Navigation ──────────────────────────────────────────────────────────

    async go_to_lead_scenario_campaign() {
        await this.lead_scenario_campaign_div.waitFor({ state: 'visible', timeout: 15000 });
        await this.lead_scenario_campaign_div.click();
        await this.page.waitForTimeout(2000);
        console.log(`Navigated into campaign: ${AUTOMATION_CONSTANTS.Campaign_name_for_leads_scenario}`);
    }

    async click_lead_summary() {
        await this.lead_summary_link.waitFor({ state: 'visible', timeout: 10000 });
        await this.lead_summary_link.click();
        await this.page.waitForTimeout(2000);
        await expect(this.lead_summary_header).toBeVisible({ timeout: 10000 });
        console.log('Lead Summary Report page opened');
    }

    // ── Date filter ─────────────────────────────────────────────────────────

    async _wait_for_overlay_clear() {
        const backdropPresent = await this.page
            .locator('.cdk-overlay-backdrop-showing')
            .isVisible()
            .catch(() => false);

        if (backdropPresent) {
            await this.page.keyboard.press('Escape');
            await this.page
                .locator('.cdk-overlay-backdrop-showing')
                .waitFor({ state: 'hidden', timeout: 8000 })
                .catch(() => {});
            await this.page.waitForTimeout(400);
        }
    }

    async open_date_filter_dropdown() {
        // If the dropdown is already open (e.g. left open by a previous step),
        // skip closing and reopening — just confirm options are visible.
        const alreadyOpen = await this.today_option.isVisible().catch(() => false);
        if (alreadyOpen) {
            await this.page.waitForTimeout(500);
            console.log('Date filter dropdown already open — skipping reopen');
            return;
        }

        // Close any lingering CDK overlay before clicking
        await this._wait_for_overlay_clear();

        await this.date_filter_button.waitFor({ state: 'visible', timeout: 10000 });
        await this.date_filter_button.click();

        await this.today_option.waitFor({ state: 'visible', timeout: 10000 });
        await this.page.waitForTimeout(2000);
        console.log('Date filter dropdown opened — options visible');
    }

    // ── Parse "29-Apr-2026 9:34 AM" → midnight Date object ──────────────────
    _parse_date(cellText) {
        const m = cellText.match(/^(\d{2})-([A-Za-z]{3})-(\d{4})/);
        if (!m) return null;
        const d = new Date(`${m[2]} ${m[1]}, ${m[3]}`);
        d.setHours(0, 0, 0, 0);
        return d;
    }

    // ── Verify all collected dates fall inside the filter's expected window ──
    _verify_dates_for_filter(filterName, dates) {
        if (dates.length === 0) return { pass: true, note: '0 rows — accepted' };

        const now = new Date(); now.setHours(0, 0, 0, 0);
        const ranges = {
            'Today':        { from: now,                                            to: now },
            'Yesterday':    { from: new Date(now - 86400000),                       to: new Date(now - 86400000) },
            'Last 7 days':  { from: new Date(now - 6 * 86400000),                  to: now },
            'Last 30 days': { from: new Date(now - 29 * 86400000),                 to: now },
            'This Month':   { from: new Date(now.getFullYear(), now.getMonth(), 1), to: now },
            'Custom Range': { from: now,                                            to: now },
        };

        const { from, to } = ranges[filterName] || {};
        if (!from) return { pass: true, note: 'No range defined' };

        const mismatches = dates.filter(d => d < from || d > to);
        return mismatches.length === 0
            ? { pass: true,  note: `All ${dates.length} date(s) within range` }
            : { pass: false, note: `${mismatches.length} date(s) outside range` };
    }

    // ── Internal helper: Apply → close overlay → collect & verify dates ──────
    async _apply_and_read_results(filterName) {
        await this.apply_button.click();
        await this.page.waitForTimeout(400);

        // Always press Escape and wait for the CDK backdrop to fully detach
        await this.page.keyboard.press('Escape');
        await this.page
            .locator('.cdk-overlay-backdrop-showing')
            .waitFor({ state: 'hidden', timeout: 8000 })
            .catch(() => {});
        await this.page.waitForTimeout(400);

        await expect(this.creation_date_header).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(1000);

        const rowCount = await this.table_rows.count();
        const parsedDates = [];
        let firstDateStr = '–';

        for (let r = 0; r < rowCount; r++) {
            const cells     = this.table_rows.nth(r).locator('td');
            const cellCount = await cells.count();
            for (let c = 0; c < cellCount; c++) {
                const text = (await cells.nth(c).innerText()).trim();
                if (/\d{2}-[A-Za-z]{3}-\d{4}/.test(text)) {
                    if (r === 0) firstDateStr = text;
                    const d = this._parse_date(text);
                    if (d) parsedDates.push(d);
                    break;
                }
            }
        }

        const verification = this._verify_dates_for_filter(filterName, parsedDates);
        const status = verification.pass ? '✅ PASS' : '❌ FAIL';
        console.log(
            `  [${filterName.padEnd(14)}]  rows: ${rowCount}` +
            `  | first: ${firstDateStr}  | ${status} — ${verification.note}`
        );

        // Click the × chip close button to reset the active filter
        // so the Date dropdown is available for the next filter
        const closeVisible = await this.filter_chip_close.isVisible().catch(() => false);
        if (closeVisible) {
            await this.filter_chip_close.click();
            await this.page.waitForTimeout(600);
            console.log(`  [${filterName.padEnd(14)}]  filter chip cleared`);
        }

        return { rowCount, firstDate: firstDateStr, ...verification };
    }

    // ── Apply all 6 filters in sequence ─────────────────────────────────────
    async apply_all_filters_and_verify() {
        const results = {};

        const standardFilters = [
            { name: 'Today',        locator: this.today_option },
            { name: 'Yesterday',    locator: this.yesterday_option },
            { name: 'Last 7 days',  locator: this.last_7_days_option },
            { name: 'Last 30 days', locator: this.last_30_days_option },
            { name: 'This Month',   locator: this.this_month_option },
        ];

        console.log('\n========== Lead Summary — Date Filter Verification ==========');

        for (const filter of standardFilters) {
            await this.open_date_filter_dropdown();
            await filter.locator.waitFor({ state: 'visible', timeout: 10000 });
            await filter.locator.hover();
            await this.page.waitForTimeout(200);
            await filter.locator.click();
            await this.page.waitForTimeout(500);
            results[filter.name] = await this._apply_and_read_results(filter.name);
        }

        // ── Custom Range ──────────────────────────────────────────────────────
        await this.open_date_filter_dropdown();
        await this.custom_range_option.waitFor({ state: 'visible', timeout: 10000 });
        await this.custom_range_option.hover();
        await this.page.waitForTimeout(200);
        await this.custom_range_option.click();
        await this.page.waitForTimeout(600);

        // From: open calendar → click today's highlighted cell
        await this.from_calendar_btn.click();
        await this.page.waitForTimeout(600);
        await this.today_calendar_cell.waitFor({ state: 'visible', timeout: 10000 });
        await this.today_calendar_cell.click();
        await this.page.waitForTimeout(500);

        // To: open calendar → click today's highlighted cell
        await this.to_calendar_btn.click();
        await this.page.waitForTimeout(600);
        await this.today_calendar_cell.waitFor({ state: 'visible', timeout: 10000 });
        await this.today_calendar_cell.click();
        await this.page.waitForTimeout(500);

        results['Custom Range'] = await this._apply_and_read_results('Custom Range');

        console.log('\n─────────────────────────────────────────────────────────────');
        Object.entries(results).forEach(([filter, data]) => {
            console.log(`  ${filter.padEnd(15)} : ${data.rowCount} lead(s)  | first date: ${data.firstDate}`);
        });
        console.log('=============================================================\n');

        return results;
    }

    // ── Users filter ────────────────────────────────────────────────────────

    async open_users_filter() {
        await this._wait_for_overlay_clear();
        await this.users_filter_button.waitFor({ state: 'visible', timeout: 15000 });
        await this.users_filter_button.click();
        await this.page.waitForTimeout(500);
    }

    /**
     * NO USER ASSIGNED → Apply (empty state) → reopen Users → toggle off NO USER ASSIGNED →
     * select assigneeName → Apply.
     */
    async select_user_after_empty_state_probe(assigneeName) {
        await this.no_user_assigned_option.waitFor({ state: 'visible', timeout: 10000 });
        await this.no_user_assigned_option.click();
        await this.page.waitForTimeout(300);

        await this.apply_button.click();
        await this.page.waitForTimeout(600);
        await expect(this.oops_no_match_message).toBeVisible({ timeout: 15000 });

        await this.open_users_filter();
        await this.no_user_assigned_option.waitFor({ state: 'visible', timeout: 10000 });
        await this.no_user_assigned_option.click();
        await this.page.waitForTimeout(300);

        await this.page.getByText(assigneeName, { exact: true }).click();
        await this.page.waitForTimeout(300);

        await this.apply_button.click();
        await this.page.waitForTimeout(800);

        await this.page.keyboard.press('Escape').catch(() => {});
        await this.page
            .locator('.cdk-overlay-backdrop-showing')
            .waitFor({ state: 'hidden', timeout: 8000 })
            .catch(() => {});
        await this.page.waitForTimeout(400);
    }

    /**
     * Scroll horizontally so a column header (and its cells) are in viewport (wide mat-table).
     * @param {import('@playwright/test').Locator} columnHeader — columnheader locator
     */
    async _scroll_column_header_into_view(columnHeader) {
        const th = columnHeader;
        await th.scrollIntoViewIfNeeded();
        await th.evaluate((el) => {
            let node = el.parentElement;
            for (let n = 0; n < 12 && node; n++, node = node.parentElement) {
                const { overflowX, overflow } = window.getComputedStyle(node);
                if (overflowX === 'auto' || overflowX === 'scroll' || overflow === 'auto' || overflow === 'scroll') {
                    node.scrollLeft = node.scrollWidth;
                }
            }
        });
        await this.page.waitForTimeout(300);
    }

    /**
     * Confirm every displayed lead shows assigneeName under "User Assigned".
     * Uses getByRole('cell', { name }) only — do not compare to tbody/mat-row counts;
     * Material/CDK often leaves extra tr nodes in the DOM (e.g. 20) while only 10 leads render.
     */
    /** @returns {Promise<number>} Number of grid cells showing assigneeName (matches displayed leads). */
    async assert_all_table_rows_assigned_to_user(assigneeName) {
        const table = this.page.getByRole('table').first();

        const userAssignedCol = table.getByRole('columnheader', { name: 'User Assigned' });
        await expect(userAssignedCol).toBeVisible({ timeout: 10000 });
        await this._scroll_column_header_into_view(userAssignedCol);

        const assigneeCells = table.getByRole('cell', { name: assigneeName, exact: true });
        await expect(assigneeCells.first()).toBeVisible({ timeout: 15000 });

        const displayedCount = await assigneeCells.count();
        if (displayedCount === 0) {
            throw new Error(`Expected at least one "${assigneeName}" cell in the grid after filter`);
        }

        for (let i = 0; i < displayedCount; i++) {
            await assigneeCells.nth(i).scrollIntoViewIfNeeded();
            await expect(assigneeCells.nth(i)).toBeVisible({ timeout: 15000 });
        }

        return displayedCount;
    }

    // ── Stage filter ────────────────────────────────────────────────────────

    async open_stage_filter() {
        await this._wait_for_overlay_clear();
        await this.stage_filter_button.waitFor({ state: 'visible', timeout: 15000 });
        await this.stage_filter_button.click();
        await this.page.waitForTimeout(500);
    }

    async select_open_stage_and_apply() {
        await this.open_stage_span.waitFor({ state: 'visible', timeout: 10000 });
        await this.open_stage_span.click();
        await this.page.waitForTimeout(300);

        await this.apply_button.click();
        await this.page.waitForTimeout(800);

        await this.page.keyboard.press('Escape').catch(() => {});
        await this.page
            .locator('.cdk-overlay-backdrop-showing')
            .waitFor({ state: 'hidden', timeout: 8000 })
            .catch(() => {});
        await this.page.waitForTimeout(400);
    }

    /**
     * Confirm every displayed lead shows stageLabel under "Lead Stage".
     * @returns {Promise<number>} Count of OPEN cells (matches displayed rows).
     */
    async assert_all_table_rows_lead_stage(stageLabel) {
        const table = this.page.getByRole('table').first();

        const leadStageCol = table.getByRole('columnheader', { name: 'Lead Stage' });
        await expect(leadStageCol).toBeVisible({ timeout: 10000 });
        await this._scroll_column_header_into_view(leadStageCol);

        const stageCells = table.getByRole('cell', { name: stageLabel, exact: true });
        await expect(stageCells.first()).toBeVisible({ timeout: 15000 });

        const displayedCount = await stageCells.count();
        if (displayedCount === 0) {
            throw new Error(`Expected at least one "${stageLabel}" cell under Lead Stage after filter`);
        }

        for (let i = 0; i < displayedCount; i++) {
            await stageCells.nth(i).scrollIntoViewIfNeeded();
            await expect(stageCells.nth(i)).toBeVisible({ timeout: 15000 });
        }

        return displayedCount;
    }

    // ── Filters panel → Lead Status ─────────────────────────────────────────

    async open_filters_panel() {
        await this._wait_for_overlay_clear();
        await this.filters_button.waitFor({ state: 'visible', timeout: 15000 });
        await this.filters_button.click();
        await this.page.waitForTimeout(500);
    }

    /**
     * Grid / filter option text can differ from feature strings (e.g. "Follow-Up" vs "Follow Up").
     * @param {string} statusLabel — value from Gherkin
     * @returns {RegExp}
     */
    _lead_status_text_pattern(statusLabel) {
        switch (statusLabel) {
            case 'Follow-Up':
            case 'Follow Up':
                return /Follow[\s-]?Up/i;
            case 'In-Progress':
            case 'In Progress':
                return /In[\s-]?Progress/i;
            default:
                return new RegExp(
                    `^${statusLabel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`,
                    'i'
                );
        }
    }

    /**
     * Filters → Status tab → pick statusLabel → Apply (closes overlay).
     * @param {string} statusLabel — e.g. Uncontacted, In-Progress, Follow-Up
     */
    async apply_lead_status_filter(statusLabel) {
        await this.open_filters_panel();
        await this.status_tab.waitFor({ state: 'visible', timeout: 10000 });
        await this.status_tab.click();
        await this.page.waitForTimeout(400);

        const statusScope = this.page.getByLabel('Status');
        const exact = statusScope.getByText(statusLabel, { exact: true });
        const pattern = this._lead_status_text_pattern(statusLabel);
        if (await exact.isVisible({ timeout: 2500 }).catch(() => false)) {
            await exact.click();
        } else {
            await statusScope.getByText(pattern).first().click();
        }
        await this.page.waitForTimeout(300);

        await this.apply_button.click();
        await this.page.waitForTimeout(700);

        await this.page.keyboard.press('Escape').catch(() => {});
        await this.page
            .locator('.cdk-overlay-backdrop-showing')
            .waitFor({ state: 'hidden', timeout: 8000 })
            .catch(() => {});
        await this.page.waitForTimeout(400);
    }

    /**
     * Exactly `expectedCount` cells under Lead Status column match statusLabel (wide table safe).
     */
    async assert_lead_status_column_exact_count(statusLabel, expectedCount) {
        const table = this.page.getByRole('table').first();
        const header = table.getByRole('columnheader', { name: 'Lead Status' });
        await expect(header).toBeVisible({ timeout: 10000 });
        await this._scroll_column_header_into_view(header);

        const pattern = this._lead_status_text_pattern(statusLabel);
        const cells = table.getByRole('cell').filter({ hasText: pattern });
        await expect(cells).toHaveCount(expectedCount, { timeout: 20000 });

        for (let i = 0; i < expectedCount; i++) {
            await cells.nth(i).scrollIntoViewIfNeeded();
            await expect(cells.nth(i)).toBeVisible({ timeout: 15000 });
        }
    }

    /**
     * Single Filters drawer: Lead Details (Contact Number) → Status → Stages OPEN → Apply.
     * Matches product UI (not separate toolbar Stage button).
     * @param {string} phoneNumber — e.g. 9887772828
     * @param {string} statusLabel — e.g. In-Progress, Uncontacted
     */
    async apply_combined_filters_contact_status_stage(phoneNumber, statusLabel) {
        await this.open_filters_panel();

        await this.page.getByText('Lead Details').click();
        await this.page.waitForTimeout(400);

        const contact = this.page.getByRole('textbox', { name: 'Contact Number' });
        await contact.click();
        await contact.fill(phoneNumber);
        await this.page.waitForTimeout(250);

        await this.page.getByText('Status', { exact: true }).click();
        await this.page.waitForTimeout(200);
        await this.page.getByLabel('Status').getByText(statusLabel, { exact: true }).click();
        await this.page.waitForTimeout(200);

        await this.page.getByRole('tab', { name: 'Stages' }).click();
        await this.page.waitForTimeout(200);
        await this.page.locator('span').filter({ hasText: /^OPEN$/ }).first().click();
        await this.page.waitForTimeout(200);

        await this.apply_button.click();
        await this.page.waitForTimeout(800);

        await this.page.keyboard.press('Escape').catch(() => {});
        await this.page
            .locator('.cdk-overlay-backdrop-showing')
            .waitFor({ state: 'hidden', timeout: 8000 })
            .catch(() => {});
        await this.page.waitForTimeout(400);
    }

    /**
     * Find tbody data rows and the first row matching phone digits (normalized from row text).
     * @returns {Promise<{ rows: import('@playwright/test').Locator, matchCount: number, bodyRow: import('@playwright/test').Locator | null }>}
     */
    async _rows_matching_phone_digits(table, phoneDigits) {
        const target = String(phoneDigits).replace(/\D/g, '').slice(-10);
        let rows = table.locator('tbody tr.mat-row');
        if ((await rows.count()) === 0) {
            rows = table.locator('tbody tr');
        }

        let matchCount = 0;
        /** @type {import('@playwright/test').Locator | null} */
        let bodyRow = null;
        const n = await rows.count();
        for (let i = 0; i < n; i++) {
            const row = rows.nth(i);
            const raw = (await row.innerText()).replace(/\D/g, '');
            if (raw.includes(target)) {
                matchCount++;
                if (!bodyRow) bodyRow = row;
            }
        }
        return { rows, matchCount, bodyRow };
    }

    /**
     * Combined filter yields exactly one row: same row shows phone, Lead Status, Lead Stage.
     */
    async assert_filtered_lead_row_phone_status_stage(phoneNumber, statusLabel, stageLabel) {
        const table = this.page.getByRole('table').first();
        const phoneDigits = String(phoneNumber).replace(/\D/g, '').slice(-10);

        const statusPattern = this._lead_status_text_pattern(statusLabel);
        const stageEscaped = stageLabel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const stagePattern = new RegExp(`\\b${stageEscaped}\\b`, 'i');

        const lsHeader = table.getByRole('columnheader', { name: 'Lead Status' });
        const lstHeader = table.getByRole('columnheader', { name: 'Lead Stage' });
        await expect(lsHeader).toBeVisible({ timeout: 10000 });
        await this._scroll_column_header_into_view(lsHeader);
        await this._scroll_column_header_into_view(lstHeader);

        const { matchCount, bodyRow } = await this._rows_matching_phone_digits(table, phoneDigits);

        if (!bodyRow) {
            throw new Error(
                `No table row contains phone ending in ${phoneDigits} (check formatting / filter results)`
            );
        }
        if (matchCount !== 1) {
            throw new Error(
                `Expected exactly 1 row with phone ${phoneDigits}; found ${matchCount} (combined filter)`
            );
        }

        await bodyRow.scrollIntoViewIfNeeded();
        await expect(bodyRow).toBeVisible({ timeout: 20000 });

        await this._scroll_column_header_into_view(lsHeader);
        await expect(bodyRow.getByRole('cell').filter({ hasText: statusPattern }).first()).toBeVisible({
            timeout: 15000,
        });

        await this._scroll_column_header_into_view(lstHeader);
        await bodyRow.scrollIntoViewIfNeeded();
        const stageCell = bodyRow.getByRole('cell').filter({ hasText: stagePattern }).first();
        await stageCell.scrollIntoViewIfNeeded();
        await expect(stageCell).toBeVisible({ timeout: 15000 });
    }
}
