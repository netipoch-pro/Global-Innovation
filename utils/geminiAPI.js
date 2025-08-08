// utils/geminiAPI.js
const axios = require('axios');
require('dotenv').config();

// ฟังก์ชันสำหรับเรียกใช้ AI Gemini API
async function callAIGeminiAPI(query, options = {}) {
  try {
    // ตรวจสอบว่ามี API key หรือไม่
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY ไม่ได้ถูกกำหนดใน environment variables');
    }

    // กำหนดค่าเริ่มต้นสำหรับ options
    const {
      maxResults = 10,
      language = 'th',
      includeEconomicData = true,
      includeTrendAnalysis = true
    } = options;

    // สร้าง payload สำหรับส่งไปยัง API
    const payload = {
      query: query,
      parameters: {
        max_results: maxResults,
        language: language,
        include_economic_data: includeEconomicData,
        include_trend_analysis: includeTrendAnalysis
      }
    };

    // กำหนด headers สำหรับ API request
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`,
      'User-Agent': 'Global-Innovation-Tracker/1.0'
    };

    // ทำการเรียก API (ในที่นี้เป็น URL ตัวอย่าง คุณต้องเปลี่ยนเป็น URL จริงของ AI Gemini)
    const response = await axios.post(
      'https://api.gemini.example.com/v1/innovation-search',
      payload,
      { headers: headers, timeout: 10000 }
    );

    // คืนค่าผลลัพธ์จาก API
    return {
      success: true,
      data: response.data,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    // จัดการกับ error ที่เกิดขึ้น
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

// ฟังก์ชันสำหรับค้นหานวัตกรรมล่าสุด
async function getLatestInnovations(sector = 'all', limit = 10) {
  const query = sector === 'all' ? 'latest innovations' : `latest innovations in ${sector}`;
  const options = {
    maxResults: limit,
    includeEconomicData: true
  };
  
  return await callAIGeminiAPI(query, options);
}

// ฟังก์ชันสำหรับคาดการณ์แนวโน้มนวัตกรรมในอนาคต
async function predictFutureInnovations(yearsAhead = 5, limit = 10) {
  const query = `predicted innovation trends ${yearsAhead} years ahead`;
  const options = {
    maxResults: limit,
    includeTrendAnalysis: true
  };
  
  return await callAIGeminiAPI(query, options);
}

// ฟังก์ชันสำหรับวิเคราะห์มูลค่าทางเศรษฐกิจของนวัตกรรม
async function analyzeEconomicValue(innovationName) {
  const query = `economic value and market impact of ${innovationName}`;
  const options = {
    includeEconomicData: true
  };
  
  return await callAIGeminiAPI(query, options);
}

// ฟังก์ชันสำหรับเปรียบเทียบแนวโน้มนวัตกรรมระหว่างประเทศ
async function compareGlobalTrends(countries = [], limit = 10) {
  const query = `compare innovation trends in ${countries.join(', ')}`;
  const options = {
    maxResults: limit,
    includeTrendAnalysis: true
  };
  
  return await callAIGeminiAPI(query, options);
}

module.exports = {
  callAIGeminiAPI,
  getLatestInnovations,
  predictFutureInnovations,
  analyzeEconomicValue,
  compareGlobalTrends
};