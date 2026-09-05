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

## GitHub Pages

โปรเจกต์นี้รองรับหน้าเว็บและ Login แบบ Static บน GitHub Pages
โดย Login ใช้ `sessionStorage` และข้อมูลบัญชีจาก `users.js` เท่านั้น
**ห้ามเรียก `/api/auth/login` หรือ `/api/site` บน GitHub Pages** เพราะ GitHub Pages ไม่สามารถรัน `server.js` / Express API ได้

หน้า `login.html` จึงไม่โหลด `dynamic.js` เพื่อไม่ให้เกิด 404/405 จาก API และใช้ cache-busting (`?v=20260905`) กับไฟล์ Login

หากต้องการระบบหลังบ้านแบบหลายผู้ใช้, ฐานข้อมูลถาวร, อัปโหลดไฟล์ และการประเมินผลที่ปลอดภัยจริง ควรนำ Backend ไปไว้บนบริการที่รองรับ Server/Functions และเชื่อมฐานข้อมูลภายนอก


## BeeHouse Admin CMS (GitHub Pages)
- Admin dashboard now controls site text, hero, tabs, stats, news, navigation, buttons, feature flags, jobs, portfolio, partners, theme, applications/evaluations, contacts, audit logs, and JSON backup/import.
- On GitHub Pages, browser storage is local to the Admin device. Use **Export site.json** and replace the repository `site.json` to publish changes to all visitors.
- Applications submitted from GitHub Pages are also local to the browser. For multi-user shared applications, connect the existing Express API/backend or another database service.
