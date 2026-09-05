/* BeeHouse Static CMS Bridge - GitHub Pages only, no server/API/files required. */
(function(){
  'use strict';
  const KEY='beehouse_site_override_v5', APP='beehouse_applications_v5', CONTACT='beehouse_contacts_v5', LOG='beehouse_logs_v5';
  const clone=x=>JSON.parse(JSON.stringify(x ?? {}));
  function base(){return clone(window.BeeHouseDefaultSite||{});}
  function load(){
    try{const raw=localStorage.getItem(KEY); if(raw){const parsed=JSON.parse(raw); return parsed&&typeof parsed==='object'?parsed:base();}}
    catch(e){console.warn('BeeHouse CMS localStorage load failed',e);}
    return base();
  }
  function save(site){
    const clean=clone(site||base());
    try{localStorage.setItem(KEY,JSON.stringify(clean));}
    catch(e){console.error('BeeHouse CMS save failed',e); alert('บันทึกไม่สำเร็จ: พื้นที่จัดเก็บของเบราว์เซอร์เต็ม กรุณาลดขนาดรูปภาพ'); return false;}
    api.site=clean;
    window.dispatchEvent(new CustomEvent('beehouse:site-updated',{detail:clean}));
    return true;
  }
  function arr(key){try{const x=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(x)?x:[]}catch{return []}}
  function setArr(key,x){try{localStorage.setItem(key,JSON.stringify(Array.isArray(x)?x:[]));window.dispatchEvent(new CustomEvent('beehouse:data-updated',{detail:{key}}));return true}catch(e){alert('บันทึกข้อมูลไม่สำเร็จ: พื้นที่จัดเก็บเต็ม');return false}}
  function log(action,status='success'){const a=arr(LOG);const u=(()=>{try{return JSON.parse(sessionStorage.getItem('currentUser')||'{}')}catch{return {}}})();a.unshift({id:Date.now(),time:new Date().toLocaleString('th-TH'),user:u.name||'Admin',action,status});setArr(LOG,a.slice(0,500));}
  function exportJson(){const blob=new Blob([JSON.stringify(api.site||base(),null,2)],{type:'application/json;charset=utf-8'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='beehouse-site-backup.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
  const api={KEY,APP,CONTACT,LOG,site:null,load,get:load,set:save,reset:()=>{try{localStorage.removeItem(KEY)}catch{} const s=base();api.site=s;return s},getApps:()=>arr(APP),saveApps:x=>setArr(APP,x),getContacts:()=>arr(CONTACT),saveContacts:x=>setArr(CONTACT,x),getLogs:()=>arr(LOG),log,exportJson,clone};
  api.site=load();
  window.BeeHouseCMS=api;
  window.dispatchEvent(new Event('beehouse:ready'));
})();
