/* ============================================
   MILIND SAHU — AXL
   script.js
   ============================================ */

// ── CURSOR ──
const cursor = document.querySelector('.cursor');
const ring = document.querySelector('.cursor-ring');
if (cursor && ring) {
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
  });
  function animateRing() {
    rx += (mx - rx) * 0.15;
    ry += (my - ry) * 0.15;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();
  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(2)';
      cursor.style.background = 'var(--accent)';
      ring.style.transform = 'translate(-50%,-50%) scale(1.5)';
      ring.style.borderColor = 'var(--accent)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(1)';
      cursor.style.background = 'var(--black)';
      ring.style.transform = 'translate(-50%,-50%) scale(1)';
      ring.style.borderColor = 'var(--black)';
    });
  });
}

// ── HAMBURGER MENU ──
const ham = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
if (ham && navLinks) {
  ham.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));
}

// ── ACTIVE NAV LINK ──
const currentPage = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  const href = a.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    a.classList.add('active');
  }
});

// ── SCROLL FADE-IN ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// ── TERMINAL TYPING ANIMATION ──
function typeLines(el, lines, speed = 40) {
  if (!el) return;
  el.innerHTML = '';
  let lineIdx = 0, charIdx = 0;

  function type() {
    if (lineIdx >= lines.length) {
      // Add blinking cursor at end
      const cursorEl = document.createElement('span');
      cursorEl.className = 'terminal-cursor';
      el.appendChild(cursorEl);
      return;
    }
    const line = lines[lineIdx];
    let row = el.querySelector(`[data-line="${lineIdx}"]`);
    if (!row) {
      row = document.createElement('div');
      row.className = 'terminal-line';
      row.setAttribute('data-line', lineIdx);
      if (line.type === 'cmd') {
        row.innerHTML = `<span class="prompt">$</span><span class="cmd-text"></span>`;
      } else {
        row.innerHTML = `<span class="terminal-output"></span>`;
      }
      el.appendChild(row);
    }
    const textEl = row.querySelector('.cmd-text, .terminal-output');
    if (charIdx < line.text.length) {
      textEl.textContent += line.text[charIdx];
      charIdx++;
      setTimeout(type, speed);
    } else {
      charIdx = 0;
      lineIdx++;
      setTimeout(type, line.pause || 200);
    }
  }
  type();
}

const termBody = document.querySelector('.terminal-body');
if (termBody) {
  const lines = [
    { type: 'cmd', text: 'whoami', pause: 300 },
    { type: 'out', text: 'milind_sahu @ iiser_tirupati' },
    { type: 'cmd', text: 'cat research.txt', pause: 200 },
    { type: 'out', text: '> Math Economics / Optimization' },
    { type: 'out', text: '> Energy Systems / Game Theory' },
    { type: 'cmd', text: 'echo $AFFILIATION', pause: 200 },
    { type: 'out', text: 'AXL — Axiom Labs' },
  ];
  setTimeout(() => typeLines(termBody, lines, 38), 600);
}

// ── PROJECT FILTER ──
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    projectCards.forEach(card => {
      const cat = card.dataset.category || '';
      const show = filter === 'all' || cat.includes(filter);
      card.style.display = show ? '' : 'none';
    });
  });
});

// ── TICKER DUPLICATE (seamless loop) ──
const ticker = document.querySelector('.ticker');
if (ticker) {
  ticker.innerHTML += ticker.innerHTML;
}

// ── SMOOTH ANCHOR ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ── NAV SHRINK ON SCROLL ──
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 80) {
    nav.style.borderBottomColor = 'var(--light-grey)';
    nav.style.background = 'rgba(255,255,255,0.97)';
  } else {
    nav.style.background = 'rgba(255,255,255,0.92)';
  }
});

// ── DARK / LIGHT THEME TOGGLE ──
const themeBtn = document.querySelector('.theme-toggle');
const savedTheme = localStorage.getItem('axl-theme') || 'light';

// Apply saved theme on load
if (savedTheme === 'dark') {
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
