// utils/predictionEngine.js
const { predictFutureInnovations, analyzeEconomicValue } = require('./geminiAPI');

// ฟังก์ชันสำหรับสร้างการประเมินการล่วงหน้าการเคลื่อนไหวของนวัตกรรม 4-5 ปีข้างหน้า
async function generateFuturePredictions(yearsAhead = 5, sectors = []) {
  try {
    // กำหนดsectors เริ่มต้นหากไม่ได้ระบุ
    if (sectors.length === 0) {
      sectors = [
        'Healthcare', 
        'Technology', 
        'Energy', 
        'Transportation', 
        'Agriculture', 
        'Environment',
        'Manufacturing',
        'Finance',
        'Education',
        'Entertainment'
      ];
    }

    // เรียกใช้ AI Gemini API เพื่อคาดการณ์แนวโน้มนวัตกรรมในอนาคต
    const predictionResults = await predictFutureInnovations(yearsAhead, 15);
    
    if (!predictionResults.success) {
      throw new Error(`Error from AI Gemini API: ${predictionResults.error}`);
    }

    // ประมวลผลผลลัพธ์และสร้างข้อมูลเชิงลึก
    const detailedPredictions = [];
    
    for (const innovation of predictionResults.data.results) {
      // วิเคราะห์มูลค่าทางเศรษฐกิจของนวัตกรรมที่คาดการณ์
      const economicAnalysis = await analyzeEconomicValue(innovation.title);
      
      // สร้างข้อมูลเชิงลึกสำหรับแต่ละนวัตกรรม
      const detailedPrediction = {
        id: generateId(),
        name: innovation.title,
        description: innovation.summary,
        sector: determineSector(innovation.title, sectors),
        predictedValue: economicAnalysis.success ? 
          formatEconomicValue(economicAnalysis.data.economic_impact) : 
          'N/A',
        timeframe: `${yearsAhead} ปีข้างหน้า`,
        confidence: innovation.confidence_score || 0.85,
        potentialImpact: innovation.impact_areas || [],
        relatedTechnologies: innovation.related_technologies || [],
        createdAt: new Date().toISOString()
      };
      
      detailedPredictions.push(detailedPrediction);
    }

    // จัดเรียงตามระดับความมั่นใจ
    detailedPredictions.sort((a, b) => b.confidence - a.confidence);
    
    // จำกัดผลลัพธ์เป็น 10 รายการ
    return detailedPredictions.slice(0, 10);
  } catch (error) {
    console.error('Error in generateFuturePredictions:', error);
    throw error;
  }
}

// ฟังก์ชันสำหรับสร้าง ID แบบง่าย
function generateId() {
  return Math.floor(Math.random() * 1000000);
}

// ฟังก์ชันสำหรับกำหนด sector ของนวัตกรรม
function determineSector(title, sectors) {
  const titleLower = title.toLowerCase();
  
  if (titleLower.includes('health') || titleLower.includes('medical')) {
    return 'Healthcare';
  } else if (titleLower.includes('ai') || titleLower.includes('artificial intelligence') || titleLower.includes('software')) {
    return 'Technology';
  } else if (titleLower.includes('energy') || titleLower.includes('solar') || titleLower.includes('battery')) {
    return 'Energy';
  } else if (titleLower.includes('transport') || titleLower.includes('vehicle') || titleLower.includes('autonomous')) {
    return 'Transportation';
  } else if (titleLower.includes('agri') || titleLower.includes('farm')) {
    return 'Agriculture';
  } else if (titleLower.includes('climate') || titleLower.includes('carbon') || titleLower.includes('environment')) {
    return 'Environment';
  } else if (titleLower.includes('manufactur') || titleLower.includes('3d print')) {
    return 'Manufacturing';
  } else if (titleLower.includes('finance') || titleLower.includes('blockchain') || titleLower.includes('crypto')) {
    return 'Finance';
  } else if (titleLower.includes('education') || titleLower.includes('learn')) {
    return 'Education';
  } else if (titleLower.includes('entertain') || titleLower.includes('ar') || titleLower.includes('vr')) {
    return 'Entertainment';
  }
  
  // คืนค่า sector สุ่มหากไม่สามารถจำแนกได้
  return sectors[Math.floor(Math.random() * sectors.length)];
}

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

// ฟังก์ชันสำหรับประเมินความเสี่ยงของนวัตกรรมในอนาคต
function assessRisk(prediction) {
  const riskFactors = [];
  let riskScore = 0;
  
  // ประเมินตามระดับความมั่นใจ
  if (prediction.confidence < 0.7) {
    riskFactors.push('Low confidence score');
    riskScore += 3;
  } else if (prediction.confidence < 0.85) {
    riskScore += 1;
  }
  
  // ประเมินตาม sector
  const highRiskSectors = ['Healthcare', 'Finance', 'Energy'];
  if (highRiskSectors.includes(prediction.sector)) {
    riskFactors.push(`High-risk sector: ${prediction.sector}`);
    riskScore += 2;
  }
  
  // ประเมินตามมูลค่าที่คาดการณ์
  const predictedValue = parseFloat(prediction.predictedValue.replace(/[^0-9.-]+/g,""));
  if (predictedValue > 1000000000000) { // มากกว่า 1 ล้านล้าน
    riskFactors.push('High economic impact');
    riskScore += 2;
  }
  
  // กำหนดระดับความเสี่ยง
  let riskLevel = 'Low';
  if (riskScore >= 5) {
    riskLevel = 'High';
  } else if (riskScore >= 3) {
    riskLevel = 'Medium';
  }
  
  return {
    level: riskLevel,
    score: riskScore,
    factors: riskFactors
  };
}

// ฟังก์ชันสำหรับสร้างรายงานสรุปการคาดการณ์
function generatePredictionReport(predictions) {
  const sectors = {};
  let totalPredictedValue = 0;
  
  predictions.forEach(prediction => {
    // นับจำนวนนวัตกรรมตาม sector
    if (!sectors[prediction.sector]) {
      sectors[prediction.sector] = 0;
    }
    sectors[prediction.sector]++;
    
    // รวมมูลค่าที่คาดการณ์
    const value = parseFloat(prediction.predictedValue.replace(/[^0-9.-]+/g,""));
    if (!isNaN(value)) {
      totalPredictedValue += value;
    }
  });
  
  return {
    totalPredictions: predictions.length,
    sectors: sectors,
    totalPredictedValue: formatEconomicValue(totalPredictedValue),
    averageConfidence: predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length,
    generatedAt: new Date().toISOString()
  };
}

module.exports = {
  generateFuturePredictions,
  assessRisk,
  generatePredictionReport
};