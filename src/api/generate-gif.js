const puppeteer = require('puppeteer');
const gifshot = require('gifshot');

module.exports = async (req, res) => {
  const url = req.query.url || req.body?.url;
  const width = parseInt(req.query.width || req.body?.width, 10);
  const frameRate = parseInt(req.query.frameRate || req.body?.frameRate, 10);
  const length = parseInt(req.query.length || req.body?.length, 10);

  if (!url || !width || !frameRate || !length) {
    res.status(400).json({ error: 'Missing required parameters' });
    return;
  }

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    const height = await page.evaluate(() => document.body.scrollHeight);
    await page.setViewport({ width, height });

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
      gifWidth: width,
      gifHeight: height
    }, (obj) => {
      if (!obj.error) {
        res.status(200).json({ gif: obj.image });
      } else {
        res.status(500).json({ error: obj.errorMsg || 'Failed to generate GIF' });
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
