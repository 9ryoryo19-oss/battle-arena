// ============================================
// BATTLE ARENA - ゲームコントローラー Phase 3
// ============================================

const Game = (() => {
  let selectedMode = 'vs-cpu';
  let selectedStage = STAGES[0];
  let selectedChars = { p1: null, p2: null };
  let selectingPlayer = 'p1';
  let engine = null;
  let lastBattleResult = null;

  // ============ SCREEN ============
  function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    if (id === 'screen-character') initCharSelect();
    if (id === 'screen-stage') initStageSelect();
    if (id === 'screen-battle') initBattle();
    if (id === 'screen-profile') loadProfileScreen();
    if (id === 'screen-title') Auth.updateAuthUI ? Auth.updateAuthUI() : null;
  }

  function selectMode(mode) {
    selectedMode = mode;
    selectedChars = { p1: null, p2: null };
    selectingPlayer = 'p1';
    showScreen('screen-character');
  }

  // ============ AUTH ============
  function switchAuthTab(tab) {
    document.getElementById('auth-form-login').style.display = tab === 'login' ? '' : 'none';
    document.getElementById('auth-form-signup').style.display = tab === 'signup' ? '' : 'none';
    document.getElementById('tab-login').classList.toggle('active', tab === 'login');
    document.getElementById('tab-signup').classList.toggle('active', tab === 'signup');
    document.getElementById('auth-msg').textContent = '';
  }

  async function doLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const msg = document.getElementById('auth-msg');
    msg.textContent = 'ログイン中...';
    msg.className = 'auth-msg';
    try {
      await Auth.signIn(email, password);
      msg.textContent = 'ログイン成功！';
      msg.className = 'auth-msg success';
      setTimeout(() => showScreen('screen-title'), 800);
    } catch(e) {
      msg.textContent = 'エラー: ' + (e.message || 'ログインに失敗しました');
      msg.className = 'auth-msg error';
    }
  }

  async function doSignup() {
    const username = document.getElementById('signup-username').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const msg = document.getElementById('auth-msg');
    if (!username || !email || !password) { msg.textContent = 'すべて入力してください'; msg.className = 'auth-msg error'; return; }
    msg.textContent = '登録中...';
    msg.className = 'auth-msg';
    try {
      await Auth.signUp(email, password, username);
      msg.textContent = '登録完了！メールを確認してください。';
      msg.className = 'auth-msg success';
    } catch(e) {
      msg.textContent = 'エラー: ' + (e.message || '登録に失敗しました');
      msg.className = 'auth-msg error';
    }
  }

  async function loadProfileScreen() {
    const profile = Auth.getProfile();
    if (!profile) return;
    document.getElementById('profile-level2').textContent = profile.level;
    document.getElementById('profile-name2').textContent = profile.username;
    document.getElementById('profile-wins2').textContent = profile.total_wins;
    document.getElementById('profile-losses2').textContent = profile.total_losses;
    document.getElementById('profile-battles2').textContent = profile.total_battles;
    const ratio = profile.exp / Auth.getExpToNextLevel(profile.level) * 100;
    document.getElementById('profile-exp-bar2').style.width = Math.min(ratio,100) + '%';
    document.getElementById('profile-exp-text2').textContent = `${profile.exp} / ${Auth.getExpToNextLevel(profile.level)} EXP`;

    // 戦績一覧
    const list = document.getElementById('records-list');
    list.textContent = '読み込み中...';
    const records = await Auth.getRecentRecords(10);
    if (!records.length) { list.textContent = '戦績がまだありません'; return; }
    list.innerHTML = records.map(r => {
      const char = CHARACTERS.find(c => c.id === r.my_char);
      const opp = CHARACTERS.find(c => c.id === r.opponent_char);
      const date = new Date(r.created_at).toLocaleDateString('ja-JP');
      return `<div class="record-item ${r.result}">
        <span class="record-result">${r.result === 'win' ? '🏆 WIN' : '💀 LOSE'}</span>
        <span class="record-chars">${char?.icon||'?'} vs ${opp?.icon||'?'}</span>
        <span class="record-date">${date}</span>
      </div>`;
    }).join('');
  }

  // ============ CHAR SELECT ============
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
    document.getElementById('selecting-indicator').textContent =
      selectedMode === 'vs-cpu' ? 'あなたのキャラを選んでください' : 'P1 キャラを選択中...';
  }

  function selectChar(char) {
    if (selectedMode === 'vs-cpu') {
      selectedChars.p1 = char;
      const others = CHARACTERS.filter(c => c.id !== char.id);
      selectedChars.p2 = others[Math.floor(Math.random() * others.length)];
      document.getElementById('p1-char-display').textContent = char.icon;
      document.getElementById('p1-char-display').className = 'selected-char p1-selected';
      document.getElementById('p2-char-display').textContent = selectedChars.p2.icon;
      document.getElementById('p2-char-display').className = 'selected-char p2-selected';
      document.getElementById('start-fight-btn').style.display = 'block';
      document.getElementById('selecting-indicator').textContent = 'P1選択完了！';
    } else {
      if (selectingPlayer === 'p1') {
        selectedChars.p1 = char;
        document.getElementById('p1-char-display').textContent = char.icon;
        document.getElementById('p1-char-display').className = 'selected-char p1-selected';
        document.querySelectorAll('.char-card').forEach(c => c.classList.remove('p1-selected'));
        document.querySelector(`.char-card[data-id="${char.id}"]`).classList.add('p1-selected');
        selectingPlayer = 'p2';
        document.getElementById('selecting-indicator').textContent = 'P2 キャラを選択中...';
      } else {
        selectedChars.p2 = char;
        document.getElementById('p2-char-display').textContent = char.icon;
        document.getElementById('p2-char-display').className = 'selected-char p2-selected';
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
    lastBattleResult = null;

    const canvas = document.getElementById('game-canvas');
    engine = new Engine(canvas, selectedStage, selectedChars.p1, selectedChars.p2, selectedMode);
    setupKeyboard();
    setupTouch();
    setTimeout(() => engine.start(), 300);
  }

  async function showResult(winner) {
    // 結果判定
    const isP1Win = winner === engine?.p1;
    const result = isP1Win ? 'win' : 'lose';
    const myHp = Math.ceil(engine?.p1?.hp || 0);

    showScreen('screen-result');
    document.getElementById('result-title').textContent = 'WINNER!';
    document.getElementById('result-char').textContent = winner.char.icon;
    document.getElementById('result-name').textContent = winner.char.name;

    // Supabaseに保存＆EXP表示（ログイン済みかつvsCPU時）
    if (Auth.isLoggedIn() && selectedMode === 'vs-cpu' && selectedChars.p1) {
      try {
        const data = await Auth.saveBattleResult({
          myChar: selectedChars.p1.id,
          opponentChar: selectedChars.p2.id,
          stage: selectedStage.id,
          result,
          myHpRemaining: myHp,
          mode: selectedMode,
        });
        if (data) {
          document.getElementById('result-exp').style.display = '';
          document.getElementById('exp-earned').textContent = `+${data.earnedExp} EXP`;
          if (data.leveledUp) {
            document.getElementById('levelup-msg').style.display = '';
            document.getElementById('levelup-msg').textContent = `🎉 LEVEL ${data.newLevel} UP!`;
          }
          const profile = Auth.getProfile();
          const ratio = profile.exp / Auth.getExpToNextLevel(profile.level) * 100;
          document.getElementById('result-exp-bar').style.width = Math.min(ratio,100) + '%';
        }
      } catch(e) { console.error(e); }
    } else {
      document.getElementById('result-exp').style.display = 'none';
    }
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
        case 'w': case 'W': p1.input.jump = true; break;
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
        case 'w': case 'W': p1.input.jump = false; break;
        case 'ArrowLeft': p2.input.left = false; break;
        case 'ArrowRight': p2.input.right = false; break;
        case 'ArrowUp': p2.input.jump = false; break;
      }
    };
  }

  // ============ TOUCH ============
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
      const t = e.changedTouches[0]; touchId = t.identifier;
      const rect = area.getBoundingClientRect();
      ox = rect.left + rect.width/2; oy = rect.top + rect.height/2;
      moveStick(t, player, knob, ox, oy, maxDist);
    }, { passive: false });
    area.addEventListener('touchmove', e => {
      e.preventDefault();
      for (const t of e.changedTouches) if (t.identifier === touchId) moveStick(t, player, knob, ox, oy, maxDist);
    }, { passive: false });
    area.addEventListener('touchend', e => {
      for (const t of e.changedTouches) {
        if (t.identifier === touchId) {
          touchId = null;
          knob.style.transform = 'translate(0,0)';
          if (engine) { const f = player==='p1'?engine.p1:engine.p2; f.input.left=false; f.input.right=false; f.input.jump=false; }
        }
      }
    }, { passive: false });
  }

  function moveStick(touch, player, knob, ox, oy, maxDist) {
    if (!engine) return;
    const f = player==='p1'?engine.p1:engine.p2;
    const dx = touch.clientX-ox, dy = touch.clientY-oy;
    const dist = Math.sqrt(dx*dx+dy*dy);
    const clamped = Math.min(dist, maxDist);
    const angle = Math.atan2(dy, dx);
    knob.style.transform = `translate(${Math.cos(angle)*clamped}px,${Math.sin(angle)*clamped}px)`;
    const th = 0.35;
    f.input.left  = dx/maxDist < -th;
    f.input.right = dx/maxDist > th;
    if (dy/maxDist < -th && !f.input.jump) f.input.jump = true;
    else if (dy/maxDist >= -th) f.input.jump = false;
  }

  function setupAttackBtn(btnId, player, type) {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    const fire = e => { e.preventDefault(); if(engine){const f=player==='p1'?engine.p1:engine.p2;f.queueAttack(type);} };
    btn.addEventListener('touchstart', fire, { passive: false });
    btn.addEventListener('mousedown', fire);
  }

  function setupJumpBtn(btnId, player) {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    const down = e => { e.preventDefault(); if(engine){const f=player==='p1'?engine.p1:engine.p2;f.input.jump=true;} };
    const up   = e => { e.preventDefault(); if(engine){const f=player==='p1'?engine.p1:engine.p2;f.input.jump=false;} };
    btn.addEventListener('touchstart', down, { passive: false });
    btn.addEventListener('touchend', up, { passive: false });
    btn.addEventListener('mousedown', down);
    btn.addEventListener('mouseup', up);
  }

  function initButtons() {
    setupAttackBtn('p1-btn-normal','p1','normal'); setupAttackBtn('p1-btn-mid','p1','mid'); setupAttackBtn('p1-btn-special','p1','special');
    setupJumpBtn('p1-btn-jump','p1');
    setupAttackBtn('p2-btn-normal','p2','normal'); setupAttackBtn('p2-btn-mid','p2','mid'); setupAttackBtn('p2-btn-special','p2','special');
    setupJumpBtn('p2-btn-jump','p2');
  }

  window.addEventListener('resize', () => { if(engine) engine.resize(); });
  document.addEventListener('DOMContentLoaded', () => {
    initButtons();
    Auth.init().catch(console.error);
  });

  return { showScreen, selectMode, startBattle, showResult, rematch, togglePause, switchAuthTab, doLogin, doSignup };
})();
