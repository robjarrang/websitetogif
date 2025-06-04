const puppeteer = require('puppeteer');
const GIFEncoder = require('gifencoder');
const { createCanvas, loadImage } = require('canvas');

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
      const screenshot = await page.screenshot();
      screenshots.push(screenshot);
      // Add timing delay to ensure proper frame rate
      await page.waitForTimeout(1000 / frameRate);
    }
    
    await browser.close();
    
    const encoder = new GIFEncoder(width, height);
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    const chunks = [];
    const stream = encoder.createReadStream();
    stream.on('data', chunk => chunks.push(chunk));

    encoder.start();
    encoder.setRepeat(0);
    encoder.setDelay(1000 / frameRate);
    encoder.setQuality(10);

    for (const shot of screenshots) {
      const img = await loadImage(shot);
      ctx.drawImage(img, 0, 0, width, height);
      encoder.addFrame(ctx);
    }

    encoder.finish();

    await new Promise((resolve, reject) => {
      stream.on('end', resolve);
      stream.on('error', reject);
    });

    const gifBuffer = Buffer.concat(chunks);
    res.status(200).json({ gif: 'data:image/gif;base64,' + gifBuffer.toString('base64') });
  } catch (err) {
    console.error('Error generating GIF:', err);
    res.status(500).json({ error: err.message });
  }
};
