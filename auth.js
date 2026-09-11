// Node.js authentication client
async function handleLogin(event){
  event.preventDefault();
  const username=document.getElementById('username').value.trim();
  const password=document.getElementById('password').value;
  const box=document.getElementById('alert-box');
  const show=(m,bad=true)=>{box.textContent=m;box.style.display='block';box.className='alert-box '+(bad?'error':'success')};
  try{
    const r=await BeeHouseAPI.fetch('/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username,password})});
    const d=await r.json();
    if(!r.ok)throw new Error(d.error||'เข้าสู่ระบบไม่สำเร็จ');
    sessionStorage.setItem('currentUser',JSON.stringify(d.user));
    if(d.user.role==='interviewer') location.href='interviewer-dashboard.html';
    else if(d.user.role==='super_admin') location.href='admin-dashboard.html';
    else location.href='index.html';
  }catch(e){show('❌ '+e.message,true)}
}
async function logout(){
  try{await BeeHouseAPI.fetch('/api/auth/logout',{method:'POST'})}catch{}
  sessionStorage.removeItem('currentUser');location.href='login.html';
}
window.handleLogin=handleLogin;window.logout=logout;