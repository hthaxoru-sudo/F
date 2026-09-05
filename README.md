# BeeHouse Dynamic Control Panel v3

## จุดสำคัญ
- โครงสร้าง HTML/CSS/JS เดิมถูกเก็บไว้ และระบบ Dynamic ถูกเพิ่มเป็นชั้นเสริม
- ข้อมูลหน้าเว็บ/พาร์ตเนอร์/สินค้า/ผลงาน/ข่าว/อาชีพ/แท็บ/สถิติ เก็บใน `data/site.json`
- ใบสมัครเก็บใน `data/applications.json`
- Contact Inbox เก็บใน `data/contacts.json`
- Audit Logs เก็บใน `data/logs.json`
- ไฟล์อัปโหลดเก็บใน `uploads/`
- Admin มีระบบแก้ไขข้อมูลแบบ JSON, เพิ่ม, แก้ไข, ลบ, อัปโหลดสื่อ และประเมินใบสมัคร
- หน้า status อ่านผลจากฐานข้อมูลเดียวกับ Admin โดยอัตโนมัติ

## วิธีรัน
1. ติดตั้ง Node.js 18+
2. เปิด Terminal ในโฟลเดอร์นี้
3. `npm install`
4. ตั้งค่า environment variables สำหรับ production:
   - `SESSION_SECRET`
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD`
   - `STAFF_USERNAME`
   - `STAFF_PASSWORD`
5. `npm start`
6. เปิด `http://localhost:3000`

ค่าเริ่มต้นถ้าไม่ตั้ง ENV:
- admin_beehouse / SuperAdminPassword123!
- staff_bee / StaffPassword123!

**แนะนำให้เปลี่ยนรหัสผ่านทันทีเมื่อนำขึ้นเซิร์ฟเวอร์จริง** และใช้ HTTPS


## แก้ไขระบบ Login
- หน้า `login.html` ใช้ Backend API `/api/auth/login` จริง ไม่ได้ตรวจรหัสผ่านจาก JavaScript ฝั่งผู้ใช้
- ต้องเปิดเว็บผ่าน `npm start` ที่ `http://localhost:3000` ห้ามดับเบิลคลิกเปิด `login.html` เป็น `file://`
- บัญชีเริ่มต้น: `admin_beehouse` / `SuperAdminPassword123!`
- บัญชีทีมงาน: `staff_bee` / `StaffPassword123!`
