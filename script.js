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

// ══════════════════════════════════════════════════════════════════════════
//  3D-STYLE RESEARCH GALAXY  ·  Pure Canvas 2D  ·  Zero dependencies
//  AXL sun at centre · research domains orbit as glowing planets
//  Drag to rotate view · Scroll to zoom · Hover for formula tooltip
// ══════════════════════════════════════════════════════════════════════════
function buildGalaxy() {
  var container = document.getElementById('research-graph');
  if (!container) return;

  // Prevent double-init
  if (container.dataset.galaxyBuilt) return;
  container.dataset.galaxyBuilt = '1';

  container.innerHTML = '';
  container.style.position = 'relative';
  container.style.overflow  = 'hidden';
  container.style.background = '#020206';
  container.style.cursor    = 'grab';

  var canvas = document.createElement('canvas');
  canvas.style.cssText = 'display:block;width:100%;height:100%;';
  container.appendChild(canvas);

  // Update hint text
  var hint = container.previousElementSibling;
  if (hint && hint.classList && hint.classList.contains('graph-hint'))
    hint.textContent = 'Drag to rotate · Scroll to zoom · Hover planets';

  var W, H, dpr;
  function resize() {
    dpr = window.devicePixelRatio || 1;
    W = container.offsetWidth  || 900;
    H = container.offsetHeight || 540;
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width  = W + 'px';
    canvas.style.height = H + 'px';
  }
  resize();

  var ctx = canvas.getContext('2d');

  // ── Planet data ──────────────────────────────────────────────────────
  var PLANETS = [
    // Inner ring — blue (Math foundations)
    { name:'Quantitative Mathematics', formula:'∀ε>0, ∃δ: |f(x)−L| < ε',  col:'#1a56db', r:14, orbit:90,  spd:0.0035, ph:0,    tilt:0.18, g:0 },
    { name:'Optimization Theory',      formula:'min f(x)  s.t. g(x) ≤ 0',  col:'#2b6ff5', r:10, orbit:115, spd:0.0024, ph:2.09, tilt:0.08, g:0 },
    { name:'Statistics',               formula:'Var(X) = E[X²] − (E[X])²', col:'#4a8fff', r:8,  orbit:140, spd:0.0018, ph:4.18, tilt:0.25, g:0 },
    // Middle ring — green (Applied domains)
    { name:'Machine Learning',         formula:'∇_θ L → θ* = argmin L(θ)', col:'#00c896', r:16, orbit:185, spd:0.0013, ph:1.05, tilt:0.12, g:1 },
    { name:'Energy Systems Analytics', formula:'ΔE = P·Δt  |  NILM≡f(V,I)',col:'#00e0a8', r:11, orbit:225, spd:0.0009, ph:3.67, tilt:0.20, g:1 },
    // Outer ring — purple (ML Methods)
    { name:'Random Forest',            formula:'ŷ = (1/T) Σᵢ hᵢ(x)',       col:'#9c7ef0', r:8,  orbit:265, spd:0.0007, ph:0.52, tilt:0.38, g:2 },
    { name:'LSTM Networks',            formula:'cₜ = fₜ⊙cₜ₋₁ + iₜ⊙c̃ₜ',   col:'#b090ff', r:7,  orbit:298, spd:0.0006, ph:2.81, tilt:0.18, g:2 },
    { name:'Time-Series Modeling',     formula:'Xₜ = μ + Σφᵢ Xₜ₋ᵢ + εₜ',  col:'#7c5fe6', r:7,  orbit:328, spd:0.0005, ph:5.14, tilt:0.30, g:2 },
    { name:'Anomaly Detection',        formula:'score(x) = −log P(x|θ)',    col:'#a07af8', r:6,  orbit:356, spd:0.0004, ph:1.88, tilt:0.10, g:2 },
  ];

  // Angles start at defined phase
  PLANETS.forEach(function(p) { p.angle = p.ph; });

  // ── Stars ───────────────────────────────────────────────────────────
  var stars = [];
  for (var i = 0; i < 220; i++) {
    stars.push({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.1,
      a: 0.15 + Math.random() * 0.55,
      twinkle: Math.random() * Math.PI * 2
    });
  }

  // ── Camera state (2D projection of 3D rotation) ──────────────────────
  var camTilt = 0.32;   // 0 = top-down, PI/2 = edge-on
  var camRot  = 0;      // rotation around Y axis
  var zoom    = 1.0;
  var autoRot = true;

  // ── Interaction ──────────────────────────────────────────────────────
  var drag = false, lastX = 0, lastY = 0;
  canvas.addEventListener('mousedown', function(e) {
    drag = true; lastX = e.clientX; lastY = e.clientY;
    autoRot = false; canvas.style.cursor = 'grabbing';
  });
  window.addEventListener('mouseup', function() {
    drag = false; canvas.style.cursor = 'grab';
  });
  window.addEventListener('mousemove', function(e) {
    if (!drag) return;
    camRot  += (e.clientX - lastX) * 0.006;
    camTilt  = Math.max(0.05, Math.min(1.3, camTilt - (e.clientY - lastY) * 0.005));
    lastX = e.clientX; lastY = e.clientY;
  });
  canvas.addEventListener('wheel', function(e) {
    zoom = Math.max(0.45, Math.min(1.9, zoom - e.deltaY * 0.0007));
    e.preventDefault();
  }, { passive: false });

  // ── Tooltip ──────────────────────────────────────────────────────────
  var tt = document.createElement('div');
  tt.style.cssText =
    'position:absolute;pointer-events:none;display:none;' +
    'background:rgba(2,2,12,0.97);border:1px solid #1a56db;' +
    'padding:11px 15px;font-family:"Space Mono",monospace;' +
    'box-shadow:0 0 28px rgba(26,86,219,0.5);z-index:200;max-width:260px;';
  container.appendChild(tt);

  var hoveredPlanet = null;
  canvas.addEventListener('mousemove', function(e) {
    var rect = container.getBoundingClientRect();
    var mx = e.clientX - rect.left;
    var my = e.clientY - rect.top;
    hoveredPlanet = null;
    for (var i = 0; i < PLANETS.length; i++) {
      var p = PLANETS[i];
      if (!p._sx) continue;
      var dx = mx - p._sx, dy = my - p._sy;
      if (Math.sqrt(dx*dx + dy*dy) < p._sr + 6) {
        hoveredPlanet = p;
        break;
      }
    }
    if (hoveredPlanet) {
      tt.innerHTML =
        '<div style="font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#fff;margin-bottom:7px;">' + hoveredPlanet.name + '</div>' +
        '<div style="font-size:11px;color:#4a7fff;line-height:1.7;text-shadow:0 0 10px rgba(74,127,255,.6);">' + hoveredPlanet.formula + '</div>';
      tt.style.display = 'block';
      tt.style.left = (mx + 240 > W ? mx - 265 : mx + 14) + 'px';
      tt.style.top  = Math.max(8, my - 30) + 'px';
      canvas.style.cursor = 'pointer';
    } else {
      tt.style.display = 'none';
      canvas.style.cursor = drag ? 'grabbing' : 'grab';
    }
  });
  canvas.addEventListener('mouseleave', function() { tt.style.display = 'none'; hoveredPlanet = null; });

  // ── Legend ───────────────────────────────────────────────────────────
  var leg = document.createElement('div');
  leg.style.cssText = 'position:absolute;bottom:14px;right:14px;display:flex;flex-direction:column;gap:5px;z-index:10;pointer-events:none;';
  [['#1a56db','Math Foundations'],['#00c896','Applied Domains'],['#9c7ef0','ML Methods']].forEach(function(item) {
    leg.insertAdjacentHTML('beforeend',
      '<div style="display:flex;align-items:center;gap:7px;">' +
      '<span style="width:8px;height:8px;border-radius:50%;background:' + item[0] + ';display:inline-block;box-shadow:0 0 7px ' + item[0] + ';flex-shrink:0;"></span>' +
      '<span style="font-family:\'Space Mono\',monospace;font-size:8px;letter-spacing:1.5px;text-transform:uppercase;color:#555;">' + item[1] + '</span>' +
      '</div>');
  });
  container.appendChild(leg);

  // ── 3D projection helpers ─────────────────────────────────────────────
  // Projects a 3D point (on the orbital plane) to 2D screen coords.
  // orbitR = orbit radius, angle = position on orbit, tiltAmp = tilt amplitude
  function project(orbitR, angle, tiltAmp) {
    // 3D coords (orbital plane tilted by camTilt, rotated by camRot)
    var x3 = Math.cos(angle + camRot) * orbitR;
    var z3 = Math.sin(angle + camRot) * orbitR;
    var y3 = Math.sin(angle * 0.65) * tiltAmp * 18;  // slight Y wobble

    // Apply camera tilt (rotate around X axis)
    var yp = y3 * Math.cos(camTilt) - z3 * Math.sin(camTilt);
    var zp = y3 * Math.sin(camTilt) + z3 * Math.cos(camTilt);

    var cx = W / 2, cy = H / 2;
    var scale = zoom * Math.min(W, H) / 820;

    // Depth for size scaling (zp range: roughly -orbitR to +orbitR)
    var depthScale = 0.72 + 0.28 * (zp / (orbitR + 1));
    return {
      x: cx + x3 * scale,
      y: cy + yp * scale,
      depth: depthScale,
      zp: zp
    };
  }

  // ── Draw helpers ─────────────────────────────────────────────────────
  function drawGlow(x, y, r, color, alpha) {
    var grad = ctx.createRadialGradient(x, y, 0, x, y, r * 2.8);
    grad.addColorStop(0,   color.replace(')', ',' + alpha + ')').replace('rgb', 'rgba'));
    grad.addColorStop(0.4, color.replace(')', ',' + (alpha * 0.4) + ')').replace('rgb', 'rgba'));
    grad.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.beginPath(); ctx.arc(x, y, r * 2.8, 0, Math.PI * 2);
    ctx.fillStyle = grad; ctx.fill();
  }

  function hexToRgb(hex) {
    var r = parseInt(hex.slice(1,3),16);
    var g = parseInt(hex.slice(3,5),16);
    var b = parseInt(hex.slice(5,7),16);
    return r+','+g+','+b;
  }

  function drawOrbit(orbitR, tiltAmp, color) {
    ctx.beginPath();
    var first = true;
    for (var a = 0; a <= Math.PI * 2 + 0.05; a += 0.04) {
      var pt = project(orbitR, a - camRot, tiltAmp);
      if (first) { ctx.moveTo(pt.x, pt.y); first = false; }
      else ctx.lineTo(pt.x, pt.y);
    }
    ctx.closePath();
    ctx.strokeStyle = color + '28';
    ctx.lineWidth = 0.8;
    ctx.stroke();
  }

  function drawPlanet(p, pt, isHovered) {
    var scale = Math.min(W, H) / 820;
    var sr = p.r * scale * zoom * (0.72 + 0.28 * pt.depth);
    sr = Math.max(3, sr);
    p._sx = pt.x; p._sy = pt.y; p._sr = sr;

    var rgb = hexToRgb(p.col);

    // Glow
    var glowR = sr * (isHovered ? 4.5 : 2.8);
    var grad = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, glowR);
    grad.addColorStop(0,   'rgba(' + rgb + ',' + (isHovered ? 0.55 : 0.22) + ')');
    grad.addColorStop(0.5, 'rgba(' + rgb + ',0.06)');
    grad.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.beginPath(); ctx.arc(pt.x, pt.y, glowR, 0, Math.PI * 2);
    ctx.fillStyle = grad; ctx.fill();

    // Body
    var bodyGrad = ctx.createRadialGradient(pt.x - sr*0.3, pt.y - sr*0.3, sr*0.05, pt.x, pt.y, sr);
    bodyGrad.addColorStop(0, 'rgba(' + rgb + ',0.95)');
    bodyGrad.addColorStop(0.6, 'rgba(' + rgb + ',0.7)');
    bodyGrad.addColorStop(1, 'rgba(' + rgb + ',0.3)');
    ctx.beginPath(); ctx.arc(pt.x, pt.y, sr, 0, Math.PI * 2);
    ctx.fillStyle = bodyGrad; ctx.fill();

    // Ring for ML planet (index 3)
    if (p.name === 'Machine Learning') {
      ctx.save();
      ctx.translate(pt.x, pt.y);
      ctx.scale(1, 0.28 + 0.15 * Math.abs(Math.sin(camTilt)));
      ctx.beginPath();
      ctx.arc(0, 0, sr * 2.2, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(' + rgb + ',0.35)';
      ctx.lineWidth = sr * 0.55;
      ctx.stroke();
      ctx.restore();
    }

    // Label
    var labelAlpha = isHovered ? 1.0 : (0.45 + 0.3 * pt.depth);
    var fontSize = Math.max(8, 9 * scale * zoom);
    ctx.font = fontSize + 'px "Space Mono", monospace';
    ctx.fillStyle = 'rgba(' + rgb + ',' + labelAlpha + ')';
    ctx.textAlign = 'center';
    ctx.shadowColor = p.col;
    ctx.shadowBlur = isHovered ? 10 : 4;

    // Shorten long names for label
    var label = p.name.length > 18 ? p.name.replace(' ','\n') : p.name;
    var lines = label.split('\n');
    lines.forEach(function(line, i) {
      ctx.fillText(line, pt.x, pt.y + sr + fontSize * (1.4 + i * 1.2));
    });
    ctx.shadowBlur = 0;
  }

  // ── Main render loop ─────────────────────────────────────────────────
  var t = 0;
  var sunPulse = 0;
  var raf;

  function draw() {
    raf = requestAnimationFrame(draw);
    t += 0.012;
    sunPulse += 0.04;
    if (autoRot) camRot += 0.0006;

    // Advance planet angles
    PLANETS.forEach(function(p) { p.angle += p.spd; });

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    // Background
    ctx.fillStyle = '#020206';
    ctx.fillRect(0, 0, W, H);

    // Stars
    stars.forEach(function(s) {
      s.twinkle += 0.02;
      var a = s.a * (0.6 + 0.4 * Math.sin(s.twinkle));
      ctx.beginPath();
      ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(150,170,255,' + a + ')';
      ctx.fill();
    });

    // Compute all planet screen positions
    var pts = PLANETS.map(function(p) {
      return project(p.orbit * zoom * Math.min(W,H)/820, p.angle, p.tilt);
    });

    // Draw orbit ellipses (back to front by zp)
    PLANETS.forEach(function(p, i) {
      drawOrbit(p.orbit * zoom * Math.min(W,H)/820, p.tilt, p.col);
    });

    // Sort planets back-to-front
    var order = PLANETS.map(function(_, i) { return i; });
    order.sort(function(a, b) { return pts[a].zp - pts[b].zp; });

    // Sun at centre
    var cx = W/2, cy = H/2;
    var sunR = 28 * zoom * Math.min(W,H)/820;
    sunR = Math.max(12, sunR);
    var pulse = 0.85 + 0.15 * Math.sin(sunPulse);

    // Sun outer glow
    var sg = ctx.createRadialGradient(cx, cy, 0, cx, cy, sunR * 5);
    sg.addColorStop(0,   'rgba(26,86,219,' + (0.35 * pulse) + ')');
    sg.addColorStop(0.4, 'rgba(26,86,219,0.08)');
    sg.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.beginPath(); ctx.arc(cx, cy, sunR * 5, 0, Math.PI * 2);
    ctx.fillStyle = sg; ctx.fill();

    // Sun body
    var sunG = ctx.createRadialGradient(cx - sunR*0.3, cy - sunR*0.3, sunR*0.1, cx, cy, sunR);
    sunG.addColorStop(0, 'rgba(120,160,255,1)');
    sunG.addColorStop(0.5, 'rgba(26,86,219,' + pulse + ')');
    sunG.addColorStop(1, 'rgba(10,40,140,0.8)');
    ctx.beginPath(); ctx.arc(cx, cy, sunR, 0, Math.PI * 2);
    ctx.fillStyle = sunG; ctx.fill();

    // AXL label on sun
    var lSize = Math.max(14, 22 * zoom * Math.min(W,H)/820);
    ctx.font = 'bold ' + lSize + 'px monospace';
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#1a56db';
    ctx.shadowBlur = 18;
    ctx.fillText('AXL', cx, cy + lSize * 0.38);
    ctx.shadowBlur = 0;

    // Draw planets back-to-front
    order.forEach(function(i) {
      drawPlanet(PLANETS[i], pts[i], PLANETS[i] === hoveredPlanet);
    });
  }

  draw();

  // Resize handling
  window.addEventListener('resize', function() {
    resize();
  });

  // Visibility — pause when hidden
  document.addEventListener('visibilitychange', function() {
    if (document.hidden) cancelAnimationFrame(raf);
    else draw();
  });
}

// ── Init ─────────────────────────────────────────────────────────────────
function initGalaxy() {
  var container = document.getElementById('research-graph');
  if (!container) return;
  if (container.dataset.galaxyBuilt) return;

  // Set height on container if not already set via CSS
  if (!container.style.height && container.offsetHeight < 50) {
    container.style.height = '540px';
  }

  var built = false;
  function tryBuild() {
    if (built || container.dataset.galaxyBuilt) return;
    var w = container.getBoundingClientRect().width || container.offsetWidth;
    var h = container.getBoundingClientRect().height || container.offsetHeight;
    if (w > 10 && h > 10) {
      built = true;
      buildGalaxy();
    }
  }

  tryBuild();
  if (built) return;

  if (typeof ResizeObserver !== 'undefined') {
    var ro = new ResizeObserver(function() { tryBuild(); if (built) ro.disconnect(); });
    ro.observe(container);
    setTimeout(function() { ro.disconnect(); }, 6000);
  } else {
    var n = 0;
    var iv = setInterval(function() {
      tryBuild(); n++;
      if (built || n > 80) clearInterval(iv);
    }, 80);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() { setTimeout(initGalaxy, 50); });
} else {
  setTimeout(initGalaxy, 50);
}
