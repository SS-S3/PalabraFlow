const express = require('express');
const cors = require('cors');
// const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.post('/api/translate', async (req, res) => {
    const { text, sourceLanguage, targetLanguage } = req.body;

    if (!text || !sourceLanguage || !targetLanguage) {
        return res.status(400).json({ error: 'Missing required parameters (text, sourceLanguage, targetLanguage)' });
    }

    try {
        const response = await fetch('http://localhost:5001/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, sourceLanguage, targetLanguage })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.details || 'Translation failed');
        }

        res.json({ translatedText: data.translatedText });
    } catch (error) {
        console.error('Translation error:', error);
        res.status(500).json({
            error: 'Failed to translate text',
            details: error.message || 'An unknown error occurred.'
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
