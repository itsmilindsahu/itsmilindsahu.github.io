// ===========================================
// PIXEL DOG SYSTEM
// ===========================================
(function() {

var DOG_DEFS = {
  corgi: {
    label: 'CORGI',
    A: '#e8a050', B: '#ffffff', C: '#222222', D: '#c07030', E: '#f5c88a', F: '#c07030',
    grid: [
      '                ',
      '       D  D     ',
      '      DAADAA    ',
      '      DAAAAA    ',
      '     DAAAACAC   ',
      '     DAAAABCC   ',
      '  D  DAAAAAB    ',
      '  DDAAAAAAB     ',
      '   DAAAAAAA     ',
      '   DAAAAAAA     ',
      '   DAAAAAAAB    ',
      '   BAAAAAAAB    ',
      '    DA   DA     ',
      '    DA   DA     ',
      '    DA   DA     ',
      '    BB   BB     '
    ],
  },
  shiba: {
    label: 'SHIBA',
    A: '#e0c090', B: '#ffffff', C: '#222222', D: '#c09060', E: '#f5e0c0', F: '#c09060',
    grid: [
      '                ',
      '       D  D     ',
      '      DAADAA    ',
      '      DAAAAA    ',
      '     DAAAACAC   ',
      '     DAAAABCC   ',
      '  DD DAAAAAB    ',
      ' D DDAAAAAB     ',
      '  D DAAAAA      ',
      '   DAAAAAAA     ',
      '   DAAAAAAAB    ',
      '   BAAAAAAAB    ',
      '    DA   DA     ',
      '    DA   DA     ',
      '    DA   DA     ',
      '    BB   BB     '
    ],
  },
  cyber: {
    label: 'CYBER',
    A: '#0a1020', B: '#1a56db', C: '#00c896', D: '#5a8fff', E: '#030a18', F: '#2266ff',
    grid: [
      '                ',
      '       D  D     ',
      '      DAADAA    ',
      '      DAAAAA    ',
      '     DAAAACAC   ',
      '     DAAAABCC   ',
      '  DD DAAAAAB    ',
      ' D DDAAAAAB     ',
      '  D DAAAAA      ',
      '   DAAAAAAA     ',
      '   DAAAAAAAB    ',
      '   BAAAAAAAB    ',
      '    DA   DA     ',
      '    DA   DA     ',
      '    DA   DA     ',
      '    BB   BB     '
    ],
  },
  retro: {
    label: 'GAMEBOY',
    A: '#9bbc0f', B: '#8bac0f', C: '#0f380f', D: '#306230', E: '#9bbc0f', F: '#0f380f',
    grid: [
      '                ',
      '       D  D     ',
      '      DAADAA    ',
      '      DAAAAA    ',
      '     DAAAACAC   ',
      '     DAAAABCC   ',
      '  DD DAAAAAB    ',
      ' D DDAAAAAB     ',
      '  D DAAAAA      ',
      '   DAAAAAAA     ',
      '   DAAAAAAAB    ',
      '   BAAAAAAAB    ',
      '    DA   DA     ',
      '    DA   DA     ',
      '    DA   DA     ',
      '    BB   BB     '
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
      var legShift = (y >= 12) ? legOffsets[(frame + (x % 2 === 0 ? 0 : 2)) % 4] : 0;
      ctx.fillStyle = col;
      ctx.fillRect(x * px, y * px + legShift, px, px);
    }
  });
  if (happy) {
    ctx.fillStyle = def.D || '#c07030';
    var wag = frame % 2 === 0 ? 1 : -1;
    var tx = 2 + wag;
    if (tx >= 0 && tx < 16) ctx.fillRect(tx * px, 6 * px, px, px);
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
  if (document.getElementById('dog-intro-overlay')) return;

  var PX_PICK = 5, PX_STAGE = 5, GRID = 16, GOAL = 10;

  var overlay = document.createElement('div');
  overlay.id = 'dog-intro-overlay';

  var wrap = document.createElement('div');
  wrap.className = 'dog-game-wrap';
  wrap.innerHTML =
    '<div class="dog-intro-eyebrow">welcome</div>' +
    '<div class="dog-intro-title">PICK YOUR BUDDY</div>' +
    '<div class="dog-intro-sub">your companion stays on the research page</div>';
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
    sessionStorage.setItem('dog-summoned', '1');
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

window.triggerDogGame = function() {
  var isResearchPage = window.location.pathname.indexOf('research-internship') !== -1;
  if (!isResearchPage) {
    alert("Summoning is only allowed on the Research page!");
    return;
  }
  buildDogOverlay();
};

function boot() {
  // Only boot the dog system if the user is on the research page
  var isResearchPage = window.location.pathname.indexOf('research-internship') !== -1;
  if (!isResearchPage) {
    return;
  }
  // Auto-launch the persistent pet on load ONLY if they already summoned it in this session
  if (sessionStorage.getItem('dog-summoned')) {
    launchPersistentDog(localStorage.getItem('axl-dog') || 'corgi');
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}

})();
