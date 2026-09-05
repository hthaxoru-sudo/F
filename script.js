// ===================================================
// 1. CONFIG DATA (ส่วนแก้ไขข้อมูลเมนูและเนื้อหา)
// ===================================================

const navbarData = [
  { label: 'หน้าหลัก', link: '#home', isExternal: false },
  { label: 'ผลงาน', link: '#portfolio', isExternal: false },
  { label: 'ร้านค้า', link: '#shop', isExternal: false },
  // 📌 ปุ่มข่าวสาร: เปลี่ยนเป็นลิงก์ไปยังเว็บข่าวสารภายนอก (ใส่ URL เว็บข่าวสารของคุณตรงนี้)
  { label: 'ข่าวสาร', link: 'news.html', isExternal: true },
];

const tabsData = [
  {
    id: 'tab-1',
    title: 'ดูผลงานของเรา',
    content: 'รวบรวมผลงานการออกแบบสถาปัตยกรรม Minecraft และระบบเว็บไซต์ทั้งหมดของ BeeHouse',
    active: true
  },
  {
    id: 'tab-2',
    title: 'ประกาศผลการสมัคร',
    content: 'ตรวจสอบรายชื่อผู้ผ่านการคัดเลือกเข้าร่วมทีมงานและโปรเจกต์ MingYue รอบล่าสุด',
    active: false
  },
  {
    id: 'tab-3',
    title: 'สมัครเป็น Modder',
    content: 'เปิดรับสมัครทีมงานตำแหน่ง Modder และ Developer สามารถยื่น Portfolio ได้ทันที',
    active: false
  }
];

const statsData = [
  { num: '0', label: 'โปรเจกต์ที่เผยแพร่' },
  { num: '3', label: 'ช่องทางชุมชน' },
  { num: '24/7', label: 'ระบบพร้อมดูแล' }
];

const partnersData = [
  {
    id: 'shop-1',
    name: 'HoneyBuild Studio',
    category: 'Minecraft Builder / Model',
    icon: '🏰',
    desc: 'รับทำสถาปัตยกรรม โมเดล 3D และสิ่งก่อสร้างในเกม Minecraft ทุกแนว มีผลงานคุณภาพระดับมืออาชีพ',
    discordUrl: 'https://discord.gg/your-discord-link-1',
    services: [
      { name: 'Spawn Server เริ่มต้น', price: '฿350+' },
      { name: 'โมเดลอาวุธ/ชุดเกราะ Custom', price: '฿120+' }
    ]
  },
  {
    id: 'shop-2',
    name: 'PixelCraft Dev',
    category: 'Plugin & Script Developer',
    icon: '⚡',
    desc: 'รับเขียนสคริปต์และระบบส่วนตัว Bedrock/Java คุณภาพสูง ปรับแต่งความต้องการได้เต็มรูปแบบ',
    discordUrl: 'https://discord.gg/your-discord-link-2',
    services: [
      { name: 'ระบบ ยศ/UI Custom', price: '฿200+' },
      { name: 'มินิเกม & ระบบประจำเซิร์ฟ', price: '฿500+' }
    ]
  },
  {
    id: 'shop-3',
    name: 'Nectar Art Graphics',
    category: 'UI & Graphic Designer',
    icon: '🎨',
    desc: 'บริการออกแบบ โลโก้ ดิสคอร์ด แบนเนอร์ และ UI เมนูภายในเกม สไตล์มินิมอลและน่ารัก',
    discordUrl: 'https://discord.gg/your-discord-link-3',
    services: [
      { name: 'ออกแบบ Logo Server', price: '฿250+' },
      { name: 'แบนเนอร์โปรโมต Discord', price: '฿150+' }
    ]
  }
];

let isManualScrolling = false;
let scrollTimeout = null;

// ===================================================
// 2. RENDER & SCROLL TRACKING FUNCTIONS
// ===================================================

function renderNavbar() {
  const container = document.getElementById('nav-links-container');
  container.innerHTML = navbarData.map((item, index) => {
    // ถ้าเป็นลิงก์ภายนอก (เว็บข่าวสาร) ให้เปิดในแท็บใหม่ target="_blank"
    if (item.isExternal) {
      return `<a href="${item.link}" target="_blank" rel="noopener noreferrer" class="nav-item">${item.label} ↗</a>`;
    }
    return `<a href="${item.link}" class="nav-item ${index === 0 ? 'active' : ''}">${item.label}</a>`;
  }).join('');

  setupNavbarClickEvents();
}

function setupNavbarClickEvents() {
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', function(e) {
      // ข้ามการล็อก ScrollSpy ถ้ากดลิงก์ภายนอก
      if (this.getAttribute('target') === '_blank') return;

      navItems.forEach(nav => nav.classList.remove('active'));
      this.classList.add('active');

      isManualScrolling = true;
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isManualScrolling = false;
      }, 800);
    });
  });
}

function setupScrollSpy() {
  const navItems = document.querySelectorAll('.nav-item:not([target="_blank"])');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (isManualScrolling) return;

    let scrollPosition = window.scrollY + 200;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navItems.forEach(item => {
          item.classList.remove('active');
          if (item.getAttribute('href') === `#${sectionId}`) {
            item.classList.add('active');
          }
        });
      }
    });
  });
}

function renderTabs() {
  const tabsContainer = document.getElementById('action-tabs-container');
  const contentDisplay = document.getElementById('tab-content-display');

  tabsContainer.innerHTML = tabsData.map(tab => `
    <button class="tab-btn ${tab.active ? 'active' : ''}" onclick="switchTab('${tab.id}')">
      ${tab.title}
    </button>
  `).join('');

  const activeTab = tabsData.find(t => t.active);
  if (activeTab) {
    contentDisplay.innerHTML = `<p>${activeTab.content}</p>`;
  }
}

function switchTab(tabId) {
  tabsData.forEach(t => t.active = (t.id === tabId));
  renderTabs();
}

function renderStats() {
  const container = document.getElementById('stats-container');
  container.innerHTML = statsData.map(s => `
    <div class="stat-item">
      <div class="stat-num">${s.num}</div>
      <div class="stat-label">${s.label}</div>
    </div>
  `).join('');
}

function renderPartners() {
  const container = document.getElementById('partner-container');
  if (!container) return;

  container.innerHTML = partnersData.map(partner => `
    <div class="partner-card">
      <div class="partner-header">
        <div class="partner-avatar">${partner.icon}</div>
        <div class="partner-info">
          <h3>${partner.name}</h3>
          <span class="partner-tag">${partner.category}</span>
        </div>
      </div>
      
      <p class="partner-desc">${partner.desc}</p>

      <div class="partner-works">
        <div class="partner-works-title">ตัวอย่างรายการ & ราคาเริ่มต้น</div>
        ${partner.services.map(s => `
          <div class="partner-work-item">
            <span>${s.name}</span>
            <span class="partner-work-price">${s.price}</span>
          </div>
        `).join('')}
      </div>

      <div class="partner-footer">
        <a href="${partner.discordUrl}" target="_blank" rel="noopener noreferrer" class="btn-discord">
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028z"/>
          </svg>
          เข้าสู่ร้านค้า (Discord)
        </a>
      </div>
    </div>
  `).join('');
}

// ===================================================
// 3. INITIALIZATION & PRELOADER
// ===================================================
window.addEventListener('DOMContentLoaded', () => {
  renderNavbar();
  renderTabs();
  renderStats();
  renderPartners();
  setupScrollSpy();

  let progress = 0;
  const progressBar = document.getElementById('progress-bar');
  const progressText = document.getElementById('progress-text');

  const interval = setInterval(() => {
    progress += 10;
    if (progressBar) progressBar.style.width = `${progress}%`;
    if (progressText) progressText.textContent = `${progress}%`;

    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        const app = document.getElementById('app');
        if (loadingScreen) loadingScreen.style.opacity = '0';
        setTimeout(() => {
          if (loadingScreen) loadingScreen.style.display = 'none';
          if (app) app.style.display = 'block';
        }, 400);
      }, 200);
    }
  }, 100);
});