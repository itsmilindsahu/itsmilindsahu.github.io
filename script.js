// ===================================================
// ENHANCED CURSOR
// ===================================================
(function() {
  var cursor = document.querySelector('.cursor');
  var ring   = document.querySelector('.cursor-ring');
  if (!cursor || !ring) return;
  var isTouchOnly = window.matchMedia('(hover:none) and (pointer:coarse)').matches;
  if (isTouchOnly) {
    cursor.style.display = 'none';
    ring.style.display   = 'none';
    document.body.style.cursor = 'auto';
    return;
  }
  var mx = 0, my = 0, rx = 0, ry = 0, trailTimer = null;
  document.addEventListener('mousemove', function(e) {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
    clearTimeout(trailTimer);
    trailTimer = setTimeout(function() {
      var t = document.createElement('div');
      t.className = 'cursor-trail';
      t.style.left = mx + 'px';
      t.style.top  = my + 'px';
      document.body.appendChild(t);
      setTimeout(function() { try { t.remove(); } catch(ee) {} }, 500);
    }, 30);
  });
  (function animRing() {
    rx += (mx - rx) * 0.1;
    ry += (my - ry) * 0.1;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animRing);
  })();
  var sel = "a, button, [role=\"button\"], .filter-btn, .project-card, .gallery-item, .cert-dark-item, .dog-pick-btn, .dog-pet-btn";
  document.addEventListener('mouseover', function(e) {
    if (e.target.closest(sel)) { cursor.classList.add('cursor-hover'); ring.classList.add('cursor-hover'); }
  });
  document.addEventListener('mouseout', function(e) {
    if (e.target.closest(sel)) { cursor.classList.remove('cursor-hover'); ring.classList.remove('cursor-hover'); }
  });
  document.addEventListener('mousedown', function() { cursor.classList.add('cursor-click'); });
  document.addEventListener('mouseup',   function() { cursor.classList.remove('cursor-click'); });
})();

// ═══════════════════════════════════════
// HAMBURGER
// ═══════════════════════════════════════
const ham = document.querySelector('.hamburger');
const navL = document.querySelector('.nav-links');
if (ham) ham.addEventListener('click', () => navL.classList.toggle('open'));

// ═══════════════════════════════════════
// TERMINAL TYPEWRITER
// ═══════════════════════════════════════
const termLines = [
  { p:'$', t:'whoami' },
  { p:'',  t:'milind_sahu @ iiser_tirupati', c:'terminal-output' },
  { p:'$', t:'cat research.txt' },
  { p:'>', t:'Quant Math / Optimization / ML', c:'terminal-output' },
  { p:'>', t:'Energy Systems Analytics',       c:'terminal-output' },
  { p:'$', t:'echo $IDENTITY' },
  { p:'',  t:'AXL — Axiom Labs :: est. 2025',  c:'terminal-output' },
];
const tb = document.querySelector('.terminal-body');
if (tb) {
  let i = 0;
  function tl() {
    if (i >= termLines.length) {
      const s = document.createElement('span');
      s.className = 'terminal-cursor';
      tb.appendChild(s);
      return;
    }
    const l = termLines[i++];
    const d = document.createElement('div');
    d.className = 'terminal-line' + (l.c ? ' ' + l.c : '');
    if (l.p) {
      const p = document.createElement('span');
      p.className = 'prompt'; p.textContent = l.p; d.appendChild(p);
    }
    const t = document.createElement('span'); t.textContent = l.t; d.appendChild(t);
    tb.appendChild(d);
    setTimeout(tl, 240);
  }
  setTimeout(tl, 800);
}

// ═══════════════════════════════════════
// FADE IN OBSERVER
// ═══════════════════════════════════════
const obs = new IntersectionObserver(
  es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
  { threshold: 0.08 }
);
document.querySelectorAll('.fade-in').forEach(el => obs.observe(el));

// ═══════════════════════════════════════
// THEME TOGGLE
// ═══════════════════════════════════════
const themeBtn = document.querySelector('.theme-toggle');
const saved = localStorage.getItem('axl-theme') || 'light';
if (saved === 'dark') { document.body.classList.add('dark'); if (themeBtn) themeBtn.textContent = '☀'; }
else { if (themeBtn) themeBtn.textContent = '◑'; }
if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const d = document.body.classList.contains('dark');
    themeBtn.textContent = d ? '☀' : '◑';
    localStorage.setItem('axl-theme', d ? 'dark' : 'light');
  });
}

// ═══════════════════════════════════════
// PROJECT FILTER
// ═══════════════════════════════════════
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card[data-category]');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    projectCards.forEach(card => {
      card.style.display =
        (filter === 'all' || card.dataset.category.includes(filter)) ? '' : 'none';
    });
  });
});



// ══════════════════════════════════════════════════════════════════════
//  RESEARCH GALAXY  ·  Canvas 2D  ·  No dependencies
// ══════════════════════════════════════════════════════════════════════
function buildGalaxy() {
  var el = document.getElementById('research-graph');
  if (!el || el._built) return;
  el._built = true;
  el.innerHTML = '';

  // ── Canvas setup ──────────────────────────────────────────────────
  var cv = document.createElement('canvas');
  // Do NOT set CSS width/height — let JS own all dimensions
  cv.style.display = 'block';
  el.appendChild(cv);

  var ctx = cv.getContext('2d');
  var W = 900, H = 540;

  function setSize() {
    W = el.offsetWidth || 900;
    H = el.offsetHeight || 540;
    cv.width  = W;   // raw pixels — no DPR scaling to keep math simple
    cv.height = H;
    cv.style.width  = W + 'px';
    cv.style.height = H + 'px';
  }
  setSize();

  // ── Data ──────────────────────────────────────────────────────────
  var P = [
    {n:'Quant Mathematics', f:'∀ε>0, ∃δ: |f(x)−L|<ε',        c:'#1a56db', r:13, o:90,  s:.0035, ph:0,    t:.18},
    {n:'Optimization',      f:'min f(x) s.t. g(x)≤0',         c:'#3a7fff', r:10, o:118, s:.0024, ph:2.1,  t:.08},
    {n:'Statistics',        f:'Var(X)=E[X²]−(E[X])²',         c:'#5a9fff', r:8,  o:145, s:.0018, ph:4.2,  t:.22},
    {n:'Machine Learning',  f:'∇θ L→θ*=argmin L(θ)',           c:'#00c896', r:16, o:188, s:.0013, ph:1.0,  t:.12, ring:true},
    {n:'Energy Analytics',  f:'ΔE=P·Δt | NILM≡f(V,I)',         c:'#00e0a8', r:11, o:228, s:.0009, ph:3.7,  t:.20},
    {n:'Random Forest',     f:'ŷ=(1/T)Σhᵢ(x)',                 c:'#9c7ef0', r:8,  o:268, s:.0007, ph:0.5,  t:.35},
    {n:'LSTM Networks',     f:'cₜ=fₜ⊙cₜ₋₁+iₜ⊙c̃ₜ',            c:'#b090ff', r:7,  o:300, s:.0006, ph:2.8,  t:.18},
    {n:'Time-Series',       f:'Xₜ=μ+ΣφᵢXₜ₋ᵢ+εₜ',              c:'#7c5fe6', r:7,  o:330, s:.0005, ph:5.1,  t:.28},
    {n:'Anomaly Detection', f:'score(x)=−log P(x|θ)',           c:'#a07af8', r:6,  o:358, s:.0004, ph:1.9,  t:.10},
  ];
  P.forEach(function(p){p.a=p.ph;});

  // Stars
  var stars=[];
  for(var i=0;i<180;i++) stars.push({x:Math.random(),y:Math.random(),r:.3+Math.random()*.9,b:Math.random()*Math.PI*2});

  // ── Camera ────────────────────────────────────────────────────────
  var tilt=.32, rot=0, zoom=1, auto=true;
  var drag=false, dx=0, dy=0;

  cv.addEventListener('mousedown',function(e){drag=true;dx=e.clientX;dy=e.clientY;auto=false;cv.style.cursor='grabbing';});
  window.addEventListener('mouseup',function(){drag=false;cv.style.cursor='grab';});
  window.addEventListener('mousemove',function(e){
    if(!drag)return;
    rot+=(e.clientX-dx)*.006; dx=e.clientX;
    tilt=Math.max(.05,Math.min(1.3,tilt-(e.clientY-dy)*.005)); dy=e.clientY;
  });
  cv.addEventListener('wheel',function(e){zoom=Math.max(.4,Math.min(2,zoom-e.deltaY*.0007));e.preventDefault();},{passive:false});
  cv.style.cursor='grab';

  // ── Tooltip ───────────────────────────────────────────────────────
  var tt=document.createElement('div');
  tt.style.cssText='position:absolute;display:none;pointer-events:none;background:rgba(2,2,12,.97);border:1px solid #1a56db;padding:11px 15px;font-family:"Space Mono",monospace;font-size:10px;box-shadow:0 0 24px rgba(26,86,219,.5);z-index:200;max-width:250px;';
  el.appendChild(tt);

  var hov=null;
  cv.addEventListener('mousemove',function(e){
    var r=el.getBoundingClientRect(), mx=e.clientX-r.left, my=e.clientY-r.top;
    hov=null;
    for(var i=0;i<P.length;i++){
      var p=P[i];
      if(!p.sx)continue;
      var d=Math.sqrt((mx-p.sx)*(mx-p.sx)+(my-p.sy)*(my-p.sy));
      if(d<p.sr+8){hov=p;break;}
    }
    if(hov){
      tt.innerHTML='<div style="font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#fff;margin-bottom:6px;">'+hov.n+'</div><div style="color:#5a9fff;line-height:1.7;">'+hov.f+'</div>';
      tt.style.display='block';
      tt.style.left=(mx+245>W?mx-255:mx+12)+'px';
      tt.style.top=Math.max(4,my-28)+'px';
      cv.style.cursor='pointer';
    } else {
      tt.style.display='none';
      cv.style.cursor=drag?'grabbing':'grab';
    }
  });
  cv.addEventListener('mouseleave',function(){tt.style.display='none';hov=null;});

  // ── Legend ────────────────────────────────────────────────────────
  var lg=document.createElement('div');
  lg.style.cssText='position:absolute;bottom:12px;right:12px;display:flex;flex-direction:column;gap:5px;pointer-events:none;z-index:10;';
  [['#1a56db','Math Foundations'],['#00c896','Applied Domains'],['#9c7ef0','ML Methods']].forEach(function(x){
    lg.insertAdjacentHTML('beforeend','<div style="display:flex;align-items:center;gap:6px;"><span style="width:7px;height:7px;border-radius:50%;background:'+x[0]+';box-shadow:0 0 6px '+x[0]+';flex-shrink:0;display:inline-block;"></span><span style="font-family:monospace;font-size:8px;letter-spacing:1.5px;text-transform:uppercase;color:#444;">'+x[1]+'</span></div>');
  });
  el.appendChild(lg);

  // ── Hint ──────────────────────────────────────────────────────────
  var hint=el.previousElementSibling;
  if(hint&&hint.classList.contains('graph-hint')) hint.textContent='Drag to rotate · Scroll to zoom · Hover planets';

  // ── Helpers ───────────────────────────────────────────────────────
  function proj(orb,angle,t2){
    var x3=Math.cos(angle+rot)*orb;
    var z3=Math.sin(angle+rot)*orb;
    var y3=Math.sin(angle*.65)*t2*16;
    var yp=y3*Math.cos(tilt)-z3*Math.sin(tilt);
    var zp=y3*Math.sin(tilt)+z3*Math.cos(tilt);
    var sc=zoom*Math.min(W,H)/800;
    return {x:W/2+x3*sc, y:H/2+yp*sc, z:zp, d:.7+.3*(zp/(orb+1))};
  }

  function rgb(hex){
    return parseInt(hex.slice(1,3),16)+','+parseInt(hex.slice(3,5),16)+','+parseInt(hex.slice(5,7),16);
  }

  function circle(x,y,r,fill){ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle=fill;ctx.fill();}

  function glow(x,y,r,col,a){
    var g=ctx.createRadialGradient(x,y,0,x,y,r);
    g.addColorStop(0,'rgba('+col+','+a+')');
    g.addColorStop(.5,'rgba('+col+','+(a*.15)+')');
    g.addColorStop(1,'rgba('+col+',0)');
    ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle=g;ctx.fill();
  }

  // ── Main loop ─────────────────────────────────────────────────────
  var tick=0;
  function draw(){
    requestAnimationFrame(draw);
    tick+=.014;
    if(auto) rot+=.0006;
    P.forEach(function(p){p.a+=p.s;});

    ctx.clearRect(0,0,W,H);
    ctx.fillStyle='#020206';
    ctx.fillRect(0,0,W,H);

    // Stars
    stars.forEach(function(s){
      s.b+=.018;
      var a=.12+.25*Math.sin(s.b);
      ctx.beginPath();ctx.arc(s.x*W,s.y*H,s.r,0,Math.PI*2);
      ctx.fillStyle='rgba(160,180,255,'+a+')';ctx.fill();
    });

    // Orbit rings
    P.forEach(function(p){
      var sc=zoom*Math.min(W,H)/800;
      var orb=p.o*sc;
      ctx.beginPath();
      for(var a=0;a<=Math.PI*2+.05;a+=.04){
        var pt=proj(p.o,a-rot,p.t);
        a<.04?ctx.moveTo(pt.x,pt.y):ctx.lineTo(pt.x,pt.y);
      }
      ctx.closePath();
      ctx.strokeStyle='rgba('+rgb(p.c)+',.12)';
      ctx.lineWidth=.7;ctx.stroke();
    });

    // Compute positions
    var pts=P.map(function(p){return proj(p.o,p.a,p.t);});

    // Depth sort
    var idx=P.map(function(_,i){return i;});
    idx.sort(function(a,b){return pts[a].z-pts[b].z;});

    // Sun
    var cx=W/2, cy=H/2;
    var sr=Math.max(14,26*zoom*Math.min(W,H)/800);
    var pulse=.85+.15*Math.sin(tick*2.8);
    glow(cx,cy,sr*5,'26,86,219',.28*pulse);
    var sg=ctx.createRadialGradient(cx-sr*.3,cy-sr*.3,sr*.05,cx,cy,sr);
    sg.addColorStop(0,'rgba(130,170,255,1)');
    sg.addColorStop(.55,'rgba(26,86,219,'+pulse+')');
    sg.addColorStop(1,'rgba(8,30,110,.85)');
    circle(cx,cy,sr,sg);
    ctx.font='bold '+Math.max(13,Math.round(sr*.72))+'px monospace';
    ctx.fillStyle='rgba(255,255,255,.95)';ctx.textAlign='center';
    ctx.shadowColor='#1a56db';ctx.shadowBlur=14;
    ctx.fillText('AXL',cx,cy+Math.max(13,Math.round(sr*.72))*.36);
    ctx.shadowBlur=0;

    // Planets
    idx.forEach(function(i){
      var p=P[i], pt=pts[i];
      var sc=Math.min(W,H)/800;
      var pr=Math.max(4, p.r*sc*zoom*(.72+.28*pt.d));
      p.sx=pt.x; p.sy=pt.y; p.sr=pr;
      var c=rgb(p.c), isH=(p===hov);

      glow(pt.x,pt.y,pr*(isH?5:3),c,isH?.5:.18);

      var bg=ctx.createRadialGradient(pt.x-pr*.3,pt.y-pr*.3,pr*.05,pt.x,pt.y,pr);
      bg.addColorStop(0,'rgba('+c+',.95)');
      bg.addColorStop(.6,'rgba('+c+',.7)');
      bg.addColorStop(1,'rgba('+c+',.25)');
      circle(pt.x,pt.y,pr,bg);

      if(p.ring){
        ctx.save();ctx.translate(pt.x,pt.y);
        ctx.scale(1,.3+.12*Math.abs(Math.sin(tilt)));
        ctx.beginPath();ctx.arc(0,0,pr*2.1,0,Math.PI*2);
        ctx.strokeStyle='rgba('+c+',.35)';ctx.lineWidth=pr*.6;ctx.stroke();
        ctx.restore();
      }

      var la=isH?1:(.4+.35*pt.d);
      var fs=Math.max(7,8*sc*zoom);
      ctx.font=fs+'px "Space Mono",monospace';
      ctx.fillStyle='rgba('+c+','+la+')';ctx.textAlign='center';
      ctx.shadowColor=p.c;ctx.shadowBlur=isH?8:3;
      ctx.fillText(p.n,pt.x,pt.y+pr+fs*1.5);
      ctx.shadowBlur=0;
    });
  }

  draw();

  window.addEventListener('resize',function(){setSize();});
}

function initGalaxy(){
  var el=document.getElementById('research-graph');
  if(!el||el._built) return;
  // Force explicit height so offsetHeight is never 0
  el.style.height='540px';
  // Give browser one frame to apply styles, then build
  requestAnimationFrame(function(){
    requestAnimationFrame(function(){
      buildGalaxy();
    });
  });
}

if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded', initGalaxy);
} else {
  initGalaxy();
}

// ═══════════════════════════════════════
// MOBILE SCROLL-REVEAL
// Adds .in-view to .fade-in elements as they enter viewport
// ═══════════════════════════════════════
(function(){
  if(!('IntersectionObserver' in window)) {
    // fallback: just show everything
    document.querySelectorAll('.fade-in').forEach(function(el){
      el.classList.add('in-view');
    });
    return;
  }
  var obs = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting) {
        e.target.classList.add('in-view');
        obs.unobserve(e.target);
      }
    });
  }, {threshold: 0.1, rootMargin: '0px 0px -40px 0px'});

  document.querySelectorAll('.fade-in').forEach(function(el){
    obs.observe(el);
  });
})();


// ===========================================
// PIXEL DOG SYSTEM
// ===========================================
(function() {

var DOG_DEFS = {
  corgi: {
    label: 'CORGI',
    A: '#e8a050', B: '#ffffff', C: '#222222', D: '#c07030', E: '#f5c88a', F: '#c07030',
    grid: [
      '    DDDD        ',
      '   DAAAAD       ',
      '  DAAAAAD  D  D ',
      ' DAAAAAAD DAAD  ',
      ' DAAAAAAD DAAD  ',
      ' DAAAAAAAAAAAD  ',
      ' DEAAAAAAAAE D  ',
      '  DEAAAAAAED    ',
      '  DAAAAAAAAAD   ',
      '  DAAAACCAAAD   ',
      '  DAAACCCCAAD   ',
      '  DAAACCCCAAD   ',
      '  DAAAAAAAAD    ',
      '   BDAAADDB     ',
      '  B D   D B     ',
      '  B D   D B     ',
    ],
  },
  shiba: {
    label: 'SHIBA',
    A: '#e0c090', B: '#ffffff', C: '#222222', D: '#4a3020', E: '#f5e0c0', F: '#c09060',
    grid: [
      '    DDDD        ',
      '   DAAAAD       ',
      '  DEAAAAD  D  D ',
      ' DEAAAAAD DAAD  ',
      ' DEAAAAAD DAAD  ',
      ' DEAAAAAAAAAD   ',
      ' DAAAAAAAAEED   ',
      '  DEAAAAAED     ',
      '  DAAAAAAAAAD   ',
      '  DAAAACCAAAD   ',
      '  DAAACCCCAAD   ',
      '  DAAACCCCAAD   ',
      '  DAAAAAAAAD    ',
      '   BDAAADDB     ',
      '  B D   D B     ',
      '  B D   D B     ',
    ],
  },
  cyber: {
    label: 'CYBER',
    A: '#0a1020', B: '#1a56db', C: '#00c896', D: '#5a8fff', E: '#030a18', F: '#2266ff',
    grid: [
      '    BBBB        ',
      '   BAAAAB       ',
      '  BAAAAB   B  B ',
      ' BAAAAAB  BAAB  ',
      ' BAAAAAB  BAAB  ',
      ' BAAAAAAAAAB    ',
      ' BAAAAAAAAAB    ',
      '  BAAAAAAB      ',
      '  BAAAAAAAAB    ',
      '  BAAACCAAAB    ',
      '  BAAACCCCAB    ',
      '  BAAACCCCAB    ',
      '  BAAAAAAB      ',
      '   BBAABBB      ',
      '   B B  B B     ',
      '   F B  B F     ',
    ],
  },
  retro: {
    label: 'GAMEBOY',
    A: '#9bbc0f', B: '#8bac0f', C: '#0f380f', D: '#306230', E: '#9bbc0f', F: '#0f380f',
    grid: [
      '    CCCC        ',
      '   CAAAAC       ',
      '  CAAAAC   C  C ',
      ' CAAAAAC  CAAC  ',
      ' CAAAAAC  CAAC  ',
      ' CAAAAAAAAC     ',
      ' CAAAAAAAAC     ',
      '  CAAAAAC       ',
      '  CAAAAAAC      ',
      '  CAAACCAAC     ',
      '  CAACCCCAC     ',
      '  CAACCCCAC     ',
      '  CAAAAAC       ',
      '   CCAACC       ',
      '   C C  C C     ',
      '   D C  C D     ',
    ],
  },
};

function drawDog(ctx, def, px, frame, happy) {
  var grid = def.grid;
  var colorMap = { A: def.A, B: def.B, C: def.C, D: def.D, E: def.E, F: def.F };
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  var legOffsets = [0, 1, 0, -1];
  grid.forEach(function(row, y) {
    for (var x = 0; x < row.length && x < 16; x++) {
      var ch = row[x];
      if (ch === ' ') continue;
      var col = colorMap[ch];
      if (!col) continue;
      var legShift = (y >= 13) ? legOffsets[(frame + (x % 2 === 0 ? 0 : 2)) % 4] : 0;
      ctx.fillStyle = col;
      ctx.fillRect(x * px, y * px + legShift, px, px);
    }
  });
  if (happy) {
    ctx.fillStyle = def.D || '#c07030';
    var wag = frame % 2 === 0 ? 1 : -1;
    var tx = 14 + wag;
    if (tx >= 0 && tx < 16) ctx.fillRect(tx * px, 2 * px, px, px);
  }
}

function makeCanvas(w, h) {
  var cv = document.createElement('canvas');
  cv.width = w; cv.height = h;
  cv.style.width  = w + 'px';
  cv.style.height = h + 'px';
  cv.style.imageRendering = 'pixelated';
  return cv;
}

function buildDogOverlay() {
  if (sessionStorage.getItem('dog-dismissed')) return;
  if (document.getElementById('dog-intro-overlay')) return;

  var PX_PICK = 5, PX_STAGE = 5, GRID = 16, GOAL = 10;

  var overlay = document.createElement('div');
  overlay.id = 'dog-intro-overlay';

  var wrap = document.createElement('div');
  wrap.className = 'dog-game-wrap';
  wrap.innerHTML =
    '<div class="dog-intro-eyebrow">welcome</div>' +
    '<div class="dog-intro-title">PICK YOUR BUDDY</div>' +
    '<div class="dog-intro-sub">your companion stays on every page</div>';
  overlay.appendChild(wrap);

  var selectedDog = localStorage.getItem('axl-dog') || 'corgi';
  var picker = document.createElement('div');
  picker.className = 'dog-picker';
  var pickerBtns = {};
  var stageCtx;

  Object.keys(DOG_DEFS).forEach(function(key) {
    var def = DOG_DEFS[key];
    var btn = document.createElement('button');
    btn.className = 'dog-pick-btn' + (key === selectedDog ? ' selected' : '');
    var cv = makeCanvas(GRID * PX_PICK, GRID * PX_PICK);
    cv.className = 'dog-pick-canvas';
    drawDog(cv.getContext('2d'), def, PX_PICK, 0, false);
    var lbl = document.createElement('div');
    lbl.className = 'dog-pick-label';
    lbl.textContent = def.label;
    btn.appendChild(cv); btn.appendChild(lbl);
    btn.addEventListener('click', function() {
      Object.keys(pickerBtns).forEach(function(k) { pickerBtns[k].classList.remove('selected'); });
      btn.classList.add('selected');
      selectedDog = key;
      localStorage.setItem('axl-dog', key);
      if (stageCtx) drawDog(stageCtx, DOG_DEFS[selectedDog], PX_STAGE, 0, false);
    });
    pickerBtns[key] = btn;
    picker.appendChild(btn);
  });
  wrap.appendChild(picker);

  var stage = document.createElement('div');
  stage.className = 'dog-game-stage';
  var stageCv = makeCanvas(GRID * PX_STAGE, GRID * PX_STAGE);
  stageCv.className = 'dog-stage-canvas';
  stageCv.style.left = '50%';
  stageCv.style.transform = 'translateX(-50%)';
  stageCv.style.bottom = '44px';
  stageCv.style.top = 'auto';
  stageCtx = stageCv.getContext('2d');
  drawDog(stageCtx, DOG_DEFS[selectedDog], PX_STAGE, 0, false);

  var heartsDiv = document.createElement('div');
  heartsDiv.className = 'dog-stage-hearts';

  var completeMsg = document.createElement('div');
  completeMsg.className = 'dog-complete-msg';
  completeMsg.innerHTML =
    '<div class="dog-complete-title">BEST FRIENDS!</div>' +
    '<div class="dog-complete-sub">launching your buddy...</div>';

  stage.appendChild(stageCv);
  stage.appendChild(heartsDiv);
  stage.appendChild(completeMsg);
  wrap.appendChild(stage);

  var happyWrap = document.createElement('div');
  happyWrap.className = 'happiness-wrap';
  happyWrap.innerHTML =
    '<div class="happiness-label"><span>HAPPINESS</span><span id="happy-pct">0%</span></div>' +
    '<div class="happiness-track"><div class="happiness-fill" id="happy-fill"></div></div>';
  wrap.appendChild(happyWrap);

  var actionRow = document.createElement('div');
  actionRow.className = 'dog-action-row';
  var petBtn  = document.createElement('button');
  petBtn.className  = 'dog-pet-btn';
  petBtn.textContent = 'PAT THE DOG \u2665';
  var skipBtn = document.createElement('button');
  skipBtn.className = 'dog-skip-btn';
  skipBtn.textContent = 'SKIP \u2192';
  actionRow.appendChild(petBtn);
  actionRow.appendChild(skipBtn);
  wrap.appendChild(actionRow);
  document.body.appendChild(overlay);

  var happiness = 0, frame = 0, complete = false, animFrame, lastFrameT = 0;

  function animStage(ts) {
    if (ts - lastFrameT > 200) {
      frame = (frame + 1) % 4;
      drawDog(stageCtx, DOG_DEFS[selectedDog], PX_STAGE, frame, happiness >= GOAL);
      lastFrameT = ts;
    }
    animFrame = requestAnimationFrame(animStage);
  }
  animFrame = requestAnimationFrame(animStage);

  function spawnHeart() {
    var h = document.createElement('div');
    h.className = 'heart-particle';
    var hearts = ['\u2665', '\u2661', '\u2764', '!', '*'];
    h.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    h.style.left = (60 + Math.random() * 180) + 'px';
    h.style.top  = (60 + Math.random() * 60) + 'px';
    h.style.fontSize = (12 + Math.random() * 10) + 'px';
    heartsDiv.appendChild(h);
    setTimeout(function() { try { h.remove(); } catch(e) {} }, 900);
  }

  function updateBar(val) {
    happiness = Math.min(GOAL, val);
    var pct = Math.round((happiness / GOAL) * 100);
    var fill = document.getElementById('happy-fill');
    var pctEl = document.getElementById('happy-pct');
    if (fill)  fill.style.width  = pct + '%';
    if (pctEl) pctEl.textContent = pct + '%';
    if (happiness >= GOAL && !complete) { complete = true; onComplete(); }
  }

  petBtn.addEventListener('click', function() {
    if (complete) return;
    updateBar(happiness + 1);
    spawnHeart();
    stageCv.style.transition = 'transform 0.08s';
    stageCv.style.transform  = 'translateX(-50%) scale(1.18) translateY(-4px)';
    setTimeout(function() { stageCv.style.transform = 'translateX(-50%) scale(1)'; }, 120);
  });

  function spawnConfetti() {
    var colors = ['#1a56db','#00c896','#7c5fe6','#f59e0b','#ffffff','#e8a050'];
    for (var i = 0; i < 40; i++) {
      var c = document.createElement('div');
      c.className = 'confetti-piece';
      c.style.left = Math.random() * 100 + 'vw';
      c.style.top  = (Math.random() * 30) + 'vh';
      c.style.background = colors[i % colors.length];
      c.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
      c.style.width = c.style.height = (6 + Math.random() * 6) + 'px';
      c.style.animationDelay = (Math.random() * 0.6) + 's';
      document.body.appendChild(c);
      (function(el) { setTimeout(function() { try { el.remove(); } catch(e) {} }, 1800); })(c);
    }
  }

  function onComplete() {
    completeMsg.classList.add('show');
    spawnConfetti();
    setTimeout(function() { dismissOverlay(); }, 2000);
  }

  function dismissOverlay() {
    cancelAnimationFrame(animFrame);
    overlay.classList.add('exiting');
    setTimeout(function() { try { overlay.remove(); } catch(e) {} }, 800);
    sessionStorage.setItem('dog-dismissed', '1');
    localStorage.setItem('axl-dog', selectedDog);
    launchPersistentDog(selectedDog);
  }

  skipBtn.addEventListener('click', function() { dismissOverlay(); });
}

function launchPersistentDog(dogKey) {
  if (document.getElementById('persistent-dog')) return;
  var def = DOG_DEFS[dogKey] || DOG_DEFS.corgi;
  var PX = 4;
  var W = 16 * PX;
  var H = 16 * PX;

  var container = document.createElement('div');
  container.id = 'persistent-dog';
  container.style.cssText = 'position:fixed;bottom:0;z-index:9997;width:' + W + 'px;height:' + H + 'px;pointer-events:none;';
  var cv = makeCanvas(W, H);
  container.appendChild(cv);
  document.body.appendChild(container);

  var ctx = cv.getContext('2d');
  var dogX = window.innerWidth / 2;
  var targetX = dogX;
  var frame = 0;
  var lastFrameT = 0;
  var facingLeft = false;
  var idleT = 0;

  document.addEventListener('mousemove', function(e) { targetX = e.clientX; });

  function animDog(ts) {
    var diff = targetX - dogX;
    var isMoving = Math.abs(diff) > 5;
    var speed = Math.min(Math.abs(diff) * 0.07, 4);
    if (isMoving) {
      facingLeft = diff < 0;
      dogX += (diff > 0 ? 1 : -1) * speed;
    }
    dogX = Math.max(W / 2, Math.min(window.innerWidth - W / 2, dogX));
    container.style.left = (dogX - W / 2) + 'px';
    cv.style.transform = facingLeft ? 'scaleX(-1)' : 'scaleX(1)';

    var frameDelay = isMoving ? 130 : 700;
    if (ts - lastFrameT > frameDelay) {
      frame = isMoving ? (frame + 1) % 4 : 0;
      drawDog(ctx, def, PX, frame, false);
      lastFrameT = ts;
    }
    if (!isMoving) {
      idleT += 0.025;
      container.style.marginBottom = (Math.sin(idleT) * 2) + 'px';
    } else {
      idleT = 0;
      container.style.marginBottom = '0px';
    }
    requestAnimationFrame(animDog);
  }
  drawDog(ctx, def, PX, 0, false);
  requestAnimationFrame(animDog);
}

function boot() {
  if (!sessionStorage.getItem('dog-dismissed')) {
    buildDogOverlay();
  } else {
    launchPersistentDog(localStorage.getItem('axl-dog') || 'corgi');
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}

})();
