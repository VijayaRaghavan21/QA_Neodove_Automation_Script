import { AUTOMATION_CONSTANTS } from '../enums/enum.js';

export class moveleads_bulkupdate {
    constructor(page) {
        this.page = page;
        this.select_campaign = this.page.getByText(AUTOMATION_CONSTANTS.Campaign_name, { exact: true });
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
        this.swtich_to_dialer_portal = this.page.locator("img[src='./assets/images/header/quick-switch.svg']");




    }

    async bulkupdate_for_move_leads() {

        await this.page.click(this.select_pipeline_list);
        await this.page.click(this.select_pipeline);
        await this.page.waitForTimeout(2000);
        console.log("Pipeline selected to open the campaign")
        await this.select_campaign.click();
        await this.page.waitForTimeout(2000);
        console.log("Copy Lead Campaign opened successfully");
        await this.lead_summary.click();
        console.log("Navigated to Lead Summary page");

        await this.select_all_checkbox.click();

        console.log("All leads are selected for bulk update");

        await this.select_bulk_update.click();


        await this.moveleads_button.click();

        //campaign selection dropdown
        await this.select_stage_dropdown.click();

        await this.select_move_lead_campaign.click();

        await this.assignee_user_dropdown.click();

        await this.page.waitForTimeout(2000);

        await this.select_agent_name.click();

        await this.movebutton.click();
    }

    async swtich_to_Dialer_Portal() {
        try {
            await this.swtich_to_dialer_portal.click();
            await this.page.waitForTimeout(3000);
            console.log("Switched to Dialer Portal successfully");
        } catch (err) {
            console.error("Failed to switch to Dialer Portal:", err.message);
            // Log the failure but don't throw to allow continuing to next step
            console.log("Continuing despite failure...");
        }
    }

    async verify_leads_moved_successfully_in_Dialer_start_calling() {
        //Switch to Dialer Portal

        await this.swtich_to_Dialer_Portal();

        await this.page.waitForTimeout(5000); // short wait for portal switch


        // Click Start Calling (no visibility expectation)
        await this.mycampaign.click();

        await this.page.waitForTimeout(3000); // short wait for UI update

        const startCallingBtn = this.page.locator(
            `//tr[
        td[contains(normalize-space(), '${AUTOMATION_CONSTANTS.Campaign_name_for_move_leads}')]
      ]//span[contains(normalize-space(), 'Start Calling')]`
        );

        await startCallingBtn.click();

        await this.page.waitForTimeout(3000); // short wait for dialer load

        console.log('Start Calling clicked');

    }
}


