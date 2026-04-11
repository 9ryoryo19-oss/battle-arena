// ============================================
// BATTLE ARENA - キャラクターデータ Phase 5
// ============================================

const CHARACTERS = [
  {
    id: 'ryu', name: 'リュウ', type: '格闘', icon: '🥋', color: '#00aaff',
    hp: 100, speed: 3, jumpPower: 12,
    attacks: {
      normal:  { damage: 8,  range: 62, cooldown: 20, knockback: 4, color: '#00aaff' },
      mid:     { damage: 15, range: 72, cooldown: 35, knockback: 7, color: '#0077cc' },
      special: { damage: 28, range: 95, cooldown: 60, knockback: 12, color: '#00ffcc', name: '波動拳' },
    },
    description: 'バランス型の格闘家',
    sprite: (ctx, x, y, w, h, dir, state) => drawMartialArtist(ctx, x, y, w, h, dir, state, '#1a6bbf', '#ffffff', '#cc8844'),
  },
  {
    id: 'ken', name: 'ケン', type: '格闘', icon: '🔥', color: '#ff6600',
    hp: 95, speed: 3.5, jumpPower: 12,
    attacks: {
      normal:  { damage: 9,  range: 60, cooldown: 18, knockback: 5, color: '#ff6600' },
      mid:     { damage: 16, range: 68, cooldown: 30, knockback: 8, color: '#ff3300' },
      special: { damage: 30, range: 82, cooldown: 55, knockback: 14, color: '#ff4400', name: '昇龍拳' },
    },
    description: '攻撃的な格闘家',
    sprite: (ctx, x, y, w, h, dir, state) => drawMartialArtist(ctx, x, y, w, h, dir, state, '#cc2200', '#ffffff', '#cc8844'),
  },
  {
    id: 'zoro', name: 'ゾロ', type: '剣', icon: '⚔️', color: '#22c55e',
    hp: 110, speed: 2.8, jumpPower: 10,
    attacks: {
      normal:  { damage: 10, range: 88, cooldown: 22, knockback: 5, color: '#22c55e' },
      mid:     { damage: 20, range: 105, cooldown: 38, knockback: 9, color: '#16a34a' },
      special: { damage: 35, range: 125, cooldown: 65, knockback: 15, color: '#00ff88', name: '三刀流・大切り' },
    },
    description: '剣士・リーチが長い',
    sprite: (ctx, x, y, w, h, dir, state) => drawSwordsman(ctx, x, y, w, h, dir, state, '#1a3a1a', '#22c55e', '#888888'),
  },
  {
    id: 'saber', name: 'セイバー', type: '剣', icon: '🗡️', color: '#a78bfa',
    hp: 105, speed: 3, jumpPower: 12,
    attacks: {
      normal:  { damage: 9,  range: 82, cooldown: 20, knockback: 5, color: '#a78bfa' },
      mid:     { damage: 18, range: 98, cooldown: 35, knockback: 10, color: '#7c3aed' },
      special: { damage: 32, range: 135, cooldown: 60, knockback: 13, color: '#c4b5fd', name: 'エクスカリバー' },
    },
    description: '騎士の剣士',
    sprite: (ctx, x, y, w, h, dir, state) => drawKnight(ctx, x, y, w, h, dir, state),
  },
  {
    id: 'dante', name: 'ダンテ', type: '銃', icon: '🔫', color: '#f59e0b',
    hp: 90, speed: 3.5, jumpPower: 11,
    attacks: {
      normal:  { damage: 7,  range: 115, cooldown: 15, knockback: 3, color: '#f59e0b', projectile: true },
      mid:     { damage: 14, range: 155, cooldown: 28, knockback: 6, color: '#d97706', projectile: true },
      special: { damage: 25, range: 210, cooldown: 55, knockback: 10, color: '#fbbf24', name: 'ラピッドファイア', projectile: true },
    },
    description: '銃使い・射程が長い',
    sprite: (ctx, x, y, w, h, dir, state) => drawGunner(ctx, x, y, w, h, dir, state, '#2a1a0a', '#f59e0b'),
  },
  {
    id: 'noir', name: 'ノワール', type: '銃', icon: '🎯', color: '#94a3b8',
    hp: 85, speed: 4, jumpPower: 12,
    attacks: {
      normal:  { damage: 8,  range: 135, cooldown: 14, knockback: 2, color: '#94a3b8', projectile: true },
      mid:     { damage: 18, range: 185, cooldown: 30, knockback: 5, color: '#64748b', projectile: true },
      special: { damage: 40, range: 260, cooldown: 70, knockback: 8, color: '#f1f5f9', name: 'スナイパー', projectile: true },
    },
    description: 'スナイパー・射程最長',
    sprite: (ctx, x, y, w, h, dir, state) => drawGunner(ctx, x, y, w, h, dir, state, '#0f1520', '#94a3b8'),
  },
  {
    id: 'golem', name: 'ゴーレム', type: '重装', icon: '🪨', color: '#a8a29e',
    hp: 150, speed: 2.5, jumpPower: 8,
    attacks: {
      normal:  { damage: 14, range: 68, cooldown: 30, knockback: 10, color: '#a8a29e' },
      mid:     { damage: 25, range: 78, cooldown: 50, knockback: 16, color: '#78716c' },
      special: { damage: 45, range: 88, cooldown: 80, knockback: 25, color: '#d97706', name: 'グランドスラム' },
    },
    description: 'タンク型・超パワフル',
    sprite: (ctx, x, y, w, h, dir, state) => drawGolem(ctx, x, y, w, h, dir, state),
  },
  {
    id: 'shadow', name: 'シャドウ', type: '忍者', icon: '🌑', color: '#818cf8',
    hp: 80, speed: 4.5, jumpPower: 13,
    attacks: {
      normal:  { damage: 6,  range: 58, cooldown: 12, knockback: 3, color: '#818cf8' },
      mid:     { damage: 14, range: 68, cooldown: 22, knockback: 7, color: '#6366f1' },
      special: { damage: 22, range: 78, cooldown: 40, knockback: 10, color: '#c7d2fe', name: '影分身' },
    },
    description: '忍者・素早い連撃',
    sprite: (ctx, x, y, w, h, dir, state) => drawNinja(ctx, x, y, w, h, dir, state),
  },
  {
    id: 'mage', name: 'マーリン', type: '魔法', icon: '🔮', color: '#c084fc',
    hp: 85, speed: 2.5, jumpPower: 11,
    attacks: {
      normal:  { damage: 8,  range: 105, cooldown: 18, knockback: 4, color: '#c084fc', projectile: true },
      mid:     { damage: 20, range: 145, cooldown: 40, knockback: 9, color: '#a855f7', projectile: true },
      special: { damage: 38, range: 165, cooldown: 70, knockback: 18, color: '#e879f9', name: 'アルカナブラスト', projectile: true },
    },
    description: '魔法使い・強力な遠距離',
    sprite: (ctx, x, y, w, h, dir, state) => drawMage(ctx, x, y, w, h, dir, state),
  },
  {
    id: 'angel', name: 'セラフィ', type: '天使', icon: '👼', color: '#fde68a',
    hp: 90, speed: 3.2, jumpPower: 12,
    attacks: {
      normal:  { damage: 9,  range: 78, cooldown: 18, knockback: 5, color: '#fde68a' },
      mid:     { damage: 18, range: 92, cooldown: 32, knockback: 9, color: '#fbbf24' },
      special: { damage: 33, range: 112, cooldown: 58, knockback: 12, color: '#ffffff', name: '神聖な裁き' },
    },
    description: '天使・空中機動力最強',
    sprite: (ctx, x, y, w, h, dir, state) => drawAngel(ctx, x, y, w, h, dir, state),
  },
];

// ============================================
// ユーティリティ
// ============================================
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x+r, y);
  ctx.lineTo(x+w-r, y); ctx.quadraticCurveTo(x+w, y, x+w, y+r);
  ctx.lineTo(x+w, y+h-r); ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
  ctx.lineTo(x+r, y+h); ctx.quadraticCurveTo(x, y+h, x, y+h-r);
  ctx.lineTo(x, y+r); ctx.quadraticCurveTo(x, y, x+r, y);
  ctx.closePath();
}

function skinGrad(ctx, x, y, h) {
  const g = ctx.createLinearGradient(x, y, x, y+h);
  g.addColorStop(0, '#ffcba4'); g.addColorStop(1, '#d4845a');
  return g;
}

function drawShadowEllipse(ctx, cx, by, rw, rh) {
  ctx.save();
  ctx.globalAlpha = 0.18;
  ctx.fillStyle = '#000';
  ctx.beginPath(); ctx.ellipse(cx, by, rw, rh, 0, 0, Math.PI*2); ctx.fill();
  ctx.restore();
}

// ============================================
// 格闘家（リュウ・ケン）
// ============================================
function drawMartialArtist(ctx, x, y, w, h, dir, state, uniformColor, beltColor, skinTone) {
  ctx.save();
  ctx.translate(x + w/2, y);
  if (dir === -1) ctx.scale(-1, 1);

  const t = Date.now() * 0.003;
  const bob = state === 'idle' ? Math.sin(t) * 2 : 0;
  const B = bob;
  const atk = state === 'attack';
  const hurt = state === 'hurt';

  // 影
  drawShadowEllipse(ctx, 0, h, w*0.45, 5);

  // 脚
  const legColor = uniformColor;
  if (state === 'walk') {
    const sw = Math.sin(t*3) * 8;
    // 左脚
    ctx.fillStyle = legColor;
    ctx.save(); ctx.translate(-w*0.12, h*0.62+B);
    ctx.rotate(sw * 0.04);
    roundRect(ctx, -w*0.1, 0, w*0.19, h*0.3, 3);
    ctx.fill();
    ctx.restore();
    // 右脚
    ctx.save(); ctx.translate(w*0.12, h*0.62+B);
    ctx.rotate(-sw * 0.04);
    roundRect(ctx, -w*0.09, 0, w*0.19, h*0.3, 3);
    ctx.fill();
    ctx.restore();
  } else {
    ctx.fillStyle = legColor;
    roundRect(ctx, -w*0.22, h*0.62+B, w*0.19, h*0.3, 3); ctx.fill();
    roundRect(ctx, w*0.03, h*0.62+B, w*0.19, h*0.3, 3); ctx.fill();
  }
  // 足先
  ctx.fillStyle = '#222';
  roundRect(ctx, -w*0.25, h*0.9+B, w*0.22, h*0.07, 3); ctx.fill();
  roundRect(ctx, w*0.03, h*0.9+B, w*0.22, h*0.07, 3); ctx.fill();

  // 胴体
  const bodyG = ctx.createLinearGradient(-w*0.25, h*0.3+B, w*0.25, h*0.62+B);
  bodyG.addColorStop(0, lighten(uniformColor, 30));
  bodyG.addColorStop(1, uniformColor);
  ctx.fillStyle = bodyG;
  roundRect(ctx, -w*0.25, h*0.3+B, w*0.5, h*0.35, 4);
  ctx.fill();

  // 帯
  ctx.fillStyle = beltColor;
  ctx.fillRect(-w*0.25, h*0.59+B, w*0.5, h*0.05);

  // 腕
  const armSkin = skinGrad(ctx, -w*0.4, h*0.3+B, h*0.3);
  ctx.fillStyle = armSkin;
  if (atk) {
    // 右腕伸ばす
    ctx.save();
    roundRect(ctx, w*0.24, h*0.32+B, w*0.32, h*0.12, 4); ctx.fill();
    // こぶし
    ctx.beginPath(); ctx.arc(w*0.56, h*0.38+B, w*0.1, 0, Math.PI*2); ctx.fill();
    ctx.restore();
    // 左腕は引いた状態
    roundRect(ctx, -w*0.38, h*0.34+B, w*0.16, h*0.25, 3); ctx.fill();
  } else {
    roundRect(ctx, -w*0.38, h*0.32+B, w*0.15, h*0.28, 3); ctx.fill();
    roundRect(ctx, w*0.23, h*0.32+B, w*0.15, h*0.28, 3); ctx.fill();
    // こぶし
    ctx.beginPath(); ctx.arc(-w*0.34, h*0.59+B, w*0.08, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(w*0.29, h*0.59+B, w*0.08, 0, Math.PI*2); ctx.fill();
  }

  // 頭
  const headG = ctx.createRadialGradient(-w*0.06, h*0.14+B, 0, 0, h*0.2+B, w*0.22);
  headG.addColorStop(0, '#ffcba4'); headG.addColorStop(1, '#c97a4a');
  ctx.fillStyle = headG;
  ctx.beginPath(); ctx.arc(0, h*0.2+B, w*0.22, 0, Math.PI*2); ctx.fill();

  // 頭帯
  ctx.fillStyle = beltColor === '#ffffff' ? '#cc0000' : '#ffffff';
  ctx.fillRect(-w*0.22, h*0.13+B, w*0.44, h*0.06);

  // 目
  ctx.fillStyle = hurt ? '#ff4444' : '#222';
  ctx.beginPath(); ctx.arc(-w*0.08, h*0.19+B, w*0.035, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(w*0.08, h*0.19+B, w*0.035, 0, Math.PI*2); ctx.fill();
  // 眉
  ctx.strokeStyle = '#553300'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(-w*0.13, h*0.15+B); ctx.lineTo(-w*0.03, h*0.16+B); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(w*0.03, h*0.16+B); ctx.lineTo(w*0.13, h*0.15+B); ctx.stroke();

  // 攻撃エフェクト
  if (atk) {
    ctx.save();
    ctx.globalAlpha = 0.5;
    const g = ctx.createRadialGradient(w*0.56, h*0.38+B, 0, w*0.56, h*0.38+B, w*0.2);
    g.addColorStop(0, '#ffffff'); g.addColorStop(1, 'transparent');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(w*0.56, h*0.38+B, w*0.2, 0, Math.PI*2); ctx.fill();
    ctx.restore();
  }

  ctx.restore();
}

function lighten(hex, amt) {
  const r = Math.min(255, parseInt(hex.slice(1,3),16)+amt);
  const g = Math.min(255, parseInt(hex.slice(3,5),16)+amt);
  const b = Math.min(255, parseInt(hex.slice(5,7),16)+amt);
  return `rgb(${r},${g},${b})`;
}

// ============================================
// 剣士（ゾロ）
// ============================================
function drawSwordsman(ctx, x, y, w, h, dir, state, coatColor, accentColor, swordColor) {
  ctx.save();
  ctx.translate(x + w/2, y);
  if (dir === -1) ctx.scale(-1, 1);
  const t = Date.now() * 0.003;
  const bob = state === 'idle' ? Math.sin(t)*2 : 0;
  const B = bob; const atk = state === 'attack';

  drawShadowEllipse(ctx, 0, h, w*0.42, 5);

  // コート裾
  ctx.fillStyle = coatColor;
  ctx.beginPath();
  ctx.moveTo(-w*0.28, h*0.58+B);
  ctx.lineTo(-w*0.36, h*0.98);
  ctx.lineTo(w*0.36, h*0.98);
  ctx.lineTo(w*0.28, h*0.58+B);
  ctx.closePath(); ctx.fill();

  // 脚
  ctx.fillStyle = '#1a1a1a';
  roundRect(ctx, -w*0.22, h*0.62+B, w*0.18, h*0.28, 3); ctx.fill();
  roundRect(ctx, w*0.04, h*0.62+B, w*0.18, h*0.28, 3); ctx.fill();
  ctx.fillStyle = '#111';
  roundRect(ctx, -w*0.24, h*0.88+B, w*0.22, h*0.08, 3); ctx.fill();
  roundRect(ctx, w*0.02, h*0.88+B, w*0.22, h*0.08, 3); ctx.fill();

  // 胴
  const bodyG = ctx.createLinearGradient(-w*0.25, h*0.28+B, w*0.25, h*0.62+B);
  bodyG.addColorStop(0, lighten(coatColor, 25)); bodyG.addColorStop(1, coatColor);
  ctx.fillStyle = bodyG;
  roundRect(ctx, -w*0.26, h*0.28+B, w*0.52, h*0.36, 4); ctx.fill();

  // 胸の帯・ベルト
  ctx.fillStyle = accentColor;
  ctx.fillRect(-w*0.26, h*0.44+B, w*0.52, h*0.04);
  ctx.fillStyle = '#5a3a00';
  ctx.fillRect(-w*0.1, h*0.28+B, w*0.2, h*0.36);

  // 刀（腰に3本）
  if (!atk) {
    [h*0.52, h*0.56, h*0.60].forEach((hy, i) => {
      ctx.strokeStyle = swordColor; ctx.lineWidth = 3-i*0.5;
      ctx.beginPath(); ctx.moveTo(w*0.26, hy+B); ctx.lineTo(-w*0.08, hy+0.04*h+B); ctx.stroke();
    });
  }

  // 腕
  const armG = ctx.createLinearGradient(0, h*0.28+B, 0, h*0.58+B);
  armG.addColorStop(0, lighten(coatColor, 20)); armG.addColorStop(1, coatColor);
  ctx.fillStyle = armG;
  if (atk) {
    // 攻撃：右腕で大振り
    ctx.save(); ctx.translate(w*0.2, h*0.32+B);
    ctx.rotate(-0.8);
    roundRect(ctx, 0, -w*0.08, w*0.18, w*0.15, 3); ctx.fill();
    // 刀を振る
    ctx.strokeStyle = swordColor; ctx.lineWidth = 4;
    ctx.shadowColor = accentColor; ctx.shadowBlur = 10;
    ctx.beginPath(); ctx.moveTo(w*0.1, 0); ctx.lineTo(w*0.65, -h*0.45); ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.restore();
    roundRect(ctx, -w*0.38, h*0.34+B, w*0.16, h*0.26, 3); ctx.fill();
  } else {
    roundRect(ctx, -w*0.38, h*0.30+B, w*0.15, h*0.28, 3); ctx.fill();
    roundRect(ctx, w*0.23, h*0.30+B, w*0.15, h*0.28, 3); ctx.fill();
  }

  // 頭
  const headG = ctx.createRadialGradient(-w*0.05, h*0.14+B, 0, 0, h*0.2+B, w*0.2);
  headG.addColorStop(0, '#ffcba4'); headG.addColorStop(1, '#c97a4a');
  ctx.fillStyle = headG;
  ctx.beginPath(); ctx.arc(0, h*0.2+B, w*0.2, 0, Math.PI*2); ctx.fill();
  // 黒髪
  ctx.fillStyle = '#111';
  ctx.beginPath(); ctx.arc(0, h*0.16+B, w*0.2, Math.PI*1.1, Math.PI*1.9); ctx.fill();
  // 三本傷
  ctx.strokeStyle = '#cc4400'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(-w*0.06, h*0.17+B); ctx.lineTo(w*0.12, h*0.22+B); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-w*0.04, h*0.19+B); ctx.lineTo(w*0.14, h*0.24+B); ctx.stroke();
  // 目（鋭い）
  ctx.fillStyle = '#1a1a4a';
  ctx.beginPath(); ctx.ellipse(-w*0.07, h*0.2+B, w*0.04, w*0.025, 0, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(w*0.07, h*0.2+B, w*0.04, w*0.025, 0, 0, Math.PI*2); ctx.fill();

  ctx.restore();
}

// ============================================
// 騎士（セイバー）
// ============================================
function drawKnight(ctx, x, y, w, h, dir, state) {
  ctx.save();
  ctx.translate(x + w/2, y);
  if (dir === -1) ctx.scale(-1, 1);
  const t = Date.now() * 0.003;
  const bob = state === 'idle' ? Math.sin(t)*1.5 : 0;
  const B = bob; const atk = state === 'attack';

  drawShadowEllipse(ctx, 0, h, w*0.44, 5);

  const armorLight = '#9ab0d0';
  const armorDark  = '#4a6080';
  const armorMid   = '#6a88aa';
  const gold       = '#ffc940';

  // 脚甲冑
  const legG = ctx.createLinearGradient(-w*0.15, h*0.6+B, w*0.15, h*0.9+B);
  legG.addColorStop(0, armorLight); legG.addColorStop(1, armorDark);
  ctx.fillStyle = legG;
  roundRect(ctx, -w*0.24, h*0.6+B, w*0.21, h*0.32, 4); ctx.fill();
  roundRect(ctx, w*0.03, h*0.6+B, w*0.21, h*0.32, 4); ctx.fill();
  // 膝当て
  ctx.fillStyle = gold;
  ctx.beginPath(); ctx.arc(-w*0.135, h*0.68+B, w*0.07, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(w*0.135, h*0.68+B, w*0.07, 0, Math.PI*2); ctx.fill();
  // ブーツ
  ctx.fillStyle = armorDark;
  roundRect(ctx, -w*0.26, h*0.9+B, w*0.25, h*0.08, 3); ctx.fill();
  roundRect(ctx, w*0.01, h*0.9+B, w*0.25, h*0.08, 3); ctx.fill();

  // 胴鎧
  const bodyG = ctx.createLinearGradient(-w*0.26, h*0.28+B, w*0.26, h*0.62+B);
  bodyG.addColorStop(0, armorLight); bodyG.addColorStop(0.5, armorMid); bodyG.addColorStop(1, armorDark);
  ctx.fillStyle = bodyG;
  roundRect(ctx, -w*0.26, h*0.28+B, w*0.52, h*0.34, 6); ctx.fill();
  // 胸紋章
  ctx.fillStyle = gold;
  ctx.beginPath(); ctx.arc(0, h*0.41+B, w*0.09, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#cc0000';
  ctx.beginPath(); ctx.arc(0, h*0.41+B, w*0.06, 0, Math.PI*2); ctx.fill();
  // 肩当て
  ctx.fillStyle = armorMid;
  ctx.beginPath(); ctx.ellipse(-w*0.3, h*0.32+B, w*0.14, w*0.09, -0.3, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(w*0.3, h*0.32+B, w*0.14, w*0.09, 0.3, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = gold;
  ctx.beginPath(); ctx.ellipse(-w*0.3, h*0.32+B, w*0.09, w*0.05, -0.3, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(w*0.3, h*0.32+B, w*0.09, w*0.05, 0.3, 0, Math.PI*2); ctx.fill();

  // 腕
  ctx.fillStyle = armorMid;
  if (atk) {
    ctx.save(); ctx.translate(w*0.2, h*0.34+B); ctx.rotate(-1.1);
    roundRect(ctx, 0, -w*0.07, w*0.2, w*0.14, 3); ctx.fill();
    // 聖剣
    ctx.strokeStyle = '#e0e8ff'; ctx.lineWidth = 5;
    ctx.shadowColor = '#a0c0ff'; ctx.shadowBlur = 16;
    ctx.beginPath(); ctx.moveTo(w*0.15, 0); ctx.lineTo(w*0.7, -h*0.5); ctx.stroke();
    // 鍔
    ctx.lineWidth = 2; ctx.beginPath();
    ctx.moveTo(w*0.05, -h*0.05); ctx.lineTo(w*0.25, h*0.05); ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.restore();
    roundRect(ctx, -w*0.4, h*0.34+B, w*0.16, h*0.25, 3); ctx.fill();
  } else {
    roundRect(ctx, -w*0.4, h*0.30+B, w*0.16, h*0.28, 3); ctx.fill();
    roundRect(ctx, w*0.24, h*0.30+B, w*0.16, h*0.28, 3); ctx.fill();
    // 剣を持つ（待機）
    ctx.strokeStyle = '#c8d8f0'; ctx.lineWidth = 4;
    ctx.shadowColor = '#8080ff'; ctx.shadowBlur = 8;
    ctx.beginPath(); ctx.moveTo(w*0.3, h*0.4+B); ctx.lineTo(w*0.38, h*0.92+B); ctx.stroke();
    ctx.shadowBlur = 0;
  }

  // 兜
  const helmG = ctx.createLinearGradient(-w*0.22, h*0.06+B, w*0.22, h*0.28+B);
  helmG.addColorStop(0, armorLight); helmG.addColorStop(1, armorDark);
  ctx.fillStyle = helmG;
  ctx.beginPath(); ctx.arc(0, h*0.2+B, w*0.22, 0, Math.PI*2); ctx.fill();
  // 兜のバイザー（スリット）
  ctx.fillStyle = '#111';
  roundRect(ctx, -w*0.15, h*0.17+B, w*0.3, h*0.05, 2); ctx.fill();
  // 兜の飾り
  ctx.fillStyle = gold;
  ctx.fillRect(-w*0.02, h*0.02+B, w*0.04, h*0.12);
  // 輝き
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.beginPath(); ctx.ellipse(-w*0.08, h*0.13+B, w*0.07, w*0.04, -0.5, 0, Math.PI*2); ctx.fill();

  ctx.restore();
}

// ============================================
// ガンナー（ダンテ・ノワール）
// ============================================
function drawGunner(ctx, x, y, w, h, dir, state, coatColor, accentColor) {
  ctx.save();
  ctx.translate(x + w/2, y);
  if (dir === -1) ctx.scale(-1, 1);
  const t = Date.now() * 0.003;
  const bob = state === 'idle' ? Math.sin(t)*2 : 0;
  const B = bob; const atk = state === 'attack';

  drawShadowEllipse(ctx, 0, h, w*0.4, 5);

  // 脚
  ctx.fillStyle = '#1a1a1a';
  roundRect(ctx, -w*0.22, h*0.62+B, w*0.18, h*0.28, 3); ctx.fill();
  roundRect(ctx, w*0.04, h*0.62+B, w*0.18, h*0.28, 3); ctx.fill();
  ctx.fillStyle = '#111';
  roundRect(ctx, -w*0.24, h*0.88+B, w*0.22, h*0.08, 3); ctx.fill();
  roundRect(ctx, w*0.02, h*0.88+B, w*0.22, h*0.08, 3); ctx.fill();

  // コート
  const coatG = ctx.createLinearGradient(-w*0.26, h*0.28+B, w*0.26, h*0.98);
  coatG.addColorStop(0, lighten(coatColor, 15)); coatG.addColorStop(1, coatColor);
  ctx.fillStyle = coatG;
  ctx.beginPath();
  ctx.moveTo(-w*0.26, h*0.28+B);
  ctx.lineTo(-w*0.34, h*0.98);
  ctx.lineTo(w*0.34, h*0.98);
  ctx.lineTo(w*0.26, h*0.28+B);
  ctx.closePath(); ctx.fill();

  // 胴
  ctx.fillStyle = lighten(coatColor, 20);
  roundRect(ctx, -w*0.24, h*0.28+B, w*0.48, h*0.34, 4); ctx.fill();

  // アクセントライン
  ctx.fillStyle = accentColor;
  ctx.fillRect(-w*0.24, h*0.28+B, w*0.04, h*0.34);
  ctx.fillRect(w*0.2, h*0.28+B, w*0.04, h*0.34);

  // 腕
  ctx.fillStyle = lighten(coatColor, 10);
  if (atk) {
    // 銃を構える
    roundRect(ctx, -w*0.38, h*0.32+B, w*0.16, h*0.26, 3); ctx.fill();
    roundRect(ctx, w*0.22, h*0.32+B, w*0.18, h*0.12, 3); ctx.fill();
    // 銃
    ctx.fillStyle = '#333';
    roundRect(ctx, w*0.36, h*0.32+B, w*0.32, h*0.1, 3); ctx.fill();
    roundRect(ctx, w*0.42, h*0.4+B, w*0.08, h*0.12, 2); ctx.fill();
    // マズルフラッシュ
    ctx.save();
    ctx.shadowColor = accentColor; ctx.shadowBlur = 20;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(w*0.68, h*0.37+B, w*0.1, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = accentColor;
    ctx.beginPath(); ctx.arc(w*0.68, h*0.37+B, w*0.06, 0, Math.PI*2); ctx.fill();
    ctx.shadowBlur = 0; ctx.restore();
  } else {
    roundRect(ctx, -w*0.38, h*0.30+B, w*0.16, h*0.28, 3); ctx.fill();
    roundRect(ctx, w*0.22, h*0.30+B, w*0.16, h*0.28, 3); ctx.fill();
    // 腰の銃
    ctx.fillStyle = '#333';
    roundRect(ctx, w*0.22, h*0.55+B, w*0.18, h*0.08, 2); ctx.fill();
  }

  // 頭
  const headG = ctx.createRadialGradient(-w*0.05, h*0.14+B, 0, 0, h*0.2+B, w*0.2);
  headG.addColorStop(0, '#ffcba4'); headG.addColorStop(1, '#c97a4a');
  ctx.fillStyle = headG;
  ctx.beginPath(); ctx.arc(0, h*0.2+B, w*0.2, 0, Math.PI*2); ctx.fill();
  // 帽子
  ctx.fillStyle = coatColor;
  ctx.beginPath();
  ctx.moveTo(-w*0.26, h*0.14+B);
  ctx.lineTo(-w*0.18, h*0.02+B);
  ctx.lineTo(w*0.18, h*0.02+B);
  ctx.lineTo(w*0.26, h*0.14+B);
  ctx.closePath(); ctx.fill();
  ctx.fillRect(-w*0.28, h*0.13+B, w*0.56, h*0.04);
  // 目
  ctx.fillStyle = '#222';
  ctx.beginPath(); ctx.ellipse(-w*0.07, h*0.2+B, w*0.04, w*0.03, 0, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(w*0.07, h*0.2+B, w*0.04, w*0.03, 0, 0, Math.PI*2); ctx.fill();

  ctx.restore();
}

// ============================================
// ゴーレム
// ============================================
function drawGolem(ctx, x, y, w, h, dir, state) {
  ctx.save();
  ctx.translate(x + w/2, y);
  if (dir === -1) ctx.scale(-1, 1);
  const t = Date.now() * 0.002;
  const bob = state === 'idle' ? Math.sin(t)*1 : 0;
  const B = bob; const atk = state === 'attack';

  drawShadowEllipse(ctx, 0, h, w*0.52, 7);

  const stoneLight = '#8a847c';
  const stoneMid   = '#5c5650';
  const stoneDark  = '#3a3530';
  const lava       = '#ff4400';

  // 脚（太い）
  const legG = ctx.createLinearGradient(-w*0.2, h*0.62+B, w*0.2, h*0.94);
  legG.addColorStop(0, stoneLight); legG.addColorStop(1, stoneDark);
  ctx.fillStyle = legG;
  roundRect(ctx, -w*0.3, h*0.62+B, w*0.26, h*0.34, 4); ctx.fill();
  roundRect(ctx, w*0.04, h*0.62+B, w*0.26, h*0.34, 4); ctx.fill();

  // 胴（巨大）
  const bodyG = ctx.createLinearGradient(-w*0.32, h*0.18+B, w*0.32, h*0.65+B);
  bodyG.addColorStop(0, stoneLight); bodyG.addColorStop(0.5, stoneMid); bodyG.addColorStop(1, stoneDark);
  ctx.fillStyle = bodyG;
  roundRect(ctx, -w*0.32, h*0.18+B, w*0.64, h*0.47, 6); ctx.fill();

  // 亀裂（ラバ）
  ctx.strokeStyle = lava; ctx.lineWidth = 2;
  ctx.shadowColor = lava; ctx.shadowBlur = 6;
  ctx.beginPath(); ctx.moveTo(-w*0.15, h*0.28+B); ctx.lineTo(w*0.05, h*0.45+B); ctx.lineTo(-w*0.08, h*0.58+B); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(w*0.1, h*0.32+B); ctx.lineTo(w*0.22, h*0.5+B); ctx.stroke();
  ctx.shadowBlur = 0;

  // 腕（巨大）
  ctx.fillStyle = stoneMid;
  if (atk) {
    // 右腕で殴る
    ctx.save(); ctx.translate(w*0.3, h*0.3+B);
    ctx.rotate(-0.5);
    roundRect(ctx, 0, -w*0.14, w*0.35, w*0.28, 5); ctx.fill();
    // 拳
    const fistG = ctx.createRadialGradient(w*0.32, 0, 0, w*0.32, 0, w*0.18);
    fistG.addColorStop(0, stoneLight); fistG.addColorStop(1, stoneDark);
    ctx.fillStyle = fistG;
    ctx.beginPath(); ctx.arc(w*0.35, 0, w*0.18, 0, Math.PI*2); ctx.fill();
    // 衝撃波
    ctx.save();
    ctx.globalAlpha = 0.4; ctx.strokeStyle = '#ff8800'; ctx.lineWidth = 3;
    ctx.shadowColor = '#ff8800'; ctx.shadowBlur = 12;
    ctx.beginPath(); ctx.arc(w*0.5, 0, w*0.25, 0, Math.PI*2); ctx.stroke();
    ctx.shadowBlur = 0; ctx.restore();
    ctx.restore();
    roundRect(ctx, -w*0.52, h*0.28+B, w*0.22, h*0.34, 4); ctx.fill();
  } else {
    roundRect(ctx, -w*0.52, h*0.22+B, w*0.22, h*0.34, 4); ctx.fill();
    roundRect(ctx, w*0.3, h*0.22+B, w*0.22, h*0.34, 4); ctx.fill();
  }

  // 頭（平頭）
  const headG = ctx.createLinearGradient(-w*0.24, h*0.04+B, w*0.24, h*0.2+B);
  headG.addColorStop(0, stoneLight); headG.addColorStop(1, stoneDark);
  ctx.fillStyle = headG;
  roundRect(ctx, -w*0.24, h*0.04+B, w*0.48, h*0.17, 4); ctx.fill();

  // 目（溶岩）
  ctx.fillStyle = lava;
  ctx.shadowColor = lava; ctx.shadowBlur = 10;
  ctx.beginPath(); ctx.ellipse(-w*0.1, h*0.1+B, w*0.07, w*0.045, 0, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(w*0.1, h*0.1+B, w*0.07, w*0.045, 0, 0, Math.PI*2); ctx.fill();
  ctx.shadowBlur = 0;

  ctx.restore();
}

// ============================================
// 忍者（シャドウ）
// ============================================
function drawNinja(ctx, x, y, w, h, dir, state) {
  ctx.save();
  ctx.translate(x + w/2, y);
  if (dir === -1) ctx.scale(-1, 1);
  const t = Date.now() * 0.004;
  const float = Math.sin(t) * 3;
  const B = float; const atk = state === 'attack';

  // 影（浮いてるので薄め）
  ctx.save(); ctx.globalAlpha = 0.1;
  ctx.fillStyle = '#000';
  ctx.beginPath(); ctx.ellipse(0, h, w*0.35, 3, 0, 0, Math.PI*2); ctx.fill();
  ctx.restore();

  const dark = '#0d0d1a';
  const purple = '#5a4aaa';
  const lightP = '#8880cc';

  // 布（下半身）
  ctx.fillStyle = dark;
  ctx.beginPath();
  ctx.moveTo(-w*0.22, h*0.6+B);
  ctx.lineTo(-w*0.28, h*0.96);
  ctx.lineTo(w*0.28, h*0.96);
  ctx.lineTo(w*0.22, h*0.6+B);
  ctx.closePath(); ctx.fill();

  // 胴
  const bodyG = ctx.createLinearGradient(-w*0.22, h*0.28+B, w*0.22, h*0.62+B);
  bodyG.addColorStop(0, purple); bodyG.addColorStop(1, dark);
  ctx.fillStyle = bodyG;
  roundRect(ctx, -w*0.22, h*0.28+B, w*0.44, h*0.34, 4); ctx.fill();

  // 襷（たすき）
  ctx.strokeStyle = lightP; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(-w*0.22, h*0.28+B); ctx.lineTo(w*0.22, h*0.58+B); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(w*0.22, h*0.28+B); ctx.lineTo(-w*0.22, h*0.58+B); ctx.stroke();

  // 腕
  ctx.fillStyle = dark;
  if (atk) {
    // クナイ投げ
    roundRect(ctx, -w*0.38, h*0.32+B, w*0.16, h*0.24, 3); ctx.fill();
    roundRect(ctx, w*0.22, h*0.32+B, w*0.22, h*0.1, 3); ctx.fill();
    // クナイ
    ctx.strokeStyle = '#c0c8e0'; ctx.lineWidth = 3;
    ctx.shadowColor = lightP; ctx.shadowBlur = 10;
    ctx.beginPath(); ctx.moveTo(w*0.42, h*0.37+B); ctx.lineTo(w*0.72, h*0.2+B); ctx.stroke();
    // 刃先
    ctx.fillStyle = '#dde8ff';
    ctx.beginPath(); ctx.moveTo(w*0.72, h*0.2+B);
    ctx.lineTo(w*0.78, h*0.14+B); ctx.lineTo(w*0.68, h*0.18+B); ctx.fill();
    ctx.shadowBlur = 0;
  } else {
    roundRect(ctx, -w*0.38, h*0.30+B, w*0.16, h*0.26, 3); ctx.fill();
    roundRect(ctx, w*0.22, h*0.30+B, w*0.16, h*0.26, 3); ctx.fill();
  }

  // 頭（覆面）
  ctx.fillStyle = dark;
  ctx.beginPath(); ctx.arc(0, h*0.2+B, w*0.2, 0, Math.PI*2); ctx.fill();
  // 額当て
  ctx.fillStyle = '#2a2a3a';
  ctx.fillRect(-w*0.2, h*0.12+B, w*0.4, h*0.07);
  ctx.strokeStyle = lightP; ctx.lineWidth = 1;
  ctx.strokeRect(-w*0.2, h*0.12+B, w*0.4, h*0.07);
  // 目（光る）
  ctx.fillStyle = lightP;
  ctx.shadowColor = lightP; ctx.shadowBlur = 8;
  ctx.beginPath(); ctx.ellipse(-w*0.07, h*0.19+B, w*0.05, w*0.025, 0, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(w*0.07, h*0.19+B, w*0.05, w*0.025, 0, 0, Math.PI*2); ctx.fill();
  ctx.shadowBlur = 0;

  // 移動時の残像エフェクト
  if (state === 'walk' || state === 'jump') {
    ctx.save(); ctx.globalAlpha = 0.15; ctx.translate(-w*0.1, 0);
    ctx.fillStyle = purple;
    ctx.beginPath(); ctx.arc(0, h*0.2+B, w*0.2, 0, Math.PI*2); ctx.fill();
    ctx.restore();
  }

  ctx.restore();
}

// ============================================
// 魔法使い（マーリン）
// ============================================
function drawMage(ctx, x, y, w, h, dir, state) {
  ctx.save();
  ctx.translate(x + w/2, y);
  if (dir === -1) ctx.scale(-1, 1);
  const t = Date.now() * 0.004;
  const float = Math.sin(t) * 4;
  const B = float; const atk = state === 'attack';

  ctx.save(); ctx.globalAlpha = 0.12;
  ctx.fillStyle = '#000';
  ctx.beginPath(); ctx.ellipse(0, h, w*0.32, 3, 0, 0, Math.PI*2); ctx.fill();
  ctx.restore();

  const robe = '#2a0a4a';
  const robeMid = '#4a1a7a';
  const runeColor = '#aa44ff';

  // ローブ裾
  ctx.fillStyle = robe;
  ctx.beginPath();
  ctx.moveTo(-w*0.24, h*0.32+B);
  ctx.lineTo(-w*0.38, h*0.98);
  ctx.lineTo(w*0.38, h*0.98);
  ctx.lineTo(w*0.24, h*0.32+B);
  ctx.closePath(); ctx.fill();
  // 裾の光る縁取り
  ctx.strokeStyle = runeColor; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.6;
  ctx.beginPath();
  ctx.moveTo(-w*0.24, h*0.32+B);
  ctx.lineTo(-w*0.38, h*0.98);
  ctx.lineTo(w*0.38, h*0.98);
  ctx.lineTo(w*0.24, h*0.32+B);
  ctx.stroke();
  ctx.globalAlpha = 1;

  // 胴ローブ
  const robeG = ctx.createLinearGradient(-w*0.24, h*0.2+B, w*0.24, h*0.62+B);
  robeG.addColorStop(0, robeMid); robeG.addColorStop(1, robe);
  ctx.fillStyle = robeG;
  roundRect(ctx, -w*0.24, h*0.2+B, w*0.48, h*0.44, 4); ctx.fill();

  // ルーン文字（胴）
  ctx.strokeStyle = runeColor; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.5;
  ctx.shadowColor = runeColor; ctx.shadowBlur = 4;
  ctx.beginPath(); ctx.moveTo(-w*0.1, h*0.35+B); ctx.lineTo(-w*0.1, h*0.5+B); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-w*0.1, h*0.42+B); ctx.lineTo(w*0.1, h*0.38+B); ctx.stroke();
  ctx.globalAlpha = 1; ctx.shadowBlur = 0;

  // 腕・袖
  ctx.fillStyle = robeMid;
  if (atk) {
    roundRect(ctx, -w*0.4, h*0.26+B, w*0.18, h*0.28, 3); ctx.fill();
    // 魔法を放つ右腕
    roundRect(ctx, w*0.22, h*0.26+B, w*0.22, h*0.12, 3); ctx.fill();
    // 魔法球
    const orbG = ctx.createRadialGradient(w*0.52, h*0.3+B, 0, w*0.52, h*0.3+B, w*0.16);
    orbG.addColorStop(0, '#ffffff'); orbG.addColorStop(0.4, '#ee88ff'); orbG.addColorStop(1, 'transparent');
    ctx.fillStyle = orbG;
    ctx.shadowColor = '#cc44ff'; ctx.shadowBlur = 20;
    ctx.beginPath(); ctx.arc(w*0.52, h*0.3+B, w*0.16, 0, Math.PI*2); ctx.fill();
    // 軌跡
    ctx.globalAlpha = 0.3;
    [w*0.36, w*0.24].forEach((px, i) => {
      ctx.beginPath(); ctx.arc(px, h*0.32+B, w*(0.1-i*0.03), 0, Math.PI*2); ctx.fill();
    });
    ctx.globalAlpha = 1; ctx.shadowBlur = 0;
  } else {
    roundRect(ctx, -w*0.4, h*0.24+B, w*0.18, h*0.28, 3); ctx.fill();
    roundRect(ctx, w*0.22, h*0.24+B, w*0.18, h*0.28, 3); ctx.fill();
    // 杖
    ctx.strokeStyle = '#5a3a00'; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(w*0.3, h*0.28+B); ctx.lineTo(w*0.36, h*0.95+B); ctx.stroke();
    // 宝珠
    const orbG2 = ctx.createRadialGradient(w*0.28, h*0.24+B, 0, w*0.28, h*0.24+B, w*0.1);
    orbG2.addColorStop(0, '#ff88ff'); orbG2.addColorStop(1, '#6600aa');
    ctx.fillStyle = orbG2;
    ctx.shadowColor = runeColor; ctx.shadowBlur = 12;
    ctx.beginPath(); ctx.arc(w*0.28, h*0.24+B, w*0.1, 0, Math.PI*2); ctx.fill();
    ctx.shadowBlur = 0;
  }

  // 帽子
  ctx.fillStyle = robe;
  ctx.beginPath();
  ctx.moveTo(0, h*0.0+B - float*0.5);
  ctx.lineTo(-w*0.22, h*0.2+B);
  ctx.lineTo(w*0.22, h*0.2+B);
  ctx.closePath(); ctx.fill();
  ctx.fillRect(-w*0.25, h*0.18+B, w*0.5, h*0.05);
  // 帽子の星
  ctx.fillStyle = '#ffd700';
  ctx.shadowColor = '#ffd700'; ctx.shadowBlur = 6;
  ctx.beginPath(); ctx.arc(w*0.06, h*0.08+B, w*0.03, 0, Math.PI*2); ctx.fill();
  ctx.shadowBlur = 0;

  // 頭
  const headG = ctx.createRadialGradient(-w*0.05, h*0.2+B, 0, 0, h*0.22+B, w*0.18);
  headG.addColorStop(0, '#ffcba4'); headG.addColorStop(1, '#c97a4a');
  ctx.fillStyle = headG;
  ctx.beginPath(); ctx.arc(0, h*0.22+B, w*0.18, 0, Math.PI*2); ctx.fill();
  // ひげ
  ctx.strokeStyle = '#e0e0d0'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(-w*0.1, h*0.27+B); ctx.lineTo(-w*0.16, h*0.36+B); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, h*0.28+B); ctx.lineTo(-w*0.02, h*0.38+B); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(w*0.1, h*0.27+B); ctx.lineTo(w*0.16, h*0.36+B); ctx.stroke();
  // 目
  ctx.fillStyle = '#44aaff';
  ctx.shadowColor = '#44aaff'; ctx.shadowBlur = 4;
  ctx.beginPath(); ctx.arc(-w*0.07, h*0.2+B, w*0.03, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(w*0.07, h*0.2+B, w*0.03, 0, Math.PI*2); ctx.fill();
  ctx.shadowBlur = 0;

  ctx.restore();
}

// ============================================
// 天使（セラフィ）
// ============================================
function drawAngel(ctx, x, y, w, h, dir, state) {
  ctx.save();
  ctx.translate(x + w/2, y);
  if (dir === -1) ctx.scale(-1, 1);
  const t = Date.now() * 0.004;
  const float = Math.sin(t) * 4;
  const B = float; const atk = state === 'attack';

  ctx.save(); ctx.globalAlpha = 0.1;
  ctx.fillStyle = '#ffffcc';
  ctx.beginPath(); ctx.ellipse(0, h, w*0.35, 4, 0, 0, Math.PI*2); ctx.fill();
  ctx.restore();

  // 翼（大きく）
  const wingColor = 'rgba(255,255,240,0.85)';
  const wingGlow = 'rgba(255,220,100,0.3)';
  const drawWing = (side) => {
    const sx = side * w*0.18;
    const wx = side * w*0.9;
    const wy = h*0.32+B;
    ctx.save();
    ctx.shadowColor = '#ffd700'; ctx.shadowBlur = atk ? 20 : 8;
    // 大羽
    ctx.fillStyle = wingColor;
    ctx.beginPath();
    ctx.moveTo(sx, h*0.28+B);
    ctx.bezierCurveTo(side*w*0.5, h*0.1+B, wx, h*0.15+B, wx, wy);
    ctx.bezierCurveTo(wx, h*0.55+B, side*w*0.5, h*0.55+B, sx, h*0.5+B);
    ctx.closePath(); ctx.fill();
    // 羽根の筋
    ctx.strokeStyle = 'rgba(255,220,100,0.6)'; ctx.lineWidth = 1.5;
    for (let i=0; i<4; i++) {
      const fi = i/4;
      ctx.beginPath();
      ctx.moveTo(sx, h*(0.28+0.22*fi)+B);
      ctx.quadraticCurveTo(side*w*0.6, h*(0.15+0.3*fi)+B, wx*(0.7+0.3*fi), wy);
      ctx.stroke();
    }
    ctx.shadowBlur = 0; ctx.restore();
  };
  drawWing(-1); drawWing(1);

  // ドレス
  const dressG = ctx.createLinearGradient(-w*0.22, h*0.28+B, w*0.22, h*0.98);
  dressG.addColorStop(0, '#fff8ee'); dressG.addColorStop(1, '#ffe8cc');
  ctx.fillStyle = dressG;
  ctx.beginPath();
  ctx.moveTo(-w*0.2, h*0.28+B);
  ctx.lineTo(-w*0.35, h*0.98);
  ctx.lineTo(w*0.35, h*0.98);
  ctx.lineTo(w*0.2, h*0.28+B);
  ctx.closePath(); ctx.fill();
  // ドレスの光る縁取り
  ctx.strokeStyle = '#ffd700'; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.5;
  ctx.beginPath();
  ctx.moveTo(-w*0.2, h*0.28+B);
  ctx.lineTo(-w*0.35, h*0.98);
  ctx.moveTo(w*0.2, h*0.28+B);
  ctx.lineTo(w*0.35, h*0.98);
  ctx.stroke();
  ctx.globalAlpha = 1;

  // 胴（コルセット）
  ctx.fillStyle = '#ffd700';
  roundRect(ctx, -w*0.18, h*0.28+B, w*0.36, h*0.3, 4); ctx.fill();
  ctx.fillStyle = '#fff8ee';
  roundRect(ctx, -w*0.14, h*0.3+B, w*0.28, h*0.26, 3); ctx.fill();

  // 腕
  const armSkin = skinGrad(ctx, -w*0.4, h*0.28+B, h*0.3);
  ctx.fillStyle = armSkin;
  if (atk) {
    roundRect(ctx, -w*0.38, h*0.3+B, w*0.16, h*0.24, 3); ctx.fill();
    roundRect(ctx, w*0.22, h*0.28+B, w*0.24, h*0.1, 3); ctx.fill();
    // 聖槍
    ctx.strokeStyle = '#ffd700'; ctx.lineWidth = 4;
    ctx.shadowColor = '#ffffff'; ctx.shadowBlur = 20;
    ctx.beginPath(); ctx.moveTo(w*0.38, h*0.32+B); ctx.lineTo(w*0.78, h*0.08+B); ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.moveTo(w*0.78, h*0.08+B); ctx.lineTo(w*0.86, h*0.0+B); ctx.lineTo(w*0.7, h*0.12+B); ctx.fill();
    ctx.shadowBlur = 0;
  } else {
    roundRect(ctx, -w*0.38, h*0.28+B, w*0.16, h*0.28, 3); ctx.fill();
    roundRect(ctx, w*0.22, h*0.28+B, w*0.16, h*0.28, 3); ctx.fill();
  }

  // 頭
  const headG = ctx.createRadialGradient(-w*0.05, h*0.16+B, 0, 0, h*0.2+B, w*0.2);
  headG.addColorStop(0, '#ffe8d8'); headG.addColorStop(1, '#d4905a');
  ctx.fillStyle = headG;
  ctx.beginPath(); ctx.arc(0, h*0.2+B, w*0.2, 0, Math.PI*2); ctx.fill();
  // 金髪（ロング）
  ctx.fillStyle = '#ffd000';
  ctx.beginPath();
  ctx.arc(0, h*0.16+B, w*0.2, Math.PI, 0);
  ctx.bezierCurveTo(w*0.22, h*0.5+B, w*0.28, h*0.6+B, w*0.2, h*0.7+B);
  ctx.lineTo(-w*0.2, h*0.7+B);
  ctx.bezierCurveTo(-w*0.28, h*0.6+B, -w*0.22, h*0.5+B, -w*0.22, h*0.3+B);
  ctx.closePath(); ctx.fill();
  // 目（輝く）
  ctx.fillStyle = '#88ccff';
  ctx.beginPath(); ctx.ellipse(-w*0.07, h*0.2+B, w*0.045, w*0.03, 0, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(w*0.07, h*0.2+B, w*0.045, w*0.03, 0, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#000';
  ctx.beginPath(); ctx.arc(-w*0.07, h*0.2+B, w*0.022, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(w*0.07, h*0.2+B, w*0.022, 0, Math.PI*2); ctx.fill();
  // ハイライト
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  ctx.beginPath(); ctx.arc(-w*0.075, h*0.185+B, w*0.01, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(w*0.065, h*0.185+B, w*0.01, 0, Math.PI*2); ctx.fill();
  // 光輪
  ctx.strokeStyle = '#ffd700'; ctx.lineWidth = 3;
  ctx.shadowColor = '#ffd700'; ctx.shadowBlur = 12;
  ctx.beginPath(); ctx.ellipse(0, h*0.03+B, w*0.24, w*0.08, 0, 0, Math.PI*2); ctx.stroke();
  ctx.shadowBlur = 0;

  ctx.restore();
}
