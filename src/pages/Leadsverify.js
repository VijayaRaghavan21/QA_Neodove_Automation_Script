import { expect } from '@playwright/test';
import path from "path";
import { fileURLToPath } from 'url';
import fs from 'fs';
import XLSX from 'xlsx';

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

  // Excel mobiles (from exact column name)
  const excelMobiles = excelLeads
    .map(e => this.normalizePhone(e["Phone Number"]))
    .filter(mobile => mobile.length === 10);

  // CRM mobiles
  const crmMobiles = await this.getCRMMobiles();

  // Find missing mobiles
  const missingMobiles = [];

  for (const mobile of excelMobiles) {
    if (!crmMobiles.includes(mobile)) {
      missingMobiles.push(mobile);
    }
  }

  // Assertion
  expect(
    missingMobiles,
    `Missing mobiles in CRM: ${missingMobiles.join(', ')}`
  ).toEqual([]);

  // ✅ RETURN everything needed for Allure
  return {
    excelCount: excelMobiles.length,
    crmCount: crmMobiles.length,
    excelMobiles,
    crmMobiles,
    missingMobiles
  };
}

}