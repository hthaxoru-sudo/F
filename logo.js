/* BeeHouse centralized branding for GitHub Pages.
   One logo source for public pages + admin. The CMS value wins; fallback is embedded. */
(function(){
  'use strict';
  const svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ff5e97"/><stop offset="1" stop-color="#9b5cff"/></linearGradient></defs><rect x="8" y="8" width="112" height="112" rx="30" fill="url(#g)"/><path d="M38 42h52v11H38zm0 17h52v11H38zm0 17h35v11H38z" fill="#fff"/><circle cx="91" cy="82" r="10" fill="#fff"/><circle cx="88" cy="79" r="3" fill="#ff5e97"/><path d="M98 74l10-7M98 90l10 7" stroke="#fff" stroke-width="5" stroke-linecap="round"/></svg>';
  const fallback='data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(svg);
  window.BeeHouseLogoFallback=fallback;
  function currentLogo(){
    try{
      const s=window.BeeHouseCMS&&window.BeeHouseCMS.site;
      const v=s&&s.general&&s.general.logo;
      return (typeof v==='string'&&v.trim())?v.trim():fallback;
    }catch(_){return fallback;}
  }
  function applyBrand(root=document){
    const src=currentLogo();
    root.querySelectorAll('img[data-beehouse-logo], .brand-logo img, .brand-icon img, .footer-logo img, .loading-bee img, .banner-icon img, .hero-badge-logo').forEach(img=>{
      img.dataset.logoManaged='1';
      img.dataset.beehouseFallback=fallback;
      if(img.src!==src) img.src=src;
      if(!img.dataset.logoErrorBound){img.dataset.logoErrorBound='1';img.addEventListener('error',()=>{if(img.src!==fallback)img.src=fallback;});}
    });
    root.querySelectorAll('link[rel="icon"], link[data-beehouse-favicon]').forEach(link=>link.href=src);
  }
  window.BeeHouseFixLogos=applyBrand;
  window.addEventListener('error',e=>{const t=e.target;if(t&&t.tagName==='IMG'&&t.src!==fallback)t.src=fallback;},true);
  const run=()=>applyBrand(document);
  window.addEventListener('beehouse:ready',run);
  window.addEventListener('beehouse:site-updated',run);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
})();
