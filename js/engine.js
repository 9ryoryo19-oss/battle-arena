// ============================================
// BATTLE ARENA - ゲームエンジン Phase 2
// ============================================

class Fighter {
  constructor(charData, x, isP2 = false) {
    this.char = charData;
    this.x = x; this.y = 0;
    this.vx = 0; this.vy = 0;
    this.w = 48; this.h = 80;
    this.dir = isP2 ? -1 : 1;
    this.isP2 = isP2;
    this.hp = charData.hp; this.maxHp = charData.hp;
    this.state = 'idle';
    this.attackCooldown = 0;
    this.hurtTimer = 0; this.stateTimer = 0;
    this.currentAttack = null;
    this.onGround = false;
    this.input = { left: false, right: false, jump: false };
    this.prevJump = false;
    this.attackQueue = [];
    this.projectiles = [];
    this.comboCount = 0; this.comboTimer = 0;
    this.flashTimer = 0;
    // Phase 2: ヒットストップ
    this.hitstopTimer = 0;
    // Phase 2: 残像（アフターイメージ）
    this.afterImages = [];
  }

  get centerX() { return this.x + this.w / 2; }
  get bottom() { return this.y + this.h; }

  queueAttack(type) {
    if (this.attackQueue.length < 2) this.attackQueue.push(type);
  }

  takeDamage(dmg, knockback, direction, attackType) {
    if (this.state === 'dead') return false;
    this.hp = Math.max(0, this.hp - dmg);
    this.vx = knockback * direction;
    this.vy = attackType === 'special' ? -6 : -3;
    this.hurtTimer = attackType === 'special' ? 28 : 18;
    this.hitstopTimer = attackType === 'special' ? 10 : attackType === 'mid' ? 5 : 3;
    this.flashTimer = 10;
    this.state = 'hurt';
    if (this.hp <= 0) { this.state = 'dead'; return true; }
    return false;
  }

  update(canvasW, canvasH, stage, opponent) {
    // ヒットストップ中は動かない
    if (this.hitstopTimer > 0) { this.hitstopTimer--; return; }

    if (this.attackCooldown > 0) this.attackCooldown--;
    if (this.hurtTimer > 0) this.hurtTimer--;
    if (this.comboTimer > 0) this.comboTimer--; else this.comboCount = 0;
    if (this.flashTimer > 0) this.flashTimer--;

    // 残像を記録（攻撃中）
    if (this.state === 'attack' && Math.random() < 0.4) {
      this.afterImages.push({ x: this.x, y: this.y, dir: this.dir, alpha: 0.4, life: 6 });
    }
    this.afterImages = this.afterImages.filter(a => { a.life--; a.alpha *= 0.7; return a.life > 0; });

    if (this.state === 'dead') { this.vy += 0.5; this.y += this.vy; return; }
    if (this.state === 'hurt' && this.hurtTimer <= 0) this.state = 'idle';

    if (opponent && this.state !== 'attack' && this.state !== 'hurt')
      this.dir = opponent.centerX > this.centerX ? 1 : -1;

    // 攻撃キューから発動
    if (this.state !== 'hurt' && this.state !== 'dead' && this.attackCooldown === 0 && this.attackQueue.length > 0) {
      this.startAttack(this.attackQueue.shift());
    }

    // 移動
    if (this.state !== 'hurt') {
      const spd = this.char.speed;
      if (this.state !== 'attack') {
        if (this.input.left) { this.vx = -spd; if (this.onGround) this.state = 'walk'; }
        else if (this.input.right) { this.vx = spd; if (this.onGround) this.state = 'walk'; }
        else { this.vx *= 0.65; if (Math.abs(this.vx) < 0.3) this.vx = 0; if (this.onGround) this.state = 'idle'; }
      } else {
        this.vx *= 0.8;
        if (this.stateTimer > 0) { this.stateTimer--; if (this.stateTimer <= 0) { this.state = 'idle'; this.currentAttack = null; } }
      }
      const jumpJust = this.input.jump && !this.prevJump;
      if (jumpJust && this.onGround) {
        this.vy = -this.char.jumpPower;
        this.onGround = false;
        this.state = 'jump';
        SFX.play('jump');
      }
    }
    this.prevJump = this.input.jump;

    this.vy += 0.65;
    this.x += this.vx;
    this.y += this.vy;
    this.x = Math.max(0, Math.min(canvasW - this.w, this.x));

    this.onGround = false;
    const gy = stage.platform.y * canvasH;
    if (this.bottom >= gy && this.vy >= 0) {
      this.y = gy - this.h; this.vy = 0; this.onGround = true;
      if (this.state === 'jump') this.state = 'idle';
    }
    if (stage.platforms) {
      stage.platforms.forEach(p => {
        const px = p.x*canvasW, py = p.y*canvasH, pw = p.w*canvasW;
        if (this.bottom >= py && this.bottom <= py+24 && this.x+this.w > px && this.x < px+pw && this.vy >= 0) {
          this.y = py-this.h; this.vy = 0; this.onGround = true;
          if (this.state === 'jump') this.state = 'idle';
        }
      });
    }
    if (this.y > canvasH+100) { this.hp = 0; this.state = 'dead'; }

    this.projectiles = this.projectiles.filter(p => { p.x += p.vx; p.life--; return p.life > 0 && p.x > -50 && p.x < canvasW+50; });
  }

  startAttack(type) {
    const atk = this.char.attacks[type];
    this.state = 'attack';
    this.attackCooldown = atk.cooldown;
    this.stateTimer = Math.min(atk.cooldown * 0.6, 22);
    this.currentAttack = { type, data: atk };
    if (atk.projectile) {
      this.projectiles.push({
        x: this.x + (this.dir===1 ? this.w : 0), y: this.y+this.h*0.35,
        vx: this.dir*9, r: type==='special'?14:type==='mid'?10:7,
        color: atk.color, damage: atk.damage, knockback: atk.knockback,
        life: Math.ceil(atk.range/9), hit: false, type,
      });
    }
  }

  draw(ctx) {
    // 残像描画
    this.afterImages.forEach(a => {
      ctx.save();
      ctx.globalAlpha = a.alpha;
      this.char.sprite(ctx, a.x, a.y, this.w, this.h, a.dir, 'attack');
      ctx.restore();
    });

    // ヒットフラッシュ
    if (this.flashTimer > 0 && this.flashTimer % 2 === 0) ctx.globalAlpha = 0.3;
    this.char.sprite(ctx, this.x, this.y, this.w, this.h, this.dir, this.state);
    ctx.globalAlpha = 1;

    // HPバー
    const bw=60, bx=this.x+this.w/2-bw/2, by=this.y-14;
    ctx.fillStyle='#222'; ctx.fillRect(bx,by,bw,6);
    const ratio=this.hp/this.maxHp;
    ctx.fillStyle=ratio>0.5?'#22c55e':ratio>0.25?'#eab308':'#ef4444';
    ctx.fillRect(bx,by,bw*ratio,6);
    ctx.strokeStyle='#444'; ctx.lineWidth=1; ctx.strokeRect(bx,by,bw,6);

    // プロジェクタイル
    this.projectiles.forEach(p => {
      const pulse = 1 + Math.sin(Date.now()*0.02)*0.2;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r*pulse,0,Math.PI*2);
      ctx.fillStyle=p.color; ctx.shadowColor=p.color; ctx.shadowBlur=16;
      ctx.fill(); ctx.shadowBlur=0;
    });
  }

  getHitbox() {
    if (this.state!=='attack'||!this.currentAttack) return null;
    if (this.currentAttack.data.projectile) return null;
    const atk=this.currentAttack.data;
    return { x: this.dir===1?this.x+this.w:this.x-atk.range, y:this.y+10, w:atk.range, h:this.h-20, damage:atk.damage, knockback:atk.knockback, type:this.currentAttack.type };
  }
}

// ============================================
// Engine
// ============================================
class Engine {
  constructor(canvas, stage, p1char, p2char, mode) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.stage = stage; this.mode = mode;
    this.resize();

    const w=this.canvas.width, h=this.canvas.height;
    this.p1 = new Fighter(p1char, w*0.2, false);
    this.p2 = new Fighter(p2char, w*0.75, true);
    this.p1.y = h*stage.platform.y-this.p1.h;
    this.p2.y = h*stage.platform.y-this.p2.h;

    this.running=false; this.paused=false;
    this.timer=99; this.timerInterval=null; this.animFrame=null;
    this.hitEffects=[]; this.cpuTimer=0; this.ended=false;

    // Phase 2: 演出
    this.screenFlash = { active: false, color: '#fff', alpha: 0, timer: 0 };
    this.announcement = { text: '', timer: 0, color: '#ffd700', scale: 1 };
    this.shakeTimer = 0;
    this.shakeX = 0; this.shakeY = 0;
  }

  resize() {
    const battle = document.getElementById('screen-battle');
    this.canvas.width = battle.offsetWidth;
    this.canvas.height = battle.offsetHeight - 56;
    this.canvas.style.top = '56px';
  }

  start() {
    this.running = true;
    // FIGHT! 演出
    this.showAnnouncement('FIGHT!', '#00d4ff', 2.0);
    SFX.play('fight');

    this.timerInterval = setInterval(() => {
      if (!this.paused && this.running) {
        this.timer = Math.max(0, this.timer-1);
        document.getElementById('round-timer').textContent = this.timer;
        if (this.timer===0) this.endRound();
      }
    }, 1000);
    this.loop();
  }

  stop() {
    this.running=false;
    if (this.animFrame) cancelAnimationFrame(this.animFrame);
    if (this.timerInterval) clearInterval(this.timerInterval);
  }

  loop() {
    if (!this.running) return;
    if (!this.paused) { this.update(); this.render(); }
    this.animFrame = requestAnimationFrame(()=>this.loop());
  }

  showAnnouncement(text, color='#ffd700', scale=1.5) {
    this.announcement = { text, color, timer: 80, scale };
  }

  triggerScreenFlash(color, duration=15) {
    this.screenFlash = { active: true, color, alpha: 0.7, timer: duration };
  }

  triggerShake(intensity=8, duration=12) {
    this.shakeTimer = duration;
    this._shakeIntensity = intensity;
  }

  update() {
    const w=this.canvas.width, h=this.canvas.height;
    if (this.mode==='vs-cpu') this.updateCPU();

    this.p1.update(w,h,this.stage,this.p2);
    this.p2.update(w,h,this.stage,this.p1);

    this.checkMeleeHit(this.p1,this.p2);
    this.checkMeleeHit(this.p2,this.p1);
    this.checkProjectileHits(this.p1,this.p2);
    this.checkProjectileHits(this.p2,this.p1);

    this.hitEffects=this.hitEffects.filter(e=>e.life>0);
    this.hitEffects.forEach(e=>e.life--);

    // 演出タイマー
    if (this.screenFlash.timer>0) {
      this.screenFlash.timer--;
      this.screenFlash.alpha *= 0.85;
      if (this.screenFlash.timer<=0) this.screenFlash.active=false;
    }
    if (this.announcement.timer>0) this.announcement.timer--;
    if (this.shakeTimer>0) {
      this.shakeTimer--;
      const i=this._shakeIntensity*(this.shakeTimer/12);
      this.shakeX=(Math.random()-0.5)*i*2;
      this.shakeY=(Math.random()-0.5)*i*2;
    } else { this.shakeX=0; this.shakeY=0; }

    this.updateHUD();

    if (!this.ended && (this.p1.state==='dead'||this.p2.state==='dead')) {
      this.ended=true;
      this.showAnnouncement('K.O.!', '#ff4466', 2.5);
      this.triggerScreenFlash('#ff0000', 25);
      this.triggerShake(12, 20);
      SFX.play('ko');
      setTimeout(()=>this.endRound(), 1600);
    }
  }

  checkMeleeHit(attacker, defender) {
    const hb=attacker.getHitbox();
    if (!hb) return;
    const d=defender;
    if (hb.x<d.x+d.w && hb.x+hb.w>d.x && hb.y<d.y+d.h && hb.y+hb.h>d.y && d.state!=='dead') {
      const killed=defender.takeDamage(hb.damage,hb.knockback,attacker.dir,hb.type);
      attacker.comboCount++; attacker.comboTimer=90;
      this.hitEffects.push({x:defender.centerX, y:defender.y+20, dmg:hb.damage, color:attacker.currentAttack?.data?.color||'#fff', life:40, maxLife:40, type:hb.type});
      // エフェクト強度を攻撃タイプで変える
      if (hb.type==='special') {
        this.triggerScreenFlash(attacker.char.color, 20);
        this.triggerShake(8,14);
        this.showAnnouncement(attacker.char.attacks.special.name||'SPECIAL!', attacker.char.color, 1.4);
      } else if (hb.type==='mid') {
        this.triggerShake(4,8);
      }
      SFX.play('hit_'+hb.type);
      attacker.currentAttack=null;
    }
  }

  checkProjectileHits(attacker, defender) {
    attacker.projectiles.forEach(p => {
      if (p.hit) return;
      const dx=p.x-(defender.x+defender.w/2), dy=p.y-(defender.y+defender.h/2);
      if (Math.sqrt(dx*dx+dy*dy)<p.r+defender.w/2 && defender.state!=='dead') {
        p.hit=true; p.life=0;
        defender.takeDamage(p.damage,p.knockback,p.vx>0?1:-1,p.type);
        attacker.comboCount++; attacker.comboTimer=90;
        this.hitEffects.push({x:p.x, y:p.y, dmg:p.damage, color:p.color, life:40, maxLife:40, type:p.type});
        if (p.type==='special') {
          this.triggerScreenFlash(attacker.char.color,18);
          this.triggerShake(6,12);
          this.showAnnouncement(attacker.char.attacks.special.name||'SPECIAL!', attacker.char.color, 1.4);
        }
        SFX.play('hit_'+p.type);
      }
    });
  }

  updateHUD() {
    document.getElementById('p1-hp-bar').style.width=(this.p1.hp/this.p1.maxHp*100)+'%';
    document.getElementById('p2-hp-bar').style.width=(this.p2.hp/this.p2.maxHp*100)+'%';
    document.getElementById('p1-hp-text').textContent=Math.ceil(this.p1.hp);
    document.getElementById('p2-hp-text').textContent=Math.ceil(this.p2.hp);
  }

  updateCPU() {
    this.cpuTimer--;
    if (this.cpuTimer>0) return;
    const cpu=this.p2, player=this.p1;
    const dist=Math.abs(cpu.centerX-player.centerX);
    cpu.input.left=false; cpu.input.right=false; cpu.input.jump=false;
    if (dist>120) cpu.centerX>player.centerX?(cpu.input.left=true):(cpu.input.right=true);
    if (dist<130 && Math.random()<0.6) {
      const r=Math.random();
      cpu.queueAttack(r<0.5?'normal':r<0.8?'mid':'special');
    }
    if (Math.random()<0.04 && cpu.onGround) cpu.input.jump=true;
    if (cpu.char.attacks.normal.projectile && dist<160)
      cpu.centerX>player.centerX?(cpu.input.right=true):(cpu.input.left=true);
    this.cpuTimer=Math.floor(6+Math.random()*10);
  }

  render() {
    const ctx=this.ctx, w=this.canvas.width, h=this.canvas.height;
    ctx.save();
    // 画面シェイク
    if (this.shakeTimer>0) ctx.translate(this.shakeX, this.shakeY);

    ctx.clearRect(-20,-20,w+40,h+40);
    this.stage.bg(ctx,w,h);
    this.drawPlatforms(ctx,w,h);
    this.p1.draw(ctx);
    this.p2.draw(ctx);

    // ヒットエフェクト
    this.hitEffects.forEach(e => {
      const alpha=e.life/e.maxLife;
      const size=e.type==='special'?22:e.type==='mid'?18:14;
      ctx.save();
      ctx.globalAlpha=alpha;
      ctx.font=`bold ${size}px Orbitron,sans-serif`;
      ctx.fillStyle=e.color; ctx.shadowColor=e.color; ctx.shadowBlur=8;
      ctx.textAlign='center';
      ctx.fillText(e.dmg, e.x, e.y-(1-alpha)*35);
      // 必殺技はHIT文字も
      if (e.type==='special' && e.life>30) {
        ctx.font='bold 14px Orbitron,sans-serif';
        ctx.fillText('CRITICAL!', e.x, e.y-(1-alpha)*35+20);
      }
      ctx.shadowBlur=0;
      ctx.restore();
    });

    // コンボ表示
    [this.p1,this.p2].forEach(f => {
      if (f.comboCount>=2 && f.comboTimer>0) {
        const bx=f.isP2?w*0.68:w*0.05;
        ctx.font='bold 20px Orbitron,sans-serif';
        ctx.fillStyle='#ffd700'; ctx.shadowColor='#ffd700'; ctx.shadowBlur=10;
        ctx.textAlign='left';
        ctx.fillText(`${f.comboCount} HIT!`, bx, h*0.2);
        ctx.shadowBlur=0;
      }
    });

    ctx.restore();

    // スクリーンフラッシュ（シェイクの外）
    if (this.screenFlash.active && this.screenFlash.alpha>0.01) {
      ctx.save();
      ctx.globalAlpha=this.screenFlash.alpha;
      ctx.fillStyle=this.screenFlash.color;
      ctx.fillRect(0,0,w,h);
      ctx.restore();
    }

    // アナウンスメント
    if (this.announcement.timer>0) {
      const progress=this.announcement.timer/80;
      const scale=this.announcement.scale*(0.8+progress*0.4);
      const alpha=Math.min(1, progress*3);
      ctx.save();
      ctx.globalAlpha=alpha;
      ctx.translate(w/2, h/2);
      ctx.scale(scale,scale);
      ctx.font='bold 48px Orbitron,sans-serif';
      ctx.fillStyle=this.announcement.color;
      ctx.strokeStyle='#000';
      ctx.lineWidth=4;
      ctx.textAlign='center';
      ctx.shadowColor=this.announcement.color;
      ctx.shadowBlur=30;
      ctx.strokeText(this.announcement.text,0,0);
      ctx.fillText(this.announcement.text,0,0);
      ctx.shadowBlur=0;
      ctx.restore();
    }
  }

  drawPlatforms(ctx,w,h) {
    ctx.fillStyle='rgba(0,0,0,0.2)';
    ctx.fillRect(0, this.stage.platform.y*h+this.p1.h, w, 8);
    if (this.stage.platforms) {
      this.stage.platforms.forEach(pl => {
        ctx.fillStyle='rgba(120,90,40,0.85)';
        ctx.fillRect(pl.x*w,pl.y*h,pl.w*w,Math.max(pl.h*h,10));
        ctx.fillStyle='rgba(255,255,255,0.2)';
        ctx.fillRect(pl.x*w,pl.y*h,pl.w*w,2);
      });
    }
  }

  endRound() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    const winner=this.p1.hp<=0?this.p2:(this.p2.hp<=0?this.p1:(this.p1.hp>=this.p2.hp?this.p1:this.p2));
    Game.showResult(winner);
  }
}
