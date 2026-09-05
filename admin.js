// js/admin.js

// ข้อมูลเริ่มต้นสำหรับทดสอบระบบใบสมัคร (หากไม่มีใน LocalStorage)
const initialApplicants = [
  {
    xbox: "GamerTag1234",
    discordId: "123456789012345678",
    ocName: "นัต",
    icName: "หมิงเยว่ หลิว",
    job: "นักรบเวทมนตร์",
    status: "pass",
    score: 92,
    maxScore: 100,
    interviewer: "Admin_Bee",
    interviewDate: "05/09/2026 20:00 น.",
    remark: "ยอดเยี่ยมมาก! ตอบคำถามข้อบังคับเมืองและแสดงบทบาทสมมุติได้อย่างสมบูรณ์แบบ"
  },
  {
    xbox: "PlayerTwo",
    discordId: "987654321098765432",
    ocName: "ตั้ม",
    icName: "อเล็กซ์ คาร์เตอร์",
    job: "นักแปรธาตุ / หมอยา",
    status: "fail",
    score: 45,
    maxScore: 100,
    interviewer: "Admin_Moon",
    interviewDate: "04/09/2026 19:30 น.",
    remark: "ยังไม่ผ่านเกณฑ์การสอบเนื่องจากจำกฎระเบียบสำคัญบางส่วนไม่ได้"
  }
];

// 1. เริ่มต้นการทำงานเมื่อโหลดหน้า
document.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(sessionStorage.getItem('currentUser'));
  if (user) {
    document.getElementById('admin-name').textContent = user.name;
    document.getElementById('admin-avatar').textContent = user.avatar;
  }

  // ซิงค์คลังข้อมูลใบสมัครเข้า LocalStorage
  if (!localStorage.getItem('applicantDatabase')) {
    localStorage.setItem('applicantDatabase', JSON.stringify(initialApplicants));
  }

  loadApplicantsTable();
  loadSystemLogs();
});

// 2. ระบบสลับ Tab
function switchTab(tabId) {
  document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
  document.querySelectorAll('.menu-btn').forEach(btn => btn.classList.remove('active'));

  document.getElementById(tabId).classList.add('active');
  event.currentTarget.classList.add('active');
  
  const titles = {
    'tab-overview': 'ภาพรวมระบบ (System Overview)',
    'tab-applications': 'จัดการใบสมัคร & ประเมินผลสอบ (Interview Control)',
    'tab-content': 'จัดการเนื้อหาหน้าเว็บ (Content Manager)',
    'tab-features': 'เปิด/ปิด ฟีเจอร์ระบบ (Feature Flags)',
    'tab-style': 'จัดการธีมและสไตล์ (Theme Settings)',
    'tab-logs': 'ประวัติกิจกรรมระบบ (System Logs)'
  };
  document.getElementById('page-title').textContent = titles[tabId];
}

// 3. โหลดและ Render ตารางใบสมัคร
function loadApplicantsTable() {
  const applicants = JSON.parse(localStorage.getItem('applicantDatabase')) || [];
  const tableBody = document.getElementById('app-table-body');

  // อัปเดตตัวเลขในหน้า Overview
  document.getElementById('stat-total-apps').textContent = applicants.length;
  document.getElementById('stat-pass-apps').textContent = applicants.filter(a => a.status === 'pass').length;
  document.getElementById('stat-pending-apps').textContent = applicants.filter(a => a.status === 'pending').length;

  if (applicants.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;">ยังไม่มีรายการใบสมัครในระบบ</td></tr>`;
    return;
  }

  tableBody.innerHTML = applicants.map(app => {
    let statusBadge = '';
    if (app.status === 'pass') statusBadge = '<span style="color:#10b981; font-weight:700;">ผ่าน</span>';
    else if (app.status === 'fail') statusBadge = '<span style="color:#ef4444; font-weight:700;">ไม่ผ่าน</span>';
    else statusBadge = '<span style="color:#f59e0b; font-weight:700;">รอประเมิน</span>';

    return `
      <tr>
        <td><strong>${app.xbox}</strong></td>
        <td>${app.discordId}</td>
        <td>${app.icName}</td>
        <td>${statusBadge}</td>
        <td><strong>${app.score || 0}</strong> / 100</td>
        <td>
          <button onclick="openEvaluation('${app.xbox}')" style="background:#ff5e97; color:#fff; border:none; padding:4px 10px; border-radius:6px; cursor:pointer;">
            📝 ประเมิน
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

// 4. เปิดแบบฟอร์มประเมินคะแนน
function openEvaluation(xbox) {
  const applicants = JSON.parse(localStorage.getItem('applicantDatabase')) || [];
  const app = applicants.find(a => a.xbox === xbox);

  if (!app) return;

  document.getElementById('eval-xbox').value = app.xbox;
  document.getElementById('eval-title').innerText = `📝 ประเมินผลสัมภาษณ์: ${app.icName} (${app.xbox})`;
  document.getElementById('eval-status').value = app.status || 'pending';
  document.getElementById('eval-remark').value = app.remark || '';
  
  document.getElementById('evaluation-card').style.display = 'block';
  document.getElementById('evaluation-card').scrollIntoView({ behavior: 'smooth' });
}

function calculateTotalScore() {
  const rp = parseInt(document.getElementById('score-rp').value) || 0;
  const rules = parseInt(document.getElementById('score-rules').value) || 0;
  const comm = parseInt(document.getElementById('score-comm').value) || 0;
  
  const total = rp + rules + comm;
  document.getElementById('eval-total-score').value = total;
}

// 5. บันทึกผลการประเมิน
function saveEvaluation() {
  const xbox = document.getElementById('eval-xbox').value;
  const status = document.getElementById('eval-status').value;
  const score = parseInt(document.getElementById('eval-total-score').value) || 0;
  const remark = document.getElementById('eval-remark').value;
  
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

  let applicants = JSON.parse(localStorage.getItem('applicantDatabase')) || [];
  const index = applicants.findIndex(a => a.xbox === xbox);

  if (index !== -1) {
    applicants[index].status = status;
    applicants[index].score = score;
    applicants[index].remark = remark;
    applicants[index].interviewer = currentUser ? currentUser.name : 'Admin';
    applicants[index].interviewDate = new Date().toLocaleString('th-TH');

    localStorage.setItem('applicantDatabase', JSON.stringify(applicants));
    addLog(`ประเมินผลสอบผู้สมัคร ${xbox} เป็น status: ${status} (${score} คะแนน)`);
    
    alert('✅ บันทึกผลการประเมินเรียบร้อยแล้ว!');
    closeEvaluation();
    loadApplicantsTable();
  }
}

function closeEvaluation() {
  document.getElementById('evaluation-card').style.display = 'none';
}

// 6. ระบบ Feature Toggle & Save to LocalStorage
function toggleFeature(featureName, isEnabled) {
  let settings = JSON.parse(localStorage.getItem('siteSettings')) || {};
  settings[featureName] = isEnabled;
  localStorage.setItem('siteSettings', JSON.stringify(settings));

  addLog(`เปลี่ยนสถานะฟีเจอร์ ${featureName} เป็น ${isEnabled ? 'เปิด' : 'ปิด'}`);
}

// 7. ระบบ บันทึก Log ประวัติการทำงาน
function addLog(action) {
  const user = JSON.parse(sessionStorage.getItem('currentUser'));
  let logs = JSON.parse(localStorage.getItem('systemLogs')) || [];
  
  const newLog = {
    time: new Date().toLocaleTimeString('th-TH'),
    user: user ? user.name : 'Unknown',
    action: action,
    status: 'สำเร็จ'
  };

  logs.unshift(newLog);
  localStorage.setItem('systemLogs', JSON.stringify(logs));
  loadSystemLogs();
}

function loadSystemLogs() {
  const logsTable = document.getElementById('logs-table-body');
  let logs = JSON.parse(localStorage.getItem('systemLogs')) || [
    { time: '10:45:12', user: 'Super Admin', action: 'เข้าสู่ระบบหลังบ้าน', status: 'สำเร็จ' }
  ];

  logsTable.innerHTML = logs.map(log => `
    <tr>
      <td>${log.time}</td>
      <td>${log.user}</td>
      <td>${log.action}</td>
      <td><span style="color: #10b981;">${log.status}</span></td>
    </tr>
  `).join('');
}

// 8. Logout Function
function logout() {
  sessionStorage.removeItem('currentUser');
  window.location.href = 'login.html';
}