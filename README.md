# BeeHouse — GitHub Pages Edition

ชุดนี้ถูกปรับให้เป็น Static 100% สำหรับ GitHub Pages

- ไม่มี Express / server.js
- ไม่มีการเรียก /api/*
- ไม่มีการโหลด site.json / applications.json / contacts.json / logs.json ตอน runtime
- ข้อมูลตั้งต้นถูกฝังไว้ใน site-default.js
- การแก้ไข CMS เก็บใน localStorage ของเบราว์เซอร์ Admin และสะท้อนหน้าเว็บบนเครื่องเดียวกันทันที
- การอัปโหลดรูปใน CMS ใช้ file picker และเก็บเป็น data URL ใน localStorage

ข้อจำกัดของ GitHub Pages: ไม่สามารถบันทึกข้อมูลจาก Admin ลงเซิร์ฟเวอร์กลางหรือให้ผู้ใช้ทุกเครื่องเห็นการแก้ไขทันทีได้โดยไม่มี Backend/Database ภายนอก
