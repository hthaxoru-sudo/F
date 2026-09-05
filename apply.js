// กำหนดสายพลัง/อาชีพ พร้อมจำนวนผู้สมัครปัจจุบัน และโควต้ารับสูงสุด
const jobOptions = [
  { id: "job_warrior", name: "นักรบเวทมนตร์", desc: "เน้นการต่อสู้ระยะประชิดด้วยพลังธาตุ", current: 5, max: 5 }, // เต็ม
  { id: "job_alchemist", name: "นักแปรธาตุ / หมอยา", desc: "ปรุงยา คราฟต์ไอเทม และสนับสนุนทีม", current: 2, max: 4 }, // ยังว่าง
  { id: "job_assassin", name: "นักฆ่าเงา", desc: "ความเร็วสูง ใช้พิษและการอำพรางตัว", current: 3, max: 3 }, // เต็ม
  { id: "job_farmer", name: "กสิกร / ผู้ใช้พฤกษา", desc: "เชี่ยวชาญการเกษตรและทรัพยากรธรรมชาติ", current: 1, max: 6 }  // ยังว่าง
];

function renderClassOptions() {
  const container = document.getElementById('class-options');
  if (!container) return;

  container.innerHTML = jobOptions.map(job => {
    const isFull = job.current >= job.max;
    
    return `
      <label class="class-card ${isFull ? 'disabled' : ''}" for="${job.id}">
        <input 
          type="radio" 
          id="${job.id}" 
          name="character_job" 
          value="${job.name}" 
          ${isFull ? 'disabled' : ''} 
          required
        >
        <span class="class-title">${job.name}</span>
        <span class="class-desc">${job.desc}</span>
        <span class="quota-badge">
          ${isFull ? '🔒 เต็มแล้ว' : `👥 เหลือ ${job.max - job.current} ที่นั่ง (${job.current}/${job.max})`}
        </span>
      </label>
    `;
  }).join('');

  // เพิ่ม Effect เมื่อเลือกการ์ด
  document.querySelectorAll('.class-card input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      document.querySelectorAll('.class-card').forEach(card => card.classList.remove('selected'));
      if (e.target.checked) {
        e.target.closest('.class-card').classList.add('selected');
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', renderClassOptions);