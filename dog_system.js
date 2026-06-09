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
      '   DAAAAAEAB    ',
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

// --- Web Audio Synthesizer (Retro 8-bit Sound Effects) ---
var audioCtx = null;
function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

function playSound(type) {
  try {
    var ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    var now = ctx.currentTime;

    if (type === 'pat') {
      // Sweet arpeggio/rising love tone
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(640, now + 0.16);
      
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.16);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.16);
    } 
    else if (type === 'throw') {
      // Throw chirp: descending pitch
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(550, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.1);
      
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    } 
    else if (type === 'catch') {
      // Success/Catch note arpeggio
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(523, now); // C5
      osc.frequency.setValueAtTime(659, now + 0.06); // E5
      osc.frequency.setValueAtTime(784, now + 0.12); // G5
      
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.005, now + 0.22);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.22);
    } 
    else if (type === 'bark') {
      // Retro bark sound
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(170, now);
      osc.frequency.exponentialRampToValueAtTime(360, now + 0.04);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.12);
      
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    } 
    else if (type === 'chomp') {
      // Eating/crunch noise
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(130, now);
      osc.frequency.linearRampToValueAtTime(30, now + 0.06);
      
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.06);
    }
  } catch (e) {
    console.warn("Audio Context blocked or not supported", e);
  }
}

function drawDog(ctx, def, px, frame, happy, offsetX, offsetY, facingLeft) {
  var grid = def.grid;
  var colorMap = { A: def.A, B: def.B, C: def.C, D: def.D, E: def.E, F: def.F };
  var ox = offsetX || 0;
  var oy = offsetY || 0;
  var legOffsets = [0, 1, 0, -1];
  
  grid.forEach(function(row, y) {
    for (var x = 0; x < row.length && x < 16; x++) {
      var targetX = facingLeft ? (15 - x) : x;
      var ch = row[x];
      if (ch === ' ') continue;
      var col = colorMap[ch];
      if (!col) continue;
      var legShift = (y >= 12) ? legOffsets[(frame + (x % 2 === 0 ? 0 : 2)) % 4] : 0;
      ctx.fillStyle = col;
      ctx.fillRect(ox + targetX * px, oy + y * px + legShift, px, px);
    }
  });
  if (happy) {
    ctx.fillStyle = def.D || '#c07030';
    var wag = frame % 2 === 0 ? 1 : -1;
    var tx = facingLeft ? (15 - (2 + wag)) : (2 + wag);
    if (tx >= 0 && tx < 16) ctx.fillRect(ox + tx * px, oy + 6 * px, px, px);
  }
}

function drawGameStage(ctx, width, height, def, dogState, dogX, dogY, dogFrame, facingLeft, toyState, toyX, toyY, foodState, foodX, foodY, crumbs, bubbleText) {
  // Clear background
  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(0, 0, width, height);

  // Draw retro grid background lines
  ctx.strokeStyle = '#141414';
  ctx.lineWidth = 1;
  for (var x = 0; x < width; x += 20) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
  }
  for (var y = 0; y < height; y += 20) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
  }

  // Draw ground line
  ctx.fillStyle = '#161616';
  ctx.fillRect(0, height - 10, width, 10);
  ctx.fillStyle = '#c8ff00'; // accent highlight line for ground
  ctx.fillRect(0, height - 12, width, 2);

  // Draw food treat if dropped
  if (foodState === 'dropped') {
    ctx.fillStyle = '#e8a050';
    ctx.fillRect(foodX - 4, foodY - 4, 8, 8);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(foodX - 2, foodY - 2, 4, 4);
  }

  // Draw toy fetch ball if thrown
  if (toyState === 'thrown') {
    ctx.fillStyle = '#ff6b35'; // orange bouncing ball
    ctx.beginPath();
    ctx.arc(toyX, toyY, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  // Draw crumbs
  if (crumbs && crumbs.length > 0) {
    ctx.fillStyle = '#e8a050';
    crumbs.forEach(function(c) {
      ctx.fillRect(c.x, c.y, 2, 2);
    });
  }

  // Draw dog (scale px = 4)
  var px = 4;
  drawDog(ctx, def, px, dogFrame, dogState === 'eating' || dogState === 'happy', dogX, dogY, facingLeft);

  // Draw speech bubble if active
  if (bubbleText) {
    ctx.fillStyle = '#e8e8e8';
    ctx.font = 'bold 8px "Space Mono", monospace';
    var textW = ctx.measureText(bubbleText).width;
    var bx = dogX + 32 - textW / 2;
    var by = dogY - 12;
    
    // Clamp bubble within screen bounds
    bx = Math.max(5, Math.min(width - textW - 5, bx));

    // Draw bubble box
    ctx.fillStyle = '#111';
    ctx.strokeStyle = '#c8ff00';
    ctx.lineWidth = 1;
    ctx.fillRect(bx - 3, by - 8, textW + 6, 12);
    ctx.strokeRect(bx - 3, by - 8, textW + 6, 12);

    // Draw speech bubble text
    ctx.fillStyle = '#e8e8e8';
    ctx.fillText(bubbleText, bx, by + 1);
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

  // Inject CSS if not already present
  if (!document.getElementById('dog-system-css')) {
    var s = document.createElement('style');
    s.id = 'dog-system-css';
    s.textContent = [
      '#dog-intro-overlay{position:fixed;inset:0;z-index:10000;background:rgba(10,10,10,0.93);backdrop-filter:blur(14px);display:flex;align-items:center;justify-content:center;animation:dogFadeIn 0.35s ease;}',
      '#dog-intro-overlay.exiting{animation:dogFadeOut 0.7s ease forwards;}',
      '@keyframes dogFadeIn{from{opacity:0;transform:scale(0.97)}to{opacity:1;transform:scale(1)}}',
      '@keyframes dogFadeOut{from{opacity:1;transform:scale(1)}to{opacity:0;transform:scale(0.95)}}',
      '.dog-game-wrap{background:#111;border:1px solid #222;border-radius:6px;padding:1.5rem;width:min(420px,94vw);display:flex;flex-direction:column;align-items:center;gap:0.8rem;box-shadow:0 24px 80px rgba(0,0,0,0.6);}',
      '.dog-intro-eyebrow{font-family:"Space Mono",monospace;font-size:10px;letter-spacing:0.25em;color:#c8ff00;text-transform:uppercase;}',
      '.dog-intro-title{font-family:"Space Mono",monospace;font-size:20px;font-weight:700;letter-spacing:0.06em;color:#e8e8e8;}',
      '.dog-intro-sub{font-size:11px;color:#555;letter-spacing:0.05em;text-align:center;}',
      '.dog-picker{display:flex;gap:0.5rem;flex-wrap:wrap;justify-content:center;}',
      '.dog-pick-btn{background:#181818;border:2px solid #2a2a2a;border-radius:4px;padding:0.4rem;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:0.3rem;transition:border-color 0.2s,background 0.2s;}',
      '.dog-pick-btn:hover{border-color:#444;background:#222;}',
      '.dog-pick-btn.selected{border-color:#c8ff00;background:rgba(200,255,0,0.06);}',
      '.dog-pick-canvas{display:block;image-rendering:pixelated;}',
      '.dog-pick-label{font-family:"Space Mono",monospace;font-size:8px;letter-spacing:0.1em;color:#888;text-transform:uppercase;}',
      '.dog-pick-btn.selected .dog-pick-label{color:#c8ff00;}',
      '.dog-game-stage{position:relative;width:100%;height:140px;background:#0a0a0a;border:1px solid #1a1a1a;border-radius:4px;overflow:hidden;}',
      '.dog-stage-canvas{position:absolute;image-rendering:pixelated;display:block;}',
      '.dog-stage-hearts{position:absolute;inset:0;pointer-events:none;}',
      '.heart-particle{position:absolute;color:#ff6b9d;pointer-events:none;animation:heartFloat 0.9s ease forwards;}',
      '@keyframes heartFloat{0%{opacity:1;transform:translateY(0) scale(1)}100%{opacity:0;transform:translateY(-42px) scale(0.6)}}',
      '.dog-complete-msg{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;background:rgba(10,10,10,0.88);opacity:0;pointer-events:none;transition:opacity 0.35s;z-index:100;}',
      '.dog-complete-msg.show{opacity:1;}',
      '.dog-complete-title{font-family:"Space Mono",monospace;font-size:16px;font-weight:700;color:#c8ff00;letter-spacing:0.12em;}',
      '.dog-complete-sub{font-size:11px;color:#888;margin-top:0.3rem;}',
      '.happiness-wrap{width:100%;}',
      '.happiness-label{display:flex;justify-content:space-between;font-family:"Space Mono",monospace;font-size:9px;letter-spacing:0.15em;color:#555;text-transform:uppercase;margin-bottom:0.4rem;}',
      '#happy-pct{color:#c8ff00;}',
      '.happiness-track{width:100%;height:4px;background:#1a1a1a;border-radius:2px;overflow:hidden;}',
      '.happiness-fill{height:100%;background:linear-gradient(90deg,#c8ff00,#00ff88);border-radius:2px;width:0%;transition:width 0.3s ease;}',
      '.dog-action-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;width:100%;}',
      '.dog-action-btn{font-family:"Space Mono",monospace;font-size:10px;font-weight:700;letter-spacing:0.05em;padding:0.6rem;border-radius:3px;cursor:pointer;transition:all 0.18s;}',
      '.dog-action-btn:hover{transform:scale(1.02);}',
      '.pet-btn{background:rgba(255,107,157,0.06);border:1px solid rgba(255,107,157,0.35);color:#ff6b9d;}',
      '.pet-btn:hover{background:rgba(255,107,157,0.18)!important;}',
      '.feed-btn{background:rgba(232,160,80,0.06);border:1px solid rgba(232,160,80,0.35);color:#e8a050;}',
      '.feed-btn:hover{background:rgba(232,160,80,0.18)!important;}',
      '.play-btn{background:rgba(0,200,150,0.06);border:1px solid rgba(0,200,150,0.35);color:#00c896;}',
      '.play-btn:hover{background:rgba(0,200,150,0.18)!important;}',
      '.skip-btn{background:none;border:1px solid #2a2a2a;color:#555;}',
      '.skip-btn:hover{color:#888!important;border-color:#444!important;}',
      '.confetti-piece{position:fixed;z-index:10001;pointer-events:none;animation:confettiFall 1.8s ease forwards;}',
      '@keyframes confettiFall{0%{opacity:1;transform:translateY(0) rotate(0deg)}100%{opacity:0;transform:translateY(90px) rotate(400deg)}}'
    ].join('');
    document.head.appendChild(s);
  }

  var PX_PICK = 5, GRID = 16, GOAL = 10;

  var overlay = document.createElement('div');
  overlay.id = 'dog-intro-overlay';

  var wrap = document.createElement('div');
  wrap.className = 'dog-game-wrap';
  wrap.innerHTML =
    '<div class="dog-intro-eyebrow">interactive pet</div>' +
    '<div class="dog-intro-title">CHOOSE A BUDDY</div>' +
    '<div class="dog-intro-sub">earn points to unlock. your companion stays at page bottom!</div>';
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
    
    var pCtx = cv.getContext('2d');
    pCtx.clearRect(0, 0, cv.width, cv.height);
    drawDog(pCtx, def, PX_PICK, 0, false, 0, 0, false);
    
    var lbl = document.createElement('div');
    lbl.className = 'dog-pick-label';
    lbl.textContent = def.label;
    
    btn.appendChild(cv); btn.appendChild(lbl);
    btn.addEventListener('click', function() {
      Object.keys(pickerBtns).forEach(function(k) { pickerBtns[k].classList.remove('selected'); });
      btn.classList.add('selected');
      selectedDog = key;
      localStorage.setItem('axl-dog', key);
      
      // Reset game stage coordinates for new dog
      dogX = 160 - 32;
      dogY = 46;
      dogState = 'idle';
      facingLeft = false;
      playSound('bark');
    });
    pickerBtns[key] = btn;
    picker.appendChild(btn);
  });
  wrap.appendChild(picker);

  // Setup interactive stage canvas (320px x 120px)
  var stage = document.createElement('div');
  stage.className = 'dog-game-stage';
  
  var stageCv = makeCanvas(320, 120);
  stageCv.className = 'dog-stage-canvas';
  stageCv.style.left = '50%';
  stageCv.style.transform = 'translateX(-50%)';
  stageCv.style.bottom = '10px';
  stageCv.style.top = 'auto';
  stageCtx = stageCv.getContext('2d');

  var heartsDiv = document.createElement('div');
  heartsDiv.className = 'dog-stage-hearts';

  var completeMsg = document.createElement('div');
  completeMsg.className = 'dog-complete-msg';
  completeMsg.innerHTML =
    '<div class="dog-complete-title">BEST FRIENDS!</div>' +
    '<div class="dog-complete-sub">your pet companion is summoned...</div>';

  stage.appendChild(stageCv);
  stage.appendChild(heartsDiv);
  stage.appendChild(completeMsg);
  wrap.appendChild(stage);

  var happyWrap = document.createElement('div');
  happyWrap.className = 'happiness-wrap';
  happyWrap.innerHTML =
    '<div class="happiness-label"><span>HAPPINESS BOND</span><span id="happy-pct">0%</span></div>' +
    '<div class="happiness-track"><div class="happiness-fill" id="happy-fill"></div></div>';
  wrap.appendChild(happyWrap);

  // Setup action grid (2x2)
  var actionGrid = document.createElement('div');
  actionGrid.className = 'dog-action-grid';
  
  var petBtn = document.createElement('button');
  petBtn.className = 'dog-action-btn pet-btn';
  petBtn.textContent = '❤️ PAT PET';

  var feedBtn = document.createElement('button');
  feedBtn.className = 'dog-action-btn feed-btn';
  feedBtn.textContent = '🍖 TREAT (+1)';

  var playBtn = document.createElement('button');
  playBtn.className = 'dog-action-btn play-btn';
  playBtn.textContent = '🥎 FETCH (+2)';

  var skipBtn = document.createElement('button');
  skipBtn.className = 'dog-action-btn skip-btn';
  skipBtn.textContent = '🚪 EXIT';

  actionGrid.appendChild(petBtn);
  actionGrid.appendChild(feedBtn);
  actionGrid.appendChild(playBtn);
  actionGrid.appendChild(skipBtn);
  wrap.appendChild(actionGrid);
  
  document.body.appendChild(overlay);

  // --- Game Loop States ---
  var happiness = 0, frame = 0, complete = false, animFrame, lastFrameT = 0;
  
  var dogX = 160 - 32; // Centered
  var dogY = 46;       // Standing on ground Y = 110 (Y_ground - Height_dog = 110 - 64 = 46)
  var dogTargetX = dogX;
  var dogVy = 0;
  var dogState = 'idle'; // 'idle', 'running', 'jumping', 'eating', 'happy'
  var facingLeft = false;
  
  var eatingTimer = 0;
  var happyTimer = 0;
  
  var bubbleText = 'Hello!';
  var bubbleTimer = 1500;
  
  var toyState = 'none'; // 'none', 'thrown'
  var toyX = 0, toyY = 0, toyVx = 0, toyVy = 0;
  
  var foodState = 'none'; // 'none', 'dropped'
  var foodX = 0, foodY = 0;
  
  var crumbs = [];

  var lastUpdate = performance.now();

  function animStage(ts) {
    var dt = ts - lastUpdate;
    if (!dt) dt = 16;
    lastUpdate = ts;

    // Frame delay for foot movement
    if (ts - lastFrameT > (dogState === 'running' ? 100 : 250)) {
      frame = (frame + 1) % 4;
      lastFrameT = ts;
    }

    // --- State Machine updates ---
    if (dogState === 'happy') {
      happyTimer -= dt;
      if (happyTimer <= 0) dogState = 'idle';
    }

    if (dogState === 'eating') {
      eatingTimer -= dt;
      // Spawn crumb particle
      if (Math.random() < 0.2) {
        crumbs.push({
          x: dogX + (facingLeft ? 12 : 52) + (Math.random() * 4 - 2),
          y: dogY + 46 + (Math.random() * 4 - 2),
          vx: (Math.random() * 2 - 1) * 0.8,
          vy: -Math.random() * 1.5
        });
      }
      if (eatingTimer <= 0) {
        dogState = 'happy';
        happyTimer = 1000;
        bubbleText = 'Yum! \u2665';
        bubbleTimer = 1500;
      }
    }

    if (dogState === 'jumping') {
      dogY += dogVy;
      dogVy += 0.25; // Gravity
      if (dogY >= 46) {
        dogY = 46;
        dogState = 'idle';
      }
    }

    // --- Physics: Dropped Treat ---
    if (foodState === 'dropped') {
      foodY += 2;
      if (foodY >= 100) foodY = 100;

      // Dog targets the treat
      dogTargetX = foodX - 32;
      var dx = dogTargetX - dogX;
      if (Math.abs(dx) > 4) {
        facingLeft = dx < 0;
        dogX += Math.sign(dx) * 2.2;
        if (dogState !== 'jumping') dogState = 'running';
      } else {
        if (foodY >= 100) {
          foodState = 'none';
          dogState = 'eating';
          eatingTimer = 1500;
          bubbleText = '*chomp chomp*';
          bubbleTimer = 1500;
          updateBar(happiness + 1);

          // Play chewing sounds
          playSound('chomp');
          setTimeout(function() { playSound('chomp'); }, 150);
          setTimeout(function() { playSound('chomp'); }, 300);
          setTimeout(function() { playSound('chomp'); }, 450);
        }
      }
    }

    // --- Physics: Fetch Ball ---
    if (toyState === 'thrown') {
      toyX += toyVx;
      toyY += toyVy;
      toyVy += 0.18; // Gravity

      // Bounce ground
      if (toyY >= 106) {
        toyY = 106;
        toyVy = -toyVy * 0.55;
        toyVx *= 0.85;
      }
      // Bounce walls
      if (toyX <= 6 || toyX >= 314) {
        toyVx = -toyVx;
      }

      // Dog chases ball
      dogTargetX = toyX - 32;
      var dx = dogTargetX - dogX;
      if (Math.abs(dx) > 4) {
        facingLeft = dx < 0;
        dogX += Math.sign(dx) * 2.6;
        if (dogState !== 'jumping') dogState = 'running';

        // Trigger jump!
        if (Math.abs(dx) < 30 && toyY < 75 && toyY > 40 && dogState !== 'jumping') {
          dogState = 'jumping';
          dogVy = -4.5;
        }
      } else {
        if (dogState !== 'jumping') dogState = 'idle';
      }

      // Intersection check (Catch!)
      var dist = Math.sqrt(Math.pow((dogX + 32) - toyX, 2) + Math.pow((dogY + 32) - toyY, 2));
      if (dist < 20) {
        toyState = 'none';
        bubbleText = 'Caught! \u2605';
        bubbleTimer = 1500;
        dogState = 'happy';
        happyTimer = 1000;
        updateBar(happiness + 2);
        spawnHeart();
        playSound('catch');
      }
    }

    // --- Physics: Idle Walk ---
    if (foodState === 'none' && toyState === 'none' && dogState !== 'eating' && dogState !== 'happy' && dogState !== 'jumping') {
      var dx = dogTargetX - dogX;
      if (Math.abs(dx) > 4) {
        facingLeft = dx < 0;
        dogX += Math.sign(dx) * 1.2;
        dogState = 'running';
      } else {
        dogState = 'idle';
        if (Math.random() < 0.008) {
          dogTargetX = Math.random() * (260 - 60) + 60;
        }
      }
    }

    // --- Crumb physics ---
    for (var i = crumbs.length - 1; i >= 0; i--) {
      var c = crumbs[i];
      c.x += c.vx;
      c.y += c.vy;
      c.vy += 0.15;
      if (c.y > 115) crumbs.splice(i, 1);
    }

    // --- Bubble decayer ---
    if (bubbleText) {
      bubbleTimer -= dt;
      if (bubbleTimer <= 0) bubbleText = '';
    }

    // Render step
    drawGameStage(stageCtx, 320, 120, DOG_DEFS[selectedDog], dogState, dogX, dogY, frame, facingLeft, toyState, toyX, toyY, foodState, foodX, foodY, crumbs, bubbleText);

    animFrame = requestAnimationFrame(animStage);
  }
  animFrame = requestAnimationFrame(animStage);

  function spawnHeart() {
    var h = document.createElement('div');
    h.className = 'heart-particle';
    var hearts = ['\u2665', '\u2661', '\u2764', '!', '*'];
    h.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    h.style.left = (120 + Math.random() * 80) + 'px';
    h.style.top  = (30 + Math.random() * 40) + 'px';
    h.style.fontSize = (12 + Math.random() * 8) + 'px';
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

  // --- Buttons Wire up ---
  petBtn.addEventListener('click', function() {
    if (complete) return;
    if (dogState === 'eating' || dogState === 'jumping') return;
    dogState = 'happy';
    happyTimer = 1000;
    bubbleText = 'Woof! \u2665';
    bubbleTimer = 1500;
    updateBar(happiness + 1);
    spawnHeart();

    playSound('pat');
    setTimeout(function() { playSound('bark'); }, 80);
    
    // Quick pop scale animation
    stageCv.style.transition = 'transform 0.08s';
    stageCv.style.transform  = 'translateX(-50%) scale(1.06)';
    setTimeout(function() { stageCv.style.transform = 'translateX(-50%) scale(1)'; }, 100);
  });

  feedBtn.addEventListener('click', function() {
    if (complete) return;
    if (foodState !== 'none' || toyState !== 'none' || dogState === 'eating') return;
    foodX = Math.random() * (240 - 80) + 80;
    foodY = 0;
    foodState = 'dropped';
    bubbleText = 'Treat! \u2665';
    bubbleTimer = 1200;
    playSound('throw');
  });

  playBtn.addEventListener('click', function() {
    if (complete) return;
    if (foodState !== 'none' || toyState !== 'none' || dogState === 'eating') return;
    if (dogX < 120) {
      toyX = 10;
      toyVx = 3.5 + Math.random() * 1.5;
    } else {
      toyX = 310;
      toyVx = -(3.5 + Math.random() * 1.5);
    }
    toyY = 30;
    toyVy = -3.2 - Math.random() * 1.5;
    toyState = 'thrown';
    bubbleText = 'Ball!';
    bubbleTimer = 1200;
    playSound('throw');
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
    playSound('catch');
    setTimeout(function() { playSound('catch'); }, 150);
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
  var H = 20 * PX; // Taller canvas to provide bubble room

  var container = document.createElement('div');
  container.id = 'persistent-dog';
  container.style.cssText = 'position:fixed;bottom:0;z-index:9997;width:' + W + 'px;height:' + H + 'px;pointer-events:auto;';
  
  var cv = makeCanvas(W, H);
  cv.style.pointerEvents = 'none'; // Clicks pass through the canvas
  container.appendChild(cv);

  // Close Button for mobile / desktop
  var closeBtn = document.createElement('button');
  closeBtn.textContent = '×';
  closeBtn.style.cssText = 'position:absolute;top:-8px;right:-8px;width:18px;height:18px;background:#111;border:1px solid #333;color:#888;border-radius:50%;font-size:10px;font-family:monospace;cursor:pointer;line-height:16px;text-align:center;padding:0;pointer-events:auto;z-index:9999;display:none;';
  container.appendChild(closeBtn);
  
  document.body.appendChild(container);

  var ctx = cv.getContext('2d');
  var dogX = window.innerWidth / 2;
  var targetX = dogX;
  var frame = 0;
  var lastFrameT = 0;
  var facingLeft = false;
  var idleT = 0;
  
  var lastMouseMoveT = Date.now();
  var wanderTargetX = dogX;
  var wanderState = 'idle'; // 'idle', 'walking', 'sleeping', 'barking'
  var wanderTimer = 0;
  
  var bubbleText = '';
  var bubbleTimer = 0;

  // Intercept cursor moves (Desktop)
  document.addEventListener('mousemove', function(e) {
    targetX = e.clientX;
    lastMouseMoveT = Date.now();
  });

  // Intercept taps (Mobile)
  document.addEventListener('touchstart', function(e) {
    if (e.touches && e.touches[0]) {
      // If tapping the dog itself, play bark sound
      var rect = container.getBoundingClientRect();
      var touch = e.touches[0];
      if (touch.clientX >= rect.left && touch.clientX <= rect.right &&
          touch.clientY >= rect.top && touch.clientY <= rect.bottom) {
        playSound('bark');
        bubbleText = 'Woof!';
        bubbleTimer = 1200;
      }
      
      targetX = e.touches[0].clientX;
      lastMouseMoveT = Date.now();
    }
    
    // Show close button for 3s on touch
    closeBtn.style.display = 'block';
    clearTimeout(container.hideCloseTimer);
    container.hideCloseTimer = setTimeout(function() {
      closeBtn.style.display = 'none';
    }, 3000);
  });

  // Intercept desktop clicks to bark
  container.addEventListener('click', function(e) {
    if (e.target !== closeBtn) {
      playSound('bark');
      bubbleText = 'Woof!';
      bubbleTimer = 1200;
      lastMouseMoveT = Date.now();
    }
  });

  // Show close button on mouse hover
  container.addEventListener('mouseenter', function() { closeBtn.style.display = 'block'; });
  container.addEventListener('mouseleave', function() { closeBtn.style.display = 'none'; });

  closeBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    container.remove();
    sessionStorage.removeItem('dog-summoned');
  });

  function animDog(ts) {
    var now = Date.now();
    var isWandering = (now - lastMouseMoveT > 6000); // 6s of inactivity starts wander mode

    // --- Wander AI Logic (Perfect for Mobile!) ---
    if (isWandering) {
      wanderTimer -= 16;
      if (wanderTimer <= 0) {
        var rand = Math.random();
        if (rand < 0.3) {
          wanderState = 'walking';
          wanderTargetX = Math.random() * (window.innerWidth - W) + W/2;
          wanderTimer = 3000 + Math.random() * 4000;
        } else if (rand < 0.5) {
          wanderState = 'sleeping';
          wanderTimer = 4000 + Math.random() * 4000;
          bubbleText = 'z Z z';
          bubbleTimer = wanderTimer;
        } else if (rand < 0.7) {
          wanderState = 'barking';
          wanderTimer = 2000;
          bubbleText = 'Woof!';
          bubbleTimer = 1200;
        } else {
          wanderState = 'idle';
          wanderTimer = 2000 + Math.random() * 2000;
        }
      }

      if (wanderState === 'walking') {
        targetX = wanderTargetX;
      } else {
        targetX = dogX; // sit still
      }
    }

    var diff = targetX - dogX;
    var isMoving = Math.abs(diff) > 5;
    var speed = Math.min(Math.abs(diff) * 0.05, isWandering ? 1.5 : 3.5);

    if (isMoving) {
      facingLeft = diff < 0;
      dogX += (diff > 0 ? 1 : -1) * speed;
    }
    dogX = Math.max(W / 2, Math.min(window.innerWidth - W / 2, dogX));
    container.style.left = (dogX - W / 2) + 'px';
    cv.style.transform = facingLeft ? 'scaleX(-1)' : 'scaleX(1)';

    var frameDelay = isMoving ? 130 : 600;
    if (ts - lastFrameT > frameDelay) {
      frame = isMoving ? (frame + 1) % 4 : 0;
      
      // Redraw pet
      ctx.clearRect(0, 0, W, H);
      var isHappy = (wanderState === 'barking');
      drawDog(ctx, def, PX, frame, isHappy, 0, 16, false); // drawn at offsetY = 16 to leave space for bubble
      
      // Draw speech bubble
      if (bubbleText && isWandering) {
        ctx.fillStyle = '#111';
        ctx.strokeStyle = '#c8ff00';
        ctx.lineWidth = 1;
        ctx.fillRect(W/2 - 18, 2, 36, 12);
        ctx.strokeRect(W/2 - 18, 2, 36, 12);
        
        ctx.fillStyle = '#fff';
        ctx.font = '7px "Space Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(bubbleText, W/2, 10);
      }
      
      lastFrameT = ts;
    }

    if (!isMoving) {
      idleT += 0.025;
      container.style.marginBottom = (Math.sin(idleT) * 1.5) + 'px';
    } else {
      idleT = 0;
      container.style.marginBottom = '0px';
    }

    if (bubbleText) {
      bubbleTimer -= 16;
      if (bubbleTimer <= 0) bubbleText = '';
    }

    requestAnimationFrame(animDog);
  }
  
  // Clear and draw initial frame
  ctx.clearRect(0, 0, W, H);
  drawDog(ctx, def, PX, 0, false, 0, 16, false);
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

  // Auto-open the game overlay ONLY if they clicked the research tab/link to get here
  if (sessionStorage.getItem('research-tab-clicked') === 'true') {
    sessionStorage.removeItem('research-tab-clicked');
    if (!sessionStorage.getItem('dog-summoned')) {
      buildDogOverlay();
    }
  }
}

// Intercept Research link clicks to support automatic opening on navigation/click
document.addEventListener('click', function(e) {
  var link = e.target.closest('a');
  if (link) {
    var href = link.getAttribute('href') || '';
    var text = link.textContent.trim().toLowerCase();
    
    if (text === 'research' || href.indexOf('research-internship') !== -1) {
      if (window.location.pathname.indexOf('research-internship') !== -1) {
        // If we are already on the research page, trigger the game directly
        if (typeof window.triggerDogGame === 'function') {
          window.triggerDogGame();
        }
      } else {
        // If we are on another page, set a flag so it triggers automatically on load
        sessionStorage.setItem('research-tab-clicked', 'true');
      }
    }
  }
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}

})();
