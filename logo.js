/* BeeHouse logo fallback: works on GitHub Pages even when the assets folder is cached/missing. */
(function(){
  'use strict';
  const svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ff5e97"/><stop offset="1" stop-color="#ff9a8b"/></linearGradient></defs><rect x="8" y="8" width="112" height="112" rx="30" fill="url(#g)"/><path d="M38 44h52v12H38zm0 18h52v12H38zm0 18h34v12H38z" fill="#fff"/><circle cx="91" cy="86" r="11" fill="#fff"/><circle cx="88" cy="83" r="3" fill="#ff5e97"/><path d="M98 77l10-8M99 95l10 8" stroke="#fff" stroke-width="5" stroke-linecap="round"/></svg>';
  const fallback='data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(svg);
  window.BeeHouseLogoFallback=fallback;
  window.addEventListener('error',function(e){const t=e.target;if(t&&t.tagName==='IMG'&&t.src!==fallback)t.src=fallback;},true);
  function fix(root=document){
    root.querySelectorAll('img[data-beehouse-logo], img.brand-logo img, .brand-icon img, .footer-logo img, .loading-bee img, .banner-icon img, .hero-badge-logo').forEach(img=>{
      if(img.dataset.logoFallbackBound)return;
      img.dataset.logoFallbackBound='1';
      img.addEventListener('error',()=>{ if(img.src!==fallback) img.src=fallback; });
      if(!img.getAttribute('src')) img.src=fallback;
    });
  }
  window.BeeHouseFixLogos=fix;
  function fixFavicon(){let l=document.querySelector('link[rel="icon"]');if(!l){l=document.createElement('link');l.rel='icon';document.head.appendChild(l)} if(!l.dataset.beehouseCustomIcon) l.href=fallback;}
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fixFavicon,{once:true}); else fixFavicon();
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>fix(),{once:true}); else fix();
})();
