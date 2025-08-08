const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Mock data for current innovations
const currentInnovations = [
  {
    id: 1,
    name: "AI-Powered Drug Discovery",
    description: "Using artificial intelligence to accelerate the discovery of new pharmaceuticals",
    sector: "Healthcare",
    economicValue: "$50B",
    trend: "กำลังเติบโต"
  },
  {
    id: 2,
    name: "Quantum Computing Breakthrough",
    description: "Major advances in quantum processors for commercial applications",
    sector: "Technology",
    economicValue: "$120B",
    trend: "กำลังเติบโต"
  },
  {
    id: 3,
    name: "Vertical Farming Systems",
    description: "Innovative urban agriculture solutions for food security",
    sector: "Agriculture",
    economicValue: "$35B",
    trend: "กำลังเติบโต"
  },
  {
    id: 4,
    name: "Fusion Energy Commercialization",
    description: "First commercial fusion reactors coming online",
    sector: "Energy",
    economicValue: "$200B",
    trend: "กำลังเติบโต"
  },
  {
    id: 5,
    name: "Brain-Computer Interfaces",
    description: "Direct neural interfaces for medical and consumer applications",
    sector: "Healthcare/Technology",
    economicValue: "$80B",
    trend: "กำลังเติบโต"
  },
  {
    id: 6,
    name: "Autonomous Vehicle Networks",
    description: "Fully autonomous transportation systems in major cities",
    sector: "Transportation",
    economicValue: "$150B",
    trend: "กำลังเติบโต"
  },
  {
    id: 7,
    name: "Carbon Capture Megastructures",
    description: "Large-scale atmospheric carbon capture facilities",
    sector: "Environment",
    economicValue: "$90B",
    trend: "กำลังเติบโต"
  },
  {
    id: 8,
    name: "Space-Based Solar Power",
    description: "Orbital solar collectors beaming energy to Earth",
    sector: "Energy",
    economicValue: "$180B",
    trend: "กำลังเติบโต"
  },
  {
    id: 9,
    name: "Personalized Genetic Medicine",
    description: "Tailored treatments based on individual genetic profiles",
    sector: "Healthcare",
    economicValue: "$75B",
    trend: "กำลังเติบโต"
  },
  {
    id: 10,
    name: "Blockchain for Supply Chains",
    description: "Transparent and secure global supply chain tracking",
    sector: "Logistics",
    economicValue: "$45B",
    trend: "กำลังเติบโต"
  }
];

// Mock data for future predictions
const futurePredictions = [
  {
    id: 1,
    name: "Neural Lace Technology",
    description: "Implantable brain interfaces for enhanced cognition",
    sector: "Healthcare/Technology",
    predictedValue: "$500B",
    timeframe: "4-5 ปีข้างหน้า"
  },
  {
    id: 2,
    name: "Molecular Assemblers",
    description: "Nanotechnology for on-demand material creation",
    sector: "Manufacturing",
    predictedValue: "$1.2T",
    timeframe: "4-5 ปีข้างหน้า"
  },
  {
    id: 3,
    name: "Atmospheric Water Generation",
    description: "Devices that extract potable water from air at any climate",
    sector: "Environment",
    predictedValue: "$300B",
    timeframe: "4-5 ปีข้างหน้า"
  },
  {
    id: 4,
    name: "Holographic Communication",
    description: "Real-time 3D holographic telepresence systems",
    sector: "Telecommunications",
    predictedValue: "$250B",
    timeframe: "4-5 ปีข้างหน้า"
  },
  {
    id: 5,
    name: "Biological Age Reversal",
    description: "Therapies that significantly reverse aging processes",
    sector: "Healthcare",
    predictedValue: "$800B",
    timeframe: "4-5 ปีข้างหน้า"
  }
];

// Routes
app.get('/', (req, res) => {
  res.render('dashboard', { 
    innovations: currentInnovations,
    predictions: futurePredictions
  });
});

// API endpoint to get current innovations
app.get('/api/innovations', (req, res) => {
  res.json(currentInnovations);
});

// API endpoint to get future predictions
app.get('/api/predictions', (req, res) => {
  res.json(futurePredictions);
});

// Function to simulate calling AI Gemini API
async function callAIGeminiAPI(query) {
  // In a real implementation, this would call the actual AI Gemini API
  // For now, we'll return mock data
  console.log(`Calling AI Gemini API with query: ${query}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    query: query,
    results: [
      {
        title: "Latest Innovation in " + query,
        summary: "This is a simulated result from AI Gemini for the query: " + query,
        relevance: "High"
      }
    ]
  };
}

// Example route that uses the AI Gemini API function
app.get('/api/search/:query', async (req, res) => {
  try {
    const results = await callAIGeminiAPI(req.params.query);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Error calling AI Gemini API' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});