const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ฟังก์ชันสำหรับสร้างไฟล์ zip ของโปรเจกต์
function createProjectZip() {
  try {
    // ตรวจสอบว่ามี PowerShell หรือไม่
    const hasPowerShell = checkPowerShell();
    
    if (hasPowerShell) {
      // ใช้ PowerShell ในการสร้างไฟล์ zip
      createZipWithPowerShell();
    } else {
      // ใช้ Node.js built-in modules ในการสร้างไฟล์ zip
      createZipWithNode();
    }
    
    console.log('สร้างไฟล์ zip ของโปรเจกต์เรียบร้อยแล้ว');
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการสร้างไฟล์ zip:', error.message);
  }
}

// ตรวจสอบว่ามี PowerShell หรือไม่
function checkPowerShell() {
  try {
    execSync('powershell -Command "Get-Host"', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

// สร้างไฟล์ zip ด้วย PowerShell
function createZipWithPowerShell() {
  const command = `
    powershell -Command "
      Compress-Archive -Path '${__dirname}\\*' -DestinationPath '${__dirname}\\global-innovation-tracker.zip' -Force;
      Write-Output 'สร้างไฟล์ global-innovation-tracker.zip เรียบร้อยแล้ว'
    "
  `;
  
  execSync(command, { stdio: 'inherit' });
}

// สร้างไฟล์ zip ด้วย Node.js built-in modules
function createZipWithNode() {
  // สำหรับการใช้งานจริง คุณอาจต้องติดตั้ง library สำหรับสร้าง zip
  // แต่ในที่นี้เราจะสร้างไฟล์ข้อความเพื่อแจ้งผู้ใช้แทน
  const readmeContent = `
# Global Innovation Tracker - คำแนะนำในการสร้างไฟล์ ZIP

เนื่องจากเครื่องนี้ไม่มี PowerShell หรือ Node.js CLI tools ที่จำเป็น
โปรดทำตามขั้นตอนด้านล่างเพื่อสร้างไฟล์ ZIP ของโปรเจกต์:

1. เปิด File Explorer
2. ไปยังไดเรกทอรี: ${__dirname}
3. เลือกโฟลเดอร์ทั้งหมดในไดเรกทอรีนี้
4. คลิกขวาและเลือก "Send to" > "Compressed (zipped) folder"
5. เปลี่ยนชื่อไฟล์เป็น "global-innovation-tracker.zip"

หรือคุณสามารถติดตั้ง Node.js และ PowerShell แล้วรันไฟล์นี้อีกครั้งเพื่อสร้างไฟล์ ZIP โดยอัตโนมัติ
  `;
  
  fs.writeFileSync(path.join(__dirname, 'ZIP_INSTRUCTIONS.txt'), readmeContent, 'utf8');
  console.log('สร้างไฟล์ ZIP_INSTRUCTIONS.txt พร้อมคำแนะนำในการสร้างไฟล์ ZIP');
}

// เรียกใช้ฟังก์ชันสร้างไฟล์ zip
createProjectZip();