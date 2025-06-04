const puppeteer = require('puppeteer');
const gifshot = require('gifshot');

document.getElementById('gifForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const url = document.getElementById('url').value;
    const width = parseInt(document.getElementById('width').value, 10);
    const frameRate = parseInt(document.getElementById('frameRate').value, 10);
    const length = parseInt(document.getElementById('length').value, 10);

    document.getElementById('loading').style.display = 'block';
    document.getElementById('result').style.display = 'none';

    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });

        const height = await page.evaluate(() => document.body.scrollHeight);
        await page.setViewport({ width, height });

        const screenshots = [];
        const totalFrames = frameRate * length;
        for (let i = 0; i < totalFrames; i++) {
            const screenshot = await page.screenshot();
            screenshots.push(screenshot);
            await page.waitForTimeout(1000 / frameRate);
        }

        await browser.close();

        gifshot.createGIF({
            images: screenshots,
            interval: 1 / frameRate,
            gifWidth: width,
            gifHeight: height
        }, (obj) => {
            if (!obj.error) {
                const image = obj.image;
                const downloadLink = document.getElementById('downloadLink');
                downloadLink.href = image;
                downloadLink.download = 'website.gif';
                document.getElementById('loading').style.display = 'none';
                document.getElementById('result').style.display = 'block';
            }
        });
    } catch (error) {
        console.error('Error generating GIF:', error);
        document.getElementById('loading').style.display = 'none';
    }
});
