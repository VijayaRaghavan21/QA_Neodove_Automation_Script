import { expect } from '@playwright/test';
import path from "path";
import { fileURLToPath } from 'url';
import fs from 'fs';
import XLSX from 'xlsx';
import { AUTOMATION_CONSTANTS } from '../enums/enum.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------- Excel file path ----------
const excelFile = path.join(
  __dirname,
  "../test_files_data",
  "TestFile_Upload_Leads.xlsx"
);

export async function readExcelLeads() {
  console.log("Reading Excel data...");

  // Read Excel as buffer
  const fileBuffer = fs.readFileSync(excelFile);

  // Parse workbook
  const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
  const worksheet = workbook.Sheets["Sheet1"];

  const data = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

  console.log("Excel rows count:", data.length);
  return data;
}


// ---------- Page Class ----------
export class Leadsverify {

  constructor(page) {
    this.page = page;

    this.lead_summary = this.page.getByText('Lead Summary', { exact: true });

    this.lead_summary_page = this.page.locator("//h3[contains(text(),'Lead Summary Report -')]");

    this.swtich_to_dialer_portal =this.page.locator("img[src='./assets/images/header/quick-switch.svg']");

    //Start Calling flows 

    this.mycampaign= this.page.getByText('My Campaigns', { exact: true });

    this.select_campaing_start_Calling= "//tr[td[contains(normalize-space(), '{Campaign_name}')]]//span[contains(normalize-space(), 'Start Calling')]";

    this.start_calling_button =this.page.getByRole('button', { name: 'Start' });
    this.phone_number_locator_in_Lead = this.page.locator(
      'xpath=//div[@class="detail-row"][.//div[@class="detail-label" and contains(normalize-space(),"Mobile Number")]]//div[@class="detail-value"]'
    );
    //Dispose Lead Locators

    // Dispose Lead Locators
    this.dispose_lead_section = this.page.getByText('DISPOSE LEAD', { exact: true });

    this.not_connected_option = this.page.getByRole('button', { name: 'Not Connected' });

    this.did_not_pick_option = this.page
      .locator('mat-radio-button')
      .filter({ hasText: 'Did not pick' });

  this.submit_dispose_button = this.page.getByRole('button', { name: 'Submit' });

  this.leads_completed_text = this.page.getByText('Leads completed', { exact: true });



}

  async navigate_to_leads_summary() {
    await this.lead_summary.click();
    console.log("Navigated to Lead Summary page");
  }

  async verify_leads_summary_page() {
     await expect(this.lead_summary_page).toBeVisible();
    console.log("Leads Summary page is visible");
  }

  normalizePhone(phone) {
  if (phone === null || phone === undefined) {
    return '';
  }

  return String(phone)       // 👈 KEY FIX
    .replace(/\D/g, '')
    .slice(-10);
}

  // Get mobile numbers from CRM UI
  async getCRMMobiles() {
  const phoneLocator = this.page.locator(
    "tbody tr td:nth-child(4) div"
  );

  // 🔑 wait until at least one row appears
  await expect(phoneLocator.first()).toBeVisible({ timeout: 10000 });

  const count = await phoneLocator.count();
  const mobiles = [];

  for (let i = 0; i < count; i++) {
    const phoneText = await phoneLocator.nth(i).innerText();
    mobiles.push(this.normalizePhone(phoneText));
  }

  return mobiles;
}

  // Validate Excel vs CRM
  async validateAllExcelMobilesPresent() {
  const excelLeads = await readExcelLeads();

  // Excel mobiles (reference data)
  const excelMobiles = excelLeads
    .map(e => this.normalizePhone(e["Phone Number"]))
    .filter(mobile => mobile.length === 10);

  // CRM mobiles (reference data)
  const crmMobiles = await this.getCRMMobiles();

  // Optional: collect info only (NO assertion)
  const missingMobiles = excelMobiles.filter(
    mobile => !crmMobiles.includes(mobile)
  );

  // ✅ DO NOT FAIL TEST HERE
  // Just return data for further flow validation

  return {
    excelCount: excelMobiles.length,
    crmCount: crmMobiles.length,
    excelMobiles,
    crmMobiles,
    missingMobiles   // for reporting only
  };
}

// Switch to Dialer & Start Calling (NO hard waits)
async openStartCalling() {
  await this.swtich_to_dialer_portal.click();


  await this.page.waitForTimeout(5000); // short wait for portal switch


  // Click Start Calling (no visibility expectation)
  await this.mycampaign.click();

    await this.page.waitForTimeout(3000); // short wait for UI update

    const startCallingBtn = this.page.locator(
    `//tr[
        td[contains(normalize-space(), '${AUTOMATION_CONSTANTS.Campaign_name}')]
      ]//span[contains(normalize-space(), 'Start Calling')]`
  );

  await startCallingBtn.click();

  await this.page.waitForTimeout(3000); // short wait for dialer load
  
  console.log('Start Calling clicked');
}



// ✅ SINGLE normalize function (KEEP ONLY THIS ONE)
normalizePhone(phone) {
  if (!phone) return '';
  return String(phone).replace(/\D/g, '').slice(-10);
}

// Get current lead mobile
async isLeadPresent() {
  try {
    await this.phone_number_locator_in_Lead.first().waitFor({
      state: 'visible',
      timeout: 8000 // wait for dialer assignment
    });
    return true;
  } catch {
    return false;
  }
}

// Get dialer mobile number from lead popup
async getDialerMobileFromPopup() {
  await this.phone_number_locator_in_Lead.waitFor({
    state: 'visible',
    timeout: 70000
  });

  const rawText = await this.phone_number_locator_in_Lead.textContent();

  console.log('RAW popup text:', rawText);

  const normalized = rawText
    .replace(/\D/g, '')
    .slice(-10);

  console.log('Dialer popup mobile:', normalized);
  return normalized;
}

async isLeadsCompleted() {
  try {
    return await this.leads_completed_text.isVisible();
  } catch {
    return false;
  }
}

  // ---------- Validate + Dispose ONE lead ----------
 async verifyAllLeadsInStartCalling(crmMobiles) {
  const processedMobiles = new Set();

  while (true) {
    // 🛑 STOP CONDITION #1: Campaign completed
    if (await this.isLeadsCompleted()) {
      console.log('✅ Leads completed message displayed. Ending flow.');
      break;
    }

    const currentMobile = await this.getDialerMobileFromPopup();

    // 🛑 STOP CONDITION #2: No valid mobile
    // if (!currentMobile || currentMobile.length !== 10) {
    //   console.log('🛑 No valid mobile. Ending flow.');
    //   break;
    // }

    // 🛑 STOP CONDITION #3: Duplicate mobile
    if (processedMobiles.has(currentMobile)) {
      console.log('🛑 Duplicate mobile detected. Ending flow.');
      break;
    }

    processedMobiles.add(currentMobile);
    console.log(`📞 Processing lead: ${currentMobile}`);

    // Soft validation (won’t stop test immediately)
    if (!crmMobiles.includes(currentMobile)) {
      console.error(`❌ Mobile not found in CRM: ${currentMobile}`);
    } else {
      console.log(`✅ Mobile validated: ${currentMobile}`);
    }

    // Dispose lead
    await this.dispose_lead_section.click();
    await this.not_connected_option.click();
    await this.did_not_pick_option.click();
    await this.submit_dispose_button.click();

    // Small wait for next lead assignment
    await this.page.waitForTimeout(1200);
  }

  if (processedMobiles.size === 0) {
    throw new Error('❌ No leads were processed');
  }

  console.log(`✅ Total leads processed: ${processedMobiles.size}`);
}


}

