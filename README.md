# Global Innovation Tracker

ระบบติดตามและวิเคราะห์การเคลื่อนไหวของนวัตกรรมโลกและการประเมินมูลค่าทางเศรษฐกิจ

## รายละเอียดโครงการ

โครงการนี้เป็นระบบ dashboard ที่ใช้ Node.js ในการติดตามและวิเคราะห์นวัตกรรมทั่วโลก รวมถึงการประเมินมูลค่าทางเศรษฐกิจและการคาดการณ์แนวโน้มในอนาคต 4-5 ปีข้างหน้า โดยใช้ AI Gemini ในการค้นหาและวิเคราะห์ข้อมูล

## คุณสมบัติหลัก

1. แสดงนวัตกรรมล่าสุด 10 รายการ
2. ประเมินการเคลื่อนไหวของนวัตกรรมในอนาคต 4-5 ปี
3. แสดงมูลค่าทางเศรษฐกิจของนวัตกรรม
4. ค้นหานวัตกรรมด้วยคำค้นหา
5. แสดงผลเป็น dashboard ที่ใช้งานง่าย

## เทคโนโลยีที่ใช้

- Node.js
- Express.js
- EJS (Embedded JavaScript templating)
- Bootstrap 5
- Axios
- dotenv

## การติดตั้งและเริ่มต้นใช้งาน

### ข้อกำหนดเบื้องต้น

- Node.js (เวอร์ชัน 14 ขึ้นไป)
- npm (ปกติจะติดตั้งมาพร้อมกับ Node.js)

### ขั้นตอนการติดตั้ง

1. โคลน repository นี้:
   ```
   git clone <repository-url>
   ```

2. ไปยังไดเรกทอรีของโครงการ:
   ```
   cd global-innovation-tracker
   ```

3. ติดตั้ง dependencies:
   ```
   npm install
   ```

4. สร้างไฟล์ `.env` และกำหนดค่า API key ของ AI Gemini:
   ```
   GEMINI_API_KEY=your_api_key_here
   PORT=3000
   ```

5. เริ่มต้นเซิร์ฟเวอร์:
   ```
   npm start
   ```

   หรือสำหรับ development:
   ```
   npm run dev
   ```

6. เปิดเบราว์เซอร์และไปที่ `http://localhost:3000`

## โครงสร้างไดเรกทอรี

```
global-innovation-tracker/
├── views/
│   └── dashboard.ejs          # หน้า dashboard หลัก
├── utils/
│   ├── geminiAPI.js           # ฟังก์ชันสำหรับเรียกใช้ AI Gemini API
│   └── predictionEngine.js     # ระบบประเมินการเคลื่อนไหวของนวัตกรรมในอนาคต
├── routes/
│   └── innovationRoutes.js    # API routes สำหรับนวัตกรรม
├── public/
│   └── (ไฟล์ static ต่างๆ จะอยู่ที่นี่)
├── server.js                 # ไฟล์หลักของเซิร์ฟเวอร์
├── package.json              # ข้อมูลโครงการและ dependencies
└── README.md                # ไฟล์นี้
```

## API Endpoints

- `GET /` - หน้า dashboard หลัก
- `GET /api/innovations` - ดึงข้อมูลนวัตกรรมล่าสุด 10 รายการ
- `GET /api/predictions` - ดึงข้อมูลการคาดการณ์นวัตกรรมในอนาคต
- `GET /api/search/:query` - ค้นหานวัตกรรมด้วยคำค้นหา
- `GET /api/innovations/sector/:sector` - ดึงข้อมูลนวัตกรรมตาม sector

## การพัฒนาต่อ

1. สร้าง branch ใหม่สำหรับ feature ที่ต้องการพัฒนา:
   ```
   git checkout -b feature-name
   ```

2. ทำการแก้ไขและ commit การเปลี่ยนแปลง:
   ```
   git commit -am "Add some feature"
   ```

3. push ไปยัง repository:
   ```
   git push origin feature-name
   ```

4. สร้าง pull request

## การปรับปรุงในอนาคต

- เพิ่มระบบแจ้งเตือนเมื่อมีนวัตกรรมใหม่
- เพิ่มกราฟและสถิติเชิงลึก
- รองรับหลายภาษา
- เพิ่มระบบ authentication สำหรับผู้ใช้

## ผู้พัฒนา

- Global Innovation Team

## License

MIT License