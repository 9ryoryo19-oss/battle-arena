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
    this.state = 'idle'; // idle, walk, jump, attack, hurt, knockback, dead
    this.attackCooldown = 0;
    this.hurtTimer = 0;
    this.knockbackTimer = 0;
    this.stateTimer = 0;
    this.currentAttack = null;

    // Input
    this.input = {
      left: false, right: false, jump: false,
      normal: false, mid: false, special: false,
    };
    this.prevInput = { ...this.input };

    // Projectiles spawned by this fighter
    this.projectiles = [];

    // Combo
    this.comboCount = 0;
    this.comboTimer = 0;

    // Effects
    this.effects = [];
    this.flashTimer = 0;
    this.flashColor = '';
  }

  get centerX() { return this.x + this.w / 2; }
  get bottom() { return this.y + this.h; }
  get top() { return this.y; }

  takeDamage(dmg, knockback, direction) {
    if (this.state === 'dead') return false;
    this.hp = Math.max(0, this.hp - dmg);
    this.vx = knockback * direction;
    this.vy = -5;
    this.hurtTimer = 20;
    this.flashTimer = 8;
    this.flashColor = '#ff4444';
    this.state = 'hurt';
    if (this.hp <= 0) {
      this.state = 'dead';
      return true; // killed
    }
    return false;
  }

  update(canvasW, canvasH, stage, opponent) {
    this.prevInput = { ...this.input };

    // Timers
    if (this.attackCooldown > 0) this.attackCooldown--;
    if (this.hurtTimer > 0) this.hurtTimer--;
    if (this.comboTimer > 0) this.comboTimer--;
    else this.comboCount = 0;
    if (this.flashTimer > 0) this.flashTimer--;

    if (this.state === 'dead') {
      this.vy += 0.6;
      this.y += this.vy;
      return;
    }

    if (this.state === 'hurt') {
      if (this.hurtTimer <= 0) this.state = 'idle';
    }

    // Direction (face opponent)
    if (opponent && this.state !== 'attack' && this.state !== 'hurt') {
      this.dir = opponent.centerX > this.centerX ? 1 : -1;
    }

    // Attack input
    if (this.state !== 'hurt' && this.state !== 'dead') {
      const justPressed = (key) => this.input[key];

      if (this.attackCooldown === 0) {
        if (justPressed('special')) {
          this.startAttack('special');
        } else if (justPressed('mid')) {
          this.startAttack('mid');
        } else if (justPressed('normal')) {
          this.startAttack('normal');
        }
      }
    }

    // Movement (not during attack or hurt)
    if (this.state !== 'attack' && this.state !== 'hurt') {
      const speed = this.char.speed;

      if (this.input.left) {
        this.vx = -speed;
        if (this.onGround) this.state = 'walk';
      } else if (this.input.right) {
        this.vx = speed;
        if (this.onGround) this.state = 'walk';
      } else {
        this.vx *= 0.7;
        if (this.onGround && Math.abs(this.vx) < 0.5) {
          this.vx = 0;
          this.state = 'idle';
        }
      }

      if (this.input.jump && this.onGround) {
        this.vy = -this.char.jumpPower;
        this.onGround = false;
        this.state = 'jump';
      }
    } else {
      this.vx *= 0.85;
      if (this.stateTimer > 0) {
        this.stateTimer--;
        if (this.stateTimer <= 0 && this.state === 'attack') {
          this.state = 'idle';
          this.currentAttack = null;
        }
      }
    }

    // Gravity
    this.vy += 0.7;
    this.x += this.vx;
    this.y += this.vy;

    // Stage boundaries
    this.x = Math.max(0, Math.min(canvasW - this.w, this.x));

    // Ground / platform collision
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
          this.vx >= 0 || true // pass-through check
        ) {
          if (
            this.bottom >= py && this.bottom <= py + 20 &&
            this.x + this.w > px && this.x < px + pw &&
            this.vy >= 0
          ) {
            this.y = py - this.h;
            this.vy = 0;
            this.onGround = true;
            if (this.state === 'jump') this.state = 'idle';
          }
        }
      });
    }

    // Fell off screen
    if (this.y > canvasH + 100) {
      this.hp = 0;
      this.state = 'dead';
    }

    // Update projectiles
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
    this.stateTimer = Math.min(atk.cooldown, 18);
    this.currentAttack = { type, data: atk };

    if (atk.projectile) {
      this.projectiles.push({
        x: this.x + (this.dir === 1 ? this.w : 0),
        y: this.y + this.h * 0.35,
        vx: this.dir * 10,
        r: type === 'special' ? 14 : type === 'mid' ? 10 : 7,
        color: atk.color,
        damage: atk.damage,
        knockback: atk.knockback,
        owner: this,
        life: Math.ceil(atk.range / 10),
        hit: false,
      });
    }
  }

  draw(ctx) {
    // Flash effect
    if (this.flashTimer > 0 && this.flashTimer % 2 === 0) {
      ctx.globalAlpha = 0.5;
    }

    // Draw character sprite
    this.char.sprite(ctx, this.x, this.y, this.w, this.h, this.dir, this.state);

    ctx.globalAlpha = 1;

    // HP bar above character
    const barW = 60;
    const bx = this.x + this.w/2 - barW/2;
    const by = this.y - 14;
    ctx.fillStyle = '#222';
    ctx.fillRect(bx, by, barW, 6);
    const hpRatio = this.hp / this.maxHp;
    ctx.fillStyle = hpRatio > 0.5 ? '#22c55e' : hpRatio > 0.25 ? '#eab308' : '#ef4444';
    ctx.fillRect(bx, by, barW * hpRatio, 6);
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 1;
    ctx.strokeRect(bx, by, barW, 6);

    // Attack hitbox debug (optional)
    // this.drawHitbox(ctx);

    // Draw projectiles
    this.projectiles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;
    });
  }

  getHitbox() {
    if (this.state !== 'attack' || !this.currentAttack) return null;
    if (this.currentAttack.data.projectile) return null; // handled via projectiles
    const atk = this.currentAttack.data;
    const hx = this.dir === 1
      ? this.x + this.w
      : this.x - atk.range;
    return {
      x: hx, y: this.y + 10,
      w: atk.range, h: this.h - 20,
      damage: atk.damage,
      knockback: atk.knockback,
    };
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

    // Fit canvas
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
    this.round = 1;
    this.animFrame = null;
    this.hitEffects = [];

    // CPU AI state
    this.cpuTimer = 0;
    this.cpuAction = 'idle';
  }

  resize() {
    const battle = document.getElementById('screen-battle');
    const hud = document.querySelector('.battle-hud');
    const controls = document.querySelector('.p1-controls');
    const hudH = hud ? hud.offsetHeight : 64;
    const ctrlH = controls ? controls.offsetHeight : 100;

    this.canvas.width = battle.offsetWidth;
    this.canvas.height = battle.offsetHeight - hudH - ctrlH;
    this.canvas.style.top = hudH + 'px';
  }

  start() {
    this.running = true;
    this.startTimer();
    this.loop();
  }

  stop() {
    this.running = false;
    if (this.animFrame) cancelAnimationFrame(this.animFrame);
    if (this.timerInterval) clearInterval(this.timerInterval);
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      if (!this.paused && this.running) {
        this.timer = Math.max(0, this.timer - 1);
        document.getElementById('round-timer').textContent = this.timer;
        if (this.timer === 0) this.endRound();
      }
    }, 1000);
  }

  loop() {
    if (!this.running) return;
    if (!this.paused) {
      this.update();
      this.render();
    }
    this.animFrame = requestAnimationFrame(() => this.loop());
  }

  update() {
    const w = this.canvas.width;
    const h = this.canvas.height;

    // CPU AI
    if (this.mode === 'vs-cpu') {
      this.updateCPU();
    }

    this.p1.update(w, h, this.stage, this.p2);
    this.p2.update(w, h, this.stage, this.p1);

    // Check melee hits
    this.checkMeleeHit(this.p1, this.p2);
    this.checkMeleeHit(this.p2, this.p1);

    // Check projectile hits
    this.checkProjectileHits(this.p1, this.p2);
    this.checkProjectileHits(this.p2, this.p1);

    // Update hit effects
    this.hitEffects = this.hitEffects.filter(e => e.life > 0);
    this.hitEffects.forEach(e => e.life--);

    // Update HUD
    this.updateHUD();

    // Check game over
    if (this.p1.state === 'dead' || this.p2.state === 'dead') {
      setTimeout(() => this.endRound(), 800);
      this.running = false;
    }
  }

  checkMeleeHit(attacker, defender) {
    const hb = attacker.getHitbox();
    if (!hb) return;
    const def = { x: defender.x, y: defender.y, w: defender.w, h: defender.h };
    if (
      hb.x < def.x + def.w && hb.x + hb.w > def.x &&
      hb.y < def.y + def.h && hb.y + hb.h > def.y &&
      defender.state !== 'dead'
    ) {
      const dir = attacker.dir;
      const killed = defender.takeDamage(hb.damage, hb.knockback, dir);
      attacker.comboCount++;
      attacker.comboTimer = 90;

      // Spawn hit effect
      this.spawnHitEffect(
        defender.centerX, defender.y + defender.h * 0.3,
        hb.damage, attacker.currentAttack?.data?.color || '#fff'
      );

      // Nullify the attack to prevent repeated hits
      attacker.currentAttack = null;
    }
  }

  checkProjectileHits(attacker, defender) {
    attacker.projectiles.forEach(p => {
      if (p.hit) return;
      const dx = p.x - (defender.x + defender.w/2);
      const dy = p.y - (defender.y + defender.h/2);
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < p.r + defender.w/2 && defender.state !== 'dead') {
        p.hit = true;
        p.life = 0;
        const dir = p.vx > 0 ? 1 : -1;
        defender.takeDamage(p.damage, p.knockback, dir);
        attacker.comboCount++;
        attacker.comboTimer = 90;
        this.spawnHitEffect(p.x, p.y, p.damage, p.color);
      }
    });
  }

  spawnHitEffect(x, y, damage, color) {
    this.hitEffects.push({ x, y, damage, color, life: 40, maxLife: 40 });
  }

  updateCPU() {
    this.cpuTimer--;
    if (this.cpuTimer > 0) return;

    const cpu = this.p2;
    const player = this.p1;
    const dist = Math.abs(cpu.centerX - player.centerX);

    // Reset CPU input
    cpu.input = { left: false, right: false, jump: false, normal: false, mid: false, special: false };

    const difficulty = 0.7; // 0-1

    // Move towards player
    if (dist > 100) {
      if (cpu.centerX > player.centerX) cpu.input.left = true;
      else cpu.input.right = true;
    }

    // Attack if in range
    if (dist < 120 && Math.random() < difficulty) {
      const r = Math.random();
      if (r < 0.5) cpu.input.normal = true;
      else if (r < 0.8) cpu.input.mid = true;
      else cpu.input.special = true;
    }

    // Jump occasionally
    if (Math.random() < 0.05 && cpu.onGround) {
      cpu.input.jump = true;
    }

    // For ranged chars, keep distance
    if (cpu.char.attacks.normal.projectile && dist < 150) {
      if (cpu.centerX > player.centerX) cpu.input.right = true;
      else cpu.input.left = true;
    }

    this.cpuTimer = Math.floor(5 + Math.random() * 10);
  }

  updateHUD() {
    const p1Ratio = this.p1.hp / this.p1.maxHp;
    const p2Ratio = this.p2.hp / this.p2.maxHp;

    document.getElementById('p1-hp-bar').style.width = (p1Ratio * 100) + '%';
    document.getElementById('p2-hp-bar').style.width = (p2Ratio * 100) + '%';
    document.getElementById('p1-hp-text').textContent = Math.ceil(this.p1.hp);
    document.getElementById('p2-hp-text').textContent = Math.ceil(this.p2.hp);
  }

  render() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Draw stage background
    this.stage.bg(ctx, w, h);

    // Draw stage platforms
    this.drawPlatforms(ctx, w, h);

    // Draw fighters
    this.p1.draw(ctx);
    this.p2.draw(ctx);

    // Draw hit effects
    this.hitEffects.forEach(e => {
      const alpha = e.life / e.maxLife;
      const dy = (1 - alpha) * 30;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.font = 'bold 18px "Orbitron", sans-serif';
      ctx.fillStyle = e.color;
      ctx.shadowColor = e.color;
      ctx.shadowBlur = 8;
      ctx.textAlign = 'center';
      ctx.fillText(e.damage, e.x, e.y - dy);
      ctx.shadowBlur = 0;
      ctx.restore();
    });

    // Combo display
    [this.p1, this.p2].forEach(f => {
      if (f.comboCount >= 2 && f.comboTimer > 0) {
        const bx = f.isP2 ? w * 0.65 : w * 0.05;
        ctx.font = 'bold 22px "Orbitron", sans-serif';
        ctx.fillStyle = '#ffd700';
        ctx.shadowColor = '#ffd700';
        ctx.shadowBlur = 10;
        ctx.fillText(`${f.comboCount} HIT!`, bx, h * 0.2);
        ctx.shadowBlur = 0;
      }
    });
  }

  drawPlatforms(ctx, w, h) {
    // Main floor
    const p = this.stage.platform;
    const gy = p.y * h;
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(0, gy + this.p1.h, w, 6);

    // Extra platforms
    if (this.stage.platforms) {
      this.stage.platforms.forEach(pl => {
        const px = pl.x * w;
        const py = pl.y * h;
        const pw = pl.w * w;
        const ph = Math.max(pl.h * h, 10);

        ctx.fillStyle = 'rgba(100,80,40,0.85)';
        ctx.fillRect(px, py, pw, ph);
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.fillRect(px, py, pw, 2);
        ctx.strokeStyle = 'rgba(0,0,0,0.4)';
        ctx.lineWidth = 1;
        ctx.strokeRect(px, py, pw, ph);
      });
    }
  }

  endRound() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    const winner = this.p1.hp <= 0 ? this.p2 : (this.p2.hp <= 0 ? this.p1 : (this.p1.hp >= this.p2.hp ? this.p1 : this.p2));
    Game.showResult(winner);
  }
}
