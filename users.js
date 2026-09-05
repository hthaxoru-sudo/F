// config/users.js
// ไฟล์แยกสำหรับจัดการรายชื่อ บัญชีผู้ใช้ และสิทธิ์การใช้งาน (Roles)

const USER_ROLES = {
  SUPER_ADMIN: 'super_admin', // สิทธิ์แอดมินใหญ่ เข้าถึงหลังบ้านได้ทุกส่วน
  STAFF: 'staff',             
  USER: 'user'                
};

const USERS_DATABASE = [
  {
    username: 'admin_beehouse',
    // ในระบบ Production ควรใช้ Password Hash เช่น bcrypt
    password: 'SuperAdminPassword123!', 
    role: USER_ROLES.SUPER_ADMIN,
    name: 'ผู้ดูแลระบบสูงสุด (Super Admin)',
    avatar: '👑'
  },
  {
    username: 'staff_bee',
    password: 'StaffPassword123!',
    role: USER_ROLES.STAFF,
    name: 'ทีมงานดูแลเว็บ',
    avatar: '🐝'
  }
];