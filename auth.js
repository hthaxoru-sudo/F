// Static GitHub Pages authentication UI. Not a secure production auth system.
async function handleLogin(event){
 event.preventDefault();event.stopImmediatePropagation();
 const username=document.getElementById('username').value.trim(),password=document.getElementById('password').value,alertBox=document.getElementById('alert-box'),button=document.querySelector('#login-form button[type="submit"]');
 try{
  if(button){button.disabled=true;button.style.opacity='.7'}
  const users=window.BeeHouseAccounts?window.BeeHouseAccounts.all():((window.USERS_DATABASE||[]));
  const user=users.find(u=>String(u.username)===username&&String(u.password)===password&&u.enabled!==false);
  if(!user)throw new Error('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง หรือบัญชีถูกปิดใช้งาน');
  const safe={id:user.id||user.username,username:user.username,role:user.role,name:user.name,avatar:user.avatar};
  sessionStorage.setItem('currentUser',JSON.stringify(safe));
  if(user.role==='interviewer'&&window.BeeHouseAccounts)window.BeeHouseAccounts.setActivity(user.username,true);
  showAlert('เข้าสู่ระบบสำเร็จ กำลังเปิดพื้นที่ของคุณ...','success');
  setTimeout(()=>{location.href=user.role==='interviewer'?'interviewer-dashboard.html':'admin-dashboard.html'},350);
 }catch(e){showAlert(e.message||'เข้าสู่ระบบไม่สำเร็จ','error');if(button){button.disabled=false;button.style.opacity=''}}
}
function showAlert(message,type){const a=document.getElementById('alert-box');if(!a)return;a.textContent=message;a.className=`alert-box ${type}`;a.style.display='block'}
