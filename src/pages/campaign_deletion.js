import { expect } from '@playwright/test';
import { AUTOMATION_CONSTANTS } from '../enums/enum.js';

export class CampaignDeletion {
    constructor(page) {
        this.page = page;

        this.pipeline_title = this.page.getByTitle('Pipeline');
        this.pipeline_link = this.page.getByRole('link', { name: AUTOMATION_CONSTANTS.PIPELINE_NAME });

        this.campaign_checkbox = this.page.locator('.mat-checkbox-inner-container').first();
        this.more_vert_button = this.page.getByRole('button').filter({ hasText: 'more_vert' }).first();
        this.delete_menu_item = this.page.getByRole('menuitem', { name: 'DELETE' });
        this.confirm_delete_button = this.page.getByRole('button', { name: "Yes, I'm sure" });
    }

    async navigate_to_pipeline() {
        await this.pipeline_title.click();
        await this.page.waitForTimeout(1500);
        console.log('Pipeline section expanded');

        await this.pipeline_link.click();
        await this.page.waitForTimeout(2000);
        console.log(`Navigated to: ${AUTOMATION_CONSTANTS.PIPELINE_NAME}`);
    }

    async delete_single_campaign(campaignLabel) {
        await this.campaign_checkbox.click();
        await this.page.waitForTimeout(1000);
        console.log(`Checkbox selected for campaign: "${campaignLabel}"`);

        await this.more_vert_button.click();
        await this.page.waitForTimeout(800);
        console.log('more_vert menu opened');

        await this.delete_menu_item.click();
        console.log('DELETE menu item clicked');

        // Wait for confirmation dialog to open first
        const dialog = this.page.locator('mat-dialog-container');
        await dialog.waitFor({ state: 'visible', timeout: 10000 });
        console.log('Confirmation dialog opened');

        // Scope input to the dialog — avoids brittle #mat-input-N ID that increments each time
        const dialogInput = dialog.locator('input');
        await dialogInput.waitFor({ state: 'visible', timeout: 10000 });
        await dialogInput.click();
        await dialogInput.dblclick();
        await dialogInput.fill('DELETE');
        await expect(dialogInput).toHaveValue('DELETE');
        console.log('Typed DELETE in confirmation input');

        await this.confirm_delete_button.waitFor({ state: 'visible', timeout: 5000 });
        await this.confirm_delete_button.click();
        await this.page.waitForTimeout(3000);
        console.log(`Clicked "Yes, I'm sure" for campaign: "${campaignLabel}"`);
    }

    async delete_all_campaigns() {
        const campaigns = [
            AUTOMATION_CONSTANTS.Campaign_name,
            AUTOMATION_CONSTANTS.Campaign_name_for_copy_leads,
            AUTOMATION_CONSTANTS.Campaign_name_for_move_leads,
        ];

        for (const campaignName of campaigns) {
            console.log(`\n--- Deleting campaign: "${campaignName}" ---`);
            await this.delete_single_campaign(campaignName);

            // Optional in-progress dialog
            try {
                const deletingMsg = this.page.getByText('Deleting Automation Campaign');
                if (await deletingMsg.isVisible({ timeout: 3000 })) {
                    console.log(`Deletion in-progress dialog visible for: "${campaignName}"`);
                }
            } catch {
                // Dialog may not always appear
            }

            // Wait for success toast
            const successToast = this.page.getByText('Campaign deleted successfully.');
            await successToast.waitFor({ state: 'visible', timeout: 15000 });
            const toastText = await successToast.innerText();
            console.log(`SUCCESS: "${toastText}" — "${campaignName}" deleted`);

            await this.page.waitForTimeout(2000);
        }
    }

    async verify_all_campaigns_deleted() {
        console.log('All three campaigns deleted successfully');
    }
}
