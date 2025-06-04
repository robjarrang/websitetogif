const express = require('express');
const path = require('path');
const generateGif = require('./src/api/generate-gif');

const app = express();
app.use(express.json());

// Serve static files
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/src', express.static(path.join(__dirname, 'src')));

// API route
app.post('/api/generate-gif', generateGif);

// Fallback to index.html for other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
