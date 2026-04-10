// ============================================
// BATTLE ARENA - ゲームコントローラー
// ============================================

const Game = (() => {
  let selectedMode = 'vs-cpu';
  let selectedStage = STAGES[0];
  let selectedChars = { p1: null, p2: null };
  let selectingPlayer = 'p1';
  let engine = null;

  // ============================================
  // SCREEN MANAGEMENT
  // ============================================
  function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');

    if (id === 'screen-character') initCharSelect();
    if (id === 'screen-stage') initStageSelect();
    if (id === 'screen-battle') initBattle();
  }

  function selectMode(mode) {
    selectedMode = mode;
    selectedChars = { p1: null, p2: null };
    selectingPlayer = 'p1';
    showScreen('screen-character');
  }

  // ============================================
  // CHARACTER SELECT
  // ============================================
  function initCharSelect() {
    selectedChars = { p1: null, p2: null };
    selectingPlayer = 'p1';

    const grid = document.getElementById('char-grid');
    grid.innerHTML = '';

    CHARACTERS.forEach(char => {
      const card = document.createElement('div');
      card.className = 'char-card';
      card.dataset.id = char.id;
      card.innerHTML = `<div class="char-card-icon">${char.icon}</div><div class="char-card-name">${char.name}</div>`;
      card.addEventListener('click', () => selectChar(char));
      grid.appendChild(card);
    });

    document.getElementById('p1-char-display').innerHTML = '?';
    document.getElementById('p2-char-display').innerHTML = '?';
    document.getElementById('p1-char-display').className = 'selected-char';
    document.getElementById('p2-char-display').className = 'selected-char';
    document.getElementById('start-fight-btn').style.display = 'none';
    updateSelectIndicator();
  }

  function selectChar(char) {
    if (selectedMode === 'vs-cpu') {
      selectedChars.p1 = char;
      // CPU random
      const others = CHARACTERS.filter(c => c.id !== char.id);
      selectedChars.p2 = others[Math.floor(Math.random() * others.length)];
      updateCharDisplay();
      document.getElementById('start-fight-btn').style.display = 'block';
      document.getElementById('selecting-indicator').textContent = 'P1選択完了！';
    } else {
      // 2P mode
      if (selectingPlayer === 'p1') {
        selectedChars.p1 = char;
        selectingPlayer = 'p2';
        updateCharDisplay();
        updateSelectIndicator();
        document.querySelectorAll('.char-card').forEach(c => c.classList.remove('p1-selected'));
        document.querySelector(`.char-card[data-id="${char.id}"]`).classList.add('p1-selected');
      } else {
        selectedChars.p2 = char;
        updateCharDisplay();
        document.getElementById('start-fight-btn').style.display = 'block';
        document.getElementById('selecting-indicator').textContent = '両プレイヤー選択完了！';
        document.querySelector(`.char-card[data-id="${char.id}"]`).classList.add('p2-selected');
      }
    }
  }

  function updateCharDisplay() {
    if (selectedChars.p1) {
      document.getElementById('p1-char-display').innerHTML = selectedChars.p1.icon;
      document.getElementById('p1-char-display').classList.add('p1-selected');
    }
    if (selectedChars.p2) {
      document.getElementById('p2-char-display').innerHTML = selectedChars.p2.icon;
      document.getElementById('p2-char-display').classList.add('p2-selected');
    }
    if (selectedChars.p1) {
      document.getElementById('p1-name').textContent = selectedChars.p1.name;
    }
    if (selectedChars.p2) {
      document.getElementById('p2-name').textContent = selectedChars.p2.name;
    }
  }

  function updateSelectIndicator() {
    const ind = document.getElementById('selecting-indicator');
    if (selectedMode === 'vs-cpu') {
      ind.textContent = 'あなたのキャラを選んでください';
    } else {
      ind.textContent = selectingPlayer === 'p1' ? 'P1 キャラを選択中...' : 'P2 キャラを選択中...';
    }
  }

  // ============================================
  // STAGE SELECT
  // ============================================
  function initStageSelect() {
    selectedStage = STAGES[0];
    const grid = document.getElementById('stage-grid');
    grid.innerHTML = '';

    STAGES.forEach((stage, i) => {
      const card = document.createElement('div');
      card.className = 'stage-card' + (i === 0 ? ' selected' : '');
      card.style.background = stage.previewColor;

      // Mini preview canvas
      const mini = document.createElement('canvas');
      mini.width = 200; mini.height = 112;
      mini.className = 'stage-preview';
      stage.bg(mini.getContext('2d'), 200, 112);
      card.appendChild(mini);

      const nameEl = document.createElement('div');
      nameEl.className = 'stage-name';
      nameEl.textContent = stage.name;
      card.appendChild(nameEl);

      card.addEventListener('click', () => {
        document.querySelectorAll('.stage-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        selectedStage = stage;
      });

      grid.appendChild(card);
    });
  }

  // ============================================
  // BATTLE
  // ============================================
  function startBattle() {
    showScreen('screen-battle');
  }

  function initBattle() {
    if (engine) engine.stop();

    // Show/hide P2 controls
    const p2ctrl = document.getElementById('p2-controls');
    if (selectedMode === 'vs-player') {
      p2ctrl.style.display = 'flex';
    } else {
      p2ctrl.style.display = 'none';
    }

    // Names in HUD
    document.getElementById('p1-name').textContent = selectedChars.p1?.name || 'P1';
    document.getElementById('p2-name').textContent = selectedChars.p2?.name || 'P2';
    document.getElementById('round-label').textContent = 'ROUND 1';

    // Create engine
    const canvas = document.getElementById('game-canvas');
    engine = new Engine(canvas, selectedStage, selectedChars.p1, selectedChars.p2, selectedMode);

    // Setup input
    setupKeyboard();
    setupTouch();

    setTimeout(() => {
      engine.start();
    }, 500);
  }

  function showResult(winner) {
    showScreen('screen-result');
    document.getElementById('result-title').textContent = 'WINNER!';
    document.getElementById('result-char').textContent = winner.char.icon;
    document.getElementById('result-name').textContent = winner.char.name;
  }

  function rematch() {
    showScreen('screen-battle');
  }

  function togglePause() {
    if (!engine) return;
    engine.paused = !engine.paused;
    document.getElementById('pause-overlay').style.display = engine.paused ? 'flex' : 'none';
    if (!engine.paused && engine.running === false) {
      engine.running = true;
      engine.loop();
    }
  }

  // ============================================
  // KEYBOARD INPUT
  // ============================================
  function setupKeyboard() {
    document.onkeydown = (e) => {
      if (!engine) return;
      const p1 = engine.p1;
      const p2 = engine.p2;

      switch(e.key) {
        // P1: WASD + F/G/H
        case 'a': case 'A': p1.input.left = true; break;
        case 'd': case 'D': p1.input.right = true; break;
        case 'w': case 'W': if (!p1.input.jump) { p1.input.jump = true; } break;
        case 'f': case 'F': p1.input.normal = true; break;
        case 'g': case 'G': p1.input.mid = true; break;
        case 'h': case 'H': p1.input.special = true; break;

        // P2: Arrow keys + numpad/JKL
        case 'ArrowLeft': p2.input.left = true; e.preventDefault(); break;
        case 'ArrowRight': p2.input.right = true; e.preventDefault(); break;
        case 'ArrowUp': if (!p2.input.jump) { p2.input.jump = true; } e.preventDefault(); break;
        case 'j': case 'J': p2.input.normal = true; break;
        case 'k': case 'K': p2.input.mid = true; break;
        case 'l': case 'L': p2.input.special = true; break;

        case 'Escape': togglePause(); break;
      }
    };

    document.onkeyup = (e) => {
      if (!engine) return;
      const p1 = engine.p1;
      const p2 = engine.p2;

      switch(e.key) {
        case 'a': case 'A': p1.input.left = false; break;
        case 'd': case 'D': p1.input.right = false; break;
        case 'w': case 'W': p1.input.jump = false; break;
        case 'f': case 'F': p1.input.normal = false; break;
        case 'g': case 'G': p1.input.mid = false; break;
        case 'h': case 'H': p1.input.special = false; break;

        case 'ArrowLeft': p2.input.left = false; break;
        case 'ArrowRight': p2.input.right = false; break;
        case 'ArrowUp': p2.input.jump = false; break;
        case 'j': case 'J': p2.input.normal = false; break;
        case 'k': case 'K': p2.input.mid = false; break;
        case 'l': case 'L': p2.input.special = false; break;
      }
    };
  }

  // ============================================
  // TOUCH / VIRTUAL STICK
  // ============================================
  function setupTouch() {
    setupStick('p1-stick-area', 'p1-stick-knob', 'p1');
    if (selectedMode === 'vs-player') {
      setupStick('p2-stick-area', 'p2-stick-knob', 'p2');
    }
  }

  function setupStick(areaId, knobId, player) {
    const area = document.getElementById(areaId);
    const knob = document.getElementById(knobId);
    if (!area || !knob) return;

    let touchId = null;
    let originX = 0, originY = 0;
    const maxDist = 30;

    area.addEventListener('touchstart', (e) => {
      if (touchId !== null) return;
      const touch = e.changedTouches[0];
      touchId = touch.identifier;
      const rect = area.getBoundingClientRect();
      originX = rect.left + rect.width / 2;
      originY = rect.top + rect.height / 2;
      handleStickMove(touch, player, knob, originX, originY, maxDist);
    }, { passive: true });

    area.addEventListener('touchmove', (e) => {
      for (let t of e.changedTouches) {
        if (t.identifier === touchId) {
          handleStickMove(t, player, knob, originX, originY, maxDist);
        }
      }
    }, { passive: true });

    area.addEventListener('touchend', (e) => {
      for (let t of e.changedTouches) {
        if (t.identifier === touchId) {
          touchId = null;
          knob.style.transform = 'translate(0, 0)';
          if (engine) {
            const f = player === 'p1' ? engine.p1 : engine.p2;
            f.input.left = false;
            f.input.right = false;
            f.input.jump = false;
          }
        }
      }
    }, { passive: true });
  }

  function handleStickMove(touch, player, knob, ox, oy, maxDist) {
    if (!engine) return;
    const f = player === 'p1' ? engine.p1 : engine.p2;
    const dx = touch.clientX - ox;
    const dy = touch.clientY - oy;
    const dist = Math.sqrt(dx*dx + dy*dy);
    const clampedDist = Math.min(dist, maxDist);
    const angle = Math.atan2(dy, dx);
    const kx = Math.cos(angle) * clampedDist;
    const ky = Math.sin(angle) * clampedDist;

    knob.style.transform = `translate(${kx}px, ${ky}px)`;

    const threshold = 0.4;
    f.input.left = dx / maxDist < -threshold;
    f.input.right = dx / maxDist > threshold;
    f.input.jump = dy / maxDist < -threshold;
  }

  function btnDown(player, btn) {
    if (!engine) return;
    const f = player === 'p1' ? engine.p1 : engine.p2;
    f.input[btn] = true;
  }

  function btnUp(player, btn) {
    if (!engine) return;
    const f = player === 'p1' ? engine.p1 : engine.p2;
    f.input[btn] = false;
  }

  // ============================================
  // INIT
  // ============================================
  window.addEventListener('resize', () => {
    if (engine) engine.resize();
  });

  return {
    showScreen,
    selectMode,
    startBattle,
    showResult,
    rematch,
    togglePause,
    btnDown,
    btnUp,
  };
})();

// ============================================
// 設定機能の追加
// ============================================
const GameSettings = {
  cpu: 'normal',   // easy / normal / hard
  time: 99,
};

Game.setSetting = function(key, value) {
  GameSettings[key] = value;
  // ボタンのactive切り替え
  if (key === 'cpu') {
    ['easy','normal','hard'].forEach(v => {
      const el = document.getElementById('cpu-' + v);
      if (el) el.classList.toggle('active', v === value);
    });
  } else if (key === 'time') {
    [60, 99, 999].forEach(v => {
      const el = document.getElementById('time-' + v);
      if (el) el.classList.toggle('active', v === value);
    });
  }
};

// CPUとタイマー設定をエンジンに反映
const _origStart = Engine.prototype.start;
Engine.prototype.start = function() {
  // CPU難易度
  const diff = { easy: 0.35, normal: 0.65, hard: 0.9 };
  this._cpuDifficulty = diff[GameSettings.cpu] || 0.65;
  // タイマー
  this.timer = GameSettings.time;
  document.getElementById('round-timer').textContent = this.timer;
  _origStart.call(this);
};

// スティックのジャンプを無効化（専用ジャンプボタンを使う）
const _origHandleStick = handleStickMove || null;
function handleStickMove(touch, player, knob, ox, oy, maxDist) {
  if (!engine) return;
  const f = player === 'p1' ? engine.p1 : engine.p2;
  const dx = touch.clientX - ox;
  const dy = touch.clientY - oy;
  const dist = Math.sqrt(dx*dx + dy*dy);
  const clampedDist = Math.min(dist, maxDist);
  const angle = Math.atan2(dy, dx);
  const kx = Math.cos(angle) * clampedDist;
  const ky = Math.sin(angle) * clampedDist;
  knob.style.transform = `translate(${kx}px, ${ky}px)`;
  const threshold = 0.4;
  f.input.left = dx / maxDist < -threshold;
  f.input.right = dx / maxDist > threshold;
  // ジャンプはスティックではなくボタンで行う → ここではfalseに固定
  // f.input.jump はジャンプボタンで制御
}

// 縦向き検知
window.addEventListener('orientationchange', checkOrientation);
window.addEventListener('resize', checkOrientation);
function checkOrientation() {
  const overlay = document.getElementById('rotate-overlay');
  if (!overlay) return;
  // portrait判定
  const isPortrait = window.innerHeight > window.innerWidth;
  overlay.style.display = isPortrait ? 'flex' : 'none';
}
checkOrientation();
