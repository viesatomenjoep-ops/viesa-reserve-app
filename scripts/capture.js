const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  console.log('Starting puppeteer...');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });

  const screenshotsDir = path.join(__dirname, '../public/screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  try {
    // 1. Capture Frontend
    console.log('Capturing frontend...');
    await page.goto('http://localhost:3001', { waitUntil: 'networkidle2', timeout: 60000 });
    // Wait an extra second for animations
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: path.join(screenshotsDir, 'frontend.png') });
    console.log('Frontend captured.');

    // 2. Capture Backend
    console.log('Capturing backend...');
    await page.goto('http://localhost:3001/admin', { waitUntil: 'networkidle2', timeout: 60000 });
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: path.join(screenshotsDir, 'backend.png') });
    console.log('Backend captured.');

    // 3. Generate PDF of the Business Plan
    console.log('Navigating to Business Plan /pdf route...');
    await page.goto('http://localhost:3001/pdf', { waitUntil: 'networkidle2', timeout: 60000 });
    await new Promise(r => setTimeout(r, 5000)); // wait for images to load

    const desktopPath = '/Users/tomvanbiene/Desktop/Viesa-Reserve-Business-Plan.pdf';
    console.log('Generating PDF to Desktop...');
    await page.pdf({
      path: desktopPath,
      format: 'A4',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' }
    });
    console.log('PDF saved to Desktop successfully!');

  } catch (err) {
    console.error('Error during capture:', err);
  } finally {
    await browser.close();
    console.log('Done.');
  }
})();
