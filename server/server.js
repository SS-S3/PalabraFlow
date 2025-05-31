const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve React build files
app.use(express.static(path.join(__dirname, '../client/build')));

// Translation service URL (your Python service)
const TRANSLATE_SERVICE_URL = process.env.TRANSLATE_SERVICE_URL || 'https://palabraflow.onrender.com';

// API Routes
app.post('/api/translate', async (req, res) => {
    const { text, sourceLanguage, targetLanguage } = req.body;

    try {
        const response = await fetch(`${TRANSLATE_SERVICE_URL}/translate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, sourceLanguage, targetLanguage })
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Translation error:', error);
        res.status(500).json({ error: 'Translation service unavailable' });
    }
});

app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        service: 'PalabraFlow Full-Stack',
        translationService: TRANSLATE_SERVICE_URL
    });
});

// Serve React app for all other routes (IMPORTANT!)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.listen(PORT, () => {
    console.log(`PalabraFlow server running on port ${PORT}`);
    console.log(`Translation service: ${TRANSLATE_SERVICE_URL}`);
});
