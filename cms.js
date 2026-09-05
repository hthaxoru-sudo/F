/* BeeHouse CMS - GitHub Pages only. No API, server or runtime JSON required. */
(function(){
  'use strict';
  const KEY='beehouse_cms_v7';
  const APP='beehouse_applications_v7';
  const CONTACT='beehouse_contacts_v7';
  const LOG='beehouse_logs_v7';
  const VERSION=7;
  const clone=o=>JSON.parse(JSON.stringify(o==null?{}:o));
  const safeParse=(v,f)=>{try{return JSON.parse(v)}catch{return f}};
  function defaults(){return clone(window.BeeHouseDefaultSite||{});}
  function normalize(s){
    const d=defaults(), out=Object.assign({},d,s||{});
    for(const k of ['general','buttons','hero','features','theme','content']) out[k]=Object.assign({},d[k]||{},(s||{})[k]||{});
    for(const k of ['navbar','tabs','stats','partners','products','portfolio','jobs','news']) out[k]=Array.isArray((s||{})[k])?(s||{})[k]:clone(d[k]||[]);
    out.__cmsVersion=VERSION;
    out.portfolio=out.portfolio.map(x=>({...x,images:Array.isArray(x.images)?x.images:(x.image?[x.image]:[]),image:x.image||(Array.isArray(x.images)&&x.images[0])||''}));
    out.partners=out.partners.map(x=>({...x,logo:x.logo||x.icon||'',services:Array.isArray(x.services)?x.services:[]}));
    return out;
  }
  function loadSync(){
    const raw=localStorage.getItem(KEY);
    if(raw){const parsed=safeParse(raw,null);if(parsed&&typeof parsed==='object')return normalize(parsed);}
    return normalize(defaults());
  }
  function setSite(site){
    const clean=normalize(site);
    try{localStorage.setItem(KEY,JSON.stringify(clean));}
    catch(e){
      if(e&&e.name==='QuotaExceededError') throw new Error('พื้นที่เก็บข้อมูลของเบราว์เซอร์เต็มแล้ว กรุณาลดขนาดหรือจำนวนรูปภาพแล้วลองอีกครั้ง');
      throw new Error('บันทึกข้อมูลไม่สำเร็จ: '+(e.message||e));
    }
    window.BeeHouseCMS.site=clean;
    window.dispatchEvent(new CustomEvent('beehouse:site-updated',{detail:clean}));
    return clean;
  }
  function getApps(){return safeParse(localStorage.getItem(APP),'[]')||[]}
  function saveApps(v){const a=Array.isArray(v)?clone(v):[];localStorage.setItem(APP,JSON.stringify(a));window.dispatchEvent(new CustomEvent('beehouse:apps-updated',{detail:a}));return a}
  function getContacts(){return safeParse(localStorage.getItem(CONTACT),'[]')||[]}
  function saveContacts(v){const a=Array.isArray(v)?clone(v):[];localStorage.setItem(CONTACT,JSON.stringify(a));window.dispatchEvent(new CustomEvent('beehouse:contacts-updated',{detail:a}));return a}
  function getLogs(){return safeParse(localStorage.getItem(LOG),'[]')||[]}
  function log(action,status='success'){const a=getLogs();let u={};try{u=JSON.parse(sessionStorage.getItem('currentUser')||'{}')}catch{};a.unshift({id:Date.now(),time:new Date().toLocaleString('th-TH'),user:u.name||'Admin',action,status});localStorage.setItem(LOG,JSON.stringify(a.slice(0,500)));}
  function exportFile(name,data){const b=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
  function exportAll(){exportFile('beehouse-backup.json',{version:VERSION,site:window.BeeHouseCMS.site||loadSync(),applications:getApps(),contacts:getContacts()});}
  function reset(){const s=normalize(defaults());localStorage.setItem(KEY,JSON.stringify(s));window.BeeHouseCMS.site=s;window.dispatchEvent(new CustomEvent('beehouse:site-updated',{detail:s}));return s;}
  async function fileToDataURL(file,max=1100,quality=.70){
    if(!file)return '';
    if(!file.type.startsWith('image/'))throw new Error('ไฟล์นี้ไม่ใช่รูปภาพ');
    return new Promise((resolve,reject)=>{const r=new FileReader();r.onerror=()=>reject(r.error);r.onload=()=>{const img=new Image();img.onload=()=>{const scale=Math.min(1,max/Math.max(img.width,img.height));const c=document.createElement('canvas');c.width=Math.max(1,Math.round(img.width*scale));c.height=Math.max(1,Math.round(img.height*scale));const ctx=c.getContext('2d');ctx.drawImage(img,0,0,c.width,c.height);resolve(c.toDataURL('image/jpeg',quality));};img.onerror=()=>reject(new Error('อ่านรูปภาพไม่สำเร็จ'));img.src=r.result};r.readAsDataURL(file)});
  }
  window.BeeHouseCMS={KEY,APP,CONTACT,LOG,VERSION,site:null,load:async()=>loadSync(),get:async()=>loadSync(),set:setSite,reset,getApps,saveApps,getContacts,saveContacts,getLogs,log,exportAll,exportJson:()=>exportFile('site.json',window.BeeHouseCMS.site||loadSync()),clone,fileToDataURL,normalize};
  function init(){window.BeeHouseCMS.site=loadSync();window.dispatchEvent(new CustomEvent('beehouse:ready',{detail:window.BeeHouseCMS.site}));}
  window.addEventListener('storage',e=>{if(e.key===KEY){const s=loadSync();window.BeeHouseCMS.site=s;window.dispatchEvent(new CustomEvent('beehouse:site-updated',{detail:s}));}});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
