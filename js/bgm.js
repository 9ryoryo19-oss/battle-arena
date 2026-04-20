// ============================================
// BATTLE ARENA - BGM（Web Audio API・完全無料）
// 外部ファイル不要・コードで音楽生成
// ============================================

const BGM = (() => {
  let ctx = null;
  let masterGain = null;
  let currentTrack = null;
  let isPlaying = false;
  let volume = 0.35;

  function init() {
    if (ctx) return;
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = ctx.createGain();
    masterGain.gain.value = volume;
    masterGain.connect(ctx.destination);
  }

  function resume() {
    if (ctx && ctx.state === 'suspended') ctx.resume();
  }

  // ノートから周波数に変換
  function note(n, octave = 4) {
    const notes = { C:0, Cs:1, D:2, Ds:3, E:4, F:5, Fs:6, G:7, Gs:8, A:9, As:10, B:11 };
    return 440 * Math.pow(2, (notes[n] + (octave - 4) * 12 - 9) / 12);
  }

  // オシレーター生成
  function osc(freq, type, gainVal, start, dur, destination) {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.setValueAtTime(0, start);
    g.gain.linearRampToValueAtTime(gainVal, start + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, start + dur);
    o.connect(g);
    g.connect(destination || masterGain);
    o.start(start);
    o.stop(start + dur + 0.05);
    return o;
  }

  // ドラムパターン
  function kick(start) {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.frequency.setValueAtTime(150, start);
    o.frequency.exponentialRampToValueAtTime(40, start + 0.1);
    g.gain.setValueAtTime(0.8, start);
    g.gain.exponentialRampToValueAtTime(0.001, start + 0.15);
    o.connect(g); g.connect(masterGain);
    o.start(start); o.stop(start + 0.2);
  }

  function snare(start) {
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.15, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i/d.length, 2);
    const src = ctx.createBufferSource();
    const g = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass'; filter.frequency.value = 2000; filter.Q.value = 0.8;
    src.buffer = buf;
    src.connect(filter); filter.connect(g); g.connect(masterGain);
    g.gain.setValueAtTime(0.25, start);
    g.gain.exponentialRampToValueAtTime(0.001, start + 0.12);
    src.start(start);
  }

  function hihat(start, open = false) {
    const buf = ctx.createBuffer(1, ctx.sampleRate * (open ? 0.3 : 0.05), ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    const g = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass'; filter.frequency.value = 8000;
    src.buffer = buf;
    src.connect(filter); filter.connect(g); g.connect(masterGain);
    g.gain.setValueAtTime(0.08, start);
    g.gain.exponentialRampToValueAtTime(0.001, start + (open ? 0.25 : 0.04));
    src.start(start);
  }

  // ============================================
  // タイトルBGM: エレクトロ・アーケード風
  // ============================================
  function playTitle() {
    stop();
    init(); resume();
    isPlaying = true;

    const bpm = 128;
    const beat = 60 / bpm;
    const bar = beat * 4;
    const loopBars = 8;
    const loopLen = bar * loopBars;

    // メロディーパターン（C minor pentatonic）
    const melody = [
      [note('C',5), 0,    beat*0.5],
      [note('Ds',5), beat*0.5, beat*0.5],
      [note('F',5), beat*1, beat*0.5],
      [note('G',5), beat*1.5, beat*1],
      [note('C',6), beat*2.5, beat*0.5],
      [note('As',5), beat*3, beat*0.5],
      [note('G',5), beat*3.5, beat*0.5],

      [note('G',5), beat*4, beat*0.5],
      [note('F',5), beat*4.5, beat*0.5],
      [note('Ds',5), beat*5, beat*0.75],
      [note('D',5), beat*6, beat*0.5],
      [note('C',5), beat*6.5, beat*1.5],

      [note('F',5), beat*8, beat*0.5],
      [note('G',5), beat*8.5, beat*0.5],
      [note('As',5), beat*9, beat*0.5],
      [note('C',6), beat*9.5, beat*1],
      [note('Ds',6), beat*10.5, beat*0.5],
      [note('C',6), beat*11, beat*0.5],
      [note('As',5), beat*11.5, beat*0.5],

      [note('G',5), beat*12, beat*0.5],
      [note('F',5), beat*12.5, beat*0.5],
      [note('G',5), beat*13, beat*0.5],
      [note('As',5), beat*13.5, beat*0.5],
      [note('C',6), beat*14, beat*2],
    ];

    // ベースライン
    const bass = [
      [note('C',3), 0, beat*2],
      [note('G',2), beat*2, beat*2],
      [note('As',2), beat*4, beat*2],
      [note('F',2), beat*6, beat*2],
      [note('C',3), beat*8, beat*2],
      [note('G',2), beat*10, beat*2],
      [note('Ds',3), beat*12, beat*2],
      [note('G',2), beat*14, beat*2],
    ];

    // コード（パッド）
    const chords = [
      [[note('C',4), note('Ds',4), note('G',4)], 0, bar*2],
      [[note('G',3), note('B',3), note('D',4)], bar*2, bar*2],
      [[note('As',3), note('D',4), note('F',4)], bar*4, bar*2],
      [[note('F',3), note('A',3), note('C',4)], bar*6, bar*2],
    ];

    let startTime = ctx.currentTime + 0.1;
    let loopCount = 0;

    const scheduleLoop = () => {
      if (!isPlaying) return;
      const t0 = startTime + loopCount * loopLen;

      // ドラム
      for (let b = 0; b < loopBars * 4; b++) {
        const t = t0 + b * beat;
        if (b % 4 === 0) kick(t);
        if (b % 4 === 2) snare(t);
        hihat(t);
        if (b % 2 === 1) hihat(t + beat * 0.5);
      }

      // メロディー
      melody.forEach(([freq, offset, dur]) => {
        osc(freq, 'square', 0.12, t0 + offset, dur);
        // ビブラート風
        const lfo = ctx.createOscillator();
        const lfoG = ctx.createGain();
        const melOsc = ctx.createOscillator();
        const melG = ctx.createGain();
        melOsc.type = 'square'; melOsc.frequency.value = freq * 1.004;
        lfo.frequency.value = 5; lfoG.gain.value = 3;
        lfo.connect(lfoG); lfoG.connect(melOsc.frequency);
        melG.gain.setValueAtTime(0, t0+offset);
        melG.gain.linearRampToValueAtTime(0.06, t0+offset+0.01);
        melG.gain.exponentialRampToValueAtTime(0.001, t0+offset+dur);
        melOsc.connect(melG); melG.connect(masterGain);
        lfo.start(t0+offset); lfo.stop(t0+offset+dur+0.1);
        melOsc.start(t0+offset); melOsc.stop(t0+offset+dur+0.1);
      });

      // ベース
      bass.forEach(([freq, offset, dur]) => {
        osc(freq, 'sawtooth', 0.2, t0 + offset, dur);
        osc(freq * 2, 'square', 0.05, t0 + offset, dur);
      });

      // パッド（コード）
      chords.forEach(([notes, offset, dur]) => {
        notes.forEach(freq => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          const filt = ctx.createBiquadFilter();
          filt.type = 'lowpass'; filt.frequency.value = 1200;
          o.type = 'sawtooth'; o.frequency.value = freq;
          g.gain.setValueAtTime(0, t0+offset);
          g.gain.linearRampToValueAtTime(0.04, t0+offset+0.3);
          g.gain.setValueAtTime(0.04, t0+offset+dur-0.2);
          g.gain.linearRampToValueAtTime(0, t0+offset+dur);
          o.connect(filt); filt.connect(g); g.connect(masterGain);
          o.start(t0+offset); o.stop(t0+offset+dur+0.1);
        });
      });

      loopCount++;
      currentTrack = setTimeout(scheduleLoop, (loopLen - beat * 2) * 1000);
    };

    scheduleLoop();
  }

  // ============================================
  // バトルBGM: アグレッシブ・ハードコア風
  // ============================================
  function playBattle() {
    stop();
    init(); resume();
    isPlaying = true;

    const bpm = 160;
    const beat = 60 / bpm;
    const bar = beat * 4;
    const loopBars = 8;
    const loopLen = bar * loopBars;

    // バトルメロディー（E minor）
    const melody = [
      [note('E',5), 0, beat*0.25],
      [note('E',5), beat*0.25, beat*0.25],
      [note('G',5), beat*0.5, beat*0.5],
      [note('B',5), beat*1, beat*0.5],
      [note('A',5), beat*1.5, beat*0.25],
      [note('G',5), beat*1.75, beat*0.25],
      [note('E',5), beat*2, beat*0.5],
      [note('Fs',5), beat*2.5, beat*0.5],
      [note('G',5), beat*3, beat*1],

      [note('G',5), beat*4, beat*0.25],
      [note('A',5), beat*4.25, beat*0.25],
      [note('B',5), beat*4.5, beat*0.5],
      [note('E',6), beat*5, beat*0.75],
      [note('D',6), beat*5.75, beat*0.25],
      [note('B',5), beat*6, beat*0.5],
      [note('A',5), beat*6.5, beat*0.5],
      [note('G',5), beat*7, beat*1],

      [note('E',5), beat*8, beat*0.25],
      [note('Fs',5), beat*8.5, beat*0.5],
      [note('G',5), beat*9, beat*0.5],
      [note('A',5), beat*9.5, beat*0.5],
      [note('B',5), beat*10, beat*1],
      [note('G',5), beat*11, beat*0.5],
      [note('Fs',5), beat*11.5, beat*0.5],

      [note('E',5), beat*12, beat*0.5],
      [note('B',4), beat*12.5, beat*0.5],
      [note('E',5), beat*13, beat*0.25],
      [note('Fs',5), beat*13.25, beat*0.25],
      [note('G',5), beat*13.5, beat*0.25],
      [note('A',5), beat*13.75, beat*0.25],
      [note('B',5), beat*14, beat*2],
    ];

    const bass = [
      [note('E',2), 0, beat*2],
      [note('G',2), beat*2, beat*1],
      [note('A',2), beat*3, beat*1],
      [note('E',2), beat*4, beat*2],
      [note('D',2), beat*6, beat*2],
      [note('E',2), beat*8, beat*2],
      [note('G',2), beat*10, beat*1],
      [note('Fs',2), beat*11, beat*1],
      [note('E',2), beat*12, beat*2],
      [note('B',1), beat*14, beat*2],
    ];

    let startTime = ctx.currentTime + 0.1;
    let loopCount = 0;

    const scheduleLoop = () => {
      if (!isPlaying) return;
      const t0 = startTime + loopCount * loopLen;

      // アグレッシブドラム
      for (let b = 0; b < loopBars * 4; b++) {
        const t = t0 + b * beat;
        // キック: 1,3拍 + シンコペ
        if (b % 4 === 0 || b % 4 === 2) kick(t);
        if (b % 8 === 5) kick(t); // シンコペ
        // スネア: 2,4拍
        if (b % 4 === 1 || b % 4 === 3) snare(t);
        // 16分ハイハット
        hihat(t);
        hihat(t + beat * 0.25);
        hihat(t + beat * 0.5);
        hihat(t + beat * 0.75);
      }

      // メロディー（ディストーション風）
      melody.forEach(([freq, offset, dur]) => {
        // 基音
        osc(freq, 'sawtooth', 0.15, t0 + offset, dur);
        // 1オクターブ上
        osc(freq * 2, 'square', 0.08, t0 + offset, dur);
        // 歪み成分
        osc(freq * 1.5, 'sawtooth', 0.04, t0 + offset, dur);
      });

      // ベース（ヘビー）
      bass.forEach(([freq, offset, dur]) => {
        osc(freq, 'sawtooth', 0.3, t0 + offset, dur);
        osc(freq * 2, 'square', 0.1, t0 + offset, dur);
      });

      // パワーコード風（5th追加）
      const powerChords = [
        [note('E',3), 0, bar*2],
        [note('G',3), bar*2, bar*2],
        [note('A',3), bar*4, bar*2],
        [note('E',3), bar*6, bar*2],
      ];
      powerChords.forEach(([freq, offset, dur]) => {
        [freq, freq * 1.5, freq * 2].forEach(f => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          const dist = ctx.createWaveShaper();
          // 簡易ディストーション
          const curve = new Float32Array(256);
          for (let i = 0; i < 256; i++) {
            const x = (i * 2) / 256 - 1;
            curve[i] = (Math.PI + 400) * x / (Math.PI + 400 * Math.abs(x));
          }
          dist.curve = curve;
          o.type = 'sawtooth'; o.frequency.value = f;
          g.gain.setValueAtTime(0, t0+offset);
          g.gain.linearRampToValueAtTime(0.06, t0+offset+0.02);
          g.gain.setValueAtTime(0.06, t0+offset+dur-0.1);
          g.gain.linearRampToValueAtTime(0, t0+offset+dur);
          o.connect(dist); dist.connect(g); g.connect(masterGain);
          o.start(t0+offset); o.stop(t0+offset+dur+0.1);
        });
      });

      loopCount++;
      currentTrack = setTimeout(scheduleLoop, (loopLen - beat * 2) * 1000);
    };

    scheduleLoop();
  }

  function stop() {
    isPlaying = false;
    if (currentTrack) { clearTimeout(currentTrack); currentTrack = null; }
  }

  function setVolume(v) {
    volume = Math.max(0, Math.min(1, v));
    if (masterGain) masterGain.gain.setTargetAtTime(volume, ctx.currentTime, 0.1);
  }

  function getVolume() { return volume; }

  return { playTitle, playBattle, stop, setVolume, getVolume, init, resume };
})();
