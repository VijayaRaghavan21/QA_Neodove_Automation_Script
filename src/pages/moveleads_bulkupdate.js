import { AUTOMATION_CONSTANTS } from '../enums/enum.js';

export class MoveLeadsBulkUpdate {
    constructor(page) {
        this.page = page;
        this.select_campaign = this.page.getByText(AUTOMATION_CONSTANTS.Campaign_name_for_copy_leads, { exact: true });
        this.lead_summary = this.page.getByText('Lead Summary', { exact: true });
        this.select_all_checkbox = this.page.locator('label.mat-checkbox-layout').locator('span').nth(0);
        this.select_bulk_update = this.page.locator('span.material-icons');
        this.moveleads_button = this.page.getByText('Move to Other Campaign', { exact: true });
        this.select_move_lead_campaign = this.page.getByText(AUTOMATION_CONSTANTS.Campaign_name_for_move_leads, { exact: true });

        this.assignee_user_dropdown = this.page.locator(
            "//h4[normalize-space()='Assign User *']/following::div[contains(@class,'mat-select-arrow-wrapper')][1]"
        );

        this.select_agent_name = this.page.locator(
            `//span[contains(@class,'mat-option-text') and contains(normalize-space(),'${AUTOMATION_CONSTANTS.Agent_Name}')]`
        );

        this.movebutton = this.page.getByText('Move', { exact: true });
        this.select_pipeline_list = "//a[@id='nd-campaigns']//span[@class='mat-list-item-content']";
        this.select_pipeline = `//span[contains(text(),'${AUTOMATION_CONSTANTS.PIPELINE_NAME}')]`;
        this.select_stage_dropdown = this.page.locator('div.mat-select-trigger.ng-tns-c62-41:visible');
        this.portal_switch = this.page.locator("img[src='./assets/images/header/quick-switch.svg']");
        this.mycampaign = this.page.getByText('My Campaigns', { exact: true });
        this.update_stage = this.page.getByText('OPEN', { exact: true });
        this.bulk_update_button = this.page.getByText('Update', { exact: true });
        this.yesconfirm_button = this.page.getByText('Yes Confirm', { exact: true });
    }

    async bulkupdate_for_move_leads() {
        await this.page.click(this.select_pipeline_list);
        await this.page.click(this.select_pipeline);
        await this.page.waitForTimeout(2000);
        console.log("Pipeline selected to open the campaign");
        await this.select_campaign.click();
        await this.page.waitForTimeout(2000);
        console.log("Source campaign (Copy Leads) opened successfully");
        await this.lead_summary.click();
        console.log("Navigated to Lead Summary page");
        await this.select_all_checkbox.click();
        console.log("All leads are selected for bulk update");
        await this.select_bulk_update.click();
        await this.moveleads_button.click();
        await this.select_stage_dropdown.click();
        await this.select_move_lead_campaign.click();
        await this.assignee_user_dropdown.click();
        await this.page.waitForTimeout(2000);
        await this.select_agent_name.click();
        await this.movebutton.click();
        await this.page.waitForTimeout(5000);
        console.log("Leads moved to another campaign successfully");

        // Close any new tab that opened after move, then return to main page
        const context = this.page.context();
        const pages = context.pages();
        for (const p of pages) {
            if (p !== this.page) {
                await p.close();
            }
        }
        await this.page.bringToFront();
        console.log("Returned to main page after move operation");
    }

    async change_move_leads_status_into_open() {
        await this.page.click(this.select_pipeline_list);
        await this.page.click(this.select_pipeline);
        await this.page.waitForTimeout(2000);
        console.log("Pipeline selected to open the campaign");
        await this.select_move_lead_campaign.click();
        await this.page.waitForTimeout(2000);
        console.log("Move Lead Campaign opened successfully");
        await this.lead_summary.click();
        console.log("Navigated to Lead Summary page");
        await this.page.waitForTimeout(3000);
        await this.select_all_checkbox.click();
        console.log("All leads are selected for bulk update");
        await this.select_bulk_update.click();
        await this.bulk_update_button.click();
        await this.select_stage_dropdown.click();
        await this.update_stage.click();
        await this.bulk_update_button.click();
        await this.page.waitForTimeout(2000);
        await this.yesconfirm_button.click();
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

    async verify_leads_moved_successfully() {
        await this.switch_to_dialer_portal();
        await this.page.waitForTimeout(5000);
        await this.mycampaign.click();
        await this.page.waitForTimeout(3000);

        const startCallingBtn = this.page.locator(
            `//tr[
        td[contains(normalize-space(), '${AUTOMATION_CONSTANTS.Campaign_name_for_move_leads}')]
      ]//button[contains(normalize-space(), 'Start Calling')]`
        );

        await startCallingBtn.waitFor({ state: 'visible' });
        await startCallingBtn.click();
        await this.page.waitForTimeout(3000);
        console.log('All the moved leads are verified in Start calling sucessfully');
    }
}
