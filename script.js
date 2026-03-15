// ═══════════════════════════════════════
// CURSOR
// ═══════════════════════════════════════
const cursor = document.querySelector('.cursor');
const ring   = document.querySelector('.cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
const isTouchOnly = window.matchMedia('(hover:none) and (pointer:coarse)').matches;
if (isTouchOnly) {
  if (cursor) cursor.style.display = 'none';
  if (ring)   ring.style.display   = 'none';
  document.body.style.cursor = 'auto';
} else {
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    if (cursor) { cursor.style.left = mx + 'px'; cursor.style.top = my + 'px'; }
  });
  (function animRing() {
    rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
    if (ring) { ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; }
    requestAnimationFrame(animRing);
  })();
}

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
