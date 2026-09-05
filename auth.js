// auth.js - GitHub Pages / Static Hosting compatible login
// Version: 2026-09-05-static
// หมายเหตุ: GitHub Pages ไม่มี Backend/Session Server จึงใช้ sessionStorage สำหรับการเข้าสู่ระบบฝั่งหน้าเว็บ

async function handleLogin(event) {
  event.preventDefault();
  event.stopImmediatePropagation();

  const usernameInput = document.getElementById('username').value.trim();
  const passwordInput = document.getElementById('password').value;
  const alertBox = document.getElementById('alert-box');
  const button = document.querySelector('#login-form button[type="submit"]');

  try {
    if (button) {
      button.disabled = true;
      button.style.opacity = '0.7';
    }

    // GitHub Pages เป็น Static Hosting จึงไม่สามารถเรียก /api/auth/login ของ Express ได้
    // ตรวจสอบบัญชีจาก users.js ที่ถูกโหลดมาก่อน auth.js
    const users = Array.isArray(window.USERS_DATABASE)
      ? window.USERS_DATABASE
      : (typeof USERS_DATABASE !== 'undefined' ? USERS_DATABASE : []);

    const user = users.find(u =>
      String(u.username) === usernameInput &&
      String(u.password) === passwordInput
    );

    if (!user) {
      throw new Error('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    }

    const safeUser = {
      id: user.id || user.username,
      username: user.username,
      role: user.role,
      name: user.name,
      avatar: user.avatar
    };

    sessionStorage.setItem('currentUser', JSON.stringify(safeUser));
    showAlert('เข้าสู่ระบบสำเร็จ! กำลังนำคุณไปหน้าหลังบ้าน...', 'success');

    setTimeout(() => {
      window.location.href = 'admin-dashboard.html';
    }, 400);
  } catch (error) {
    showAlert(error.message || 'เข้าสู่ระบบไม่สำเร็จ', 'error');
    if (button) {
      button.disabled = false;
      button.style.opacity = '';
    }
  }
}

function showAlert(message, type) {
  const alertBox = document.getElementById('alert-box');
  if (!alertBox) return;
  alertBox.textContent = message;
  alertBox.className = `alert-box ${type}`;
  alertBox.style.display = 'block';
}
