# BeeHouse UI refresh

ปรับเฉพาะชั้น UI/CSS ตามคำขอ โดยไม่แก้ JavaScript หรือ logic ของระบบเดิม

## ไฟล์ที่เปลี่ยน
- `style.css` — หน้าเว็บไซต์หลัก, สมัคร, ตรวจสอบผล, loading/preloader, cards, forms และ footer
- `admin-style.css` — แผงผู้ดูแล
- `login-style.css` — หน้าเข้าสู่ระบบ

## แนวทาง
- เปลี่ยนจาก glassmorphism สีชมพูเต็มหน้าเป็นโทน Official: navy / white / slate + gold accent
- เพิ่มลำดับชั้นตัวหนังสือและพื้นที่หายใจ
- ลดเงาและความโค้งที่มากเกินไป
- ป้องกันปุ่ม/ข้อความชนกันด้วย responsive rules
- ปรับหน้าผลการสมัครให้มี visual hierarchy แบบประกาศผลทางการ
- ปรับ loading screen ให้เหมือนระบบเว็บไซต์จริงมากขึ้น

## ข้อจำกัด GitHub Pages
โค้ดชุดเดิมเก็บข้อมูลสมัคร/เนื้อหาใน `localStorage` และใช้ `sessionStorage` สำหรับ session ฝั่ง browser ดังนั้นข้อมูลจะไม่แชร์กันระหว่างผู้ใช้หลายคนบน GitHub Pages โดยตรง

การทำ multi-user จริงต้องเพิ่ม backend/database เช่น Firebase, Supabase หรือ API server ซึ่งเป็นการเปลี่ยน logic/architecture และไม่สามารถแก้ด้วย CSS เพียงอย่างเดียวได้
