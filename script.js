/* BeeHouse visual helpers. Content is rendered by dynamic.js from BeeHouseCMS. */
(function(){
  function setupScrollSpy(){
    const nav=()=>document.querySelectorAll('.nav-item:not([target="_blank"])');
    window.addEventListener('scroll',()=>{const y=window.scrollY+180;document.querySelectorAll('section[id]').forEach(s=>{if(y>=s.offsetTop&&y<s.offsetTop+s.offsetHeight){nav().forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+s.id))}})});
  }
  window.addEventListener('DOMContentLoaded',()=>{
    setupScrollSpy();
    const bar=document.getElementById('progress-bar'),txt=document.getElementById('progress-text');
    if(!bar)return;let p=0;const i=setInterval(()=>{p=Math.min(100,p+20);bar.style.width=p+'%';if(txt)txt.textContent=p+'%';if(p>=100){clearInterval(i);setTimeout(()=>{const l=document.getElementById('loading-screen'),a=document.getElementById('app');if(l)l.style.display='none';if(a)a.style.display='block'},150)}},80);
  });
})();
