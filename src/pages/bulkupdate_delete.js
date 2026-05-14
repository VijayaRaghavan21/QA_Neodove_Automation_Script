import assert from 'assert';
import { AUTOMATION_CONSTANTS } from '../enums/enum.js';

export class BulkUpdateDelete {
    constructor(page) {
        this.page = page;

        this.portal_switch_button = this.page.getByRole('button').nth(3);

        this.pipeline_title = this.page.getByTitle('Pipeline');
        this.pipeline_link = this.page.getByRole('link', { name: AUTOMATION_CONSTANTS.PIPELINE_NAME });
        this.move_leads_campaign = this.page.getByText(AUTOMATION_CONSTANTS.Campaign_name_for_move_leads);
        this.lead_summary_button = this.page.getByRole('button', { name: 'Lead Summary' });

        this.select_all_checkbox = this.page.locator('.mat-checkbox-inner-container').first();
        this.bulk_actions_button = this.page.getByRole('button', { name: 'Bulk Actions expand_more' });

        this.delete_menu_item = this.page.getByRole('menuitem', { name: 'Delete' });
        this.delete_confirmation_text = this.page.getByText("'DELETE'");
        this.delete_input = this.page.locator('#mat-input-0');
        this.confirm_delete_button = this.page.getByRole('button', { name: "Yes, I'm sure" });

        this.delete_success_toast = this.page.getByText('leads Deleted Successfully!');
    }

    async switch_to_admin_portal() {
        await this.portal_switch_button.click();
        await this.page.waitForTimeout(2000);
        console.log('Switched to Admin Portal successfully');
    }

    async navigate_to_move_leads_campaign() {
        await this.pipeline_title.click();
        await this.page.waitForTimeout(1000);
        console.log('Pipeline section expanded');

        await this.pipeline_link.click();
        await this.page.waitForTimeout(2000);
        console.log(`Navigated to pipeline: ${AUTOMATION_CONSTANTS.PIPELINE_NAME}`);

        await this.move_leads_campaign.click();
        await this.page.waitForTimeout(2000);
        console.log(`Opened campaign: ${AUTOMATION_CONSTANTS.Campaign_name_for_move_leads}`);

        await this.lead_summary_button.click();
        await this.page.waitForTimeout(2000);
        console.log('Navigated to Lead Summary page');
    }

    async select_all_leads_and_open_bulk_actions() {
        await this.select_all_checkbox.click();
        await this.page.waitForTimeout(1000);
        console.log('All leads selected via checkbox');

        await this.bulk_actions_button.click();
        await this.page.waitForTimeout(1000);
        console.log('Bulk Actions menu opened');
    }

    async select_delete_and_confirm() {
        await this.delete_menu_item.click();
        await this.page.waitForTimeout(1000);
        console.log('Delete option selected from Bulk Actions menu');

        await this.delete_confirmation_text.click();
        await this.page.waitForTimeout(500);
        console.log('DELETE confirmation prompt visible');

        await this.delete_input.click();
        await this.delete_input.dblclick();
        await this.delete_input.fill('DELETE');
        console.log('Typed DELETE in the confirmation input');

        await this.confirm_delete_button.click();
        await this.page.waitForTimeout(3000);
        console.log('Clicked "Yes, I\'m sure" to confirm deletion');
    }

    async verify_leads_deleted_successfully() {
        await this.delete_success_toast.waitFor({ state: 'visible', timeout: 10000 });
        const toastText = await this.delete_success_toast.innerText();
        console.log(`Delete success message displayed: "${toastText}"`);

        assert.ok(toastText.includes('Deleted Successfully'), `Expected delete success toast but got: "${toastText}"`);

        console.log('All leads in Move Leads campaign deleted successfully');
    }
}
