/* BeeHouse public UI bridge - all data comes from BeeHouseCMS/localStorage on GitHub Pages. */
(function(){
'use strict';
const $=s=>document.querySelector(s);
const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const text=(sel,v)=>{const e=$(sel);if(e&&v!=null)e.textContent=v};
function site(){return window.BeeHouseCMS?.site||window.BeeHouseDefaultSite||{};}
function setFavicon(src){if(!src)return;let l=document.querySelector('link[data-beehouse-favicon]');if(!l){l=document.createElement('link');l.rel='icon';l.dataset.beehouseFavicon='1';document.head.appendChild(l)}l.href=src}
function logoFallback(){return window.BeeHouseLogoFallback||'assets/beehouse-logo.svg'}
function imageOrFallback(src,fallback){const v=String(src||'').trim();return v||fallback||logoFallback()}
function bindImageFallbacks(root=document){root.querySelectorAll('img[data-beehouse-fallback], img.brand-logo img, img.featured-image, img.partner-avatar img, img.news-image, img.widget-img, .footer-logo img, .loading-bee img, .banner-icon img, .hero-badge-logo').forEach(img=>{if(img.dataset.fallbackBound)return;img.dataset.fallbackBound='1';img.addEventListener('error',()=>{const fallback=img.dataset.beehouseFallback||logoFallback();if(img.src!==new URL(fallback,document.baseURI).href){img.src=fallback;img.classList.add('image-fallback-used')}})})}
function safeImage(src,fallback){return imageOrFallback(src,fallback||logoFallback())}
function applyCommonSite(s){
 const g=s.general||{},c=s.content||{},h=s.hero||{},b=s.buttons||{};
 document.title=g.siteTitle||document.title;setFavicon(g.favicon||g.logo);
 document.documentElement.style.setProperty('--pink-primary',s.theme?.primary||'#ff5e97');
 document.querySelectorAll('.brand-logo').forEach(e=>{e.innerHTML=`<img data-beehouse-logo data-beehouse-fallback="${esc(logoFallback())}" src="${esc(safeImage(g.logo,logoFallback()))}" alt="${esc(g.siteTitle||'BeeHouse')}">`});
 document.querySelectorAll('.footer-logo').forEach(e=>{e.innerHTML=`<img data-beehouse-logo data-beehouse-fallback="${esc(logoFallback())}" src="${esc(safeImage(g.logo,logoFallback()))}" alt="${esc(g.siteTitle||'BeeHouse')}">`});
 document.querySelectorAll('.loading-bee,.banner-icon').forEach(e=>{const img=e.querySelector('img');if(img){img.dataset.beehouseFallback=logoFallback();img.src=safeImage(g.logo,logoFallback());}});
 document.querySelectorAll('.brand-title strong').forEach(e=>e.textContent=(g.siteTitle||'BeeHouse').split('|')[0].trim());
 document.querySelectorAll('.brand-title small').forEach(e=>e.textContent=(g.siteTitle||'').toUpperCase());
 const nav=$('#nav-links-container');if(nav)nav.innerHTML=(s.navbar||[]).filter(x=>x.enabled!==false).map(x=>`<a href="${esc(x.link||'#')}" class="nav-item">${esc(x.label)}</a>`).join('');
 const actions=document.querySelector('.nav-actions');if(actions){
   const ensure=(key,selector,cls)=>{let e=actions.querySelector(selector);if(!e){e=document.createElement('a');e.className=cls;actions.appendChild(e)}const x=b[key]||{};e.textContent=x.text||key;e.href=x.url||'#';e.style.display=x.enabled===false?'none':'';return e};
   ensure('apply','a[data-cms-button="apply"]','btn btn-dark-gradient');ensure('login','a[data-cms-button="login"]','btn btn-light-pill-link');
 }
 document.querySelectorAll('.footer-brand-info h3').forEach(e=>e.textContent=c.home?.footerTitle||g.siteTitle||e.textContent);
 document.querySelectorAll('.footer-brand-info p').forEach(e=>e.textContent=c.home?.footerSlogan||g.slogan||e.textContent);
 document.querySelectorAll('.copyright-text').forEach(e=>e.textContent=g.copyright||e.textContent);
 document.querySelectorAll('.powered-badge strong').forEach(e=>e.textContent=g.footerCredits||e.textContent);
 const heroBadge=$('.main-card-glass .badge-pill');if(heroBadge){heroBadge.innerHTML=`<img data-beehouse-logo data-beehouse-fallback="${esc(logoFallback())}" class="hero-badge-logo" src="${esc(safeImage(g.logo,logoFallback()))}" alt="${esc(g.siteTitle||'BeeHouse')}">${esc(h.badge||'')}`;}
 const heroTitle=$('.main-title');if(heroTitle)heroTitle.innerHTML=h.title||heroTitle.innerHTML;
 text('.main-desc',h.description);
 const featuredImg=$('.featured-image');if(featuredImg){featuredImg.dataset.beehouseFallback=logoFallback();featuredImg.src=imageOrFallback(h.featuredImage,g.logo||logoFallback());}text('.featured-info strong',h.featuredTitle);
 const fp=$('.featured-info p');if(fp)fp.innerHTML=esc(h.featuredDescription||'')+' <span class="dot-status"></span>';
 const ct=c.home||{};
 [['.portfolio-section .badge-pill-soft',ct.portfolioBadge],['.portfolio-section .section-title',ct.portfolioTitle],['.portfolio-section .section-desc',ct.portfolioDescription],['.shop-section .badge-pill-soft',ct.partnerBadge],['.shop-section .section-title',ct.partnerTitle],['.shop-section .section-desc',ct.partnerDescription],['.banner-left strong',ct.bannerTitle],['.banner-left p',ct.bannerDescription]].forEach(([sel,v])=>{const e=$(sel);if(e&&v)e.textContent=v});
 const viewAll=$('.btn-view-all');if(viewAll){viewAll.textContent=b.news?.text||ct.newsViewAll||viewAll.textContent;viewAll.href=b.news?.url||'news.html';viewAll.style.display=b.news?.enabled===false?'none':''} const banner=$('.bottom-banner');if(banner){banner.style.display=s.features?.banner===false?'none':'';const ba=banner.querySelector('.banner-actions a,.banner-actions button');if(ba){ba.textContent=b.apply?.text||ct.bannerTitle||ba.textContent;if(b.apply?.url){if(ba.tagName==='A')ba.href=b.apply.url;else ba.onclick=()=>location.href=b.apply.url}ba.style.display=b.apply?.enabled===false?'none':''}}
 const latest=(s.news||[])[0], nb=$('.home-news-widget .widget-card');if(nb&&latest){const img=nb.querySelector('.widget-img');if(img)img.src=imageOrFallback(latest.image);text('.widget-tag',latest.categoryName||latest.category||'ข่าวสาร');text('.widget-date',latest.date||'');text('.widget-headline',latest.title||'');text('.widget-desc',latest.excerpt||'');const l=nb.querySelector('.widget-link');if(l)l.href=latest.linkUrl||'news.html'}
}
function renderHome(){
 const s=site();applyCommonSite(s);bindImageFallbacks(); window.BeeHouseFixLogos?.(document); window.BeeHouseFixLogos?.(document); window.BeeHouseFixLogos?.(document);
 const tabs=$('#action-tabs-container'),content=$('#tab-content-display');
 if(tabs){tabs.innerHTML=(s.tabs||[]).map(x=>`<button class="tab-btn ${x.active?'active':''}" data-tab="${esc(x.id)}">${esc(x.title)}</button>`).join('');tabs.onclick=e=>{const b=e.target.closest('[data-tab]');if(!b)return;const t=(s.tabs||[]).find(x=>x.id===b.dataset.tab);if(content&&t)content.innerHTML=`<p>${esc(t.content)}</p>`;tabs.querySelectorAll('.tab-btn').forEach(x=>x.classList.toggle('active',x===b))};const a=(s.tabs||[]).find(x=>x.active)||(s.tabs||[])[0];if(content&&a)content.innerHTML=`<p>${esc(a.content)}</p>`}
 const stats=$('#stats-container');if(stats)stats.innerHTML=(s.stats||[]).map(x=>`<div class="stat-item"><div class="stat-num">${esc(x.num)}</div><div class="stat-label">${esc(x.label)}</div></div>`).join('');
 const partners=$('#partner-container');if(partners)partners.innerHTML=(s.partners||[]).map(p=>`<div class="partner-card"><div class="partner-header"><div class="partner-avatar">${p.logo?`<img data-beehouse-fallback="${logoFallback()}" src="${esc(p.logo)}" alt="${esc(p.name)}">`:`<img data-beehouse-fallback="${logoFallback()}" src="${logoFallback()}" alt="BeeHouse">`}</div><div class="partner-info"><h3>${esc(p.name)}</h3><span class="partner-tag">${esc(p.category)}</span></div></div><p class="partner-desc">${esc(p.desc)}</p><div class="partner-works"><div class="partner-works-title">ตัวอย่างรายการ & ราคาเริ่มต้น</div>${(p.services||[]).map(x=>`<div class="partner-work-item"><span>${esc(x.name)}</span><span class="partner-work-price">${esc(x.price)}</span></div>`).join('')}</div><div class="partner-footer"><a href="${esc(p.url||p.discordUrl||'#')}" target="_blank" rel="noopener noreferrer" class="btn-discord">เข้าสู่ร้านค้า ↗</a></div></div>`).join('');
 function renderPortfolio(s){
  const pf=$('#portfolio-container');
  if(!pf)return;
  const items=s.portfolio||[];
  if(!items.length){pf.innerHTML=`<div class="empty-state"><p>${esc(s.content?.home?.portfolioEmpty||'ยังไม่มีผลงานในขณะนี้')}</p></div>`;return;}
  const slides=items.map((x,pi)=>{
    const imgs=Array.isArray(x.images)&&x.images.length?x.images:(x.image?[x.image]:[]);
    const arr=imgs.length?imgs:['assets/beehouse-logo.svg'];
    const imageHtml=arr.map((im,ii)=>`<img data-beehouse-fallback="${logoFallback()}" data-image-index="${ii}" src="${esc(im)}" alt="${esc(x.title)}" style="display:${ii===0?'block':'none'}">`).join('');
    return `<article class="portfolio-slide" data-project="${pi}" style="display:${pi===0?'block':'none'}"><div class="portfolio-card"><div class="portfolio-media"><button class="portfolio-media-arrow prev" type="button" data-image-dir="-1">‹</button><div class="portfolio-image-viewport"><div class="portfolio-image-track">${imageHtml}</div></div><button class="portfolio-media-arrow next" type="button" data-image-dir="1">›</button><div class="portfolio-image-counter">1 / ${arr.length}</div></div><div class="portfolio-copy"><h3>${esc(x.title)}</h3><p>${esc(x.description)}</p>${x.url?`<a href="${esc(x.url)}" target="_blank" rel="noopener">ดูตัวอย่างเต็ม ↗</a>`:''}</div></div></article>`;
  }).join('');
  pf.innerHTML=`<div class="portfolio-slider">${slides}</div>`;
  const projectSlides=[...pf.querySelectorAll('.portfolio-slide')];
  let projectIndex=0;
  const showProject=()=>projectSlides.forEach((el,i)=>el.style.display=i===projectIndex?'block':'none');
  pf.querySelectorAll('[data-image-dir]').forEach(btn=>btn.addEventListener('click',()=>{
    const slide=btn.closest('.portfolio-slide');
    const imgs=[...slide.querySelectorAll('[data-image-index]')];
    let idx=imgs.findIndex(im=>im.style.display!=='none');
    if(idx<0)idx=0;
    idx=(idx+Number(btn.dataset.imageDir)+imgs.length)%imgs.length;
    imgs.forEach((im,i)=>im.style.display=i===idx?'block':'none');
    const counter=slide.querySelector('.portfolio-image-counter');
    if(counter)counter.textContent=`${idx+1} / ${imgs.length}`;
  }));
  const prev=$('#btn-prev'),next=$('#btn-next');
  if(prev)prev.onclick=()=>{projectIndex=(projectIndex-1+projectSlides.length)%projectSlides.length;showProject()};
  if(next)next.onclick=()=>{projectIndex=(projectIndex+1)%projectSlides.length;showProject()};
  showProject();
  bindImageFallbacks(pf); window.BeeHouseFixLogos?.(pf);
 }
 renderPortfolio(s);
 const f=s.features||{};if(f.preloader===false){$('#loading-screen')?.remove();if($('#app'))$('#app').style.display='block'}
}
function renderApply(){
 const s=site();applyCommonSite(s);const form=$('#rp-apply-form');if(!form)return;const c=s.content?.apply||{};const head=document.querySelector('.form-header h2');if(head&&c.title)head.textContent=c.title;
 if(s.features?.applicationsOpen===false){form.innerHTML=`<div class="form-section"><h3>${esc(c.closedTitle||'🚫 ปิดรับสมัครชั่วคราว')}</h3><p>${esc(c.closedText||'ขณะนี้ระบบปิดรับสมัคร')}</p></div>`;return}
 const box=$('#class-options');if(box)box.innerHTML=(s.jobs||[]).filter(j=>j.enabled!==false).map(j=>{const count=window.BeeHouseCMS.getApps().filter(a=>a.job===j.name).length,full=count>=Number(j.max||0);return `<label class="class-card ${full?'disabled':''}" for="${esc(j.id)}"><input type="radio" id="${esc(j.id)}" name="character_job" value="${esc(j.name)}" ${full?'disabled':''} required><span class="class-title">${esc(j.name)}</span><span class="class-desc">${esc(j.desc)}</span><span class="quota-badge">${full?'🔒 เต็มแล้ว':`👥 เหลือ ${Number(j.max)-count} ที่นั่ง (${count}/${Number(j.max)})`}</span></label>`}).join('');
}
function bindApply(){const f=$('#rp-apply-form');if(!f||f.dataset.cmsBound)return;f.dataset.cmsBound='1';f.addEventListener('submit',e=>{e.preventDefault();const g=id=>document.getElementById(id)?.value?.trim()||'';const job=document.querySelector('input[name="character_job"]:checked')?.value||'';const apps=window.BeeHouseCMS.getApps();const id='APP-'+Date.now();apps.push({id,ocNickname:g('oc_nickname'),ocAge:g('oc_age'),discord:g('oc_discord'),discordId:g('oc_discord_id'),xbox:g('xbox_name'),interviewTime:g('interview_time'),icFullname:g('ic_fullname'),icNickname:g('ic_nickname'),icAge:g('ic_age'),icHistory:g('ic_history'),icPersonality:g('ic_personality'),icPrologue:g('ic_prologue'),job,status:'pending',score:0,maxScore:100,scoreBreakdown:{rp:0,rules:0,comm:0},remark:'',submittedAt:new Date().toLocaleString('th-TH')});window.BeeHouseCMS.saveApps(apps);window.BeeHouseCMS.log('ส่งใบสมัคร '+id);alert('✅ ส่งใบสมัครเรียบร้อยแล้ว');f.reset();renderApply();});}
function renderStatus(){const s=site();applyCommonSite(s);const form=$('#status-login-form');if(!form||form.dataset.cmsBound)return;if(s.content?.status?.title){const h=$('#login-section h2');if(h)h.textContent=s.content.status.title}form.dataset.cmsBound='1';form.addEventListener('submit',e=>{e.preventDefault();const xbox=$('#login_xbox')?.value.trim()||'',did=$('#login_discord_id')?.value.trim()||'';const u=window.BeeHouseCMS.getApps().find(x=>String(x.xbox).toLowerCase()===xbox.toLowerCase()&&String(x.discordId)===did);if(!u){alert(s.content?.status?.notFound||'ไม่พบข้อมูลการสมัคร');return}$('#login-section').style.display='none';$('#result-section').style.display='block';const r=$('#result-section');r.innerHTML=`<div class="form-section"><h3>${u.status==='pass'?'🎉 ผ่านการสอบ':u.status==='fail'?'💔 ไม่ผ่านการสอบ':'⏳ รอการสอบ'}</h3><p>ผู้สมัคร: <b>${esc(u.ocNickname)}</b> | ตัวละคร: <b>${esc(u.icFullname)}</b></p><div class="form-grid"><div><label>คะแนน</label><strong>${esc(u.score)}/100</strong></div><div><label>อาชีพ</label><strong>${esc(u.job)}</strong></div><div><label>ผู้ประเมิน</label><strong>${esc(u.interviewer||'-')}</strong></div><div><label>วันที่</label><strong>${esc(u.interviewDate||'-')}</strong></div></div><label>ความคิดเห็น</label><p>${esc(u.remark||'-')}</p></div>`});}
function renderNews(){const box=$('#news-container');if(!box)return;const s=site();applyCommonSite(s);const c=s.content?.news||{};text('.hero-title',c.heroTitle);text('.hero-desc',c.heroDescription);const si=$('#search-input');if(si)si.placeholder=c.searchPlaceholder||si.placeholder;text('.section-subtitle',c.listTitle);const render=items=>{box.innerHTML=items.map(n=>`<article class="news-card">${n.isUrgent?'<div class="priority-badge">🚨 แจ้งเตือนด่วน</div>':''}<div class="news-image-wrapper"><img src="${esc(imageOrFallback(n.image))}" class="news-image" alt="${esc(n.title)}"></div><div class="news-content"><div class="news-meta"><span class="news-tag">${esc(n.categoryName||n.category||'ข่าวสาร')}</span><span class="news-date">${esc(n.date)}</span></div><h2 class="news-title">${esc(n.title)}</h2><p class="news-excerpt">${esc(n.excerpt||n.content||'')}</p><div class="news-footer"><span>✍️ ${esc(n.author||'Admin')}</span>${n.linkUrl?`<a href="${esc(n.linkUrl)}" target="_blank" class="btn-read-more">อ่านรายละเอียด ↗</a>`:''}</div></div></article>`).join('')||`<div class="empty-state">${esc(c.noResults||'ไม่พบข่าว')}</div>`};render(s.news||[]);if(si&&!si.dataset.cmsBound){si.dataset.cmsBound='1';si.addEventListener('input',()=>{const q=si.value.toLowerCase().trim();render((s.news||[]).filter(n=>JSON.stringify(n).toLowerCase().includes(q)))})}}
function render(){if($('#portfolio-container')||$('#partner-container'))renderHome();if($('#rp-apply-form')){renderApply();bindApply()}if($('#status-login-form'))renderStatus();if($('#news-container'))renderNews();bindImageFallbacks(); window.BeeHouseFixLogos?.(document)}
window.addEventListener('DOMContentLoaded',render);window.addEventListener('beehouse:ready',render);window.addEventListener('beehouse:site-updated',render);window.addEventListener('storage',e=>{if([window.BeeHouseCMS?.KEY,window.BeeHouseCMS?.APP].includes(e.key))render()});window.BeeHousePublic={render};
})();
