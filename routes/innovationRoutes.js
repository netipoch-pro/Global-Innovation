// routes/innovationRoutes.js
const express = require('express');
const router = express.Router();
const { getLatestInnovations } = require('../utils/geminiAPI');
const { generateFuturePredictions, assessRisk, generatePredictionReport } = require('../utils/predictionEngine');

// Route สำหรับดึงข้อมูลนวัตกรรม 10 รายการล่าสุด
router.get('/api/innovations', async (req, res) => {
  try {
    // ดึงข้อมูลนวัตกรรมล่าสุดจาก AI Gemini API
    const innovationsResult = await getLatestInnovations('all', 10);
    
    if (!innovationsResult.success) {
      return res.status(500).json({ 
        error: 'Failed to fetch innovations data',
        details: innovationsResult.error
      });
    }
    
    // จัดรูปแบบข้อมูลให้เหมาะสมกับการแสดงผล
    const formattedInnovations = innovationsResult.data.results.map((innovation, index) => ({
      id: index + 1,
      name: innovation.title,
      description: innovation.summary,
      sector: innovation.sector || 'General',
      economicValue: innovation.economic_value ? 
        formatEconomicValue(innovation.economic_value) : 
        'N/A',
      trend: innovation.trend || 'Stable',
      createdAt: innovation.date || new Date().toISOString()
    }));
    
    res.json({
      success: true,
      data: formattedInnovations,
      count: formattedInnovations.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in /api/innovations:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message
    });
  }
});

// Route สำหรับดึงข้อมูลการคาดการณ์นวัตกรรมในอนาคต
router.get('/api/predictions', async (req, res) => {
  try {
    // สร้างการประเมินการล่วงหน้าการเคลื่อนไหวของนวัตกรรม 4-5 ปีข้างหน้า
    const futurePredictions = await generateFuturePredictions(5, []);
    
    // ประเมินความเสี่ยงสำหรับแต่ละนวัตกรรม
    const predictionsWithRisk = futurePredictions.map(prediction => ({
      ...prediction,
      risk: assessRisk(prediction)
    }));
    
    // สร้างรายงานสรุปการคาดการณ์
    const report = generatePredictionReport(predictionsWithRisk);
    
    res.json({
      success: true,
      data: predictionsWithRisk,
      report: report,
      count: predictionsWithRisk.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in /api/predictions:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message
    });
  }
});

// Route สำหรับค้นหานวัตกรรมด้วยคำค้นหา
router.get('/api/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const { sector, limit = 10 } = req.query;
    
    // ดึงข้อมูลนวัตกรรมจาก AI Gemini API ตามคำค้นหา
    const searchResult = await getLatestInnovations(sector || 'all', parseInt(limit));
    
    if (!searchResult.success) {
      return res.status(500).json({
        error: 'Failed to search innovations data',
        details: searchResult.error
      });
    }
    
    // จัดรูปแบบข้อมูลให้เหมาะสมกับการแสดงผล
    const formattedResults = searchResult.data.results.map((innovation, index) => ({
      id: index + 1,
      name: innovation.title,
      description: innovation.summary,
      sector: innovation.sector || 'General',
      economicValue: innovation.economic_value ?
        formatEconomicValue(innovation.economic_value) :
        'N/A',
      trend: innovation.trend || 'Stable',
      relevance: innovation.relevance_score || 0.5,
      createdAt: innovation.date || new Date().toISOString()
    }));
    
    res.json({
      success: true,
      query: query,
      data: formattedResults,
      count: formattedResults.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in /api/search/:query:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
});

// Route สำหรับดึงข้อมูลนวัตกรรมตาม sector
router.get('/api/innovations/sector/:sector', async (req, res) => {
  try {
    const { sector } = req.params;
    const { limit = 10 } = req.query;
    
    // ดึงข้อมูลนวัตกรรมจาก AI Gemini API ตาม sector
    const sectorResult = await getLatestInnovations(sector, parseInt(limit));
    
    if (!sectorResult.success) {
      return res.status(500).json({
        error: `Failed to fetch innovations for sector: ${sector}`,
        details: sectorResult.error
      });
    }
    
    // จัดรูปแบบข้อมูลให้เหมาะสมกับการแสดงผล
    const formattedResults = sectorResult.data.results.map((innovation, index) => ({
      id: index + 1,
      name: innovation.title,
      description: innovation.summary,
      sector: innovation.sector || sector,
      economicValue: innovation.economic_value ?
        formatEconomicValue(innovation.economic_value) :
        'N/A',
      trend: innovation.trend || 'Stable',
      createdAt: innovation.date || new Date().toISOString()
    }));
    
    res.json({
      success: true,
      sector: sector,
      data: formattedResults,
      count: formattedResults.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in /api/innovations/sector/:sector:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
});

// ฟังก์ชันสำหรับจัดรูปแบบมูลค่าทางเศรษฐกิจ
function formatEconomicValue(value) {
  if (!value) return 'N/A';
  
  // ถ้าเป็นตัวเลข ให้จัดรูปแบบเป็นสกุลเงิน
  if (typeof value === 'number') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(value);
  }
  
  // ถ้าเป็น object ให้พยายามดึงค่าที่สำคัญ
  if (typeof value === 'object') {
    const amount = value.amount || value.value || value.estimated_value;
    const currency = value.currency || 'USD';
    
    if (amount) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        notation: 'compact',
        maximumFractionDigits: 1
      }).format(amount);
    }
  }
  
  // คืนค่าเดิมหากไม่สามารถจัดรูปแบบได้
  return value.toString();
}

module.exports = router;