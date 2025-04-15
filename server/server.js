const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config(); // Ensure this is at the top

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// --- Initialize Gemini API Client ---
// Ensure GEMINI_API_KEY is loaded from .env
const apiKey = process.env.GEMINI_API_KEY;
let genAI;
let model;

if (!apiKey) {
    console.error("Error: GEMINI_API_KEY is not defined in the environment variables.");
    // Optionally exit or prevent the server from fully starting
    // process.exit(1);
} else {
    try {
        genAI = new GoogleGenerativeAI(apiKey);
        model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        console.log("Gemini API client initialized successfully.");
    } catch (error) {
        console.error("Failed to initialize Gemini API client:", error);
        // Optionally exit or prevent the server from fully starting
        // process.exit(1);
    }
}

// --- Translation Endpoint ---
app.post('/api/translate', async (req, res) => {
    // Check if the model was initialized successfully
    if (!model) {
        return res.status(500).json({
            error: 'Gemini API client not initialized',
            details: 'Server configuration error. Check API key.'
        });
    }

    try {
        // Get parameters from request body, excluding apiKey
        const { text, sourceLanguage, targetLanguage } = req.body; // Removed apiKey[2]

        // Validate required parameters
        if (!text || !sourceLanguage || !targetLanguage) {
            return res.status(400).json({ error: 'Missing required parameters (text, sourceLanguage, targetLanguage)' }); // Updated error message
        }

        // Construct the prompt
        const prompt = `Translate the following ${sourceLanguage} text to ${targetLanguage}. Return only the translated text without any explanations, additional text, or formatting:

"${text}"`;

        // Generate content using the globally initialized model
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const translatedText = response.text().trim();

        res.json({ translatedText });

    } catch (error) {
        console.error('Translation error:', error);
        // Provide more context in the error response if available
        res.status(500).json({
            error: 'Failed to translate text',
            details: error.message || 'An unknown error occurred during translation.'
        });
    }
});

// --- Remove API Key Verification Endpoint ---
// The entire app.post('/api/verify-key', ...) block should be deleted.[2]


// Serve static files in production (if applicable)
if (process.env.NODE_ENV === 'production') {
    const path = require('path');
    app.use(express.static(path.join(__dirname, '../client/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
    });
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    if (!apiKey) {
        console.warn("Warning: Server started but GEMINI_API_KEY is missing. Translation endpoint will fail.");
    }
});

// Note: Ensure to handle the case where the API key is not provided or invalid.
// This can be done by checking the API key before making any requests to the Gemini API.
// This is a simplified version of the server code. In a production environment,

