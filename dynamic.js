/* BeeHouse Dynamic Layer - added without replacing the original UI */
(function(){
"use strict";
const API="/api";
const $=s=>document.querySelector(s);
const esc=v=>String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
async function api(url,opt={}){const r=await fetch(API+url,{headers:{"Content-Type":"application/json",...(opt.headers||{})},...opt});let d={};try{d=await r.json()}catch{}if(!r.ok)throw Error(d.error||"เกิดข้อผิดพลาด");return d}
function text(sel,v){const e=$(sel);if(e&&v!==undefined)e.textContent=v}
function html(sel,v){const e=$(sel);if(e&&v!==undefined)e.innerHTML=v}
async function loadSite(){
 try { if(window.BeeHouseCMS) return await window.BeeHouseCMS.get(); } catch(e){}
 try{return await api("/site")}catch{}
 try{const r=await fetch(new URL('site.json?v=20260905',document.baseURI),{cache:'no-store'});if(r.ok)return await r.json()}catch(e){} return window.BeeHouseDefaultSite||null
}

function setBrandIcon(src, selector){const e=document.querySelector(selector);if(!e)return;if(src&&/^(data:image|https?:|\/|assets\/)/.test(src)){e.innerHTML=`<img src="${esc(src)}" alt="BeeHouse logo">`;e.style.background='transparent'}else e.textContent=src||'B'}
function setFavicon(src){if(!src)return;let l=document.querySelector('link[data-beehouse-favicon]');if(!l){l=document.createElement('link');l.rel='icon';l.dataset.beehouseFavicon='1';document.head.appendChild(l)}l.href=src}
function applyCommonSite(s){const g=s.general||{},c=s.content||{},h=s.hero||{},b=s.buttons||{};document.title=g.siteTitle||document.title;setFavicon(g.favicon||g.logo);document.documentElement.style.setProperty('--pink-primary',s.theme?.primary||'#ff5e97');
 document.querySelectorAll('.brand-logo,.brand-icon').forEach(e=>{if(e.classList.contains('brand-icon')&&e.closest('.admin-shell'))return; if(g.logo&&/^(data:image|https?:|assets\/|\/)/.test(g.logo))e.innerHTML=`<img src="${esc(g.logo)}" alt="${esc(g.siteTitle||'BeeHouse')}">`;else e.textContent=g.logo||'B'});
 document.querySelectorAll('.brand-title strong').forEach(e=>e.textContent=(g.siteTitle||'BeeHouse').split('|')[0].trim());document.querySelectorAll('.brand-title small').forEach(e=>e.textContent=(g.siteTitle||'').toUpperCase());
 const nav=document.querySelector('#nav-links-container');if(nav)nav.innerHTML=(s.navbar||[]).filter(x=>x.enabled!==false).map(x=>`<a href="${esc(x.link)}" class="nav-item">${esc(x.label)}</a>`).join('');
 const apply=document.querySelector('.nav-actions a[href="apply.html"]');if(apply){apply.textContent=b.apply?.text||apply.textContent;apply.href=b.apply?.url||'apply.html';apply.style.display=b.apply?.enabled===false?'none':''}const login=document.querySelector('.nav-actions a[href="login.html"]');if(login){login.textContent=b.login?.text||login.textContent;login.href=b.login?.url||'login.html';login.style.display=b.login?.enabled===false?'none':''}
 document.querySelectorAll('.footer-brand-info h3').forEach(e=>e.textContent=c.home?.footerTitle||g.siteTitle||e.textContent);document.querySelectorAll('.footer-brand-info p').forEach(e=>e.textContent=c.home?.footerSlogan||g.slogan||e.textContent);document.querySelectorAll('.copyright-text').forEach(e=>e.textContent=g.copyright||e.textContent);document.querySelectorAll('.powered-badge strong').forEach(e=>e.textContent=g.footerCredits||e.textContent);
 if(document.querySelector('.main-card-glass')){const badge=document.querySelector('.main-card-glass .badge-pill');if(badge)badge.innerHTML=h.badge||badge.innerHTML;const title=document.querySelector('.main-title');if(title)title.innerHTML=h.title||title.innerHTML;const d=document.querySelector('.main-desc');if(d)d.textContent=h.description||d.textContent;const ft=document.querySelector('.featured-info strong');if(ft)ft.textContent=h.featuredTitle||ft.textContent;const fp=document.querySelector('.featured-info p');if(fp)fp.textContent=h.featuredDescription||fp.textContent}
 const ct=c.home||{};const map=[['.portfolio-section .badge-pill-soft',ct.portfolioBadge],['.portfolio-section .section-title',ct.portfolioTitle],['.portfolio-section .section-desc',ct.portfolioDescription],['.shop-section .badge-pill-soft',ct.partnerBadge],['.shop-section .section-title',ct.partnerTitle],['.shop-section .section-desc',ct.partnerDescription],['.home-news-widget h3',ct.newsTitle],['.btn-view-all',ct.newsViewAll],['.banner-left strong',ct.bannerTitle],['.banner-left p',ct.bannerDescription]];map.forEach(([sel,v])=>{const e=document.querySelector(sel);if(e&&v)e.textContent=v});const banner=document.querySelector('.bottom-banner');if(banner)banner.style.display=s.features?.banner===false?'none':'';
 const nb=document.querySelector('.home-news-widget .widget-card');const latest=(s.news||[])[0];if(nb&&latest){const img=nb.querySelector('.widget-img');if(img)img.src=latest.image||img.src;const tag=nb.querySelector('.widget-tag');if(tag)tag.textContent=latest.categoryName||latest.category||'ข่าวสาร';const date=nb.querySelector('.widget-date');if(date)date.textContent=latest.date||'';const hh=nb.querySelector('.widget-headline');if(hh)hh.textContent=latest.title||'';const dd=nb.querySelector('.widget-desc');if(dd)dd.textContent=latest.excerpt||'';const l=nb.querySelector('.widget-link');if(l)l.href=latest.linkUrl||'news.html'}
}
async function publicHome(){
 const s=await loadSite(); if(!s)return;
 applyCommonSite(s);
 text(".brand-title strong",(s.general?.siteTitle||"BeeHouse").split("|")[0].trim());
 const sm=$(".brand-title small"); if(sm)sm.textContent=(s.general?.siteTitle||"").toUpperCase();
 const hero=s.hero||{};
 const badge=$(".main-card-glass .badge-pill"); if(badge)badge.innerHTML=hero.badge||badge.innerHTML;
 const title=$(".main-title"); if(title)title.innerHTML=hero.title||title.innerHTML;
 text(".main-desc",hero.description);
 const ft=$(".featured-info strong"); if(ft)ft.textContent=hero.featuredTitle||ft.textContent;
 const fp=$(".featured-info p"); if(fp)fp.innerHTML=esc(hero.featuredDescription||"")+" <span class=\"dot-status\"></span>";
 const footer=s.general||{};
 const fb=$(".footer-brand-info h3"); if(fb)fb.textContent=footer.siteTitle||fb.textContent;
 const fc=$(".footer-brand-info p"); if(fc)fc.textContent=footer.slogan||fc.textContent;
 const cr=$(".copyright-text"); if(cr)cr.textContent=footer.copyright||cr.textContent;
 const pb=$(".powered-badge strong"); if(pb)pb.textContent=footer.footerCredits||pb.textContent;
 const nav=$("#nav-links-container"); if(nav)nav.innerHTML=(s.navbar||[]).filter(x=>x.enabled!==false).map(x=>`<a href="${esc(x.link)}" class="nav-item">${esc(x.label)}</a>`).join("");
 const tabs=$("#action-tabs-container"); if(tabs)tabs.innerHTML=(s.tabs||[]).map(x=>`<button class="tab-btn ${x.active?"active":""}" data-tab="${esc(x.id)}">${esc(x.title)}</button>`).join("");
 const content=$("#tab-content-display"); const active=(s.tabs||[]).find(x=>x.active)||(s.tabs||[])[0]; if(content&&active)content.innerHTML=`<p>${esc(active.content)}</p>`;
 if(tabs)tabs.onclick=e=>{const b=e.target.closest("[data-tab]");if(!b)return;const t=(s.tabs||[]).find(x=>x.id===b.dataset.tab);if(t)content.innerHTML=`<p>${esc(t.content)}</p>`;tabs.querySelectorAll(".tab-btn").forEach(x=>x.classList.toggle("active",x===b))};
 const stats=$("#stats-container");if(stats)stats.innerHTML=(s.stats||[]).map(x=>`<div class="stat-item"><div class="stat-num">${esc(x.num)}</div><div class="stat-label">${esc(x.label)}</div></div>`).join("");
 const partners=$("#partner-container");if(partners)partners.innerHTML=(s.partners||[]).map(p=>`<div class="partner-card"><div class="partner-header"><div class="partner-avatar">${esc(p.icon||"🏪")}</div><div class="partner-info"><h3>${esc(p.name)}</h3><span class="partner-tag">${esc(p.category)}</span></div></div><p class="partner-desc">${esc(p.desc)}</p><div class="partner-works"><div class="partner-works-title">ตัวอย่างรายการ & ราคาเริ่มต้น</div>${(p.services||[]).map(x=>`<div class="partner-work-item"><span>${esc(x.name)}</span><span class="partner-work-price">${esc(x.price)}</span></div>`).join("")}</div><div class="partner-footer"><a href="${esc(p.url||p.discordUrl||"#")}" target="_blank" rel="noopener noreferrer" class="btn-discord">เข้าสู่ร้านค้า ↗</a></div></div>`).join("");
 const pf=$("#portfolio-container");if(pf){const items=s.portfolio||[];pf.innerHTML=items.length?items.map(x=>`<article class="portfolio-card"><img src="${esc(x.image||"")}" alt="${esc(x.title)}"><div><h3>${esc(x.title)}</h3><p>${esc(x.description)}</p>${x.url?`<a href="${esc(x.url)}" target="_blank">ดูตัวอย่างเต็ม ↗</a>`:""}</div></article>`).join(""):`<div class="empty-state"><p>ยังไม่มีผลงานในขณะนี้ ผู้ดูแลสามารถเพิ่มผลงานได้ผ่านแผงควบคุม</p></div>`}
 const feat=s.features||{};if(feat.banner===false)$(".bottom-banner")?.remove();if(feat.preloader===false){$("#loading-screen")?.remove();$("#app")?.style.setProperty("display","block")}
 const theme=s.theme||{};if(theme.primary)document.documentElement.style.setProperty("--pink-primary",theme.primary);
}
async function publicApply(){
 const s=await loadSite();if(!s)return; applyCommonSite(s); if($('#rp-apply-form')){const c=s.content?.apply||{}; const h=document.querySelector('.form-header h2'); if(h&&c.title)h.textContent=c.title;}
 if(s.features?.applicationsOpen===false){const f=$("#rp-apply-form"),c=s.content?.apply||{};if(f){f.innerHTML=`<div class="form-section"><h3>${esc(c.closedTitle||'🚫 ปิดรับสมัครชั่วคราว')}</h3><p>${esc(c.closedText||'ขณะนี้ระบบปิดรับสมัคร กรุณาติดตามประกาศจากหน้าเว็บไซต์')}</p></div>`};return}
 const c=$("#class-options");if(!c)return;
 const apps=(window.BeeHouseCMS?.getApps?.()||[]);
 c.innerHTML=(s.jobs||[]).filter(j=>j.enabled!==false).map(j=>{const n=(apps.find(a=>a.job===j.name)?.count)||0;const full=n>=Number(j.max);return `<label class="class-card ${full?"disabled":""}" for="${esc(j.id)}"><input type="radio" id="${esc(j.id)}" name="character_job" value="${esc(j.name)}" ${full?"disabled":""} required><span class="class-title">${esc(j.name)}</span><span class="class-desc">${esc(j.desc)}</span><span class="quota-badge">${full?"🔒 เต็มแล้ว":`👥 เหลือ ${Number(j.max)-n} ที่นั่ง (${n}/${j.max})`}</span></label>`}).join("");
 document.addEventListener("submit",async e=>{
  if(e.target.id!=="rp-apply-form")return;e.preventDefault();e.stopImmediatePropagation();
  const g=id=>document.getElementById(id)?.value?.trim()||"";
  const job=document.querySelector('input[name="character_job"]:checked')?.value||"";
  const body={ocNickname:g("oc_nickname"),ocAge:g("oc_age"),discord:g("oc_discord"),discordId:g("oc_discord_id"),xbox:g("xbox_name"),interviewTime:g("interview_time"),icFullname:g("ic_fullname"),icNickname:g("ic_nickname"),icAge:g("ic_age"),icHistory:g("ic_history"),icPersonality:g("ic_personality"),icPrologue:g("ic_prologue"),job};
  try{const a=window.BeeHouseCMS?.getApps?.()||[];const id="APP-"+Date.now();a.push({...body,id,status:"pending",score:0,maxScore:100,remark:"",submittedAt:new Date().toLocaleString("th-TH")});window.BeeHouseCMS?.saveApps?.(a);window.BeeHouseCMS?.log?.("มีการส่งใบสมัคร "+id);alert("✅ ส่งใบสมัครเรียบร้อยแล้ว");e.target.reset()}catch(err){alert("❌ "+err.message)}
 },true);
}
async function publicStatus(){
 const s=await loadSite();if(s)applyCommonSite(s); const c=s?.content?.status||{}; const title=document.querySelector('#login-section h2');if(title&&c.title)title.textContent=c.title; const f=$("#status-login-form");if(!f)return;
 document.addEventListener("submit",async e=>{
  if(e.target!==f)return;e.preventDefault();e.stopImmediatePropagation();
  const xbox=$("#login_xbox").value.trim(),discordId=$("#login_discord_id").value.trim();
  try{const local=(window.BeeHouseCMS?.getApps?.()||[]).find(x=>String(x.xbox).toLowerCase()===xbox.toLowerCase()&&String(x.discordId)===discordId);if(local){renderStatus({...local,ocName:local.ocNickname,icName:local.icFullname,maxScore:100});return}const u=await api(`/status?xbox=${encodeURIComponent(xbox)}&discordId=${encodeURIComponent(discordId)}`);renderStatus(u)}catch(err){alert("❌ "+err.message)}
 },true);
 function renderStatus(u){$("#login-section").style.display="none";$("#loading-section").style.display="none";const r=$("#result-section");r.style.display="block";const pass=u.status==="pass",fail=u.status==="fail";r.innerHTML=`<div style="padding:20px;border-radius:16px;margin-bottom:20px;text-align:center;background:rgba(255,255,255,.12);border:2px solid ${pass?"#48bb78":fail?"#f56565":"#ecc94b"}">${pass?"🎉 ยินดีด้วย! คุณผ่านการสัมภาษณ์":fail?"💔 เสียใจด้วย คุณยังไม่ผ่านการสัมภาษณ์":"⏳ อยู่ระหว่างรอการสอบสัมภาษณ์"}<p>ผู้สมัคร: <strong>${esc(u.ocName)}</strong> | ตัวละคร: <strong>${esc(u.icName)}</strong></p></div><div class="form-section"><div style="text-align:center"><label>คะแนนรวมที่ได้</label><div style="font-size:3.2rem;font-weight:900">${esc(u.score)} <small>/ ${esc(u.maxScore)}</small></div></div><div class="form-grid"><div class="form-group"><label>Xbox Gamertag</label><input disabled value="${esc(xbox)}"></div><div class="form-group"><label>สายพลัง / อาชีพ</label><input disabled value="${esc(u.job)}"></div><div class="form-group"><label>ผู้ทำการสอบสัมภาษณ์</label><input disabled value="${esc(u.interviewer)}"></div><div class="form-group"><label>วันที่/เวลา สอบ</label><input disabled value="${esc(u.interviewDate)}"></div></div><div class="form-group"><label>ความคิดเห็นและคำแนะนำ</label><textarea rows="4" disabled>${esc(u.remark)}</textarea></div></div><button onclick="location.reload()" class="btn-submit-app">↻ ค้นหาใหม่อีกครั้ง</button>`}
}
async function publicNews(){
 if(!$("#news-container"))return;const s=await loadSite();if(!s?.news)return; applyCommonSite(s); const c=s.content?.news||{}; text('.hero-title',c.heroTitle); text('.hero-desc',c.heroDescription); const si=$("#search-input");if(si)si.placeholder=c.searchPlaceholder||si.placeholder; text('.section-subtitle',c.listTitle); 
 const items=s.news||[];const box=$("#news-container");box.innerHTML=items.map(n=>`<article class="news-card">${n.isUrgent?'<div class="priority-badge">🚨 แจ้งเตือนด่วน</div>':""}<div class="news-image-wrapper"><img src="${esc(n.image)}" class="news-image" alt="${esc(n.title)}"></div><div class="news-content"><div class="news-meta"><span class="news-tag">${esc(n.categoryName||n.category||"ข่าวสาร")}</span><span class="news-date">${esc(n.date)}</span></div><h2 class="news-title">${esc(n.title)}</h2><p class="news-excerpt">${esc(n.excerpt||n.content||"")}</p><div class="news-footer"><span>✍️ ${esc(n.author||"Admin")}</span>${n.linkUrl?`<a href="${esc(n.linkUrl)}" target="_blank" class="btn-read-more">อ่านรายละเอียด ↗</a>`:""}</div></div></article>`).join("")}
async function login(){
 const f=$("#login-form");if(!f)return;
 document.addEventListener("submit",async e=>{if(e.target!==f)return;e.preventDefault();e.stopImmediatePropagation();try{const d=await api("/auth/login",{method:"POST",body:JSON.stringify({username:$("#username").value.trim(),password:$("#password").value})});location.href=d.user.role==="super_admin"?"admin-dashboard.html":"admin-dashboard.html"}catch(err){const a=$("#alert-box");a.textContent=err.message;a.className="alert-box error";a.style.display="block"}},true);
}
document.addEventListener("DOMContentLoaded",()=>{publicHome();publicApply();publicStatus();publicNews();login()}); window.addEventListener('beehouse:site-updated',()=>{publicHome();publicApply();publicStatus();publicNews()}); window.addEventListener('storage',e=>{if(e.key==='beehouse_site_override_v4'){publicHome();publicApply();publicStatus();publicNews()}});
})();