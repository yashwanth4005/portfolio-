const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));

    // Catch fetch/network errors
    page.on('requestfailed', request => {
        console.log('NETWORK ERROR:', request.url(), request.failure().errorText);
    });

    const fileUrl = `file://${path.resolve('index.html').replace(/\\/g, '/')}`;
    console.log(`Opening ${fileUrl}...`);

    try {
        await page.goto(fileUrl, { waitUntil: 'networkidle0' });
        console.log("Page loaded successfully.");
    } catch (e) {
        console.log("Error loading page:", e);
    }

    await browser.close();
})();
