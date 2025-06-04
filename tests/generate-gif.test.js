// Mock puppeteer, gifshot and canvas so the handler can load without heavy deps
jest.mock('puppeteer', () => ({
  launch: jest.fn().mockResolvedValue({
    newPage: jest.fn().mockResolvedValue({
      goto: jest.fn(),
      evaluate: jest.fn().mockResolvedValue(100),
      setViewport: jest.fn(),
      screenshot: jest.fn().mockResolvedValue(Buffer.from('')),
      waitForTimeout: jest.fn(),
    }),
    close: jest.fn(),
  }),
}));

jest.mock('gifshot', () => ({}), { virtual: true });
jest.mock('canvas', () => ({ createCanvas: jest.fn(), loadImage: jest.fn() }));

const generateGif = require('../src/api/generate-gif');

const makeRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('generateGif parameter validation', () => {
  test('missing url results in status 400', async () => {
    const req = { query: { width: '100', frameRate: '1', length: '1' } };
    const res = makeRes();

    await generateGif(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Missing required parameter: url' });
  });

  test('invalid width results in status 400', async () => {
    const req = { query: { url: 'http://example.com', width: '0', frameRate: '1', length: '1' } };
    const res = makeRes();

    await generateGif(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Width must be a positive integer up to 2000px' });
  });

  test('invalid frameRate results in status 400', async () => {
    const req = { query: { url: 'http://example.com', width: '100', frameRate: '0', length: '1' } };
    const res = makeRes();

    await generateGif(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Frame rate must be a positive integer up to 60 fps' });
  });

  test('invalid length results in status 400', async () => {
    const req = { query: { url: 'http://example.com', width: '100', frameRate: '1', length: '0' } };
    const res = makeRes();

    await generateGif(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Length must be a positive integer up to 60 seconds' });
  });
});
