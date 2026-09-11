# BeeHouse — Node.js version

ระบบนี้เปลี่ยนจาก CMS ที่เก็บข้อมูลด้วย `localStorage` มาเป็น Node.js + Express
ข้อมูลหลักอยู่ฝั่งเซิร์ฟเวอร์ใน `data/` และไฟล์รูปอยู่ใน `uploads/`

## เริ่มใช้งาน

```bash
npm install
npm start
```

เปิด `http://localhost:3000`

ตั้งค่า production ผ่าน environment variables ตาม `.env.example`:
- `SESSION_SECRET`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `STAFF_USERNAME`
- `STAFF_PASSWORD`

**ห้ามนำรหัสผ่านจริงใส่ใน `users.js` หรือไฟล์ frontend** บัญชีจริงถูกเก็บเป็น bcrypt hash ใน `data/users.json`

## สิ่งที่ใช้งานผ่าน Node.js
- Login / Logout / Session
- Admin CMS บันทึก `site.json` ฝั่งเซิร์ฟเวอร์
- ใบสมัครบันทึก `applications.json`
- ตรวจผลสัมภาษณ์และคะแนนผ่านบัญชี Interviewer
- สร้าง/แก้ไข/ปิดใช้งานบัญชีจาก Admin
- Contact Inbox
- Audit log
- อัปโหลดรูปไป `uploads/`
- หน้า Status อ่านผลจาก server จริง
- ทุกเครื่องที่เข้า server เดียวกันเห็นข้อมูลชุดเดียวกัน

## สำคัญสำหรับ Netlify/GitHub Pages
เวอร์ชันนี้ **ไม่ใช่ static-only deployment** อีกต่อไป หาก deploy เป็น GitHub Pages อย่างเดียว
Express จะไม่ทำงานและ API `/api/*` จะใช้ไม่ได้ ต้อง deploy Node.js server บนบริการที่รองรับ Node.js
เช่น VPS/PaaS แล้วให้โดเมนหน้าเว็บชี้มาที่ server นั้น

`data/` และ `uploads/` ต้องอยู่บน persistent disk/volume ของ hosting ที่เลือก
หาก hosting มี filesystem แบบชั่วคราว ควรย้ายฐานข้อมูล/ไฟล์ไป object storage หรือ database ภายหลัง
