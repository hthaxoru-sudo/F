// js/auth.js

function handleLogin(event) {
  event.preventDefault();

  const usernameInput = document.getElementById('username').value.trim();
  const passwordInput = document.getElementById('password').value.trim();
  const alertBox = document.getElementById('alert-box');

  // ค้นหาบัญชีผู้ใช้จาก config/users.js
  const targetUser = USERS_DATABASE.find(
    user => user.username === usernameInput && user.password === passwordInput
  );

  if (targetUser) {
    showAlert('เข้าสู่ระบบสำเร็จ! กำลังนำคุณไปหน้าหลังบ้าน...', 'success');

    // บันทึก Session การเข้าสู่ระบบ
    sessionStorage.setItem('currentUser', JSON.stringify({
      username: targetUser.username,
      name: targetUser.name,
      role: targetUser.role,
      avatar: targetUser.avatar
    }));

    // ตรวจสอบสิทธิ์แยกหน้า Redirect
    setTimeout(() => {
      if (targetUser.role === USER_ROLES.SUPER_ADMIN) {
        // แอดมินใหญ่ส่งไปหน้า Dashboard หลัก
        window.location.href = 'admin-dashboard.html';
      } else {
        // สิทธิ์อื่นส่งไปหน้าจัดการทั่วไป
        window.location.href = 'staff-dashboard.html';
      }
    }, 1200);

  } else {
    showAlert('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง', 'error');
  }
}

function showAlert(message, type) {
  const alertBox = document.getElementById('alert-box');
  alertBox.textContent = message;
  alertBox.className = `alert-box ${type}`;
  alertBox.style.display = 'block';
}