// ═══════════════════════════════════════
// CURSOR
// ═══════════════════════════════════════
const cursor = document.querySelector('.cursor');
const ring   = document.querySelector('.cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px'; cursor.style.top = my + 'px';
});
(function animRing() {
  rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
  requestAnimationFrame(animRing);
})();

// ═══════════════════════════════════════
// HAMBURGER
// ═══════════════════════════════════════
const ham = document.querySelector('.hamburger');
const navL = document.querySelector('.nav-links');
if (ham) ham.addEventListener('click', () => navL.classList.toggle('open'));

// ═══════════════════════════════════════
// TERMINAL
// ═══════════════════════════════════════
const termLines = [
  { p:'$', t:'whoami' },
  { p:'',  t:'milind_sahu @ iiser_tirupati', c:'terminal-output' },
  { p:'$', t:'cat research.txt' },
  { p:'>', t:'Quant Math / Optimization / ML', c:'terminal-output' },
  { p:'>', t:'Energy Systems Analytics',      c:'terminal-output' },
  { p:'$', t:'echo $IDENTITY' },
  { p:'',  t:'AXL — Axiom Labs :: est. 2025', c:'terminal-output' },
];
const tb = document.querySelector('.terminal-body');
if (tb) {
  let i = 0;
  function tl() {
    if (i >= termLines.length) {
      const s = document.createElement('span'); s.className = 'terminal-cursor'; tb.appendChild(s); return;
    }
    const l = termLines[i++];
    const d = document.createElement('div');
    d.className = 'terminal-line' + (l.c ? ' ' + l.c : '');
    if (l.p) { const p = document.createElement('span'); p.className = 'prompt'; p.textContent = l.p; d.appendChild(p); }
    const t = document.createElement('span'); t.textContent = l.t; d.appendChild(t);
    tb.appendChild(d); setTimeout(tl, 240);
  }
  setTimeout(tl, 800);
}

// ═══════════════════════════════════════
// FADE IN
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
// D3 RESEARCH FORCE GRAPH
// ═══════════════════════════════════════
function buildGraph() {
  const container = document.getElementById('research-graph');
  if (!container || typeof d3 === 'undefined') return;

  const W = container.clientWidth || 900;
  const H = Math.min(520, window.innerHeight * 0.65);
  container.style.height = H + 'px';

  // ── Data ──────────────────────────────
  const nodes = [
    { id: 'Quantitative\nMathematics', short: 'QUANT\nMATH',   group: 0, formula: '∀ε>0, ∃δ: |f(x)−L| < ε',         r: 36 },
    { id: 'Optimization\nTheory',      short: 'OPT',            group: 0, formula: 'min_x f(x)  s.t.  g(x) ≤ 0',      r: 30 },
    { id: 'Statistics',                short: 'STAT',           group: 0, formula: 'Var(X) = E[X²] − (E[X])²',         r: 26 },
    { id: 'Probability',               short: 'PROB',           group: 0, formula: 'P(A|B) = P(A∩B) / P(B)',            r: 26 },
    { id: 'Machine\nLearning',         short: 'ML',             group: 1, formula: '∇_θ L(θ) → θ* = argmin L(θ)',      r: 34 },
    { id: 'Energy Systems\nAnalytics', short: 'ENERGY\nSYS',   group: 1, formula: 'ΔE = P·Δt  ∥  NILM ≡ f(V,I)',      r: 28 },
    { id: 'Random\nForest',            short: 'RF',             group: 2, formula: 'ŷ = (1/T) Σᵢ hᵢ(x)',               r: 18 },
    { id: 'LSTM\nNetworks',            short: 'LSTM',           group: 2, formula: 'cₜ = fₜ⊙cₜ₋₁ + iₜ⊙c̃ₜ',          r: 18 },
    { id: 'Time-Series\nModeling',     short: 'T-S',            group: 2, formula: 'Xₜ = μ + Σφᵢ Xₜ₋ᵢ + εₜ',          r: 18 },
    { id: 'Anomaly\nDetection',        short: 'ANOM',           group: 2, formula: 'score(x) = −log P(x|θ)',            r: 18 },
  ];

  const links = [
    { source: 'Quantitative\nMathematics', target: 'Optimization\nTheory',      w: 2.5 },
    { source: 'Quantitative\nMathematics', target: 'Statistics',                w: 2.5 },
    { source: 'Quantitative\nMathematics', target: 'Probability',               w: 2.5 },
    { source: 'Optimization\nTheory',      target: 'Machine\nLearning',         w: 2   },
    { source: 'Statistics',               target: 'Machine\nLearning',          w: 2   },
    { source: 'Probability',              target: 'Machine\nLearning',          w: 2   },
    { source: 'Machine\nLearning',        target: 'Energy Systems\nAnalytics',  w: 2   },
    { source: 'Machine\nLearning',        target: 'Random\nForest',             w: 1.5 },
    { source: 'Machine\nLearning',        target: 'LSTM\nNetworks',             w: 1.5 },
    { source: 'Machine\nLearning',        target: 'Time-Series\nModeling',      w: 1.5 },
    { source: 'Machine\nLearning',        target: 'Anomaly\nDetection',         w: 1.5 },
    { source: 'Energy Systems\nAnalytics',target: 'LSTM\nNetworks',             w: 1   },
    { source: 'Energy Systems\nAnalytics',target: 'Time-Series\nModeling',      w: 1   },
    { source: 'Energy Systems\nAnalytics',target: 'Anomaly\nDetection',         w: 1   },
  ];

  const COLS = { 0: '#1a56db', 1: '#00c896', 2: '#7c5fe6' };
  const GLOW = { 0: 'rgba(26,86,219,', 1: 'rgba(0,200,150,', 2: 'rgba(124,95,230,' };

  // ── SVG setup ─────────────────────────
  d3.select('#research-graph svg').remove();
  const svg = d3.select('#research-graph').append('svg')
    .attr('width', W).attr('height', H)
    .style('background', 'transparent');

  const defs = svg.append('defs');

  // Glow filters
  [0,1,2].forEach(g => {
    const col = COLS[g].replace('#','');
    const f = defs.append('filter').attr('id', `glow-${g}`)
      .attr('x','-60%').attr('y','-60%').attr('width','220%').attr('height','220%');
    f.append('feGaussianBlur').attr('in','SourceGraphic').attr('stdDeviation','6').attr('result','blur');
    const m = f.append('feMerge');
    m.append('feMergeNode').attr('in','blur');
    m.append('feMergeNode').attr('in','SourceGraphic');
  });

  // Arrow markers per group
  [0,1,2].forEach(g => {
    defs.append('marker').attr('id', `arr-${g}`)
      .attr('viewBox','0 -4 10 8').attr('refX', 24).attr('markerWidth', 5).attr('markerHeight', 5).attr('orient','auto')
      .append('path').attr('d','M0,-4L10,0L0,4').attr('fill', COLS[g]).attr('opacity', 0.6);
  });

  // ── Force sim ─────────────────────────
  const sim = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id(d => d.id).distance(d => {
      if (d.target.group === 2) return 100;
      if (d.source.group === 0) return 160;
      return 140;
    }).strength(0.6))
    .force('charge', d3.forceManyBody().strength(d => d.group === 0 ? -500 : d.group === 1 ? -380 : -220))
    .force('center', d3.forceCenter(W / 2, H / 2))
    .force('collision', d3.forceCollide(d => d.r + 22))
    .force('x', d3.forceX(W / 2).strength(0.03))
    .force('y', d3.forceY(H / 2).strength(0.03));

  // ── Links ─────────────────────────────
  const linkEl = svg.append('g').attr('class','graph-links')
    .selectAll('line').data(links).join('line')
    .attr('stroke', d => COLS[d.target.group])
    .attr('stroke-opacity', 0.18)
    .attr('stroke-width', d => d.w)
    .attr('marker-end', d => `url(#arr-${d.target.group})`);

  // ── Nodes ─────────────────────────────
  const nodeG = svg.append('g').attr('class','graph-nodes')
    .selectAll('g').data(nodes).join('g')
    .attr('class','graph-node')
    .call(d3.drag()
      .on('start', (ev, d) => { if (!ev.active) sim.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
      .on('drag',  (ev, d) => { d.fx = ev.x; d.fy = ev.y; })
      .on('end',   (ev, d) => { if (!ev.active) sim.alphaTarget(0); d.fx = null; d.fy = null; })
    );

  // Pulse ring (animated)
  nodeG.append('circle').attr('class','node-pulse')
    .attr('r', d => d.r + 6)
    .attr('fill','none')
    .attr('stroke', d => COLS[d.group])
    .attr('stroke-width', 1)
    .attr('opacity', 0)
    .each(function(d) {
      const el = d3.select(this);
      function pulse() {
        el.attr('r', d.r + 6).attr('opacity', 0.4)
          .transition().duration(1800).ease(d3.easeCubicOut)
          .attr('r', d.r + 22).attr('opacity', 0)
          .on('end', () => setTimeout(pulse, 800 + Math.random() * 2000));
      }
      setTimeout(pulse, Math.random() * 2000);
    });

  // Main circle
  nodeG.append('circle').attr('class','node-body')
    .attr('r', d => d.r)
    .attr('fill', d => `${GLOW[d.group]}0.08)`)
    .attr('stroke', d => COLS[d.group])
    .attr('stroke-width', d => d.group === 0 ? 2 : 1.5)
    .style('cursor','grab');

  // Label (multi-line via foreignObject won't work in SVG; use tspan)
  nodeG.append('text').attr('class','node-text')
    .attr('text-anchor','middle')
    .attr('fill', d => d.group === 2 ? '#aaa' : '#fff')
    .style('font-family','"Space Mono", monospace')
    .style('font-weight', d => d.group === 0 ? '700' : '500')
    .style('font-size', d => d.group === 0 ? '9px' : d.group === 1 ? '10px' : '8px')
    .style('pointer-events','none')
    .style('text-shadow', d => `0 0 12px ${COLS[d.group]}`)
    .each(function(d) {
      const lines = d.id.split('\n');
      const el = d3.select(this);
      const lineH = 12;
      const startY = -(lines.length - 1) * lineH / 2;
      lines.forEach((line, i) => {
        el.append('tspan')
          .attr('x', 0).attr('dy', i === 0 ? startY + 'px' : lineH + 'px')
          .text(line);
      });
    });

  // ── Tooltip ───────────────────────────
  const tt = d3.select('#research-graph').append('div').attr('class','graph-tooltip');

  nodeG
    .on('mouseenter', function(ev, d) {
      // activate glow
      d3.select(this).select('.node-body')
        .attr('fill', `${GLOW[d.group]}0.22)`)
        .attr('stroke-width', 3)
        .attr('filter', `url(#glow-${d.group})`);

      // dim unconnected links, highlight connected
      const connected = new Set();
      links.forEach(l => {
        if (l.source.id === d.id) connected.add(l.target.id);
        if (l.target.id === d.id) connected.add(l.source.id);
      });
      linkEl
        .attr('stroke-opacity', l =>
          l.source.id === d.id || l.target.id === d.id ? 0.9 : 0.04
        )
        .attr('stroke-width', l =>
          l.source.id === d.id || l.target.id === d.id ? l.w * 2.5 : l.w
        );

      // dim unrelated nodes
      nodeG.select('.node-body').attr('opacity', (n) =>
        n.id === d.id || connected.has(n.id) ? 1 : 0.25
      );

      // show tooltip
      tt.style('opacity', 1)
        .html(`<div class="tt-name">${d.id.replace('\n',' ')}</div><div class="tt-formula">${d.formula}</div>`);
    })
    .on('mousemove', function(ev) {
      const rect = container.getBoundingClientRect();
      const tx = ev.clientX - rect.left;
      const ty = ev.clientY - rect.top;
      const tipW = 240;
      tt.style('left', (tx + tipW > W ? tx - tipW - 12 : tx + 14) + 'px')
        .style('top', Math.max(8, ty - 14) + 'px');
    })
    .on('mouseleave', function(ev, d) {
      d3.select(this).select('.node-body')
        .attr('fill', `${GLOW[d.group]}0.08)`)
        .attr('stroke-width', d.group === 0 ? 2 : 1.5)
        .attr('filter', null);
      linkEl.attr('stroke-opacity', 0.18).attr('stroke-width', l => l.w);
      nodeG.select('.node-body').attr('opacity', 1);
      tt.style('opacity', 0);
    });

  // ── Tick ──────────────────────────────
  const PAD = 50;
  sim.on('tick', () => {
    linkEl
      .attr('x1', d => clamp(d.source.x, PAD, W-PAD))
      .attr('y1', d => clamp(d.source.y, PAD, H-PAD))
      .attr('x2', d => clamp(d.target.x, PAD, W-PAD))
      .attr('y2', d => clamp(d.target.y, PAD, H-PAD));
    nodeG.attr('transform', d =>
      `translate(${clamp(d.x, PAD, W-PAD)},${clamp(d.y, PAD, H-PAD)})`
    );
  });

  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  // ── Legend ────────────────────────────
  const legend = d3.select('#research-graph').append('div').attr('class','graph-legend');
  [
    { label:'Mathematical Foundations', g:0 },
    { label:'Applied Domains', g:1 },
    { label:'ML Methods', g:2 },
  ].forEach(item => {
    const row = legend.append('div').attr('class','legend-row');
    row.append('span').attr('class','legend-dot').style('background', COLS[item.g]);
    row.append('span').attr('class','legend-text').text(item.label);
  });

  // resize
  window.addEventListener('resize', () => {
    const nW = container.clientWidth;
    svg.attr('width', nW);
    sim.force('center', d3.forceCenter(nW/2, H/2)).alpha(0.3).restart();
  });
}

// Build graph once D3 is loaded
if (typeof d3 !== 'undefined') {
  window.addEventListener('DOMContentLoaded', buildGraph);
  if (document.readyState !== 'loading') buildGraph();
} else {
  // d3 loaded async, wait for it
  const script = document.querySelector('script[src*="d3"]');
  if (script) script.addEventListener('load', buildGraph);
}
