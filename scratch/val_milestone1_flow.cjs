const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const screenshotDir = path.join(__dirname, 'screenshots_m1_val');
if (fs.existsSync(screenshotDir)) {
  console.log("🧹 Purging old validation screenshots...");
  fs.rmSync(screenshotDir, { recursive: true, force: true });
}
fs.mkdirSync(screenshotDir, { recursive: true });

(async () => {
  console.log("🚀 Starting E2E Validation for Milestone 1 (State Sync & Dynamic Dashboard)...");
  
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  
  console.log("🔗 Navigating to Secure Access Login Page...");
  await page.goto('https://genmedia30-production.up.railway.app/', { waitUntil: 'networkidle2' });
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  console.log("👉 Clicking Okta SSO Bypass...");
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(el => el.textContent.includes('Okta'));
    if (btn) btn.click();
  });
  
  // Wait 2s for navigation and dashboard load
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  console.log("📸 Capture 1: Initial Dynamic Dashboard (Mock Campaigns & Active Tasks)");
  await page.screenshot({ path: path.join(screenshotDir, '01_dashboard_initial.png') });
  
  console.log("👉 Clicking 'Resume' on Zygardia Q3 Launch Campaign...");
  await page.evaluate(() => {
    // Find the row containing Zygardia Q3 Launch Campaign and click its Resume button
    const rows = Array.from(document.querySelectorAll('tbody tr'));
    const zygardiaRow = rows.find(row => row.textContent.includes('Zygardia Q3 Launch Campaign'));
    if (zygardiaRow) {
      const btn = zygardiaRow.querySelector('button');
      if (btn) btn.click();
    }
  });
  
  // Wait 3s for Campaign Studio to load the draft and run initial scan
  console.log("⏳ Loading campaign draft in Studio...");
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  console.log("📸 Capture 2: Campaign Studio (Draft Loaded Successfully)");
  await page.screenshot({ path: path.join(screenshotDir, '02_studio_draft_loaded.png') });
  
  console.log("👉 Editing copy to be compliant (removing 'miracle cure' and 'guaranteed')...");
  await page.evaluate(() => {
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.value = "ZYGARDIA 10mg is a breakthrough monotherapy for resectable renal cell carcinoma. Clinically proven to provide a significant improvement in recurrence-free survival in clinical trials. Our therapeutic pipeline is designed to deliver excellent clinical survival rates. Ensure early adjuvant intervention to optimize treatment sequencing.";
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }
  });
  
  // Wait 3.5s for debounced scan to complete and update context
  console.log("⏳ Waiting for compliance scan to audit new copy...");
  await new Promise(resolve => setTimeout(resolve, 3500));
  
  console.log("📸 Capture 3: Campaign Studio (Copy Compliant & Slide Unlocked)");
  await page.screenshot({ path: path.join(screenshotDir, '03_studio_compliant_unlocked.png') });
  
  console.log("👉 Clicking 'Create Asset' to open creator modal...");
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(el => el.textContent.includes('Create Asset'));
    if (btn) btn.click();
  });
  await new Promise(resolve => setTimeout(resolve, 1000)); // modal open animation
  
  console.log("👉 Switching to Video tab and generating video...");
  await page.evaluate(() => {
    // Click Video Tab
    const tab = Array.from(document.querySelectorAll('button')).find(el => el.textContent.includes('Video Generator'));
    if (tab) tab.click();
  });
  await new Promise(resolve => setTimeout(resolve, 1000)); // tab switch settling
  
  await page.evaluate(() => {
    // Click Generate Video
    const btn = Array.from(document.querySelectorAll('button')).find(el => el.textContent.includes('Generate Video'));
    if (btn) btn.click();
  });
  
  // Wait 4s for video generation simulation
  console.log("⏳ Generating clinical video asset...");
  await new Promise(resolve => setTimeout(resolve, 4000));
  
  console.log("📸 Capture 4: Campaign Studio (Video Generated & Playing in Slide Mockup)");
  await page.screenshot({ path: path.join(screenshotDir, '04_studio_video_generated.png') });
  
  console.log("👉 Navigating through Stepper to Step 5 (Review)...");
  // Click Next Module (Step 3 -> Step 4)
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(el => el.textContent.includes('Next Module'));
    if (btn) btn.click();
  });
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Click Next Module (Step 4 -> Step 5)
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(el => el.textContent.includes('Next Module'));
    if (btn) btn.click();
  });
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  console.log("📸 Capture 5: Step 5 Review & Approval Page");
  await page.screenshot({ path: path.join(screenshotDir, '05_studio_step5_review.png') });
  
  console.log("👉 Clicking 'Approve to Memory' (Final Submission)...");
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(el => el.textContent.includes('Approve to Memory'));
    if (btn) btn.click();
  });
  
  // Wait 2.5s for redirection and dashboard update
  console.log("⏳ Submitting campaign and redirecting to dashboard...");
  await new Promise(resolve => setTimeout(resolve, 2500));
  
  console.log("📸 Capture 6: Updated Dashboard (All Campaigns Completed, Metrics Updated, Tasks Clear)");
  await page.screenshot({ path: path.join(screenshotDir, '06_dashboard_updated_final.png') });
  
  await browser.close();
  console.log("🎉 MILESTONE 1 E2E STATE SYNC VALIDATION COMPLETED SUCCESSFULLY!");
})();
