const express = require('express');
const axios = require('axios');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security & Performance Middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"]
        }
    }
}));
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Your existing mock data...
const currentInnovations = [
  // ... (keep your existing data)
];

const futurePredictions = [
  // ... (keep your existing data)
];

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString() 
    });
});

// Your existing routes...
app.get('/', (req, res) => {
    res.render('dashboard', { 
        innovations: currentInnovations,
        predictions: futurePredictions
    });
});

// API endpoints
app.get('/api/innovations', (req, res) => {
    res.json({
        success: true,
        data: currentInnovations,
        timestamp: new Date().toISOString()
    });
});

app.get('/api/predictions', (req, res) => {
    res.json({
        success: true,
        data: futurePredictions,
        timestamp: new Date().toISOString()
    });
});

// Enhanced AI Gemini API function
async function callAIGeminiAPI(query) {
    if (process.env.GEMINI_API_KEY) {
        try {
            // Real Gemini API call
            const response = await axios.post(
                'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
                {
                    contents: [{
                        parts: [{
                            text: `Search for innovations related to: ${query}`
                        }]
                    }]
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    params: {
                        key: process.env.GEMINI_API_KEY
                    }
                }
            );
            
            return {
                query: query,
                results: response.data,
                source: 'gemini'
            };
        } catch (error) {
            console.error('Gemini API error:', error);
            // Fallback to mock data if API fails
        }
    }
    
    // Mock data fallback
    return {
        query: query,
        results: [{
            title: `Innovation results for: ${query}`,
            summary: `AI-generated insights about ${query}`,
            relevance: "High"
        }],
        source: 'mock'
    };
}

app.get('/api/search/:query', async (req, res) => {
    try {
        const results = await callAIGeminiAPI(req.params.query);
        res.json(results);
    } catch (error) {
        res.status(500).json({ 
            error: 'Error processing search request',
            message: error.message 
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📊 Dashboard: http://localhost:${PORT}`);
    console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
});
// เพิ่มใน server.js
app.use(cors({
    origin: ['https://netipoch-pro.github.io', 'http://localhost:*'],
    credentials: true
}));