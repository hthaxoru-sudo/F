/* Fully Dynamic Admin Control Center - additive layer */
(function(){
"use strict";
const A="/api/admin", esc=v=>String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
async function api(url,opt={}){const r=await fetch(A+url,{headers:{"Content-Type":"application/json",...(opt.headers||{})},...opt});let d={};try{d=await r.json()}catch{}if(!r.ok)throw Error(d.error||"เกิดข้อผิดพลาด");return d}
let db=null, active="general";
const collections=["partners","products","portfolio","news","jobs","tabs","stats"];
const labels={partners:"พาร์ตเนอร์",products:"สินค้า / บริการ",portfolio:"ผลงาน / แกลเลอรี",news:"ข่าวสาร / ประกาศ",jobs:"สายพลัง / อาชีพ",tabs:"แท็บหน้าแรก",stats:"สถิติหน้าแรก"};
function inject(){
 const nav=document.querySelector(".sidebar-menu");if(!nav)return;
 if(!document.getElementById("dynamic-menu")){const b=document.createElement("button");b.id="dynamic-menu";b.className="menu-btn";b.textContent="⚙️ Dynamic Control Center";b.onclick=()=>show("general");nav.appendChild(b)}
 const main=document.querySelector(".main-content");if(!document.getElementById("dynamic-panel")){const sec=document.createElement("section");sec.id="dynamic-panel";sec.className="tab-panel";sec.innerHTML='<div id="dynamic-root"></div>';main.appendChild(sec)}
}
async function init(){try{const me=await (await fetch("/api/auth/me")).json();if(!me.user||me.user.role!=="super_admin")return;db=await api("/all");inject();show("general")}catch(e){console.error(e)}}
function show(type){
 active=type;document.querySelectorAll(".tab-panel").forEach(x=>x.classList.remove("active"));document.getElementById("dynamic-panel").classList.add("active");document.querySelectorAll(".menu-btn").forEach(x=>x.classList.remove("active"));document.getElementById("dynamic-menu").classList.add("active");
 const r=document.getElementById("dynamic-root");
 if(type==="general")return general(r);
 if(type==="applications")return applications(r);
 if(type==="contacts")return contacts(r);
 if(type==="logs")return logs(r);
 if(type==="upload")return upload(r);
 return collection(r,type);
}
function toolbar(title){return `<div class="card-box"><h3>${title}</h3><div id="dynamic-body"></div></div>`}
function general(r){
 const s=db.site||{},g=s.general||{},b=s.buttons||{},h=s.hero||{},f=s.features||{},t=s.theme||{};
 r.innerHTML=toolbar("⚙️ ตั้งค่าเว็บไซต์แบบ Dynamic 100%")+toolbar("🧩 เมนูจัดการข้อมูลทั้งหมด");
 const cards=[["general","🌐 ข้อมูลทั่วไป"],["collections","📦 พาร์ตเนอร์ / สินค้า / ผลงาน / ข่าว"],["applications","📩 ใบสมัคร & ประเมินผล"],["contacts","📨 Contact Inbox"],["logs","📜 Audit Logs"],["upload","🖼️ Media Upload"]].map(x=>`<button class="btn-add" onclick="DynamicAdmin.show('${x[0]}')">${x[1]}</button>`).join("");
 document.querySelectorAll("#dynamic-body")[1].innerHTML=cards;
 document.querySelectorAll("#dynamic-body")[0].innerHTML=`<div class="form-grid">
 <div class="form-group"><label>ชื่อเว็บไซต์</label><input id="dg-title" value="${esc(g.siteTitle)}"></div>
 <div class="form-group"><label>สโลแกน</label><input id="dg-slogan" value="${esc(g.slogan)}"></div>
 <div class="form-group"><label>Logo / Emoji / URL</label><input id="dg-logo" value="${esc(g.logo)}"></div>
 <div class="form-group"><label>Favicon URL</label><input id="dg-favicon" value="${esc(g.favicon)}"></div>
 <div class="form-group"><label>Footer Credits</label><input id="dg-footer" value="${esc(g.footerCredits)}"></div>
 <div class="form-group"><label>Copyright</label><input id="dg-copy" value="${esc(g.copyright)}"></div>
 <div class="form-group"><label>สถานะเซิร์ฟเวอร์</label><select id="dg-server"><option value="online" ${g.serverStatus==="online"?"selected":""}>Online</option><option value="offline" ${g.serverStatus==="offline"?"selected":""}>Offline</option></select></div>
 <div class="form-group"><label>สีหลัก</label><input type="color" id="dg-color" value="${esc(t.primary||"#ff5e97")}"></div>
 </div>
 <h4>ปุ่มและการเปิดรับสมัคร</h4>
 <div class="form-grid">${Object.entries(b).map(([k,v])=>`<div class="form-group"><label>${k}</label><input data-b="${k}" value="${esc(v.text)}" placeholder="ข้อความปุ่ม"><input data-u="${k}" value="${esc(v.url)}" placeholder="URL"><label><input type="checkbox" data-e="${k}" ${v.enabled!==false?"checked":""}> เปิดใช้งาน</label></div>`).join("")}</div>
 <div class="form-group"><label>หัวข้อหลัก</label><input id="dg-hero-title" value="${esc(h.title)}"></div>
 <div class="form-group"><label>คำบรรยายหลัก</label><textarea id="dg-hero-desc">${esc(h.description)}</textarea></div>
 <label><input type="checkbox" id="dg-appopen" ${f.applicationsOpen!==false?"checked":""}> เปิดรับสมัคร</label>
 <button class="btn-save" onclick="DynamicAdmin.saveGeneral()">💾 บันทึกทั้งหมด</button>`;
}
async function saveGeneral(){
 const s=db.site,g={...s.general,siteTitle:$("#dg-title").value,slogan:$("#dg-slogan").value,logo:$("#dg-logo").value,favicon:$("#dg-favicon").value,footerCredits:$("#dg-footer").value,copyright:$("#dg-copy").value,serverStatus:$("#dg-server").value};
 const buttons={};Object.keys(s.buttons||{}).forEach(k=>buttons[k]={text:document.querySelector(`[data-b="${k}"]`).value,url:document.querySelector(`[data-u="${k}"]`).value,enabled:document.querySelector(`[data-e="${k}"]`).checked});
 const next={...s,general:g,buttons,hero:{...s.hero,title:$("#dg-hero-title").value,description:$("#dg-hero-desc").value},features:{...s.features,applicationsOpen:$("#dg-appopen").checked},theme:{...s.theme,primary:$("#dg-color").value}};
 db.site=await (await fetch("/api/admin/site",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(next)})).json();alert("✅ บันทึกแล้ว");
}
function collection(r,name){
 if(name==="collections"){r.innerHTML=toolbar("📦 เลือกหมวดข้อมูล");document.querySelector("#dynamic-body").innerHTML=collections.map(k=>`<button class="btn-add" onclick="DynamicAdmin.show('${k}')">${labels[k]}</button>`).join("");return}
 const arr=db.site?.[name]||[];r.innerHTML=toolbar("จัดการ"+labels[name]);
 document.querySelector("#dynamic-body").innerHTML=`<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:15px"><button class="btn-add" onclick="DynamicAdmin.edit('${name}','new')">＋ เพิ่มรายการ</button><button class="btn-add" onclick="DynamicAdmin.show('collections')">← หมวดทั้งหมด</button></div><div>${arr.map((x,i)=>`<div class="card-box" style="margin-bottom:10px;display:flex;justify-content:space-between;gap:10px"><div><strong>${esc(x.name||x.title||x.label||x.id||"รายการ "+(i+1))}</strong><small style="display:block;opacity:.7">${esc(x.category||x.description||"")}</small></div><div><button class="btn-add" onclick="DynamicAdmin.edit('${name}',${i})">แก้ไข</button> <button class="btn-add" onclick="DynamicAdmin.del('${name}',${i})">ลบ</button></div></div>`).join("")}</div>`;
}
function edit(name,idx){
 const arr=db.site[name]||[];const val=idx==="new"?{id:name+"-"+Date.now(),name:"รายการใหม่"}:arr[idx];const body=document.getElementById("dynamic-body");
 body.innerHTML=`<p>แก้ไขข้อมูลเป็น JSON ได้โดยตรง ระบบจะนำไปแสดงผลบนหน้าเว็บอัตโนมัติ</p><textarea id="json-editor" style="width:100%;min-height:320px;font-family:monospace">${esc(JSON.stringify(val,null,2))}</textarea><br><button class="btn-save" onclick="DynamicAdmin.saveItem('${name}','${idx}')">💾 บันทึก</button> <button class="btn-add" onclick="DynamicAdmin.show('${name}')">ยกเลิก</button>`;
}
async function saveItem(name,idx){try{const v=JSON.parse(document.getElementById("json-editor").value);const arr=[...(db.site[name]||[])];if(idx==="new")arr.push(v);else arr[Number(idx)]=v;db.site[name]=await api("/collection/"+name,{method:"PUT",body:JSON.stringify(arr)});alert("บันทึกแล้ว");show(name)}catch(e){alert("❌ "+e.message)}}
async function del(name,i){if(!confirm("ยืนยันการลบรายการนี้?"))return;const arr=[...(db.site[name]||[])];arr.splice(i,1);db.site[name]=await api("/collection/"+name,{method:"PUT",body:JSON.stringify(arr)});show(name)}
function applications(r){
 const a=db.applications||[];r.innerHTML=toolbar("📩 Applications & Interview Evaluation");
 document.querySelector("#dynamic-body").innerHTML=`<div class="form-grid"><input id="app-search" placeholder="ค้นหา Xbox / Discord / ชื่อ IC"><select id="app-filter"><option value="">ทุกสถานะ</option><option value="pending">รอสอบ</option><option value="pass">ผ่าน</option><option value="fail">ไม่ผ่าน</option></select></div><div style="overflow:auto"><table class="log-table"><thead><tr><th>Xbox</th><th>Discord</th><th>IC</th><th>สถานะ</th><th>คะแนน</th><th>จัดการ</th></tr></thead><tbody id="da-apps">${rows(a)}</tbody></table></div><button class="btn-add" onclick="DynamicAdmin.show('general')">← กลับเมนู</button>`;
 $("#app-search").oninput=filterApps;$("#app-filter").onchange=filterApps;
}
function rows(a){return a.map((x,i)=>`<tr><td>${esc(x.xbox)}</td><td>${esc(x.discordId)}</td><td>${esc(x.icFullname||x.icName)}</td><td>${esc(x.status)}</td><td>${esc(x.score||0)}/100</td><td><button class="btn-add" onclick="DynamicAdmin.evaluate(${i})">ประเมิน</button> <button class="btn-add" onclick="DynamicAdmin.delApp('${x.id}')">ลบ</button></td></tr>`).join("")}
function filterApps(){const q=$("#app-search").value.toLowerCase(),st=$("#app-filter").value;$("#da-apps").innerHTML=rows((db.applications||[]).filter(x=>(!st||x.status===st)&&JSON.stringify(x).toLowerCase().includes(q)))}
function evaluate(i){
 const x=db.applications[i];const body=document.getElementById("dynamic-body");body.innerHTML=`<h4>ประเมิน: ${esc(x.xbox)}</h4><div class="form-grid"><div class="form-group"><label>Roleplay (0-40)</label><input id="ev-rp" type="number" min="0" max="40" value="${x.scoreBreakdown?.rp||0}"></div><div class="form-group"><label>กฎเมือง (0-30)</label><input id="ev-rules" type="number" min="0" max="30" value="${x.scoreBreakdown?.rules||0}"></div><div class="form-group"><label>การสื่อสาร (0-30)</label><input id="ev-comm" type="number" min="0" max="30" value="${x.scoreBreakdown?.comm||0}"></div><div class="form-group"><label>สถานะ</label><select id="ev-status"><option value="pending" ${x.status==="pending"?"selected":""}>รอสอบ</option><option value="pass" ${x.status==="pass"?"selected":""}>ผ่าน</option><option value="fail" ${x.status==="fail"?"selected":""}>ไม่ผ่าน</option></select></div></div><div class="form-group"><label>ความคิดเห็น</label><textarea id="ev-remark">${esc(x.remark)}</textarea></div><button class="btn-save" onclick="DynamicAdmin.saveEval(${i})">💾 บันทึกผล</button> <button class="btn-add" onclick="DynamicAdmin.show('applications')">ยกเลิก</button>`;
}
async function saveEval(i){const x=db.applications[i],rp=+$("#ev-rp").value||0,rules=+$("#ev-rules").value||0,comm=+$("#ev-comm").value||0;const v=await api("/applications/"+x.id,{method:"PUT",body:JSON.stringify({status:$("#ev-status").value,score:rp+rules+comm,scoreBreakdown:{rp,rules,comm},remark:$("#ev-remark").value,interviewDate:new Date().toLocaleString("th-TH"),interviewer:db?.users?.find(u=>u.id)?.name||"Super Admin"})});db.applications[i]=v;alert("บันทึกผลแล้ว");show("applications")}
async function delApp(id){if(!confirm("ลบใบสมัครนี้?"))return;await api("/applications/"+id,{method:"DELETE"});db.applications=db.applications.filter(x=>x.id!==id);show("applications")}
function contacts(r){r.innerHTML=toolbar("📨 Contact Inbox");document.querySelector("#dynamic-body").innerHTML=(db.contacts||[]).map(x=>`<div class="card-box"><strong>${esc(x.subject||x.name||"ข้อความติดต่อ")}</strong><p>${esc(x.message||x.content||"")}</p><small>${esc(x.email||"")} • ${esc(x.status)}</small><br><button class="btn-add" onclick="DynamicAdmin.contact('${x.id}','closed')">ปิดเรื่อง</button></div>`).join("")}
async function contact(id,status){await api("/contacts/"+id,{method:"PUT",body:JSON.stringify({status})});db.contacts=(db.contacts||[]).map(x=>x.id===id?{...x,status}:x);show("contacts")}
function logs(r){r.innerHTML=toolbar("📜 Audit Logs");document.querySelector("#dynamic-body").innerHTML=`<div style="overflow:auto"><table class="log-table"><thead><tr><th>เวลา</th><th>ผู้ใช้</th><th>กิจกรรม</th><th>สถานะ</th></tr></thead><tbody>${(db.logs||[]).map(x=>`<tr><td>${esc(x.time)}</td><td>${esc(x.user)}</td><td>${esc(x.action)}</td><td>${esc(x.status)}</td></tr>`).join("")}</tbody></table></div>`}
function upload(r){r.innerHTML=toolbar("🖼️ Media Upload");document.querySelector("#dynamic-body").innerHTML=`<p>อัปโหลดรูปหรือวิดีโอ แล้วนำ URL ไปใส่ใน Portfolio / Partner / News ได้ทันที</p><input type="file" id="media-file" accept="image/*,video/*"><button class="btn-save" onclick="DynamicAdmin.doUpload()">อัปโหลด</button><pre id="upload-result"></pre>`}
async function doUpload(){const f=$("#media-file").files[0];if(!f)return alert("เลือกไฟล์ก่อน");const fd=new FormData();fd.append("file",f);const r=await fetch("/api/admin/upload",{method:"POST",body:fd});const d=await r.json();if(!r.ok)return alert(d.error);$("#upload-result").textContent=location.origin+d.url}
window.DynamicAdmin={show,saveGeneral,edit,saveItem,del,applications,evaluate,saveEval,delApp,contact,doUpload};
document.addEventListener("DOMContentLoaded",init);
})();