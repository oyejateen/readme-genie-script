const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({
  origin: ['http://localhost:3000', 'https://readmegenie.vercel.app'],
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

app.post('/api/github/callback', async (req, res) => {
  const { code } = req.body;

  try {
    const response = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code: code
    }, {
      headers: {
        Accept: 'application/json'
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    res.status(500).json({ error: 'Failed to exchange code for token' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));