// ============================================
// BATTLE ARENA - 効果音（Web Audio API・完全無料）
// ============================================

const SFX = (() => {
  let ctx = null;

  function init() {
    if (ctx) return;
    ctx = new (window.AudioContext || window.webkitAudioContext)();
  }

  function play(type) {
    try {
      init();
      if (ctx.state === 'suspended') ctx.resume();
      const now = ctx.currentTime;

      switch(type) {
        case 'hit_normal': {
          const o = ctx.createOscillator(), g = ctx.createGain();
          o.connect(g); g.connect(ctx.destination);
          o.frequency.setValueAtTime(180, now);
          o.frequency.exponentialRampToValueAtTime(80, now + 0.08);
          g.gain.setValueAtTime(0.4, now);
          g.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
          o.start(now); o.stop(now + 0.1);
          break;
        }
        case 'hit_mid': {
          const o = ctx.createOscillator(), g = ctx.createGain();
          o.connect(g); g.connect(ctx.destination);
          o.type = 'sawtooth';
          o.frequency.setValueAtTime(220, now);
          o.frequency.exponentialRampToValueAtTime(60, now + 0.12);
          g.gain.setValueAtTime(0.5, now);
          g.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
          o.start(now); o.stop(now + 0.15);
          break;
        }
        case 'hit_special': {
          // 爆発音
          const buf = ctx.createBuffer(1, ctx.sampleRate * 0.3, ctx.sampleRate);
          const data = buf.getChannelData(0);
          for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 2);
          const src = ctx.createBufferSource(), g = ctx.createGain();
          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass'; filter.frequency.value = 400;
          src.buffer = buf;
          src.connect(filter); filter.connect(g); g.connect(ctx.destination);
          g.gain.setValueAtTime(0.8, now);
          g.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
          src.start(now); src.stop(now + 0.3);
          break;
        }
        case 'jump': {
          const o = ctx.createOscillator(), g = ctx.createGain();
          o.connect(g); g.connect(ctx.destination);
          o.frequency.setValueAtTime(200, now);
          o.frequency.exponentialRampToValueAtTime(500, now + 0.15);
          g.gain.setValueAtTime(0.2, now);
          g.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
          o.start(now); o.stop(now + 0.15);
          break;
        }
        case 'ko': {
          const o = ctx.createOscillator(), g = ctx.createGain();
          o.connect(g); g.connect(ctx.destination);
          o.frequency.setValueAtTime(440, now);
          o.frequency.exponentialRampToValueAtTime(55, now + 0.8);
          g.gain.setValueAtTime(0.6, now);
          g.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
          o.start(now); o.stop(now + 0.8);
          break;
        }
        case 'fight': {
          [0, 0.1, 0.2].forEach((delay, i) => {
            const o = ctx.createOscillator(), g = ctx.createGain();
            o.connect(g); g.connect(ctx.destination);
            o.frequency.value = [330, 440, 660][i];
            g.gain.setValueAtTime(0.3, now + delay);
            g.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.2);
            o.start(now + delay); o.stop(now + delay + 0.2);
          });
          break;
        }
      }
    } catch(e) {}
  }

  return { play, init };
})();
