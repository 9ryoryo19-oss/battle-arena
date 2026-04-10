// ============================================
// BATTLE ARENA - キャラクターデータ
// ============================================

const CHARACTERS = [
  {
    id: 'ryu',
    name: 'リュウ',
    type: '格闘',
    icon: '🥋',
    color: '#00d4ff',
    hp: 100,
    speed: 3,
    jumpPower: 12,
    attacks: {
      normal:  { damage: 8,  range: 60,  cooldown: 20, knockback: 4, color: '#00d4ff' },
      mid:     { damage: 15, range: 70,  cooldown: 35, knockback: 7, color: '#0099cc' },
      special: { damage: 28, range: 90,  cooldown: 60, knockback: 12, color: '#00ffcc', name: '波動拳' },
    },
    description: 'バランス型の格闘家',
    sprite: (ctx, x, y, w, h, dir, state) => drawFighter(ctx, x, y, w, h, dir, state, '#00d4ff', '#003366'),
  },
  {
    id: 'ken',
    name: 'ケン',
    type: '格闘',
    icon: '🔥',
    color: '#ff6600',
    hp: 95,
    speed: 3.5,
    jumpPower: 11,
    attacks: {
      normal:  { damage: 9,  range: 58,  cooldown: 18, knockback: 5, color: '#ff6600' },
      mid:     { damage: 16, range: 65,  cooldown: 30, knockback: 8, color: '#ff3300' },
      special: { damage: 30, range: 80,  cooldown: 55, knockback: 14, color: '#ff4400', name: '昇龍拳' },
    },
    description: '攻撃的な格闘家',
    sprite: (ctx, x, y, w, h, dir, state) => drawFighter(ctx, x, y, w, h, dir, state, '#ff6600', '#660000'),
  },
  {
    id: 'zoro',
    name: 'ゾロ',
    type: '剣',
    icon: '⚔️',
    color: '#22c55e',
    hp: 110,
    speed: 2.8,
    jumpPower: 8,
    attacks: {
      normal:  { damage: 10, range: 85,  cooldown: 22, knockback: 5, color: '#22c55e' },
      mid:     { damage: 20, range: 100, cooldown: 38, knockback: 9, color: '#16a34a' },
      special: { damage: 35, range: 120, cooldown: 65, knockback: 15, color: '#00ff88', name: '三刀流・大切り' },
    },
    description: '剣士・リーチが長い',
    sprite: (ctx, x, y, w, h, dir, state) => drawSwordsman(ctx, x, y, w, h, dir, state, '#22c55e', '#14532d'),
  },
  {
    id: 'saber',
    name: 'セイバー',
    type: '剣',
    icon: '🗡️',
    color: '#a78bfa',
    hp: 105,
    speed: 3,
    jumpPower: 12,
    attacks: {
      normal:  { damage: 9,  range: 80,  cooldown: 20, knockback: 5, color: '#a78bfa' },
      mid:     { damage: 18, range: 95,  cooldown: 35, knockback: 10, color: '#7c3aed' },
      special: { damage: 32, range: 130, cooldown: 60, knockback: 13, color: '#c4b5fd', name: '聖剣・エクスカリバー' },
    },
    description: '騎士の剣士・空中戦得意',
    sprite: (ctx, x, y, w, h, dir, state) => drawSwordsman(ctx, x, y, w, h, dir, state, '#a78bfa', '#3b0764'),
  },
  {
    id: 'dante',
    name: 'ダンテ',
    type: '銃',
    icon: '🔫',
    color: '#f59e0b',
    hp: 90,
    speed: 3.5,
    jumpPower: 11,
    attacks: {
      normal:  { damage: 7,  range: 110, cooldown: 15, knockback: 3, color: '#f59e0b', projectile: true },
      mid:     { damage: 14, range: 150, cooldown: 28, knockback: 6, color: '#d97706', projectile: true },
      special: { damage: 25, range: 200, cooldown: 55, knockback: 10, color: '#fbbf24', name: 'ラピッドファイア', projectile: true },
    },
    description: '銃使い・射程が長い',
    sprite: (ctx, x, y, w, h, dir, state) => drawGunner(ctx, x, y, w, h, dir, state, '#f59e0b', '#451a03'),
  },
  {
    id: 'noir',
    name: 'ノワール',
    type: '銃',
    icon: '🎯',
    color: '#64748b',
    hp: 85,
    speed: 2.5,
    jumpPower: 12,
    attacks: {
      normal:  { damage: 8,  range: 130, cooldown: 14, knockback: 2, color: '#94a3b8', projectile: true },
      mid:     { damage: 18, range: 180, cooldown: 30, knockback: 5, color: '#64748b', projectile: true },
      special: { damage: 40, range: 250, cooldown: 70, knockback: 8, color: '#f1f5f9', name: 'スナイパー', projectile: true },
    },
    description: 'スナイパー・射程最長',
    sprite: (ctx, x, y, w, h, dir, state) => drawGunner(ctx, x, y, w, h, dir, state, '#94a3b8', '#0f172a'),
  },
  {
    id: 'golem',
    name: 'ゴーレム',
    type: '重装',
    icon: '🪨',
    color: '#78716c',
    hp: 150,
    speed: 3,
    jumpPower: 8,
    attacks: {
      normal:  { damage: 14, range: 65,  cooldown: 30, knockback: 10, color: '#78716c' },
      mid:     { damage: 25, range: 75,  cooldown: 50, knockback: 16, color: '#57534e' },
      special: { damage: 45, range: 85,  cooldown: 80, knockback: 25, color: '#d97706', name: 'グランドスラム' },
    },
    description: 'タンク型・遅いが超パワフル',
    sprite: (ctx, x, y, w, h, dir, state) => drawGolem(ctx, x, y, w, h, dir, state),
  },
  {
    id: 'shadow',
    name: 'シャドウ',
    type: '忍者',
    icon: '🌑',
    color: '#1e1b4b',
    hp: 80,
    speed: 4.5,
    jumpPower: 13,
    attacks: {
      normal:  { damage: 6,  range: 55,  cooldown: 12, knockback: 3, color: '#818cf8' },
      mid:     { damage: 14, range: 65,  cooldown: 22, knockback: 7, color: '#6366f1' },
      special: { damage: 22, range: 75,  cooldown: 40, knockback: 10, color: '#c7d2fe', name: '影分身' },
    },
    description: '忍者・素早い連撃',
    sprite: (ctx, x, y, w, h, dir, state) => drawNinja(ctx, x, y, w, h, dir, state),
  },
  {
    id: 'mage',
    name: 'マーリン',
    type: '魔法',
    icon: '🔮',
    color: '#8b5cf6',
    hp: 85,
    speed: 2.5,
    jumpPower: 8,
    attacks: {
      normal:  { damage: 8,  range: 100, cooldown: 18, knockback: 4, color: '#c084fc', projectile: true },
      mid:     { damage: 20, range: 140, cooldown: 40, knockback: 9, color: '#a855f7', projectile: true },
      special: { damage: 38, range: 160, cooldown: 70, knockback: 18, color: '#e879f9', name: 'アルカナブラスト', projectile: true },
    },
    description: '魔法使い・強力な遠距離攻撃',
    sprite: (ctx, x, y, w, h, dir, state) => drawMage(ctx, x, y, w, h, dir, state),
  },
  {
    id: 'angel',
    name: 'セラフィ',
    type: '天使',
    icon: '👼',
    color: '#fde68a',
    hp: 90,
    speed: 3.2,
    jumpPower: 12,
    attacks: {
      normal:  { damage: 9,  range: 75,  cooldown: 18, knockback: 5, color: '#fde68a' },
      mid:     { damage: 18, range: 90,  cooldown: 32, knockback: 9, color: '#fbbf24' },
      special: { damage: 33, range: 110, cooldown: 58, knockback: 12, color: '#fff', name: '神聖な裁き' },
    },
    description: '天使・空中機動力最強',
    sprite: (ctx, x, y, w, h, dir, state) => drawAngel(ctx, x, y, w, h, dir, state),
  },
];

// ============================================
// スプライト描画関数
// ============================================

function drawFighter(ctx, x, y, w, h, dir, state, bodyColor, darkColor) {
  ctx.save();
  ctx.translate(x + w/2, y);
  if (dir === -1) ctx.scale(-1, 1);

  const bob = state === 'idle' ? Math.sin(Date.now() * 0.005) * 2 : 0;
  const gy = bob;

  // Body
  ctx.fillStyle = bodyColor;
  ctx.fillRect(-w*0.2, h*0.3 + gy, w*0.4, h*0.35);

  // Head
  ctx.fillStyle = '#ffcc99';
  ctx.beginPath();
  ctx.arc(0, h*0.2 + gy, w*0.2, 0, Math.PI*2);
  ctx.fill();

  // Hair
  ctx.fillStyle = darkColor;
  ctx.beginPath();
  ctx.arc(0, h*0.15 + gy, w*0.2, Math.PI, 0);
  ctx.fill();

  // Legs
  ctx.fillStyle = darkColor;
  if (state === 'walk') {
    const swing = Math.sin(Date.now() * 0.01) * 10;
    ctx.fillRect(-w*0.15, h*0.65 + gy, w*0.12, h*0.28 + swing);
    ctx.fillRect(w*0.03, h*0.65 + gy, w*0.12, h*0.28 - swing);
  } else {
    ctx.fillRect(-w*0.15, h*0.65 + gy, w*0.12, h*0.28);
    ctx.fillRect(w*0.03, h*0.65 + gy, w*0.12, h*0.28);
  }

  // Arms
  ctx.fillStyle = bodyColor;
  if (state === 'attack') {
    ctx.fillRect(w*0.2, h*0.3 + gy, w*0.35, h*0.12);
    ctx.fillRect(-w*0.4, h*0.35 + gy, w*0.2, h*0.1);
  } else {
    ctx.fillRect(w*0.18, h*0.32 + gy, w*0.12, h*0.3);
    ctx.fillRect(-w*0.3, h*0.32 + gy, w*0.12, h*0.3);
  }

  ctx.restore();
}

function drawSwordsman(ctx, x, y, w, h, dir, state, bodyColor, darkColor) {
  ctx.save();
  ctx.translate(x + w/2, y);
  if (dir === -1) ctx.scale(-1, 1);

  const bob = state === 'idle' ? Math.sin(Date.now() * 0.005) * 2 : 0;

  // Armor body
  ctx.fillStyle = bodyColor;
  ctx.fillRect(-w*0.22, h*0.28 + bob, w*0.44, h*0.38);
  ctx.fillStyle = darkColor;
  ctx.fillRect(-w*0.22, h*0.28 + bob, w*0.44, h*0.06);

  // Head / helmet
  ctx.fillStyle = '#ffcc99';
  ctx.beginPath();
  ctx.arc(0, h*0.2 + bob, w*0.18, 0, Math.PI*2);
  ctx.fill();
  ctx.fillStyle = bodyColor;
  ctx.fillRect(-w*0.2, h*0.1 + bob, w*0.4, h*0.14);

  // Legs
  ctx.fillStyle = darkColor;
  ctx.fillRect(-w*0.16, h*0.66 + bob, w*0.13, h*0.28);
  ctx.fillRect(w*0.03, h*0.66 + bob, w*0.13, h*0.28);

  // Sword
  if (state === 'attack') {
    ctx.strokeStyle = '#c0c0c0';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(w*0.2, h*0.3 + bob);
    ctx.lineTo(w*0.7, h*0.05 + bob);
    ctx.stroke();
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(w*0.2, h*0.3 + bob);
    ctx.lineTo(w*0.15, h*0.42 + bob);
    ctx.stroke();
  } else {
    ctx.strokeStyle = '#c0c0c0';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(w*0.25, h*0.25 + bob);
    ctx.lineTo(w*0.4, h*0.75 + bob);
    ctx.stroke();
  }

  ctx.restore();
}

function drawGunner(ctx, x, y, w, h, dir, state, bodyColor, darkColor) {
  ctx.save();
  ctx.translate(x + w/2, y);
  if (dir === -1) ctx.scale(-1, 1);

  const bob = state === 'idle' ? Math.sin(Date.now() * 0.005) * 2 : 0;

  // Body
  ctx.fillStyle = darkColor;
  ctx.fillRect(-w*0.2, h*0.28 + bob, w*0.4, h*0.38);
  ctx.fillStyle = bodyColor;
  ctx.fillRect(-w*0.18, h*0.30 + bob, w*0.1, h*0.34);

  // Head
  ctx.fillStyle = '#ffcc99';
  ctx.beginPath();
  ctx.arc(0, h*0.2 + bob, w*0.18, 0, Math.PI*2);
  ctx.fill();
  ctx.fillStyle = darkColor;
  ctx.beginPath();
  ctx.arc(0, h*0.15 + bob, w*0.18, Math.PI, 0);
  ctx.fill();

  // Legs
  ctx.fillStyle = darkColor;
  ctx.fillRect(-w*0.15, h*0.66 + bob, w*0.12, h*0.28);
  ctx.fillRect(w*0.03, h*0.66 + bob, w*0.12, h*0.28);

  // Gun
  ctx.fillStyle = '#555';
  if (state === 'attack') {
    ctx.fillRect(w*0.15, h*0.35 + bob, w*0.45, h*0.1);
    // Muzzle flash
    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.arc(w*0.6, h*0.40 + bob, w*0.08, 0, Math.PI*2);
    ctx.fill();
  } else {
    ctx.fillRect(w*0.18, h*0.38 + bob, w*0.25, h*0.08);
  }

  ctx.restore();
}

function drawGolem(ctx, x, y, w, h, dir, state) {
  ctx.save();
  ctx.translate(x + w/2, y);
  if (dir === -1) ctx.scale(-1, 1);

  const bob = state === 'idle' ? Math.sin(Date.now() * 0.003) * 1 : 0;

  // Body (big rectangle)
  ctx.fillStyle = '#57534e';
  ctx.fillRect(-w*0.3, h*0.2 + bob, w*0.6, h*0.5);

  // Head (flat top)
  ctx.fillStyle = '#78716c';
  ctx.fillRect(-w*0.22, h*0.08 + bob, w*0.44, h*0.18);

  // Eyes
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(-w*0.12, h*0.12 + bob, w*0.08, w*0.06);
  ctx.fillRect(w*0.04, h*0.12 + bob, w*0.08, w*0.06);

  // Legs
  ctx.fillStyle = '#44403c';
  ctx.fillRect(-w*0.26, h*0.70 + bob, w*0.22, h*0.28);
  ctx.fillRect(w*0.04, h*0.70 + bob, w*0.22, h*0.28);

  // Arms
  if (state === 'attack') {
    ctx.fillStyle = '#57534e';
    ctx.fillRect(w*0.28, h*0.2 + bob, w*0.3, h*0.18);
    ctx.fillRect(-w*0.58, h*0.3 + bob, w*0.3, h*0.15);
  } else {
    ctx.fillStyle = '#57534e';
    ctx.fillRect(w*0.28, h*0.22 + bob, w*0.18, h*0.35);
    ctx.fillRect(-w*0.46, h*0.22 + bob, w*0.18, h*0.35);
  }

  // Stone texture lines
  ctx.strokeStyle = '#44403c';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-w*0.2, h*0.40 + bob); ctx.lineTo(w*0.2, h*0.40 + bob);
  ctx.moveTo(-w*0.1, h*0.55 + bob); ctx.lineTo(w*0.25, h*0.55 + bob);
  ctx.stroke();

  ctx.restore();
}

function drawNinja(ctx, x, y, w, h, dir, state) {
  ctx.save();
  ctx.translate(x + w/2, y);
  if (dir === -1) ctx.scale(-1, 1);

  const bob = state === 'idle' ? Math.sin(Date.now() * 0.008) * 3 : 0;

  // Dark body
  ctx.fillStyle = '#1e1b4b';
  ctx.fillRect(-w*0.18, h*0.28 + bob, w*0.36, h*0.38);

  // Head with mask
  ctx.fillStyle = '#1e1b4b';
  ctx.beginPath();
  ctx.arc(0, h*0.20 + bob, w*0.2, 0, Math.PI*2);
  ctx.fill();
  // Eyes (glowing)
  ctx.fillStyle = '#818cf8';
  ctx.fillRect(-w*0.1, h*0.17 + bob, w*0.07, w*0.05);
  ctx.fillRect(w*0.03, h*0.17 + bob, w*0.07, w*0.05);

  // Scarf
  ctx.fillStyle = '#312e81';
  ctx.fillRect(-w*0.22, h*0.27 + bob, w*0.44, h*0.08);

  // Legs
  ctx.fillStyle = '#312e81';
  if (state === 'walk') {
    const s = Math.sin(Date.now() * 0.015) * 12;
    ctx.fillRect(-w*0.14, h*0.66 + bob, w*0.11, h*0.28 + s);
    ctx.fillRect(w*0.03, h*0.66 + bob, w*0.11, h*0.28 - s);
  } else {
    ctx.fillRect(-w*0.14, h*0.66 + bob, w*0.11, h*0.28);
    ctx.fillRect(w*0.03, h*0.66 + bob, w*0.11, h*0.28);
  }

  // Kunai / arm
  ctx.fillStyle = '#1e1b4b';
  if (state === 'attack') {
    ctx.strokeStyle = '#c7d2fe';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(w*0.18, h*0.35 + bob); ctx.lineTo(w*0.55, h*0.25 + bob);
    ctx.stroke();
  }

  ctx.restore();
}

function drawMage(ctx, x, y, w, h, dir, state) {
  ctx.save();
  ctx.translate(x + w/2, y);
  if (dir === -1) ctx.scale(-1, 1);

  const bob = state === 'idle' ? Math.sin(Date.now() * 0.004) * 3 : 0;
  const float = Math.sin(Date.now() * 0.004) * 4;

  // Robe
  ctx.fillStyle = '#4c1d95';
  ctx.beginPath();
  ctx.moveTo(-w*0.25, h*0.30 + bob);
  ctx.lineTo(w*0.25, h*0.30 + bob);
  ctx.lineTo(w*0.35, h*0.98);
  ctx.lineTo(-w*0.35, h*0.98);
  ctx.closePath();
  ctx.fill();

  // Hat
  ctx.fillStyle = '#3b0764';
  ctx.beginPath();
  ctx.moveTo(0, h*0.0 + bob - float);
  ctx.lineTo(-w*0.25, h*0.22 + bob);
  ctx.lineTo(w*0.25, h*0.22 + bob);
  ctx.closePath();
  ctx.fill();

  // Head
  ctx.fillStyle = '#ffcc99';
  ctx.beginPath();
  ctx.arc(0, h*0.22 + bob, w*0.18, 0, Math.PI*2);
  ctx.fill();

  // Staff
  ctx.strokeStyle = '#92400e';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(w*0.2, h*0.3 + bob); ctx.lineTo(w*0.28, h*0.9 + bob);
  ctx.stroke();

  // Orb on staff
  ctx.fillStyle = state === 'attack' ? '#e879f9' : '#8b5cf6';
  ctx.shadowColor = state === 'attack' ? '#e879f9' : '#8b5cf6';
  ctx.shadowBlur = state === 'attack' ? 20 : 8;
  ctx.beginPath();
  ctx.arc(w*0.2, h*0.28 + bob, w*0.1, 0, Math.PI*2);
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.restore();
}

function drawAngel(ctx, x, y, w, h, dir, state) {
  ctx.save();
  ctx.translate(x + w/2, y);
  if (dir === -1) ctx.scale(-1, 1);

  const bob = Math.sin(Date.now() * 0.004) * 4;

  // Wings
  ctx.fillStyle = 'rgba(253,230,138,0.5)';
  ctx.beginPath();
  ctx.ellipse(-w*0.5, h*0.35 + bob, w*0.35, h*0.22, -0.4, 0, Math.PI*2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(w*0.5, h*0.35 + bob, w*0.35, h*0.22, 0.4, 0, Math.PI*2);
  ctx.fill();

  // Dress
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.moveTo(-w*0.2, h*0.30 + bob);
  ctx.lineTo(w*0.2, h*0.30 + bob);
  ctx.lineTo(w*0.28, h*0.95);
  ctx.lineTo(-w*0.28, h*0.95);
  ctx.closePath();
  ctx.fill();

  // Head
  ctx.fillStyle = '#ffcc99';
  ctx.beginPath();
  ctx.arc(0, h*0.18 + bob, w*0.18, 0, Math.PI*2);
  ctx.fill();

  // Hair
  ctx.fillStyle = '#fde68a';
  ctx.beginPath();
  ctx.arc(0, h*0.13 + bob, w*0.18, Math.PI, 0);
  ctx.fill();

  // Halo
  ctx.strokeStyle = '#ffd700';
  ctx.lineWidth = 3;
  ctx.shadowColor = '#ffd700';
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.ellipse(0, h*0.04 + bob, w*0.22, w*0.07, 0, 0, Math.PI*2);
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Spear (attack)
  if (state === 'attack') {
    ctx.strokeStyle = '#fde68a';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#fde68a';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.moveTo(w*0.15, h*0.3 + bob); ctx.lineTo(w*0.65, h*0.1 + bob);
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  ctx.restore();
}
