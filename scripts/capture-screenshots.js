const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function captureScreenshots() {
    const mockups = [
        {
            path: 'docs/features/analytics-reporting/mockups/dashboard.html',
            output: 'docs/features/analytics-reporting/mockups/screenshots/dashboard.png',
            name: 'Analytics Dashboard'
        },
        {
            path: 'docs/features/member-management/mockups/member-list.html',
            output: 'docs/features/member-management/mockups/screenshots/member-list.png',
            name: 'Member List'
        },
        {
            path: 'docs/features/member-management/mockups/member-portal.html',
            output: 'docs/features/member-management/mockups/screenshots/member-portal.png',
            name: 'Member Portal'
        },
        {
            path: 'docs/features/rewards/mockups/rewards-catalog.html',
            output: 'docs/features/rewards/mockups/screenshots/rewards-catalog.png',
            name: 'Rewards Catalog'
        },
        {
            path: 'docs/features/points-transactions/mockups/quick-checkout.html',
            output: 'docs/features/points-transactions/mockups/screenshots/quick-checkout.png',
            name: 'Quick Checkout'
        },
        {
            path: 'docs/features/campaigns/mockups/campaign-dashboard.html',
            output: 'docs/features/campaigns/mockups/screenshots/campaign-dashboard.png',
            name: 'Campaigns Dashboard'
        }
    ];

    console.log('Launching browser...');
    const browser = await chromium.launch();
    const context = await browser.newContext({
        viewport: { width: 1440, height: 900 }
    });
    const page = await context.newPage();

    for (const mockup of mockups) {
        const inputPath = path.resolve(process.cwd(), mockup.path);
        const outputPath = path.resolve(process.cwd(), mockup.output);

        // Ensure output directory exists
        const outputDir = path.dirname(outputPath);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        if (!fs.existsSync(inputPath)) {
            console.log(`✗ ${mockup.name}: File not found - ${mockup.path}`);
            continue;
        }

        try {
            const fileUrl = `file://${inputPath}`;
            await page.goto(fileUrl, { waitUntil: 'networkidle' });

            // Wait for fonts to load
            await page.waitForTimeout(500);

            await page.screenshot({
                path: outputPath,
                fullPage: true
            });

            console.log(`✓ ${mockup.name}: ${mockup.output}`);
        } catch (error) {
            console.log(`✗ ${mockup.name}: ${error.message}`);
        }
    }

    await browser.close();
    console.log('\nScreenshot capture complete!');
}

captureScreenshots().catch(console.error);
