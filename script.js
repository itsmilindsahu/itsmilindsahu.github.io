// CURSOR — mix-blend-mode handles visibility on dark/light
const cursor = document.querySelector('.cursor');
const ring   = document.querySelector('.cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
});
(function animateRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(animateRing);
})();

// HAMBURGER
const hamburger = document.querySelector('.hamburger');
const navLinks  = document.querySelector('.nav-links');
if (hamburger) hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));

// TERMINAL TYPING
const lines = [
  { prompt:'$', text:'whoami' },
  { prompt:'',  text:'milind_sahu @ iiser_tirupati', cls:'terminal-output' },
  { prompt:'$', text:'cat research.txt' },
  { prompt:'>', text:'Math Economics / Optimization', cls:'terminal-output' },
  { prompt:'>', text:'Energy Systems / Game Theory',  cls:'terminal-output' },
  { prompt:'$', text:'echo $AFFILIATION' },
  { prompt:'',  text:'AXL — Axiom Labs', cls:'terminal-output' },
];
const termBody = document.querySelector('.terminal-body');
if (termBody) {
  let i = 0;
  function typeLine() {
    if (i >= lines.length) {
      const cur = document.createElement('span');
      cur.className = 'terminal-cursor';
      termBody.appendChild(cur);
      return;
    }
    const l = lines[i++];
    const div = document.createElement('div');
    div.className = 'terminal-line' + (l.cls ? ' ' + l.cls : '');
    if (l.prompt) {
      const p = document.createElement('span');
      p.className = 'prompt'; p.textContent = l.prompt;
      div.appendChild(p);
    }
    const t = document.createElement('span');
    t.textContent = l.text;
    div.appendChild(t);
    termBody.appendChild(div);
    setTimeout(typeLine, 220);
  }
  setTimeout(typeLine, 600);
}

// FADE IN on scroll
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-in').forEach(el => obs.observe(el));

// PROJECT FILTER
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    document.querySelectorAll('.project-card').forEach(card => {
      card.style.display = (f === 'all' || card.dataset.category.includes(f)) ? 'flex' : 'none';
    });
  });
});

// DARK / LIGHT THEME TOGGLE
const themeBtn = document.querySelector('.theme-toggle');
const saved = localStorage.getItem('axl-theme') || 'light';
if (saved === 'dark') {
  document.body.classList.add('dark');
  if (themeBtn) themeBtn.textContent = '☀';
} else {
  if (themeBtn) themeBtn.textContent = '◑';
}
if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    themeBtn.textContent = isDark ? '☀' : '◑';
    localStorage.setItem('axl-theme', isDark ? 'dark' : 'light');
  });
}
