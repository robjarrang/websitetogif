const puppeteer = require('puppeteer');
const gifshot = require('gifshot');

module.exports = async (req, res) => {
  // Support both query parameters and body parameters for flexibility
  const url = req.query.url || req.body?.url;
  const width = parseInt(req.query.width || req.body?.width, 10);
  const frameRate = parseInt(req.query.frameRate || req.body?.frameRate, 10);
  const length = parseInt(req.query.length || req.body?.length, 10);

  // Validate required parameters
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
      // Add timing delay to ensure proper frame rate
      await page.waitForTimeout(1000 / frameRate);
    }
    
    await browser.close();
    
    gifshot.createGIF({
      images: screenshots,
      interval: 1 / frameRate,
      gifWidth: width,
      gifHeight: height
    }, (obj) => {
      if (obj.error) {
        console.error('GIF generation error:', obj.errorMsg);
        res.status(500).json({ error: obj.errorMsg || 'Failed to generate GIF' });
      } else {
        res.status(200).json({ gif: obj.image });
      }
    });
  } catch (err) {
    console.error('Error generating GIF:', err);
    res.status(500).json({ error: err.message });
  }
};