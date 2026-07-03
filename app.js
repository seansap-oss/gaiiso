(function(){
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const DATA=window.GAAISO_DATA||{};
  const IG=DATA.instagram||'https://www.instagram.com/gaaiso/';
  const LS={
    notes:'gaaiso_notes_v1',
    gallery:'gaaiso_gallery_v1',
    products:'gaaiso_products_v1',
    home:'gaaiso_homepage_v2',
    design:'gaaiso_design_v2',
    hero:'gaaiso_hero_media_v2',
    video:'gaaiso_video_v2',
    galleryFull:'gaaiso_gallery_full_v2',
    productsFull:'gaaiso_products_full_v2'
  };
  function readJSON(key,fallback){try{const raw=localStorage.getItem(key);return raw?JSON.parse(raw):fallback}catch{return fallback}}
  function escapeHTML(v){return String(v??'').replace(/[&<>'"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[m]))}
  function toast(msg){let t=$('.toast'); if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t)} t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2600)}
  function extraArr(key){const legacy=LS[key];return readJSON(legacy,[])}
  function dataWithFull(baseKey,fullKey,legacyKey){const full=readJSON(LS[fullKey],null); if(Array.isArray(full))return full; return [...(DATA[baseKey]||[]),...extraArr(legacyKey)];}
  function getHeroItems(){const full=readJSON(LS.hero,null);return Array.isArray(full)&&full.length?full.filter(x=>x.active!==false):((DATA.hero||[]).filter(x=>x.active!==false));}
  function getVideo(){const v=readJSON(LS.video,null);return v&&v.enabled&&v.src?v:null;}
  function applyDesign(){
    const d=readJSON(LS.design,{});
    const root=document.documentElement;
    if(d.backgroundColor)root.style.setProperty('--paper',d.backgroundColor);
    if(d.cardColor)root.style.setProperty('--paper2',d.cardColor);
    if(d.inkColor)root.style.setProperty('--ink',d.inkColor);
    if(d.primaryColor)root.style.setProperty('--clay',d.primaryColor);
    if(d.secondaryColor)root.style.setProperty('--sage',d.secondaryColor);
    if(d.buttonColor){root.style.setProperty('--charcoal',d.buttonColor)}
    if(d.fontFamily){
      const map={inter:'Inter, system-ui, -apple-system, Segoe UI, sans-serif',serif:'"Cormorant Garamond", Georgia, serif',system:'system-ui, -apple-system, Segoe UI, sans-serif'};
      document.body.style.fontFamily=map[d.fontFamily]||map.inter;
    }
    if(d.logoText){$$('.brand-name').forEach(el=>el.textContent=d.logoText)}
    if(d.logoImage){$$('.brand-mark').forEach(el=>{el.innerHTML=`<img src="${escapeHTML(d.logoImage)}" alt="${escapeHTML(d.logoText||'GAAISO')} logo" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`;})}
  }
  function applyHomeText(){
    const h=readJSON(LS.home,{});
    if(!Object.keys(h).length)return;
    const hero=$('.hero-copy');
    if(hero){
      const eyebrow=$('.eyebrow',hero), title=$('h1',hero), lead=$('.lead',hero), actions=$$('.actions .btn',hero), note=$('.mini-note span:last-child',hero);
      if(eyebrow&&h.eyebrow)eyebrow.textContent=h.eyebrow;
      if(title&&h.heroTitle)title.textContent=h.heroTitle;
      if(lead&&h.heroSubtitle)lead.textContent=h.heroSubtitle;
      if(actions[0]&&h.primaryButton)actions[0].textContent=h.primaryButton;
      if(actions[1]&&h.secondaryButton)actions[1].textContent=h.secondaryButton;
      if(note&&h.miniNote)note.textContent=h.miniNote;
    }
    const aboutCard=$('.about-grid .card');
    if(aboutCard){
      const title=$('h2',aboutCard), ps=$$('p',aboutCard);
      if(title&&h.aboutTitle)title.textContent=h.aboutTitle;
      if(ps[0]&&h.aboutText)ps[0].textContent=h.aboutText;
      if(ps[1]&&h.aboutSecondText)ps[1].textContent=h.aboutSecondText;
    }
    if(h.footerBio){$$('.foot div:first-child p').forEach(el=>el.textContent=h.footerBio)}
  }
  function nav(){const h=$('.hamb'),m=$('.mobile-menu'); if(h&&m){h.addEventListener('click',()=>m.classList.toggle('open')); m.addEventListener('click',e=>{if(e.target.tagName==='A')m.classList.remove('open')})} $$('[data-instagram]').forEach(a=>a.href=IG)}
  function footer(){const saved=readJSON(LS.home,{}); const c={...(DATA.contact||{}),...(saved.contact||{})}; $$('[data-address]').forEach(e=>e.textContent=c.address||'Imphal, Manipur, India'); $$('[data-phone]').forEach(e=>e.textContent=c.phone||'+91 XXXXX XXXXX'); $$('[data-email]').forEach(e=>e.textContent=c.email||'hello@gaaiso.com'); $$('[data-hours]').forEach(e=>e.textContent=c.hours||'10:00 AM – 5:00 PM')}
  function hero(){
    const stage=$('#heroStage'),frame=$('#photoFrame'),dots=$('#dots'); if(!stage||!frame||!dots)return; const items=getHeroItems(); if(!items.length)return;
    frame.innerHTML=items.map((x,i)=>`<div class="slide ${i===0?'active':''}"><img src="${escapeHTML(x.src)}" alt="${escapeHTML((x.title||'GAAISO')+' '+(x.text||''))}"><div class="caption"><b>${escapeHTML(x.title||'GAAISO')}</b><span>${escapeHTML(x.text||'Handcrafted collection')}</span></div></div>`).join('');
    dots.innerHTML=''; let current=0,timer,startX=0; items.forEach((_,i)=>{const b=document.createElement('button');b.className='dot'+(i===0?' active':'');b.setAttribute('aria-label','Go to photo '+(i+1));b.onclick=()=>go(i,true);dots.appendChild(b)});
    const slides=$$('.slide',frame), dotEls=$$('.dot',dots);
    function go(i,manual=false){slides[current]?.classList.remove('active');dotEls[current]?.classList.remove('active');current=(i+slides.length)%slides.length;slides[current]?.classList.add('active');dotEls[current]?.classList.add('active');frame.style.transform=`rotate(${current%2?'.55':'-.55'}deg)`; if(manual)restart()}
    function nextRandom(){let n;if(slides.length<2)return;do{n=Math.floor(Math.random()*slides.length)}while(n===current);go(n)}
    function restart(){clearInterval(timer);timer=setInterval(nextRandom,3000)}
    frame.addEventListener('pointerdown',e=>{startX=e.clientX;clearInterval(timer)},{passive:true});
    frame.addEventListener('pointerup',e=>{const dx=e.clientX-startX;if(Math.abs(dx)>38)go(current+(dx<0?1:-1),true);else restart()},{passive:true});
    addVideoButton(); restart();
  }
  function addVideoButton(){
    const v=getVideo(); if(!v)return; const heroCopy=$('.hero-copy'); if(!heroCopy||$('#gaaisoVideoBtn'))return;
    const actions=$('.actions',heroCopy); const btn=document.createElement('button'); btn.id='gaaisoVideoBtn'; btn.type='button'; btn.className='btn video-btn'; btn.innerHTML='▶ '+escapeHTML(v.label||'Watch Video');
    if(actions)actions.appendChild(btn); else heroCopy.appendChild(btn);
    let modal=$('#gaaisoVideoModal'); if(!modal){modal=document.createElement('div');modal.id='gaaisoVideoModal';modal.className='video-modal';modal.innerHTML='<div class="video-card"><button class="video-close" aria-label="Close video">×</button><video controls playsinline></video></div>';document.body.appendChild(modal)}
    const video=$('video',modal); video.src=v.src;
    btn.onclick=()=>{modal.classList.add('open'); video.currentTime=0; video.play().catch(()=>{});};
    modal.onclick=e=>{if(e.target===modal||e.target.className==='video-close'){video.pause();modal.classList.remove('open')}};
  }
  function lightbox(){let lb=$('.lightbox'); if(!lb){lb=document.createElement('div');lb.className='lightbox';lb.innerHTML='<div class="lightbox-card"><button class="close" aria-label="Close">×</button><div class="lightbox-img"><img alt=""></div><div class="lightbox-text"><b></b><span></span></div></div>';document.body.appendChild(lb)} const img=$('.lightbox img'),b=$('.lightbox b'),s=$('.lightbox span'); lb.addEventListener('click',e=>{if(e.target===lb||e.target.className==='close')lb.classList.remove('open')}); document.addEventListener('keydown',e=>{if(e.key==='Escape')lb.classList.remove('open')}); return {open:(src,title,cat)=>{img.src=src;b.textContent=title;s.textContent=cat||'';lb.classList.add('open')}}}
  function renderGallery(){const root=$('#galleryGrid'); if(!root)return; const items=dataWithFull('gallery','galleryFull','gallery'); const cats=['All',...new Set(items.map(i=>i.category).filter(Boolean))]; const filters=$('#galleryFilters'); let active='All'; const lb=lightbox(); function draw(){root.innerHTML=items.filter(i=>active==='All'||i.category===active).map(i=>`<figure data-src="${escapeHTML(i.src)}" data-title="${escapeHTML(i.title)}" data-cat="${escapeHTML(i.category||'')}"><img src="${escapeHTML(i.src)}" alt="${escapeHTML(i.title)}"><figcaption>${escapeHTML(i.title)}</figcaption></figure>`).join(''); $$('figure',root).forEach(f=>f.onclick=()=>lb.open(f.dataset.src,f.dataset.title,f.dataset.cat))} if(filters){filters.innerHTML=cats.map(c=>`<button class="filter ${c===active?'active':''}" data-cat="${escapeHTML(c)}">${escapeHTML(c)}</button>`).join(''); filters.onclick=e=>{if(e.target.matches('.filter')){active=e.target.dataset.cat;$$('.filter',filters).forEach(x=>x.classList.toggle('active',x.dataset.cat===active));draw()}}} draw()}
  function renderProducts(){const root=$('#productGrid'); if(!root)return; root.innerHTML=dataWithFull('products','productsFull','products').map(p=>`<article class="product"><div class="product-img"><img src="${escapeHTML(p.src)}" alt="${escapeHTML(p.name)}"></div><div class="product-body"><span class="status">${escapeHTML(p.status||'Available')}</span><h3>${escapeHTML(p.name)}</h3><p>${escapeHTML(p.tag||'')}</p><p><strong>${escapeHTML(p.price||'Price on request')}</strong></p><a class="btn dark full" href="${IG}" target="_blank" rel="noopener">Enquire on Instagram</a></div></article>`).join('')}
  function guestbook(){const list=$('#guestList'),form=$('#guestForm'); if(!list&&!form)return; function notes(){const local=readJSON(LS.notes,[]).filter(n=>!n.status||n.status==='approved'); return [...(DATA.notes||[]),...local]} function draw(){if(list)list.innerHTML=notes().map(n=>`<div class="note"><b>${escapeHTML(n.name)}</b><p>${escapeHTML(n.message)}</p><span>${escapeHTML(n.city||'Guest')}</span></div>`).join('')} draw(); if(form)form.addEventListener('submit',e=>{e.preventDefault();const fd=new FormData(form);const n={name:fd.get('name')||'Guest',city:fd.get('city')||'',message:fd.get('message')||'',status:'pending',createdAt:new Date().toISOString()}; if(!n.message.trim())return toast('Please write a message.'); const arr=readJSON(LS.notes,[]);arr.unshift(n);localStorage.setItem(LS.notes,JSON.stringify(arr));form.reset();draw();toast('Message saved for admin approval on this device.')})}
  function enquiry(){const f=$('#enquiryForm'); if(!f)return; f.addEventListener('submit',e=>{e.preventDefault();const fd=new FormData(f);const msg=`Hello GAAISO, I am interested in ${fd.get('product')||'your collection'}. Name: ${fd.get('name')||''}. Phone/Email: ${fd.get('contact')||''}. Message: ${fd.get('message')||''}`; window.open(IG,'_blank'); toast('Opening Instagram for enquiry.')})}
  function injectVideoCSS(){if($('#gaaisoVideoCSS'))return; const st=document.createElement('style'); st.id='gaaisoVideoCSS'; st.textContent='.video-btn{background:rgba(255,250,242,.72);backdrop-filter:blur(12px)}.video-modal{position:fixed;inset:0;background:rgba(25,23,19,.88);z-index:260;display:none;align-items:center;justify-content:center;padding:18px}.video-modal.open{display:flex}.video-card{position:relative;width:min(980px,96vw);background:#0f0e0c;border-radius:24px;overflow:hidden;box-shadow:0 30px 90px rgba(0,0,0,.35)}.video-card video{display:block;width:100%;max-height:82vh;background:#000}.video-close{position:absolute;right:12px;top:12px;z-index:2;border:none;border-radius:50%;width:42px;height:42px;background:#fffaf2;color:#191713;font-size:28px;cursor:pointer}'; document.head.appendChild(st)}
  document.addEventListener('DOMContentLoaded',()=>{injectVideoCSS();applyDesign();nav();footer();applyHomeText();hero();renderGallery();renderProducts();guestbook();enquiry();});
})();
