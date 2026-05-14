import assert from 'assert';
import { AUTOMATION_CONSTANTS } from '../enums/enum.js';

export class BulkUpdate {
    constructor(page) {
        this.page = page;

        this.portal_switch = this.page.locator("img[src='./assets/images/header/quick-switch.svg']");

        this.select_campaign = this.page.getByText(AUTOMATION_CONSTANTS.Campaign_name, { exact: true });
        this.select_copy_lead_campaign = this.page.getByText(AUTOMATION_CONSTANTS.Campaign_name_for_copy_leads, { exact: true });

        this.select_pipeline_list = "//a[@id='nd-campaigns']//span[@class='mat-list-item-content']";
        this.select_pipeline = `//span[contains(text(),'${AUTOMATION_CONSTANTS.PIPELINE_NAME}')]`;

        this.lead_summary = this.page.getByText('Lead Summary', { exact: true });
        this.select_all_checkbox = this.page.locator('label.mat-checkbox-layout').locator('span').nth(0);
        this.select_bulk_update = this.page.locator('span.material-icons');
        this.bulk_update_button = this.page.getByText('Update', { exact: true });
        this.select_stage_dropdown = this.page.locator('div.mat-select-trigger.ng-tns-c62-41:visible');
        this.update_stage = this.page.getByText('IN PROGRESS', { exact: true });
        this.next_follow_up = this.page.getByRole('textbox', { name: 'Follow Up Date' });
        this.next_set_follow_up_date = this.page.getByText('Set', { exact: true });

        this.my_leads_section = this.page.getByText('My Leads', { exact: true });

        this.follow_up_start_Calling = this.page.locator(
            `xpath=//div[contains(@class,'nd-mylead-card')]
  [.//div[contains(@class,'nd-mylead-card-title')]
     [.//text()[contains(.,'Follow')]]]
  //button[.//text()[contains(.,'Start')]]`
        );

        this.dispose_lead_section = this.page.getByText('DISPOSE LEAD', { exact: true });
        this.not_connected_option = this.page.getByRole('button', { name: 'Not Connected' });
        this.did_not_pick_option = this.page
            .locator('mat-radio-button')
            .filter({ hasText: 'Did not pick' });
        this.submit_dispose_button = this.page.getByRole('button', { name: 'Submit' });
        this.leads_completed_text = this.page.getByText('Leads completed');

        this.phone_number_locator_in_Lead = this.page.locator(
            'xpath=//div[@class="detail-row"][.//div[@class="detail-label" and contains(normalize-space(),"Mobile Number")]]//div[@class="detail-value"]'
        );

        this.copy_leads_to_other_campaign_button = this.page.getByText('Copy to Other Campaign', { exact: true });

        this.assignee_user_dropdown = this.page.locator(
            "//h4[normalize-space()='Assign User *']/following::div[contains(@class,'mat-select-arrow-wrapper')][1]"
        );

        this.copy_button = this.page.getByText('Copy', { exact: true });
        this.mycampaign = this.page.getByText('My Campaigns', { exact: true });

        this.select_agent_name = this.page.locator(
            `//span[contains(@class,'mat-option-text') and contains(normalize-space(),'${AUTOMATION_CONSTANTS.Agent_Name}')]`
        );
    }

    async open_the_campaign_page() {
        await this.portal_switch.click();
        await this.page.click(this.select_pipeline_list);
        await this.page.click(this.select_pipeline);
        await this.page.waitForTimeout(2000);
        console.log("Pipeline selected to open the campaign");
        await this.select_campaign.click();
        await this.page.waitForTimeout(2000);
        console.log("Campaign opened successfully");
    }

    async open_lead_Summary_page() {
        await this.lead_summary.click();
        console.log("Navigated to Lead Summary page");
    }

    async bulk_update_stage() {
        await this.page.waitForTimeout(3000);
        await this.select_all_checkbox.click();
        console.log("All leads are selected for bulk update");
        await this.select_bulk_update.click();
        await this.bulk_update_button.click();
        await this.select_stage_dropdown.click();
        await this.update_stage.click();
        await this.next_follow_up.click();
        await this.page.waitForTimeout(2000);
        await this.next_set_follow_up_date.click();
        await this.bulk_update_button.click();
        console.log("Bulk update of stage and follow up date is completed successfully");
        await this.page.getByText('Yes Confirm', { exact: true }).click();
        await this.page.waitForTimeout(3000);
    }

    async verify_all_leads_changed_to_inprogress() {
        const lead_stage_cells = this.page.locator("//tbody/tr/td[8]");
        const rowCount = await lead_stage_cells.count();
        for (let i = 0; i < rowCount; i++) {
            const cellText = await lead_stage_cells.nth(i).innerText();
            assert.strictEqual(cellText.trim(), 'IN PROGRESS', `Lead at row ${i + 1} is not updated to IN PROGRESS. Found: "${cellText.trim()}"`);
        }
        console.log("All leads are verified to be updated to IN PROGRESS");
    }

    async switch_to_dialer_portal() {
        try {
            await this.portal_switch.click();
            await this.page.waitForTimeout(3000);
            console.log("Switched to Dialer Portal successfully");
        } catch (err) {
            console.error("Failed to switch to Dialer Portal:", err.message);
            console.log("Continuing despite failure...");
        }
    }

    async navigate_to_my_leads_page() {
        await this.my_leads_section.click();
        console.log("Navigated to My Leads page successfully");
    }

    async verify_all_the_leads_in_followup_section() {
        await this.follow_up_start_Calling.click();
        console.log("Started calling in Follow up leads section successfully");
    }

    async getDialerMobileFromPopup() {
        try {
            await this.phone_number_locator_in_Lead.waitFor({
                state: 'visible',
                timeout: 5000
            });
            const rawText = await this.phone_number_locator_in_Lead.textContent();
            console.log('RAW popup text:', rawText);
            const normalized = rawText.replace(/\D/g, '').slice(-10);
            console.log('Dialer popup mobile:', normalized);
            return normalized;
        } catch (err) {
            console.log('No lead popup visible within timeout, assuming no more leads');
            return '';
        }
    }

    async isLeadsCompleted() {
        try {
            const visible = await this.leads_completed_text.isVisible();
            console.log('isLeadsCompleted check: Leads completed text visible?', visible);
            return visible;
        } catch (err) {
            console.log('isLeadsCompleted error:', err.message);
            return false;
        }
    }

    async verifyAllLeadsInFollowupStartCalling() {
        const processedMobiles = new Set();

        while (true) {
            const mobile = await this.getDialerMobileFromPopup();

            if (!mobile) {
                if (await this.isLeadsCompleted()) {
                    console.log('✅ Leads completed');
                    break;
                } else {
                    console.log('🛑 No mobile detected and not completed, stopping');
                    break;
                }
            }

            if (processedMobiles.has(mobile)) {
                throw new Error(`❌ Duplicate mobile detected: ${mobile}`);
            }

            processedMobiles.add(mobile);
            console.log(`📞 Processing lead: ${mobile}`);

            const waitTime = processedMobiles.size === 1 ? 2000 : 1000;
            await this.page.waitForTimeout(waitTime);
            await this.dispose_lead_section.click();
            await this.not_connected_option.click();
            await this.did_not_pick_option.click();
            await this.submit_dispose_button.click();
            await this.page.waitForTimeout(1000);
        }

        console.log(`Total leads processed: ${processedMobiles.size}`);

        assert.strictEqual(processedMobiles.size, AUTOMATION_CONSTANTS.Expected_Lead_Count, `Expected ${AUTOMATION_CONSTANTS.Expected_Lead_Count} unique leads, but got ${processedMobiles.size}`);

        console.log(`✅ ${AUTOMATION_CONSTANTS.Expected_Lead_Count} unique leads displayed under follow up lead with no duplicates`);
    }

    async ensure_on_admin_portal() {
        const pipelineNav = this.page.locator("//a[@id='nd-campaigns']");
        const isVisible = await pipelineNav.isVisible();
        if (!isVisible) {
            await this.portal_switch.click();
            await this.page.waitForTimeout(3000);
            console.log("Switched back to Admin Portal");
        } else {
            console.log("Already on Admin Portal");
        }
    }

    async open_the_pipeline_page() {
        // Dismiss any blocking overlay before navigating
        try {
            const useHereBtn = this.page.locator('button:has-text("Use here")');
            if (await useHereBtn.isVisible({ timeout: 1500 })) {
                await useHereBtn.click();
                await this.page.waitForTimeout(1000);
                console.log("Dismissed overlay before pipeline navigation");
            }
        } catch (e) { /* no overlay */ }

        await this.page.click(this.select_pipeline_list);
        await this.page.click(this.select_pipeline);
        await this.page.waitForTimeout(2000);
        console.log("Pipeline selected to open the campaign");
    }

    async bulkupdate_for_copy_leads() {
        await this.select_campaign.click();
        await this.page.waitForTimeout(2000);
        console.log("Copy Lead Campaign opened successfully");
        await this.lead_summary.click();
        console.log("Navigated to Lead Summary page");
        await this.select_all_checkbox.click();
        console.log("All leads are selected for bulk update");
        await this.select_bulk_update.click();
        await this.copy_leads_to_other_campaign_button.click();
        await this.select_stage_dropdown.click();
        await this.select_copy_lead_campaign.click();
        await this.assignee_user_dropdown.click();
        await this.page.waitForTimeout(2000);
        await this.select_agent_name.click();
        await this.copy_button.click();
        console.log("Copy button clicked, waiting for leads to be copied...");
        await this.page.waitForTimeout(8000);

        // Close any new tab that opened after copy, then return to main page
        const context = this.page.context();
        const pages = context.pages();
        for (const p of pages) {
            if (p !== this.page) {
                await p.close();
            }
        }
        await this.page.bringToFront();
        
        console.log("Leads copied successfully, redirecting to Dialer Portal...");
        await this.switch_to_dialer_portal();

    }

    async verify_leads_copied_successfully_in_Dialer_start_calling() {
        await this.page.waitForTimeout(3000);
        await this.mycampaign.click();
        await this.page.waitForTimeout(3000);

        const startCallingBtn = this.page.locator(
            `//tr[
        td[contains(normalize-space(), '${AUTOMATION_CONSTANTS.Campaign_name_for_copy_leads}')]
      ]//button[contains(normalize-space(), 'Start Calling')]`
        );

        await startCallingBtn.waitFor({ state: 'visible' });
        await startCallingBtn.click();
        await this.page.waitForTimeout(3000);
        console.log('Start Calling clicked');
    }
}
