const puppeteer = require('puppeteer');
const gifshot = require('gifshot');

module.exports = async (req, res) => {
  const { url, width, frameRate, length } = req.body || {};

  if (!url || !width || !frameRate || !length) {
    res.status(400).json({ error: 'Missing parameters' });
    return;
  }

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    const height = await page.evaluate(() => document.body.scrollHeight);
    await page.setViewport({ width: parseInt(width, 10), height });

    const screenshots = [];
    const totalFrames = frameRate * length;
    for (let i = 0; i < totalFrames; i++) {
      const screenshot = await page.screenshot({ encoding: 'base64' });
      screenshots.push('data:image/png;base64,' + screenshot);
    }

    await browser.close();

    gifshot.createGIF({
      images: screenshots,
      interval: 1 / frameRate,
      gifWidth: parseInt(width, 10),
      gifHeight: height
    }, obj => {
      if (obj.error) {
        console.error('GIF error:', obj.errorMsg);
        res.status(500).json({ error: 'GIF generation failed' });
      } else {
        res.status(200).json({ gif: obj.image });
      }
    });
  } catch (err) {
    console.error('Error generating GIF:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
