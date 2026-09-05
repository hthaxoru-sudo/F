/* BeeHouse Static CMS Bridge */
(function(){
  const KEY='beehouse_site_override_v3';
  const APP='beehouse_applications_v3';
  const CONTACT='beehouse_contacts_v3';
  const LOG='beehouse_logs_v3';
  function clone(x){return JSON.parse(JSON.stringify(x));}
  async function base(){const r=await fetch('site.json?v=20260905'); return r.json();}
  async function load(){let s; try{s=JSON.parse(localStorage.getItem(KEY)||'null')}catch{} if(!s)s=await base(); return s;}
  function save(s){localStorage.setItem(KEY,JSON.stringify(s)); window.dispatchEvent(new CustomEvent('beehouse:site-updated',{detail:s})); return s;}
  async function get(){return load()}
  async function set(s){return save(s)}
  async function reset(){localStorage.removeItem(KEY); return load()}
  function getApps(){try{return JSON.parse(localStorage.getItem(APP)||'[]')}catch{return []}}
  function saveApps(a){localStorage.setItem(APP,JSON.stringify(a)); window.dispatchEvent(new Event('beehouse:apps-updated')); return a}
  function getContacts(){try{return JSON.parse(localStorage.getItem(CONTACT)||'[]')}catch{return []}}
  function saveContacts(a){localStorage.setItem(CONTACT,JSON.stringify(a)); return a}
  function getLogs(){try{return JSON.parse(localStorage.getItem(LOG)||'[]')}catch{return []}}
  function log(action,status='success'){const a=getLogs();a.unshift({id:Date.now(),time:new Date().toLocaleString('th-TH'),user:JSON.parse(sessionStorage.getItem('currentUser')||'{}').name||'Admin',action,status});localStorage.setItem(LOG,JSON.stringify(a.slice(0,500)));}
  function exportJson(){const s=JSON.stringify(window.BeeHouseCMS.site||{},null,2);const blob=new Blob([s],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='site.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
  window.BeeHouseCMS={KEY,APP,CONTACT,LOG,site:null,load,get,set,reset,getApps,saveApps,getContacts,saveContacts,getLogs,log,exportJson,clone};
  document.addEventListener('DOMContentLoaded',async()=>{try{window.BeeHouseCMS.site=await load();window.dispatchEvent(new Event('beehouse:ready'))}catch(e){console.error(e)}});
})();