/* BeeHouse CMS - Node.js backend client */
(function(){
  'use strict';
  const clone=o=>JSON.parse(JSON.stringify(o==null?{}:o));
  const safe=v=>{try{return JSON.parse(v)}catch{return null}};
  const CACHE='beehouse_cms_cache_v8', APPCACHE='beehouse_apps_cache_v8', CONTCACHE='beehouse_contacts_cache_v8';
  let site=null, apps=[], contacts=[];
  const api=async(url,opt={})=>{
    const r=await fetch(url,{headers:{'Content-Type':'application/json',...(opt.headers||{})},...opt});
    let d={}; try{d=await r.json()}catch{}
    if(!r.ok) throw new Error(d.error||'เกิดข้อผิดพลาดจากเซิร์ฟเวอร์');
    return d;
  };
  function cache(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch{}}
  function readCache(k,d){return safe(localStorage.getItem(k))??d}
  function setLocal(s){site=clone(s);cache(CACHE,site);window.BeeHouseCMS.site=site;window.dispatchEvent(new CustomEvent('beehouse:site-updated',{detail:site}));return site}
  async function load(){
    const cached=readCache(CACHE,window.BeeHouseDefaultSite||{});
    site=cached;
    try{setLocal(await api('/api/site'))}catch(e){console.warn('CMS server unavailable; using cached site',e.message)}
    return site;
  }
  async function get(){return load()}
  function set(s){
    const clean=setLocal(s);
    api('/api/admin/site',{method:'PUT',body:JSON.stringify(clean)})
      .then(setLocal).catch(e=>console.error('CMS save failed:',e));
    return clean;
  }
  function getApps(){return Array.isArray(apps)?clone(apps):readCache(APPCACHE,[])}
  function saveApps(v){
    apps=Array.isArray(v)?clone(v):[]; cache(APPCACHE,apps);
    // Synchronize every record with Node.js.
    Promise.all(apps.filter(x=>x.id).map(x=>api('/api/admin/applications/'+encodeURIComponent(x.id),{method:'PUT',body:JSON.stringify(x)}).catch(e=>console.error(e))))
      .then(()=>window.dispatchEvent(new Event('beehouse:apps-updated')));
    return apps;
  }
  async function refreshApps(){try{apps=await api('/api/admin/applications');cache(APPCACHE,apps)}catch(e){console.warn(e.message)}return getApps()}
  function getContacts(){return Array.isArray(contacts)?clone(contacts):readCache(CONTCACHE,[])}
  function saveContacts(v){contacts=Array.isArray(v)?clone(v):[];cache(CONTCACHE,contacts);return contacts}
  async function refreshContacts(){try{contacts=await api('/api/admin/contacts');cache(CONTCACHE,contacts)}catch(e){console.warn(e.message)}return getContacts()}
  function getLogs(){return readCache('beehouse_logs_cache_v8',[])}
  function log(action,status='success'){api('/api/admin/log',{method:'POST',body:JSON.stringify({action,status})}).catch(()=>{});}
  async function upload(file){
    const fd=new FormData();fd.append('file',file);
    const r=await fetch('/api/admin/upload',{method:'POST',body:fd});
    let d={};try{d=await r.json()}catch{} if(!r.ok)throw new Error(d.error||'อัปโหลดไม่สำเร็จ');return d;
  }
  function exportFile(name,data){const b=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
  function exportAll(){exportFile('beehouse-backup.json',{version:8,site:site||{},applications:getApps(),contacts:getContacts()})}
  async function reset(){const s=await api('/api/admin/site/reset',{method:'POST'});return setLocal(s)}
  window.BeeHouseCMS={site:null,load,get,set,reset,getApps,saveApps,refreshApps,getContacts,saveContacts,refreshContacts,getLogs,log,exportAll,exportJson:()=>exportFile('site.json',site||{}),clone,upload,fileToDataURL:async f=>{const x=await upload(f);return x.url}};
  async function init(){
    window.BeeHouseCMS.site=readCache(CACHE,window.BeeHouseDefaultSite||{});
    apps=readCache(APPCACHE,[]);contacts=readCache(CONTCACHE,[]);
    try{await load();}catch{}
    window.dispatchEvent(new CustomEvent('beehouse:ready',{detail:window.BeeHouseCMS.site}));
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();