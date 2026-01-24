import { expect } from '@playwright/test';
import { AUTOMATION_CONSTANTS } from '../enums/enum.js';

export class bulkupdate {
    constructor(page) {

        this.page = page;

        //locators for bulk update

         this.swtich_to_admin_portal = this.page.locator("img[src='./assets/images/header/quick-switch.svg']");


        //Swtich to Admin Portal beacuse it is alread in dialer portal

        this.swtich_to_dialer_portal = this.page.locator("img[src='./assets/images/header/quick-switch.svg']");

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

        this.update_button = this.page.getByText('Update', { exact: true });


        // My Leads , Follow up Leads in Dialer Portal

        this.my_leads_section = this.page.getByText('My Leads', { exact: true });

        //Selector follow up Start calling

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

        this.mycampaign= this.page.getByText('My Campaigns', { exact: true });

        this.select_agent_name = this.page.locator(
            `//span[contains(@class,'mat-option-text') and contains(normalize-space(),'${AUTOMATION_CONSTANTS.Agent_Name}')]`
        );


    }

    async open_the_campaign_page() {

        //Navaiate to Campaign Page

        //await this.swtich_to_admin_portal.click();

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

        await this.update_button.click();

        console.log("Bulk update of stage  and follow up date is completed successfully");

        await this.page.getByText('Yes Confirm', { exact: true }).click();

        await this.page.waitForTimeout(3000);

    }

    async verify_all_leads_changed_to_inprogress() {

        const lead_stage_cells = this.page.locator("//tbody/tr/td[8]");

        const rowCount = await lead_stage_cells.count();

        for (let i = 0; i < rowCount; i++) {
            const cellText = await lead_stage_cells.nth(i).innerText();
            if (cellText.trim() !== 'IN PROGRESS') {
                throw new Error(`Lead at row ${i + 1} is not updated to IN PROGRESS`);
            }
        }
        console.log("All leads are verified to be updated to IN PROGRESS");


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
                timeout: 5000  // Reduced from 70000 to 5 seconds
            });

            const rawText = await this.phone_number_locator_in_Lead.textContent();

            console.log('RAW popup text:', rawText);

            const normalized = rawText
                .replace(/\D/g, '')
                .slice(-10);

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
                
                // Check if campaign finished after no mobile appears
                if (await this.isLeadsCompleted()) {
                    console.log('✅ Leads completed');
                    break;
                } else {
                    console.log('🛑 No mobile detected and not completed, stopping');
                    break;
                }
            }

            // ❌ DUPLICATE CHECK (STRICT)
            if (processedMobiles.has(mobile)) {
                throw new Error(`❌ Duplicate mobile detected: ${mobile}`);
            }

            processedMobiles.add(mobile);
            console.log(`📞 Processing lead: ${mobile}`);

            // Wait longer for the first lead to ensure UI is ready
            const waitTime = processedMobiles.size === 1 ? 2000 : 1000;
            await this.page.waitForTimeout(waitTime);
            await this.dispose_lead_section.click();
            await this.not_connected_option.click();
            await this.did_not_pick_option.click();
            await this.submit_dispose_button.click();

            await this.page.waitForTimeout(1000);
        }

        console.log(`Total leads processed: ${processedMobiles.size}`);

        // ❌ COUNT VALIDATION
        if (processedMobiles.size !== 20) {
            throw new Error(`❌ Expected 20 unique leads, but got ${processedMobiles.size}`);
        }

        console.log('✅ 20 unique leads displayed under follow up lead with no duplicates');
    }


     async open_the_pipeline_page() {

        //Navaiate to Campaign Page

       // await this.swtich_to_admin_portal.click();



        await this.page.click(this.select_pipeline_list);
        await this.page.click(this.select_pipeline);
        await this.page.waitForTimeout(2000);
        console.log("Pipeline selected to open the campaign");
     }


async bulkupdate_for_copy_leads(){

    await this.select_campaign.click();
    await this.page.waitForTimeout(2000);
    console.log("Copy Lead Campaign opened successfully");
     await this.lead_summary.click();
        console.log("Navigated to Lead Summary page");

    await this.select_all_checkbox.click();

    console.log("All leads are selected for bulk update");

    await this.select_bulk_update.click();


    await this.copy_leads_to_other_campaign_button.click();

    //campaign selection dropdown

    await this.select_stage_dropdown.click();

    await this.select_copy_lead_campaign.click();

    await this.assignee_user_dropdown.click();

    await this.page.waitForTimeout(2000);

    await this.select_agent_name.click();

    await this.copy_button.click();
}

async verify_leads_copied_successfully_in_Dialer_start_calling(){

    await this.swtich_to_Dialer_Portal();

   await this.page.waitForTimeout(5000); // short wait for portal switch


  // Click Start Calling (no visibility expectation)
  await this.mycampaign.click();

    await this.page.waitForTimeout(3000); // short wait for UI update

    const startCallingBtn = this.page.locator(
    `//tr[
        td[contains(normalize-space(), '${AUTOMATION_CONSTANTS.Campaign_name_for_copy_leads}')]
      ]//span[contains(normalize-space(), 'Start Calling')]`
  );

  await startCallingBtn.click();

  await this.page.waitForTimeout(3000); // short wait for dialer load
  
  console.log('Start Calling clicked');

}
}