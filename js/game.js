// ============================================
// BATTLE ARENA - ゲームコントローラー
// ============================================

const Game = (() => {
  let selectedMode = 'vs-cpu';
  let selectedStage = STAGES[0];
  let selectedChars = { p1: null, p2: null };
  let selectingPlayer = 'p1';
  let engine = null;

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

  // ============ CHARACTER SELECT ============
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
    document.getElementById('p1-char-display').textContent = '?';
    document.getElementById('p2-char-display').textContent = '?';
    document.getElementById('p1-char-display').className = 'selected-char';
    document.getElementById('p2-char-display').className = 'selected-char';
    document.getElementById('start-fight-btn').style.display = 'none';
    document.getElementById('selecting-indicator').textContent = selectedMode === 'vs-cpu' ? 'あなたのキャラを選んでください' : 'P1 キャラを選択中...';
  }

  function selectChar(char) {
    if (selectedMode === 'vs-cpu') {
      selectedChars.p1 = char;
      const others = CHARACTERS.filter(c => c.id !== char.id);
      selectedChars.p2 = others[Math.floor(Math.random() * others.length)];
      document.getElementById('p1-char-display').textContent = char.icon;
      document.getElementById('p1-char-display').classList.add('p1-selected');
      document.getElementById('p2-char-display').textContent = selectedChars.p2.icon;
      document.getElementById('p2-char-display').classList.add('p2-selected');
      document.getElementById('start-fight-btn').style.display = 'block';
      document.getElementById('selecting-indicator').textContent = 'P1選択完了！';
    } else {
      if (selectingPlayer === 'p1') {
        selectedChars.p1 = char;
        document.getElementById('p1-char-display').textContent = char.icon;
        document.getElementById('p1-char-display').classList.add('p1-selected');
        document.querySelectorAll('.char-card').forEach(c => c.classList.remove('p1-selected'));
        document.querySelector(`.char-card[data-id="${char.id}"]`).classList.add('p1-selected');
        selectingPlayer = 'p2';
        document.getElementById('selecting-indicator').textContent = 'P2 キャラを選択中...';
      } else {
        selectedChars.p2 = char;
        document.getElementById('p2-char-display').textContent = char.icon;
        document.getElementById('p2-char-display').classList.add('p2-selected');
        document.querySelector(`.char-card[data-id="${char.id}"]`).classList.add('p2-selected');
        document.getElementById('start-fight-btn').style.display = 'block';
        document.getElementById('selecting-indicator').textContent = '両プレイヤー選択完了！';
      }
    }
  }

  // ============ STAGE SELECT ============
  function initStageSelect() {
    selectedStage = STAGES[0];
    const grid = document.getElementById('stage-grid');
    grid.innerHTML = '';
    STAGES.forEach((stage, i) => {
      const card = document.createElement('div');
      card.className = 'stage-card' + (i === 0 ? ' selected' : '');
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

  // ============ BATTLE ============
  function startBattle() { showScreen('screen-battle'); }

  function initBattle() {
    if (engine) engine.stop();
    document.getElementById('p2-controls').style.display = selectedMode === 'vs-player' ? 'flex' : 'none';
    document.getElementById('p1-name').textContent = selectedChars.p1?.name || 'P1';
    document.getElementById('p2-name').textContent = selectedChars.p2?.name || 'P2';
    document.getElementById('round-label').textContent = 'ROUND 1';
    document.getElementById('round-timer').textContent = '99';

    const canvas = document.getElementById('game-canvas');
    engine = new Engine(canvas, selectedStage, selectedChars.p1, selectedChars.p2, selectedMode);
    setupKeyboard();
    setupTouch();
    setTimeout(() => engine.start(), 300);
  }

  function showResult(winner) {
    showScreen('screen-result');
    document.getElementById('result-title').textContent = 'WINNER!';
    document.getElementById('result-char').textContent = winner.char.icon;
    document.getElementById('result-name').textContent = winner.char.name;
  }

  function rematch() { showScreen('screen-battle'); }

  function togglePause() {
    if (!engine) return;
    engine.paused = !engine.paused;
    document.getElementById('pause-overlay').style.display = engine.paused ? 'flex' : 'none';
    if (!engine.paused && !engine.running) { engine.running = true; engine.loop(); }
  }

  // ============ KEYBOARD ============
  function setupKeyboard() {
    document.onkeydown = (e) => {
      if (!engine) return;
      const p1 = engine.p1, p2 = engine.p2;
      switch(e.key) {
        case 'a': case 'A': p1.input.left = true; break;
        case 'd': case 'D': p1.input.right = true; break;
        case 'w': case 'W': case ' ': p1.input.jump = true; break;
        case 'f': case 'F': p1.queueAttack('normal'); break;
        case 'g': case 'G': p1.queueAttack('mid'); break;
        case 'h': case 'H': p1.queueAttack('special'); break;
        case 'ArrowLeft': p2.input.left = true; e.preventDefault(); break;
        case 'ArrowRight': p2.input.right = true; e.preventDefault(); break;
        case 'ArrowUp': p2.input.jump = true; e.preventDefault(); break;
        case 'j': case 'J': p2.queueAttack('normal'); break;
        case 'k': case 'K': p2.queueAttack('mid'); break;
        case 'l': case 'L': p2.queueAttack('special'); break;
        case 'Escape': togglePause(); break;
      }
    };
    document.onkeyup = (e) => {
      if (!engine) return;
      const p1 = engine.p1, p2 = engine.p2;
      switch(e.key) {
        case 'a': case 'A': p1.input.left = false; break;
        case 'd': case 'D': p1.input.right = false; break;
        case 'w': case 'W': case ' ': p1.input.jump = false; break;
        case 'ArrowLeft': p2.input.left = false; break;
        case 'ArrowRight': p2.input.right = false; break;
        case 'ArrowUp': p2.input.jump = false; break;
      }
    };
  }

  // ============ TOUCH CONTROLS ============
  function setupTouch() {
    setupStick('p1-stick-area', 'p1-stick-knob', 'p1');
    if (selectedMode === 'vs-player') setupStick('p2-stick-area', 'p2-stick-knob', 'p2');
  }

  function setupStick(areaId, knobId, player) {
    const area = document.getElementById(areaId);
    const knob = document.getElementById(knobId);
    if (!area || !knob) return;
    let touchId = null, ox = 0, oy = 0;
    const maxDist = 32;

    area.addEventListener('touchstart', e => {
      e.preventDefault();
      if (touchId !== null) return;
      const t = e.changedTouches[0];
      touchId = t.identifier;
      const rect = area.getBoundingClientRect();
      ox = rect.left + rect.width / 2;
      oy = rect.top + rect.height / 2;
      moveStick(t, player, knob, ox, oy, maxDist);
    }, { passive: false });

    area.addEventListener('touchmove', e => {
      e.preventDefault();
      for (const t of e.changedTouches) {
        if (t.identifier === touchId) moveStick(t, player, knob, ox, oy, maxDist);
      }
    }, { passive: false });

    area.addEventListener('touchend', e => {
      for (const t of e.changedTouches) {
        if (t.identifier === touchId) {
          touchId = null;
          knob.style.transform = 'translate(0,0)';
          if (engine) {
            const f = player === 'p1' ? engine.p1 : engine.p2;
            f.input.left = false; f.input.right = false; f.input.jump = false;
          }
        }
      }
    }, { passive: false });
  }

  function moveStick(touch, player, knob, ox, oy, maxDist) {
    if (!engine) return;
    const f = player === 'p1' ? engine.p1 : engine.p2;
    const dx = touch.clientX - ox;
    const dy = touch.clientY - oy;
    const dist = Math.sqrt(dx*dx + dy*dy);
    const clamped = Math.min(dist, maxDist);
    const angle = Math.atan2(dy, dx);
    knob.style.transform = `translate(${Math.cos(angle)*clamped}px,${Math.sin(angle)*clamped}px)`;
    const threshold = 0.35;
    f.input.left  = dx / maxDist < -threshold;
    f.input.right = dx / maxDist > threshold;
    // スティック上方向でジャンプ
    const justUp = dy / maxDist < -threshold && !f.input.jump;
    if (justUp) f.input.jump = true;
    else if (dy / maxDist >= -threshold) f.input.jump = false;
  }

  // ============ ATTACK BUTTONS (タップ確実発火) ============
  function setupAttackBtn(btnId, player, attackType) {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    btn.addEventListener('touchstart', e => {
      e.preventDefault();
      if (engine) {
        const f = player === 'p1' ? engine.p1 : engine.p2;
        f.queueAttack(attackType);
      }
    }, { passive: false });
    btn.addEventListener('mousedown', e => {
      e.preventDefault();
      if (engine) {
        const f = player === 'p1' ? engine.p1 : engine.p2;
        f.queueAttack(attackType);
      }
    });
  }

  function setupJumpBtn(btnId, player) {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    btn.addEventListener('touchstart', e => {
      e.preventDefault();
      if (engine) { const f = player === 'p1' ? engine.p1 : engine.p2; f.input.jump = true; }
    }, { passive: false });
    btn.addEventListener('touchend', e => {
      e.preventDefault();
      if (engine) { const f = player === 'p1' ? engine.p1 : engine.p2; f.input.jump = false; }
    }, { passive: false });
    btn.addEventListener('mousedown', () => { if (engine) { const f = player === 'p1' ? engine.p1 : engine.p2; f.input.jump = true; } });
    btn.addEventListener('mouseup',   () => { if (engine) { const f = player === 'p1' ? engine.p1 : engine.p2; f.input.jump = false; } });
  }

  // ボタンイベントをDOMロード後に設定
  function initButtons() {
    setupAttackBtn('p1-btn-normal',  'p1', 'normal');
    setupAttackBtn('p1-btn-mid',     'p1', 'mid');
    setupAttackBtn('p1-btn-special', 'p1', 'special');
    setupJumpBtn('p1-btn-jump', 'p1');
    setupAttackBtn('p2-btn-normal',  'p2', 'normal');
    setupAttackBtn('p2-btn-mid',     'p2', 'mid');
    setupAttackBtn('p2-btn-special', 'p2', 'special');
    setupJumpBtn('p2-btn-jump', 'p2');
  }

  window.addEventListener('resize', () => { if (engine) engine.resize(); });
  document.addEventListener('DOMContentLoaded', initButtons);

  return { showScreen, selectMode, startBattle, showResult, rematch, togglePause };
})();
