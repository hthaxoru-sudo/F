// js/auth.js - ระบบเข้าสู่ระบบจริงผ่าน Backend API

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

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username: usernameInput, password: passwordInput })
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || 'เข้าสู่ระบบไม่สำเร็จ');
    }

    // เก็บข้อมูลผู้ใช้ไว้สำหรับ UI เดิมของหน้า Admin
    sessionStorage.setItem('currentUser', JSON.stringify(data.user));

    showAlert('เข้าสู่ระบบสำเร็จ! กำลังนำคุณไปหน้าหลังบ้าน...', 'success');

    setTimeout(() => {
      window.location.href = data.user?.role === 'super_admin'
        ? 'admin-dashboard.html'
        : 'admin-dashboard.html';
    }, 500);
  } catch (error) {
    showAlert(error.message || 'ไม่สามารถเชื่อมต่อระบบเข้าสู่ระบบได้', 'error');
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
