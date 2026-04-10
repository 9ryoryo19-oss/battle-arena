// ============================================
// BATTLE ARENA - ゲームエンジン
// ============================================

class Fighter {
  constructor(charData, x, isP2 = false) {
    this.char = charData;
    this.x = x;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.w = 48;
    this.h = 80;
    this.dir = isP2 ? -1 : 1;
    this.isP2 = isP2;
    this.hp = charData.hp;
    this.maxHp = charData.hp;

    // State
    this.onGround = false;
    this.state = 'idle';
    this.attackCooldown = 0;
    this.hurtTimer = 0;
    this.stateTimer = 0;
    this.currentAttack = null;

    // 移動入力（連続）
    this.input = { left: false, right: false, jump: false };
    this.prevJump = false;

    // 攻撃はキュー（タップ1回=1発確実）
    this.attackQueue = [];

    // Projectiles
    this.projectiles = [];

    // Combo
    this.comboCount = 0;
    this.comboTimer = 0;

    // Flash
    this.flashTimer = 0;
  }

  get centerX() { return this.x + this.w / 2; }
  get bottom() { return this.y + this.h; }

  // 攻撃ボタンが押されたらキューに追加（game.jsから呼ぶ）
  queueAttack(type) {
    if (this.attackQueue.length < 2) {
      this.attackQueue.push(type);
    }
  }

  takeDamage(dmg, knockback, direction) {
    if (this.state === 'dead') return false;
    this.hp = Math.max(0, this.hp - dmg);
    this.vx = knockback * direction;
    this.vy = -4;
    this.hurtTimer = 18;
    this.flashTimer = 8;
    this.state = 'hurt';
    if (this.hp <= 0) {
      this.state = 'dead';
      return true;
    }
    return false;
  }

  update(canvasW, canvasH, stage, opponent) {
    // Timers
    if (this.attackCooldown > 0) this.attackCooldown--;
    if (this.hurtTimer > 0) this.hurtTimer--;
    if (this.comboTimer > 0) this.comboTimer--;
    else this.comboCount = 0;
    if (this.flashTimer > 0) this.flashTimer--;

    if (this.state === 'dead') {
      this.vy += 0.5;
      this.y += this.vy;
      return;
    }

    if (this.state === 'hurt' && this.hurtTimer <= 0) {
      this.state = 'idle';
    }

    // Face opponent
    if (opponent && this.state !== 'attack' && this.state !== 'hurt') {
      this.dir = opponent.centerX > this.centerX ? 1 : -1;
    }

    // Attack from queue
    if (this.state !== 'hurt' && this.state !== 'dead' && this.attackCooldown === 0 && this.attackQueue.length > 0) {
      const type = this.attackQueue.shift();
      this.startAttack(type);
    }

    // Movement
    if (this.state !== 'hurt') {
      const speed = this.char.speed;

      if (this.state !== 'attack') {
        if (this.input.left) {
          this.vx = -speed;
          if (this.onGround) this.state = 'walk';
        } else if (this.input.right) {
          this.vx = speed;
          if (this.onGround) this.state = 'walk';
        } else {
          this.vx *= 0.65;
          if (Math.abs(this.vx) < 0.3) this.vx = 0;
          if (this.onGround && this.state !== 'attack') this.state = 'idle';
        }
      } else {
        this.vx *= 0.8;
        if (this.stateTimer > 0) {
          this.stateTimer--;
          if (this.stateTimer <= 0) {
            this.state = 'idle';
            this.currentAttack = null;
          }
        }
      }

      // Jump (justPressed)
      const jumpJust = this.input.jump && !this.prevJump;
      if (jumpJust && this.onGround) {
        this.vy = -this.char.jumpPower;
        this.onGround = false;
        this.state = 'jump';
      }
    }
    this.prevJump = this.input.jump;

    // Gravity
    this.vy += 0.65;
    this.x += this.vx;
    this.y += this.vy;

    // Boundaries
    this.x = Math.max(0, Math.min(canvasW - this.w, this.x));

    // Ground collision
    this.onGround = false;
    const groundY = stage.platform.y * canvasH;
    if (this.bottom >= groundY && this.vy >= 0) {
      this.y = groundY - this.h;
      this.vy = 0;
      this.onGround = true;
      if (this.state === 'jump') this.state = 'idle';
    }

    // Extra platforms
    if (stage.platforms) {
      stage.platforms.forEach(p => {
        const px = p.x * canvasW;
        const py = p.y * canvasH;
        const pw = p.w * canvasW;
        if (
          this.bottom >= py && this.bottom <= py + 24 &&
          this.x + this.w > px && this.x < px + pw &&
          this.vy >= 0
        ) {
          this.y = py - this.h;
          this.vy = 0;
          this.onGround = true;
          if (this.state === 'jump') this.state = 'idle';
        }
      });
    }

    // Fell off screen
    if (this.y > canvasH + 100) {
      this.hp = 0;
      this.state = 'dead';
    }

    // Projectiles
    this.projectiles = this.projectiles.filter(p => {
      p.x += p.vx;
      p.life--;
      return p.life > 0 && p.x > -50 && p.x < canvasW + 50;
    });
  }

  startAttack(type) {
    const atk = this.char.attacks[type];
    this.state = 'attack';
    this.attackCooldown = atk.cooldown;
    this.stateTimer = Math.min(atk.cooldown * 0.6, 22);
    this.currentAttack = { type, data: atk };

    if (atk.projectile) {
      this.projectiles.push({
        x: this.x + (this.dir === 1 ? this.w : 0),
        y: this.y + this.h * 0.35,
        vx: this.dir * 9,
        r: type === 'special' ? 14 : type === 'mid' ? 10 : 7,
        color: atk.color,
        damage: atk.damage,
        knockback: atk.knockback,
        life: Math.ceil(atk.range / 9),
        hit: false,
      });
    }
  }

  draw(ctx) {
    if (this.flashTimer > 0 && this.flashTimer % 2 === 0) {
      ctx.globalAlpha = 0.4;
    }
    this.char.sprite(ctx, this.x, this.y, this.w, this.h, this.dir, this.state);
    ctx.globalAlpha = 1;

    // HP bar above character
    const bw = 60, bx = this.x + this.w/2 - bw/2, by = this.y - 14;
    ctx.fillStyle = '#222';
    ctx.fillRect(bx, by, bw, 6);
    const ratio = this.hp / this.maxHp;
    ctx.fillStyle = ratio > 0.5 ? '#22c55e' : ratio > 0.25 ? '#eab308' : '#ef4444';
    ctx.fillRect(bx, by, bw * ratio, 6);
    ctx.strokeStyle = '#444'; ctx.lineWidth = 1;
    ctx.strokeRect(bx, by, bw, 6);

    // Projectiles
    this.projectiles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color; ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;
    });
  }

  getHitbox() {
    if (this.state !== 'attack' || !this.currentAttack) return null;
    if (this.currentAttack.data.projectile) return null;
    const atk = this.currentAttack.data;
    const hx = this.dir === 1 ? this.x + this.w : this.x - atk.range;
    return { x: hx, y: this.y + 10, w: atk.range, h: this.h - 20, damage: atk.damage, knockback: atk.knockback };
  }
}

// ============================================
// Engine
// ============================================
class Engine {
  constructor(canvas, stage, p1char, p2char, mode) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.stage = stage;
    this.mode = mode;
    this.resize();

    const w = this.canvas.width;
    this.p1 = new Fighter(p1char, w * 0.2, false);
    this.p2 = new Fighter(p2char, w * 0.75, true);
    this.p1.y = this.canvas.height * stage.platform.y - this.p1.h;
    this.p2.y = this.canvas.height * stage.platform.y - this.p2.h;

    this.running = false;
    this.paused = false;
    this.timer = 99;
    this.timerInterval = null;
    this.animFrame = null;
    this.hitEffects = [];
    this.cpuTimer = 0;
    this.ended = false;
  }

  resize() {
    const battle = document.getElementById('screen-battle');
    const hudH = 56;
    const ctrlH = 110;
    this.canvas.width = battle.offsetWidth;
    this.canvas.height = Math.max(battle.offsetHeight - hudH - ctrlH, 100);
    this.canvas.style.top = hudH + 'px';
  }

  start() {
    this.running = true;
    this.timerInterval = setInterval(() => {
      if (!this.paused && this.running) {
        this.timer = Math.max(0, this.timer - 1);
        document.getElementById('round-timer').textContent = this.timer;
        if (this.timer === 0) this.endRound();
      }
    }, 1000);
    this.loop();
  }

  stop() {
    this.running = false;
    if (this.animFrame) cancelAnimationFrame(this.animFrame);
    if (this.timerInterval) clearInterval(this.timerInterval);
  }

  loop() {
    if (!this.running) return;
    if (!this.paused) { this.update(); this.render(); }
    this.animFrame = requestAnimationFrame(() => this.loop());
  }

  update() {
    const w = this.canvas.width, h = this.canvas.height;
    if (this.mode === 'vs-cpu') this.updateCPU();

    this.p1.update(w, h, this.stage, this.p2);
    this.p2.update(w, h, this.stage, this.p1);

    this.checkMeleeHit(this.p1, this.p2);
    this.checkMeleeHit(this.p2, this.p1);
    this.checkProjectileHits(this.p1, this.p2);
    this.checkProjectileHits(this.p2, this.p1);

    this.hitEffects = this.hitEffects.filter(e => e.life > 0);
    this.hitEffects.forEach(e => e.life--);
    this.updateHUD();

    if (!this.ended && (this.p1.state === 'dead' || this.p2.state === 'dead')) {
      this.ended = true;
      setTimeout(() => this.endRound(), 800);
    }
  }

  checkMeleeHit(attacker, defender) {
    const hb = attacker.getHitbox();
    if (!hb) return;
    const d = defender;
    if (hb.x < d.x + d.w && hb.x + hb.w > d.x && hb.y < d.y + d.h && hb.y + hb.h > d.y && d.state !== 'dead') {
      defender.takeDamage(hb.damage, hb.knockback, attacker.dir);
      attacker.comboCount++;
      attacker.comboTimer = 90;
      this.hitEffects.push({ x: defender.centerX, y: defender.y + 20, dmg: hb.damage, color: attacker.currentAttack?.data?.color || '#fff', life: 40, maxLife: 40 });
      attacker.currentAttack = null;
    }
  }

  checkProjectileHits(attacker, defender) {
    attacker.projectiles.forEach(p => {
      if (p.hit) return;
      const dx = p.x - (defender.x + defender.w/2);
      const dy = p.y - (defender.y + defender.h/2);
      if (Math.sqrt(dx*dx + dy*dy) < p.r + defender.w/2 && defender.state !== 'dead') {
        p.hit = true; p.life = 0;
        defender.takeDamage(p.damage, p.knockback, p.vx > 0 ? 1 : -1);
        attacker.comboCount++;
        attacker.comboTimer = 90;
        this.hitEffects.push({ x: p.x, y: p.y, dmg: p.damage, color: p.color, life: 40, maxLife: 40 });
      }
    });
  }

  updateHUD() {
    document.getElementById('p1-hp-bar').style.width = (this.p1.hp / this.p1.maxHp * 100) + '%';
    document.getElementById('p2-hp-bar').style.width = (this.p2.hp / this.p2.maxHp * 100) + '%';
    document.getElementById('p1-hp-text').textContent = Math.ceil(this.p1.hp);
    document.getElementById('p2-hp-text').textContent = Math.ceil(this.p2.hp);
  }

  updateCPU() {
    this.cpuTimer--;
    if (this.cpuTimer > 0) return;
    const cpu = this.p2, player = this.p1;
    const dist = Math.abs(cpu.centerX - player.centerX);
    cpu.input.left = false; cpu.input.right = false; cpu.input.jump = false;

    if (dist > 120) {
      cpu.centerX > player.centerX ? (cpu.input.left = true) : (cpu.input.right = true);
    }
    if (dist < 130 && Math.random() < 0.6) {
      const r = Math.random();
      cpu.queueAttack(r < 0.5 ? 'normal' : r < 0.8 ? 'mid' : 'special');
    }
    if (Math.random() < 0.04 && cpu.onGround) cpu.input.jump = true;
    if (cpu.char.attacks.normal.projectile && dist < 160) {
      cpu.centerX > player.centerX ? (cpu.input.right = true) : (cpu.input.left = true);
    }
    this.cpuTimer = Math.floor(6 + Math.random() * 10);
  }

  render() {
    const ctx = this.ctx, w = this.canvas.width, h = this.canvas.height;
    ctx.clearRect(0, 0, w, h);
    this.stage.bg(ctx, w, h);
    this.drawPlatforms(ctx, w, h);
    this.p1.draw(ctx);
    this.p2.draw(ctx);

    this.hitEffects.forEach(e => {
      const alpha = e.life / e.maxLife;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.font = 'bold 16px Orbitron, sans-serif';
      ctx.fillStyle = e.color;
      ctx.shadowColor = e.color; ctx.shadowBlur = 6;
      ctx.textAlign = 'center';
      ctx.fillText(e.dmg, e.x, e.y - (1 - alpha) * 30);
      ctx.shadowBlur = 0;
      ctx.restore();
    });

    [this.p1, this.p2].forEach(f => {
      if (f.comboCount >= 2 && f.comboTimer > 0) {
        const bx = f.isP2 ? w * 0.65 : w * 0.05;
        ctx.font = 'bold 18px Orbitron, sans-serif';
        ctx.fillStyle = '#ffd700'; ctx.shadowColor = '#ffd700'; ctx.shadowBlur = 8;
        ctx.fillText(`${f.comboCount} HIT!`, bx, h * 0.18);
        ctx.shadowBlur = 0;
      }
    });
  }

  drawPlatforms(ctx, w, h) {
    const gy = this.stage.platform.y * h;
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.fillRect(0, gy + this.p1.h, w, 8);

    if (this.stage.platforms) {
      this.stage.platforms.forEach(pl => {
        ctx.fillStyle = 'rgba(120,90,40,0.85)';
        ctx.fillRect(pl.x*w, pl.y*h, pl.w*w, Math.max(pl.h*h, 10));
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.fillRect(pl.x*w, pl.y*h, pl.w*w, 2);
      });
    }
  }

  endRound() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    const winner = this.p1.hp <= 0 ? this.p2 : (this.p2.hp <= 0 ? this.p1 : (this.p1.hp >= this.p2.hp ? this.p1 : this.p2));
    Game.showResult(winner);
  }
}
