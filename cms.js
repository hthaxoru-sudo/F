/* BeeHouse Static CMS Bridge - resilient GitHub Pages edition */
(function(){
  const KEY='beehouse_site_override_v4';
  const APP='beehouse_applications_v4';
  const CONTACT='beehouse_contacts_v4';
  const LOG='beehouse_logs_v4';
  const clone=x=>JSON.parse(JSON.stringify(x));
  async function base(){ return clone(window.BeeHouseDefaultSite||{}); }
  async function load(){
    try{const raw=localStorage.getItem(KEY);if(raw)return JSON.parse(raw)}catch(e){}
    return base();
  }
  function save(s){
    const clean=clone(s);
    localStorage.setItem(KEY,JSON.stringify(clean));
    window.BeeHouseCMS.site=clean;
    window.dispatchEvent(new CustomEvent('beehouse:site-updated',{detail:clean}));
    return clean;
  }
  function getApps(){try{return JSON.parse(localStorage.getItem(APP)||'[]')}catch{return []}}
  function saveApps(a){localStorage.setItem(APP,JSON.stringify(a));window.dispatchEvent(new Event('beehouse:apps-updated'));return a}
  function getContacts(){try{return JSON.parse(localStorage.getItem(CONTACT)||'[]')}catch{return []}}
  function saveContacts(a){localStorage.setItem(CONTACT,JSON.stringify(a));window.dispatchEvent(new Event('beehouse:contacts-updated'));return a}
  function getLogs(){try{return JSON.parse(localStorage.getItem(LOG)||'[]')}catch{return []}}
  function log(action,status='success'){const a=getLogs();a.unshift({id:Date.now(),time:new Date().toLocaleString('th-TH'),user:JSON.parse(sessionStorage.getItem('currentUser')||'{}').name||'Admin',action,status});localStorage.setItem(LOG,JSON.stringify(a.slice(0,500)))}
  function exportJson(){const blob=new Blob([JSON.stringify(window.BeeHouseCMS.site||{},null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='site.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
  window.BeeHouseCMS={KEY,APP,CONTACT,LOG,site:null,load,get:load,set:save,reset:async()=>{localStorage.removeItem(KEY);return load()},getApps,saveApps,getContacts,saveContacts,getLogs,log,exportJson,clone};
  async function init(){try{window.BeeHouseCMS.site=await load()}catch(e){window.BeeHouseCMS.site=clone(window.BeeHouseDefaultSite||{})}window.dispatchEvent(new Event('beehouse:ready'))}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
