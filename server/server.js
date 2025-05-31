const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || '*'
}));
app.use(express.json());

// Serve static files from React build
app.use(express.static(path.join(__dirname, '../client/build')));

// Use your deployed Python Flask service
const TRANSLATE_SERVICE_URL = process.env.TRANSLATE_SERVICE_URL || 'https://palabraflow-translator.onrender.com';

app.post('/api/translate', async (req, res) => {
    const { text, sourceLanguage, targetLanguage } = req.body;

    if (!text || !sourceLanguage || !targetLanguage) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    try {
        // Call your Flask translation service
        const response = await fetch(`${TRANSLATE_SERVICE_URL}/translate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, sourceLanguage, targetLanguage }),
            timeout: 30000 // 30 second timeout
        });

        if (!response.ok) {
            throw new Error(`Translation service responded with status: ${response.status}`);
        }

        const data = await response.json();
        res.json({ translatedText: data.translatedText });

    } catch (error) {
        console.error('Translation error:', error);
        
        // Improved fallback with better error handling
        if (error.name === 'AbortError' || error.code === 'ECONNREFUSED') {
            const fallbackTranslation = `[DEMO: ${targetLanguage.toUpperCase()}] ${text}`;
            res.json({ 
                translatedText: fallbackTranslation,
                note: 'Translation service temporarily unavailable. This is a demo response.',
                serviceStatus: 'unavailable'
            });
        } else {
            res.status(500).json({
                error: 'Translation failed',
                details: error.message,
                serviceUrl: TRANSLATE_SERVICE_URL
            });
        }
    }
});

// Enhanced health check
app.get('/health', async (req, res) => {
    let translationServiceStatus = 'unknown';
    
    try {
        const healthCheck = await fetch(`${TRANSLATE_SERVICE_URL}/health`, { timeout: 5000 });
        translationServiceStatus = healthCheck.ok ? 'healthy' : 'unhealthy';
    } catch (error) {
        translationServiceStatus = 'unavailable';
    }

    res.status(200).json({ 
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        translationService: {
            url: TRANSLATE_SERVICE_URL,
            status: translationServiceStatus
        }
    });
});

// API info endpoint
app.get('/api', (req, res) => {
    res.json({
        message: 'PalabraFlow API - Full Stack Application',
        version: '1.0.0',
        architecture: 'Microservices',
        endpoints: [
            'POST /api/translate',
            'GET /health',
            'GET /api'
        ],
        translationService: TRANSLATE_SERVICE_URL
    });
});

// Serve React app for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.listen(PORT, () => {
    console.log(`PalabraFlow server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Translation service: ${TRANSLATE_SERVICE_URL}`);
});
