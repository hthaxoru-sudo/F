/* BeeHouse Accounts - GitHub Pages static mode
   Accounts created by Super Admin are stored in this browser's localStorage.
   This is UI/access-control simulation only; production security requires a backend. */
(function(){
  'use strict';
  const KEY='beehouse_accounts_v1';
  const ACTIVE_KEY='beehouse_interviewer_activity_v1';
  const base=()=>Array.isArray(window.USERS_DATABASE)?window.USERS_DATABASE.map(u=>({...u})):[];
  const read=()=>{try{const a=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(a)?a:[]}catch{return[]}};
  const all=()=>[...base(),...read()];
  const save=a=>{localStorage.setItem(KEY,JSON.stringify(a));window.dispatchEvent(new CustomEvent('beehouse:accounts-updated',{detail:a}));return a};
  function add(account){
    const a=read();
    if(!account.username||!account.password)throw new Error('กรุณาระบุชื่อผู้ใช้และรหัสผ่าน');
    if(all().some(x=>String(x.username).toLowerCase()===String(account.username).toLowerCase()))throw new Error('ชื่อผู้ใช้นี้มีอยู่แล้ว');
    const item={id:account.id||('u-'+Date.now()),username:String(account.username).trim(),password:String(account.password),role:account.role||'interviewer',name:account.name||account.username,avatar:account.avatar||'👤',enabled:account.enabled!==false,createdAt:new Date().toISOString()};
    a.push(item);save(a);return item;
  }
  function update(id,patch){const a=read();const i=a.findIndex(x=>String(x.id)===String(id));if(i<0)throw new Error('ไม่พบบัญชี');a[i]={...a[i],...patch};save(a);return a[i]}
  function remove(id){save(read().filter(x=>String(x.id)!==String(id)))}
  function setActivity(username,online){
    const a=(()=>{try{return JSON.parse(localStorage.getItem(ACTIVE_KEY)||'{}')}catch{return{}}})();
    if(online)a[username]={username,lastSeen:Date.now(),online:true}; else delete a[username];
    localStorage.setItem(ACTIVE_KEY,JSON.stringify(a));window.dispatchEvent(new CustomEvent('beehouse:activity-updated'));
  }
  function heartbeat(user){if(!user||user.role!=='interviewer')return null;const tick=()=>setActivity(user.username,true);tick();const timer=setInterval(tick,10000);window.addEventListener('beforeunload',()=>{clearInterval(timer);setActivity(user.username,false)},{once:true});return timer}
  function activity(){try{return JSON.parse(localStorage.getItem(ACTIVE_KEY)||'{}')}catch{return{}}}
  function isOnline(username){const x=activity()[username];return !!(x&&Date.now()-Number(x.lastSeen||0)<25000)}
  window.BeeHouseAccounts={KEY,ACTIVE_KEY,all,read,add,update,remove,heartbeat,setActivity,activity,isOnline};
})();
