// Simple CORS proxy for Runalyze API
// Run with: node proxy-server.js

import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Proxy endpoint for Runalyze API
app.get('/api/runalyze/*', async (req, res) => {
  try {
    // Get token from header
    const token = req.headers['token'] || req.headers['authorization']?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Build Runalyze API URL
    const runalyzeUrl = 'https://runalyze.com/api/v1' + req.path.replace('/api/runalyze', '');
    const fullUrl = runalyzeUrl + (req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : '');

    console.log('🔄 Proxying request to:', fullUrl);
    console.log('🔑 Using token:', token.substring(0, 10) + '...');

    // Forward request to Runalyze API
    const response = await fetch(fullUrl, {
      method: req.method,
      headers: {
        'token': token,
        'Accept': 'application/json',
      }
    });

    console.log('✅ Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error response:', errorText);
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();
    console.log('✅ Success, returning', Array.isArray(data) ? data.length : 'unknown', 'items');

    res.json(data);

  } catch (error) {
    console.error('❌ Proxy error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║  🚀 Runalyze Proxy Server Running                     ║
║                                                        ║
║  Port:     http://localhost:${PORT}                      ║
║  Endpoint: http://localhost:${PORT}/api/runalyze/*       ║
║                                                        ║
║  Ready to proxy requests to Runalyze API!             ║
╚════════════════════════════════════════════════════════╝
  `);
});
