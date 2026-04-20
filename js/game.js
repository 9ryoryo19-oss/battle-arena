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
    if (id === 'screen-ranking') loadRankingScreen();
    if (id === 'screen-profile') loadProfileScreen();
    // BGM
    BGM.resume();
    if (['screen-title','screen-mode','screen-character','screen-stage','screen-auth','screen-ranking','screen-profile','screen-settings'].includes(id)) {
      BGM.playTitle();
    } else if (id === 'screen-battle') {
      BGM.playBattle();
    } else if (id === 'screen-result') {
      BGM.stop();
    }
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
    const username = document.getElementById('signup-username').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const msg = document.getElementById('auth-msg');
    if (!username || !email || !password) {
      msg.textContent = 'すべて入力してください';
      msg.className = 'auth-msg error';
      return;
    }
    if (password.length < 6) {
      msg.textContent = 'パスワードは6文字以上にしてください';
      msg.className = 'auth-msg error';
      return;
    }
    msg.textContent = '登録中...';
    msg.className = 'auth-msg';
    try {
      const data = await Auth.signUp(email, password, username);
      if (data.session) {
        // メール確認不要 → すぐログイン
        msg.textContent = '登録完了！ようこそ ' + username + ' さん！';
        msg.className = 'auth-msg success';
        setTimeout(() => showScreen('screen-title'), 1000);
      } else {
        // メール確認が必要
        msg.textContent = '確認メールを送りました。メールのリンクをクリックしてからログインしてください。';
        msg.className = 'auth-msg success';
      }
    } catch(e) {
      msg.textContent = 'エラー: ' + (e.message || '登録に失敗しました');
      msg.className = 'auth-msg error';
    }
  }

  let rankingData = [];
  let rankingTab = 'wins';

  async function loadRankingScreen() {
    const list = document.getElementById('ranking-list');
    list.innerHTML = '<div class="ranking-loading">読み込み中...</div>';
    rankingData = await Auth.getRankings(50);
    renderRanking();
    // 自分の順位
    const profile = Auth.getProfile();
    if (profile && rankingData.length) {
      const mine = rankingData.find(r => r.username === profile.username);
      const myCard = document.getElementById('my-rank-card');
      const myInfo = document.getElementById('my-rank-info');
      if (mine) {
        myCard.style.display = '';
        myInfo.innerHTML = `<span class="my-rank-num">#${mine.rank}</span> ${mine.username} — LV${mine.level} / ${mine.total_wins}勝 / 勝率${mine.win_rate}%`;
      }
    }
  }

  function switchRankingTab(tab) {
    rankingTab = tab;
    document.querySelectorAll('.ranking-tab').forEach((b,i) => {
      b.classList.toggle('active', ['wins','winrate','level'][i] === tab);
    });
    renderRanking();
  }

  function renderRanking() {
    const list = document.getElementById('ranking-list');
    if (!rankingData.length) { list.innerHTML = '<div class="ranking-loading">データがありません</div>'; return; }

    let sorted = [...rankingData];
    if (rankingTab === 'wins') sorted.sort((a,b) => b.total_wins - a.total_wins);
    else if (rankingTab === 'winrate') sorted.sort((a,b) => b.win_rate - a.win_rate);
    else if (rankingTab === 'level') sorted.sort((a,b) => b.level - a.level || b.total_wins - a.total_wins);

    const myProfile = Auth.getProfile();
    const medals = ['🥇','🥈','🥉'];
    const charMap = {};
    CHARACTERS.forEach(c => charMap[c.id] = c.icon);

    list.innerHTML = sorted.slice(0, 20).map((r, i) => {
      const rank = i + 1;
      const isMe = myProfile && r.username === myProfile.username;
      const medal = medals[i] || `#${rank}`;
      const favIcon = charMap[r.favorite_char] || '⚔️';
      const stat = rankingTab === 'wins' ? `${r.total_wins}勝`
        : rankingTab === 'winrate' ? `${r.win_rate}%`
        : `LV${r.level}`;
      return `<div class="ranking-row ${isMe ? 'my-row' : ''} ${rank <= 3 ? 'top3' : ''}">
        <span class="rank-medal">${medal}</span>
        <span class="rank-char">${favIcon}</span>
        <span class="rank-name">${r.username}${isMe ? ' 👈' : ''}</span>
        <span class="rank-lv">LV${r.level}</span>
        <span class="rank-stat">${stat}</span>
        <span class="rank-battles">${r.total_battles}戦</span>
      </div>`;
    }).join('');
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

      // Canvasプレビュー（DOM追加後に描画）
      const canvas = document.createElement('canvas');
      canvas.width = 80; canvas.height = 88;
      canvas.className = 'char-card-canvas';

      // タイプバッジ
      const typeColors = { '格闘':'#ef4444','剣':'#22c55e','銃':'#f59e0b','重装':'#78716c','忍者':'#818cf8','魔法':'#a855f7','天使':'#fbbf24' };
      const badge = document.createElement('div');
      badge.className = 'char-type-badge';
      badge.textContent = char.type;
      badge.style.background = typeColors[char.type] || '#666';

      const name = document.createElement('div');
      name.className = 'char-card-name';
      name.textContent = char.name;

      card.appendChild(canvas);
      card.appendChild(badge);
      card.appendChild(name);
      card.addEventListener('click', () => selectChar(char));

      // ホバーでプレビュー更新（アニメ）
      card.addEventListener('mouseenter', () => updateCharPreview(char));
      card.addEventListener('touchstart', () => updateCharPreview(char), { passive: true });

      grid.appendChild(card);

      // DOM追加後に描画（非同期で確実に）
      requestAnimationFrame(() => {
        const ctx = canvas.getContext('2d');
        try { char.sprite(ctx, 8, 2, 64, 84, 1, 'idle'); } catch(e) {
          ctx.font = '32px serif'; ctx.textAlign = 'center';
          ctx.fillText(char.icon, 40, 52);
        }
      });
    });

    // 選択中プレビューのCanvas初期化
    initPreviewCanvas('p1-preview-canvas');
    initPreviewCanvas('p2-preview-canvas');

    document.getElementById('p1-char-display-name').textContent = '?';
    document.getElementById('p2-char-display-name').textContent = '?';
    document.getElementById('p1-char-display').className = 'selected-char';
    document.getElementById('p2-char-display').className = 'selected-char';
    document.getElementById('start-fight-btn').style.display = 'none';
    document.getElementById('selecting-indicator').textContent =
      selectedMode === 'vs-cpu' ? 'あなたのキャラを選んでください' : 'P1 キャラを選択中...';

    // アニメーションループ
    startCharSelectAnimation();
  }

  let charSelectAnimFrame = null;
  let hoveredChar = null;

  function updateCharPreview(char) { hoveredChar = char; }

  function initPreviewCanvas(id) {
    const canvas = document.getElementById(id);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.font = '32px serif';
    ctx.textAlign = 'center';
    ctx.fillText('?', canvas.width/2, canvas.height/2 + 12);
  }

  function startCharSelectAnimation() {
    if (charSelectAnimFrame) cancelAnimationFrame(charSelectAnimFrame);

    function loop() {
      // 選択中キャラの大きいプレビューのみ毎フレーム更新
      const p1canvas = document.getElementById('p1-preview-canvas');
      const p2canvas = document.getElementById('p2-preview-canvas');
      if (p1canvas && selectedChars.p1) {
        const ctx = p1canvas.getContext('2d');
        ctx.clearRect(0, 0, p1canvas.width, p1canvas.height);
        try { selectedChars.p1.sprite(ctx, 8, 2, p1canvas.width-16, p1canvas.height-6, 1, 'idle'); } catch(e) {}
      }
      if (p2canvas && selectedChars.p2) {
        const ctx = p2canvas.getContext('2d');
        ctx.clearRect(0, 0, p2canvas.width, p2canvas.height);
        try { selectedChars.p2.sprite(ctx, 8, 2, p2canvas.width-16, p2canvas.height-6, -1, 'idle'); } catch(e) {}
      }
      const screen = document.getElementById('screen-character');
      if (screen && screen.classList.contains('active')) {
        charSelectAnimFrame = requestAnimationFrame(loop);
      }
    }
    loop();
  }

  function selectChar(char) {
    if (selectedMode === 'vs-cpu') {
      selectedChars.p1 = char;
      const others = CHARACTERS.filter(c => c.id !== char.id);
      selectedChars.p2 = others[Math.floor(Math.random() * others.length)];
      updateSelectedDisplay();
      document.getElementById('start-fight-btn').style.display = 'block';
      document.getElementById('selecting-indicator').textContent = 'P1選択完了！';
      document.querySelectorAll('.char-card').forEach(c => {
        c.classList.toggle('p1-selected', c.dataset.id === char.id);
      });
    } else {
      if (selectingPlayer === 'p1') {
        selectedChars.p1 = char;
        updateSelectedDisplay();
        document.querySelectorAll('.char-card').forEach(c => c.classList.remove('p1-selected'));
        document.querySelector(`.char-card[data-id="${char.id}"]`).classList.add('p1-selected');
        selectingPlayer = 'p2';
        document.getElementById('selecting-indicator').textContent = 'P2 キャラを選択中...';
        document.getElementById('p1-char-display').className = 'selected-char p1-selected';
      } else {
        selectedChars.p2 = char;
        updateSelectedDisplay();
        document.querySelector(`.char-card[data-id="${char.id}"]`).classList.add('p2-selected');
        document.getElementById('start-fight-btn').style.display = 'block';
        document.getElementById('selecting-indicator').textContent = '両プレイヤー選択完了！';
        document.getElementById('p2-char-display').className = 'selected-char p2-selected';
      }
    }
  }

  function updateSelectedDisplay() {
    if (selectedChars.p1) {
      document.getElementById('p1-char-display').className = 'selected-char p1-selected';
      document.getElementById('p1-char-display-name').textContent = selectedChars.p1.name;
      document.getElementById('p1-char-type').textContent = selectedChars.p1.type;
      document.getElementById('p1-name').textContent = selectedChars.p1.name;
    }
    if (selectedChars.p2) {
      document.getElementById('p2-char-display').className = 'selected-char p2-selected';
      document.getElementById('p2-char-display-name').textContent = selectedChars.p2.name;
      document.getElementById('p2-char-type').textContent = selectedChars.p2.type;
      document.getElementById('p2-name').textContent = selectedChars.p2.name;
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
    const isBrawl = selectedMode === 'brawl';
    const is2P = selectedMode === 'vs-player';
    document.getElementById('p2-controls').style.display = is2P ? 'flex' : 'none';
    document.getElementById('p1-name').textContent = selectedChars.p1?.name || 'P1';
    document.getElementById('p2-name').textContent = isBrawl ? '敵' : (selectedChars.p2?.name || 'P2');
    document.getElementById('round-label').textContent = isBrawl ? '乱闘モード' : 'ROUND 1';
    document.getElementById('round-timer').textContent = isBrawl ? '180' : '99';
    document.getElementById('p1-stocks').textContent = '';
    document.getElementById('p2-stocks').textContent = '';
    const guide = document.getElementById('combo-guide');
    if (guide) { guide.style.display = ''; setTimeout(() => { guide.style.display = 'none'; }, 5000); }
    lastBattleResult = null;

    const canvas = document.getElementById('game-canvas');
    engine = new Engine(canvas, selectedStage, selectedChars.p1, selectedChars.p2 || CHARACTERS[0], selectedMode);
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

  return { showScreen, selectMode, startBattle, showResult, rematch, togglePause, switchAuthTab, doLogin, doSignup, switchRankingTab };})();
