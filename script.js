// ═══════════════════════════════════════
// CURSOR
// ═══════════════════════════════════════
const cursor = document.querySelector('.cursor');
const ring   = document.querySelector('.cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  if (cursor) { cursor.style.left = mx + 'px'; cursor.style.top = my + 'px'; }
});
(function animRing() {
  rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
  if (ring) { ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; }
  requestAnimationFrame(animRing);
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


// ══════════════════════════════════════════════════════════════════════════
//  3D RESEARCH GALAXY  ·  Three.js r128
//  AXL sun at centre · research domains orbit as glowing planets
//  Drag to rotate · Scroll to zoom · Hover for tooltip + formula
// ══════════════════════════════════════════════════════════════════════════
function buildGalaxy() {
  const container = document.getElementById('research-graph');
  if (!container) return;

  // Clear any leftover SVG / D3 markup
  container.innerHTML = '';
  container.style.height    = '540px';
  container.style.background = '#020206';
  container.style.cursor     = 'grab';
  container.style.overflow   = 'hidden';
  container.style.position   = 'relative';

  const W = container.clientWidth || 900;
  const H = 540;

  // ── Renderer ──────────────────────────────────────────────────────────
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W, H);
  renderer.setClearColor(0x020206, 1);
  container.appendChild(renderer.domElement);
  renderer.domElement.style.display = 'block';

  // ── Scene ──────────────────────────────────────────────────────────────
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x020206, 0.012);

  // ── Camera ─────────────────────────────────────────────────────────────
  const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 800);
  let camTheta = 0.25, camPhi = 0.38, camR = 46;
  function updateCamera() {
    camera.position.set(
      Math.sin(camTheta) * Math.cos(camPhi) * camR,
      Math.sin(camPhi) * camR,
      Math.cos(camTheta) * Math.cos(camPhi) * camR
    );
    camera.lookAt(0, 0, 0);
  }
  updateCamera();

  // ── Lights ─────────────────────────────────────────────────────────────
  scene.add(new THREE.AmbientLight(0x08081a, 2.2));
  const sunPt = new THREE.PointLight(0x1a56db, 5, 90);
  scene.add(sunPt);
  const fillPt = new THREE.PointLight(0x00c896, 0.7, 70);
  fillPt.position.set(25, 12, 20);
  scene.add(fillPt);

  // ── Starfield ──────────────────────────────────────────────────────────
  (function() {
    const N = 2200;
    const pos = new Float32Array(N * 3);
    for (let i = 0; i < N * 3; i++) pos[i] = (Math.random() - 0.5) * 320;
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    scene.add(new THREE.Points(geo,
      new THREE.PointsMaterial({ color: 0x1a2240, size: 0.20, transparent: true, opacity: 0.75 })
    ));
  })();

  // ── AXL Sun ────────────────────────────────────────────────────────────
  const sunMesh = new THREE.Mesh(
    new THREE.SphereGeometry(2.8, 48, 48),
    new THREE.MeshStandardMaterial({
      color: 0x1a56db, emissive: 0x1a56db, emissiveIntensity: 1.6,
      roughness: 0.1, metalness: 0.95
    })
  );
  scene.add(sunMesh);

  // Glow shells
  [{ r: 4.4, o: 0.055 }, { r: 6.6, o: 0.018 }].forEach(function(cfg) {
    scene.add(new THREE.Mesh(
      new THREE.SphereGeometry(cfg.r, 24, 24),
      new THREE.MeshBasicMaterial({ color: 0x1a56db, transparent: true, opacity: cfg.o, side: THREE.BackSide })
    ));
  });

  // "AXL" canvas label above sun
  const lc = document.createElement('canvas'); lc.width = 256; lc.height = 128;
  const lctx = lc.getContext('2d');
  lctx.clearRect(0, 0, 256, 128);
  lctx.shadowColor = '#1a56db'; lctx.shadowBlur = 28;
  lctx.font = 'bold 72px monospace'; lctx.fillStyle = '#ffffff';
  lctx.textAlign = 'center'; lctx.fillText('AXL', 128, 82);
  const axlLabel = new THREE.Mesh(
    new THREE.PlaneGeometry(5.4, 2.7),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(lc), transparent: true, depthWrite: false })
  );
  axlLabel.position.y = 4.8;
  scene.add(axlLabel);

  // ── Planet definitions ─────────────────────────────────────────────────
  var PLANETS = [
    // Inner ring — blue (Math foundations)
    { name:'Quantitative\nMathematics', formula:'∀ε>0, ∃δ: |f(x)−L| < ε',         col:0x1a56db, emi:0x091840, r:1.1,  orbit:8.5,  spd:0.44,  ph:0,    tilt:0.18, ring:false, g:0 },
    { name:'Optimization\nTheory',      formula:'min f(x)  s.t.  g(x) ≤ 0',         col:0x2b6ff5, emi:0x091840, r:0.82, orbit:11.0, spd:0.30,  ph:2.09, tilt:0.09, ring:false, g:0 },
    { name:'Statistics',                formula:'Var(X) = E[X²] − (E[X])²',          col:0x4a8fff, emi:0x091840, r:0.68, orbit:13.5, spd:0.22,  ph:4.18, tilt:0.28, ring:false, g:0 },
    // Middle ring — green (Applied domains)
    { name:'Machine\nLearning',         formula:'∇_θ L → θ* = argmin L(θ)',          col:0x00c896, emi:0x003d2e, r:1.3,  orbit:18.0, spd:0.16,  ph:1.05, tilt:0.13, ring:true,  g:1 },
    { name:'Energy Systems\nAnalytics', formula:'ΔE = P·Δt  |  NILM ≡ f(V,I)',      col:0x00e0a8, emi:0x003530, r:0.88, orbit:22.0, spd:0.115, ph:3.67, tilt:0.22, ring:false, g:1 },
    // Outer ring — purple (ML Methods)
    { name:'Random\nForest',            formula:'ŷ = (1/T) Σᵢ hᵢ(x)',                col:0x9c7ef0, emi:0x2a0a60, r:0.62, orbit:26.5, spd:0.088, ph:0.52, tilt:0.40, ring:false, g:2 },
    { name:'LSTM\nNetworks',            formula:'cₜ = fₜ⊙cₜ₋₁ + iₜ⊙c̃ₜ',            col:0xb090ff, emi:0x300a90, r:0.58, orbit:30.0, spd:0.072, ph:2.81, tilt:0.20, ring:false, g:2 },
    { name:'Time-Series\nModeling',     formula:'Xₜ = μ + Σφᵢ Xₜ₋ᵢ + εₜ',           col:0x7c5fe6, emi:0x200850, r:0.52, orbit:33.5, spd:0.060, ph:5.14, tilt:0.33, ring:false, g:2 },
    { name:'Anomaly\nDetection',        formula:'score(x) = −log P(x|θ)',             col:0xa07af8, emi:0x2a0888, r:0.50, orbit:37.0, spd:0.049, ph:1.88, tilt:0.12, ring:false, g:2 },
  ];

  var GC = { 0:0x1a56db, 1:0x00c896, 2:0x9c7ef0 };
  var labelColors = ['#88aaff', '#44ddaa', '#bb99ff'];

  // ── Orbit rings ────────────────────────────────────────────────────────
  var orbitMats = [];
  PLANETS.forEach(function(p) {
    var pts = [];
    for (var i = 0; i <= 128; i++) {
      var a = (i / 128) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * p.orbit, 0, Math.sin(a) * p.orbit));
    }
    var mat = new THREE.LineBasicMaterial({ color: GC[p.g], transparent: true, opacity: 0.07 });
    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat));
    orbitMats.push(mat);
  });

  // ── Canvas label helper ────────────────────────────────────────────────
  function makeCanvasLabel(text, hexColor) {
    var c = document.createElement('canvas'); c.width = 256; c.height = 80;
    var ctx = c.getContext('2d');
    ctx.clearRect(0, 0, 256, 80);
    ctx.font = '500 13px "Space Mono", monospace';
    ctx.fillStyle = hexColor || '#cccccc';
    ctx.textAlign = 'center';
    var lines = text.split('\n');
    lines.forEach(function(l, i) { ctx.fillText(l, 128, 26 + i * 20); });
    var mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2.8 * (text.length > 12 ? 1.2 : 1), 1.1 + (lines.length - 1) * 0.4),
      new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false })
    );
    return mesh;
  }

  // ── Build planet objects ───────────────────────────────────────────────
  var pObjs = PLANETS.map(function(p) {
    var mat = new THREE.MeshStandardMaterial({
      color: p.col, emissive: p.emi, emissiveIntensity: 0.55,
      roughness: 0.28, metalness: 0.80
    });
    var mesh = new THREE.Mesh(new THREE.SphereGeometry(p.r, 28, 28), mat);

    // Atmo glow
    mesh.add(new THREE.Mesh(
      new THREE.SphereGeometry(p.r * 1.42, 16, 16),
      new THREE.MeshBasicMaterial({ color: p.col, transparent: true, opacity: 0.05, side: THREE.BackSide })
    ));

    // Saturn ring for ML
    if (p.ring) {
      var rm = new THREE.Mesh(
        new THREE.RingGeometry(p.r * 1.65, p.r * 2.5, 64),
        new THREE.MeshBasicMaterial({ color: p.col, transparent: true, opacity: 0.30, side: THREE.DoubleSide })
      );
      rm.rotation.x = Math.PI / 3.2;
      mesh.add(rm);
    }

    // Label
    var lm = makeCanvasLabel(p.name, labelColors[p.g]);
    lm.position.y = p.r + 0.9;
    mesh.add(lm);
    mesh.userData.label = lm;

    scene.add(mesh);
    return { mesh: mesh, p: p, angle: p.ph };
  });

  // ── Tooltip DOM element ────────────────────────────────────────────────
  var tt = document.createElement('div');
  tt.style.cssText =
    'position:absolute;pointer-events:none;display:none;' +
    'background:rgba(2,2,10,0.97);border:1px solid #1a56db;' +
    'padding:12px 16px;font-family:"Space Mono",monospace;' +
    'box-shadow:0 0 30px rgba(26,86,219,0.45);z-index:200;' +
    'max-width:260px;border-radius:0;';
  container.appendChild(tt);

  // ── Raycaster ──────────────────────────────────────────────────────────
  var raycaster = new THREE.Raycaster();
  var mouse2 = new THREE.Vector2(-9999, -9999);
  var hoveredIdx = -1;
  var planetMeshes = pObjs.map(function(o) { return o.mesh; });

  renderer.domElement.addEventListener('mousemove', function(e) {
    var rect = container.getBoundingClientRect();
    mouse2.x =  ((e.clientX - rect.left) / W) * 2 - 1;
    mouse2.y = -((e.clientY - rect.top)  / H) * 2 + 1;

    raycaster.setFromCamera(mouse2, camera);
    var hits = raycaster.intersectObjects(planetMeshes);

    if (hits.length) {
      var hitIdx = -1;
      for (var i = 0; i < pObjs.length; i++) {
        if (pObjs[i].mesh === hits[0].object) { hitIdx = i; break; }
      }
      if (hitIdx !== -1) {
        if (hoveredIdx !== hitIdx) {
          if (hoveredIdx !== -1) {
            pObjs[hoveredIdx].mesh.material.emissiveIntensity = 0.55;
            orbitMats[hoveredIdx].opacity = 0.07;
          }
          hoveredIdx = hitIdx;
          pObjs[hitIdx].mesh.material.emissiveIntensity = 1.8;
          orbitMats[hitIdx].opacity = 0.45;
          renderer.domElement.style.cursor = 'pointer';
        }
        var p = pObjs[hitIdx].p;
        tt.innerHTML =
          '<div style="font-size:10px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:#fff;margin-bottom:8px;">' +
          p.name.replace('\n',' ') + '</div>' +
          '<div style="font-size:11px;color:#4a7fff;line-height:1.7;text-shadow:0 0 10px rgba(74,127,255,.7);">' +
          p.formula + '</div>';
        tt.style.display = 'block';
        var tx = e.clientX - rect.left, ty = e.clientY - rect.top;
        tt.style.left = (tx + 250 > W ? tx - 270 : tx + 14) + 'px';
        tt.style.top  = Math.max(8, ty - 28) + 'px';
      }
    } else {
      if (hoveredIdx !== -1) {
        pObjs[hoveredIdx].mesh.material.emissiveIntensity = 0.55;
        orbitMats[hoveredIdx].opacity = 0.07;
        hoveredIdx = -1;
      }
      tt.style.display = 'none';
      renderer.domElement.style.cursor = 'grab';
    }
  });

  renderer.domElement.addEventListener('mouseleave', function() {
    if (hoveredIdx !== -1) {
      pObjs[hoveredIdx].mesh.material.emissiveIntensity = 0.55;
      orbitMats[hoveredIdx].opacity = 0.07;
      hoveredIdx = -1;
    }
    tt.style.display = 'none';
  });

  // ── Drag / scroll controls ─────────────────────────────────────────────
  var dragging = false, pmx = 0, pmy = 0, autoRotate = true;

  renderer.domElement.addEventListener('mousedown', function(e) {
    dragging = true; pmx = e.clientX; pmy = e.clientY;
    autoRotate = false;
    renderer.domElement.style.cursor = 'grabbing';
  });
  window.addEventListener('mouseup', function() {
    dragging = false;
    renderer.domElement.style.cursor = hoveredIdx !== -1 ? 'pointer' : 'grab';
  });
  window.addEventListener('mousemove', function(e) {
    if (!dragging) return;
    camTheta -= (e.clientX - pmx) * 0.005;
    camPhi = Math.max(0.06, Math.min(1.38, camPhi - (e.clientY - pmy) * 0.005));
    pmx = e.clientX; pmy = e.clientY;
  });
  renderer.domElement.addEventListener('wheel', function(e) {
    camR = Math.max(16, Math.min(80, camR + e.deltaY * 0.06));
  }, { passive: true });

  // ── Legend ─────────────────────────────────────────────────────────────
  var leg = document.createElement('div');
  leg.style.cssText = 'position:absolute;bottom:14px;right:14px;display:flex;flex-direction:column;gap:5px;z-index:10;pointer-events:none;';
  [['#1a56db','Math Foundations'],['#00c896','Applied Domains'],['#9c7ef0','ML Methods']].forEach(function(item) {
    leg.insertAdjacentHTML('beforeend',
      '<div style="display:flex;align-items:center;gap:7px;">' +
      '<span style="width:8px;height:8px;border-radius:50%;background:' + item[0] + ';display:inline-block;box-shadow:0 0 7px ' + item[0] + ';"></span>' +
      '<span style="font-family:\'Space Mono\',monospace;font-size:8px;letter-spacing:1.5px;text-transform:uppercase;color:#555;">' + item[1] + '</span>' +
      '</div>'
    );
  });
  container.appendChild(leg);

  // ── Render loop ────────────────────────────────────────────────────────
  var clk = 0;
  function loop() {
    requestAnimationFrame(loop);
    clk += 0.008;

    // Pulsing sun
    sunMesh.material.emissiveIntensity = 1.4 + Math.sin(clk * 1.7) * 0.3;
    sunMesh.rotation.y += 0.003;
    axlLabel.lookAt(camera.position);

    // Move planets
    pObjs.forEach(function(o) {
      o.angle += o.p.spd * 0.008;
      o.mesh.position.x = Math.cos(o.angle) * o.p.orbit;
      o.mesh.position.z = Math.sin(o.angle) * o.p.orbit;
      o.mesh.position.y = Math.sin(o.angle * 0.65 + o.p.ph) * o.p.tilt * 2.2;
      o.mesh.rotation.y += 0.011;
      if (o.mesh.userData.label) {
        // Billboard: just face camera directly
        o.mesh.userData.label.lookAt(camera.position);
      }
    });

    if (autoRotate) camTheta += 0.0007;
    updateCamera();
    renderer.render(scene, camera);
  }
  loop();

  // ── Resize ─────────────────────────────────────────────────────────────
  window.addEventListener('resize', function() {
    var nW = container.clientWidth;
    camera.aspect = nW / H;
    camera.updateProjectionMatrix();
    renderer.setSize(nW, H);
  });
}

// ── Bootstrap Three.js then build ──────────────────────────────────────
function initGalaxy() {
  if (!document.getElementById('research-graph')) return;
  if (typeof THREE !== 'undefined') { buildGalaxy(); return; }
  var s = document.createElement('script');
  s.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
  s.onload  = buildGalaxy;
  s.onerror = function() { console.warn('[AXL] Three.js CDN failed'); };
  document.head.appendChild(s);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGalaxy);
} else {
  initGalaxy();
}
