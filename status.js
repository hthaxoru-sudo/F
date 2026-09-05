// จำลองคลังข้อมูลใบสมัครผู้เล่น
const applicantDatabase = [
  {
    xbox: "GamerTag1234",
    discordId: "123456789012345678",
    ocName: "นัต",
    icName: "หมิงเยว่ หลิว",
    job: "นักรบเวทมนตร์",
    status: "pass", // pass, fail, pending
    score: 92,
    maxScore: 100,
    interviewer: "Admin_Bee",
    interviewDate: "05/09/2026 20:00 น.",
    remark: "ยอดเยี่ยมมาก! ตอบคำถามข้อบังคับเมืองและแสดงบทบาทสมมุติได้อย่างสมบูรณ์แบบ ยินดีต้อนรับเข้าสู่โปรเจกต์ MingYue!"
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
    remark: "ยังไม่ผ่านเกณฑ์การสอบเนื่องจากจำกฎระเบียบสำคัญบางส่วนไม่ได้ สามารถเตรียมตัวและยื่นขอสอบใหม่ได้ในรอบถัดไป"
  }
];

document.getElementById('status-login-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const inputXbox = document.getElementById('login_xbox').value.trim();
  const inputDiscordId = document.getElementById('login_discord_id').value.trim();

  // ค้นหาข้อมูลผู้เล่น
  const user = (window.BeeHouseCMS?.getApps?.()||applicantDatabase).find(item => 
    item.xbox.toLowerCase() === inputXbox.toLowerCase() && 
    item.discordId === inputDiscordId
  );

  if (!user) {
    alert("❌ ไม่พบข้อมูลการสมัคร! กรุณาตรวจสอบ Xbox Gamertag หรือ Discord ID อีกครั้ง");
    return;
  }

  // ซ่อนฟอร์ม และเปิดส่วนแสดงผลการโหลด
  document.getElementById('login-section').style.display = 'none';
  const loadingSection = document.getElementById('loading-section');
  const loadingText = document.getElementById('loading-text');
  const loadingSubtext = document.getElementById('loading-subtext');
  const progressBar = document.getElementById('progress-bar');
  const progressPercent = document.getElementById('progress-percent');
  
  loadingSection.style.display = 'block';

  // ฟังก์ชันอัปเดตหลอด Progress Bar และข้อความ
  function updateProgress(percent, text, subtext) {
    progressBar.style.width = percent + '%';
    progressPercent.innerText = percent + '%';
    if (text) loadingText.innerText = text;
    if (subtext) loadingSubtext.innerText = subtext;
  }

  // ลำดับการดาวน์โหลดแบบเนิบๆ ลุ้นๆ (รวมเวลาประมาณ 13 วินาที อ่านทันแน่นอน)
  updateProgress(5, "กำลังเริ่มเชื่อมต่อฐานข้อมูล...", "กำลังส่งคำขอไปยังเซิร์ฟเวอร์หลัก");

  setTimeout(() => {
    updateProgress(25, "ค้นหาชื่อบัญชีผู้สมัคร...", "ค้นหาชื่อ " + inputXbox + " ในระบบ");
  }, 2500);

  setTimeout(() => {
    updateProgress(45, "เอ๊ะ... ทำไมหาข้อมูลไม่เจอนะ? 🤔", "ระบบกำลังสแกนซ้ำในแฟ้มสำรอง โปรดรอสักครู่...");
  }, 5500);

  setTimeout(() => {
    updateProgress(70, "เจอแฟ้มข้อมูลแล้ว! 🎉", "กำลังปลดล็อกซองเอกสารผลการสอบสัมภาษณ์...");
  }, 8500);

  setTimeout(() => {
    updateProgress(90, "กำลังคำนวณคะแนนและสรุปผล...", "อีกนิดเดียวเท่านั้น เตรียมตัวให้พร้อม!");
  }, 11000);

  setTimeout(() => {
    updateProgress(100, "เสร็จสิ้น!", "กำลังแสดงผลการสอบของคุณ...");
  }, 13000);

  // แสดงผลลัพธ์จริง
  setTimeout(() => {
    loadingSection.style.display = 'none';
    renderResult(user);
  }, 13800);
});

function renderResult(user) {
  const resultSection = document.getElementById('result-section');
  resultSection.style.display = 'block';

  const isPass = user.status === 'pass';
  const isFail = user.status === 'fail';

  // จุดพลุฉลองถ้าสอบผ่าน! 🎉
  if (isPass && typeof confetti === 'function') {
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 }
    });
  }

  // กำหนดตกแต่งการ์ดผลสอบ
  let statusCardStyle = '';
  let statusHeader = '';

  if (isPass) {
    statusCardStyle = 'background: rgba(72, 187, 120, 0.15); border: 2px solid #48bb78; box-shadow: 0 0 25px rgba(72, 187, 120, 0.3);';
    statusHeader = `<div style="color: #2f855a; font-size: 1.5rem; font-weight: 800; text-align: center; margin-bottom: 12px;">
      🎉 ยินดีด้วย! คุณผ่านการสัมภาษณ์
    </div>`;
  } else if (isFail) {
    statusCardStyle = 'background: rgba(245, 101, 101, 0.15); border: 2px solid #f56565; box-shadow: 0 0 25px rgba(245, 101, 101, 0.3);';
    statusHeader = `<div style="color: #9b2c2c; font-size: 1.5rem; font-weight: 800; text-align: center; margin-bottom: 12px;">
      💔 เสียใจด้วย คุณยังไม่ผ่านการสัมภาษณ์
    </div>`;
  } else {
    statusCardStyle = 'background: rgba(236, 201, 75, 0.15); border: 2px solid #ecc94b;';
    statusHeader = `<div style="color: #975a16; font-size: 1.5rem; font-weight: 800; text-align: center; margin-bottom: 12px;">
      ⏳ อยู่ระหว่างรอการสอบสัมภาษณ์
    </div>`;
  }

  resultSection.innerHTML = `
    <div style="padding: 20px; border-radius: 16px; ${statusCardStyle} margin-bottom: 20px; text-align: center;">
      ${statusHeader}
      <p style="margin: 0; opacity: 0.9;">ผู้สมัคร: <strong>${user.ocName}</strong> | ตัวละคร: <strong>${user.icName}</strong></p>
    </div>

    <div class="form-section">
      <div style="text-align: center; margin-bottom: 20px;">
        <label style="font-size: 0.9rem; color: var(--text-muted); font-weight: 600;">คะแนนรวมที่ได้</label>
        <div style="font-size: 3.2rem; font-weight: 900; color: ${isPass ? '#2f855a' : (isFail ? '#e53e3e' : '#d69e2e')}; text-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          ${user.score} <span style="font-size: 1.2rem; color: var(--text-muted);">/ ${user.maxScore}</span>
        </div>
      </div>

      <div class="form-grid">
        <div class="form-group">
          <label>Xbox Gamertag</label>
          <input type="text" value="${user.xbox}" disabled>
        </div>
        <div class="form-group">
          <label>สายพลัง / อาชีพ</label>
          <input type="text" value="${user.job}" disabled>
        </div>
        <div class="form-group">
          <label>ผู้ทำการสอบสัมภาษณ์</label>
          <input type="text" value="${user.interviewer}" disabled>
        </div>
        <div class="form-group">
          <label>วันที่/เวลา สอบ</label>
          <input type="text" value="${user.interviewDate}" disabled>
        </div>
      </div>

      <div class="form-group" style="margin-top: 10px;">
        <label><i class="fa-solid fa-comment-dots"></i> ความคิดเห็นและคำแนะนำจากผู้สอบ</label>
        <textarea rows="3" disabled style="resize: none; font-size: 0.95rem;">${user.remark}</textarea>
      </div>
    </div>

    <button onclick="location.reload()" class="btn-submit-app" style="background: rgba(0,0,0,0.08); color: var(--text-color); margin-top: 10px;">
      <i class="fa-solid fa-rotate-left"></i> ค้นหาใหม่อีกครั้ง
    </button>
  `;
}