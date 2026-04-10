// ============================================
// BATTLE ARENA - ステージデータ
// ============================================

const STAGES = [
  {
    id: 'dojo',
    name: '道場',
    bg: (ctx, w, h) => {
      // Sky
      const sky = ctx.createLinearGradient(0, 0, 0, h * 0.7);
      sky.addColorStop(0, '#87ceeb');
      sky.addColorStop(1, '#e0f4ff');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h * 0.7);

      // Mountains
      ctx.fillStyle = '#6b8fa8';
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(i * w/4 - w*0.1, h * 0.65);
        ctx.lineTo(i * w/4 + w*0.12, h * 0.3);
        ctx.lineTo(i * w/4 + w*0.25, h * 0.65);
        ctx.fill();
      }

      // Floor
      const floor = ctx.createLinearGradient(0, h*0.7, 0, h);
      floor.addColorStop(0, '#8B4513');
      floor.addColorStop(1, '#5c2d00');
      ctx.fillStyle = floor;
      ctx.fillRect(0, h * 0.7, w, h * 0.3);

      // Wood planks
      ctx.strokeStyle = '#6B3410';
      ctx.lineWidth = 2;
      for (let i = 0; i < 8; i++) {
        ctx.beginPath();
        ctx.moveTo(i * w/7, h * 0.7);
        ctx.lineTo(i * w/7, h);
        ctx.stroke();
      }
    },
    platform: { y: 0.72, h: 0.04 },
    platforms: [],
    color: '#8B4513',
    previewColor: 'linear-gradient(180deg, #87ceeb 60%, #8B4513 40%)',
  },
  {
    id: 'floating',
    name: '浮島',
    bg: (ctx, w, h) => {
      // Sunset sky
      const sky = ctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, '#0d1b4b');
      sky.addColorStop(0.5, '#6b21a8');
      sky.addColorStop(1, '#f97316');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      // Stars
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      const stars = [[0.1, 0.1], [0.3, 0.05], [0.6, 0.08], [0.8, 0.15], [0.45, 0.12], [0.9, 0.06], [0.15, 0.2]];
      stars.forEach(([sx, sy]) => {
        ctx.beginPath();
        ctx.arc(sx * w, sy * h, 1.5, 0, Math.PI*2);
        ctx.fill();
      });

      // Clouds below
      ctx.fillStyle = 'rgba(255,255,255,0.15)';
      [0.15, 0.5, 0.82].forEach(cx => {
        ctx.beginPath();
        ctx.ellipse(cx * w, h * 0.85, w * 0.12, h * 0.04, 0, 0, Math.PI*2);
        ctx.fill();
      });
    },
    platform: { y: 0.72, h: 0.04 },
    platforms: [
      { x: 0.08, y: 0.50, w: 0.18, h: 0.04 },
      { x: 0.74, y: 0.50, w: 0.18, h: 0.04 },
      { x: 0.38, y: 0.38, w: 0.24, h: 0.04 },
    ],
    color: '#6b21a8',
    previewColor: 'linear-gradient(180deg, #0d1b4b 0%, #6b21a8 50%, #f97316 100%)',
  },
  {
    id: 'rooftop',
    name: '都市の屋上',
    bg: (ctx, w, h) => {
      // Night city
      const sky = ctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, '#0a0a1a');
      sky.addColorStop(1, '#1a1a3a');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      // City buildings
      const buildings = [
        {x: 0, w: 0.12, h: 0.55}, {x: 0.08, w: 0.1, h: 0.45},
        {x: 0.15, w: 0.08, h: 0.60}, {x: 0.72, w: 0.1, h: 0.50},
        {x: 0.80, w: 0.12, h: 0.65}, {x: 0.89, w: 0.11, h: 0.48},
      ];
      buildings.forEach(b => {
        ctx.fillStyle = '#111122';
        ctx.fillRect(b.x * w, (1 - b.h) * h, b.w * w, b.h * h);

        // Windows
        ctx.fillStyle = 'rgba(255,220,100,0.6)';
        for (let wy = (1-b.h)*h + 8; wy < h - 20; wy += 14) {
          for (let wx = b.x*w + 4; wx < (b.x+b.w)*w - 6; wx += 10) {
            if (Math.random() > 0.3) {
              ctx.fillRect(wx, wy, 5, 8);
            }
          }
        }
      });

      // Neon signs
      ctx.shadowColor = '#00d4ff';
      ctx.shadowBlur = 12;
      ctx.strokeStyle = '#00d4ff';
      ctx.lineWidth = 2;
      ctx.strokeRect(w * 0.22, h * 0.52, w * 0.08, h * 0.06);
      ctx.shadowColor = '#ff4466';
      ctx.strokeStyle = '#ff4466';
      ctx.strokeRect(w * 0.68, h * 0.44, w * 0.06, h * 0.05);
      ctx.shadowBlur = 0;

      // Floor (rooftop)
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, h * 0.7, w, h * 0.3);
      ctx.strokeStyle = '#2a2a4a';
      ctx.lineWidth = 1;
      for (let i = 0; i < 10; i++) {
        ctx.beginPath();
        ctx.moveTo(0, h * 0.7 + i * 20);
        ctx.lineTo(w, h * 0.7 + i * 20);
        ctx.stroke();
      }
    },
    platform: { y: 0.72, h: 0.04 },
    platforms: [
      { x: 0.12, y: 0.55, w: 0.15, h: 0.03 },
      { x: 0.73, y: 0.55, w: 0.15, h: 0.03 },
    ],
    color: '#1a1a2e',
    previewColor: 'linear-gradient(180deg, #0a0a1a 60%, #1a1a2e 40%)',
  },
  {
    id: 'volcano',
    name: '火山',
    bg: (ctx, w, h) => {
      // Red/orange sky
      const sky = ctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, '#1a0500');
      sky.addColorStop(0.6, '#7c1a00');
      sky.addColorStop(1, '#ff4400');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      // Volcano silhouette
      ctx.fillStyle = '#0a0000';
      ctx.beginPath();
      ctx.moveTo(0, h * 0.9);
      ctx.lineTo(w * 0.3, h * 0.2);
      ctx.lineTo(w * 0.5, h * 0.3);
      ctx.lineTo(w * 0.7, h * 0.1);
      ctx.lineTo(w, h * 0.9);
      ctx.fill();

      // Lava glow
      ctx.fillStyle = '#ff6600';
      ctx.shadowColor = '#ff6600';
      ctx.shadowBlur = 20;
      ctx.fillRect(0, h * 0.86, w, h * 0.14);
      ctx.shadowBlur = 0;

      // Lava surface texture
      const t = Date.now() * 0.001;
      ctx.fillStyle = '#ff3300';
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.ellipse(
          (i * 0.22 + Math.sin(t + i) * 0.05) * w,
          h * 0.88, w * 0.08, h * 0.02, 0, 0, Math.PI*2
        );
        ctx.fill();
      }
    },
    platform: { y: 0.72, h: 0.04 },
    platforms: [
      { x: 0.05, y: 0.56, w: 0.2, h: 0.04 },
      { x: 0.75, y: 0.56, w: 0.2, h: 0.04 },
      { x: 0.38, y: 0.42, w: 0.24, h: 0.04 },
    ],
    color: '#7c1a00',
    previewColor: 'linear-gradient(180deg, #1a0500 0%, #7c1a00 60%, #ff4400 100%)',
  },
  {
    id: 'ice',
    name: '氷の宮殿',
    bg: (ctx, w, h) => {
      // Ice blue
      const sky = ctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, '#e0f4ff');
      sky.addColorStop(1, '#b0d8f0');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      // Ice pillars
      ctx.fillStyle = 'rgba(180,230,255,0.6)';
      [0.05, 0.2, 0.78, 0.92].forEach(px => {
        ctx.beginPath();
        ctx.moveTo(px*w - w*0.03, h);
        ctx.lineTo(px*w, h*0.15);
        ctx.lineTo(px*w + w*0.03, h);
        ctx.fill();
      });

      // Snowflakes
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      const snows = [[0.2, 0.2], [0.5, 0.1], [0.8, 0.25], [0.35, 0.35], [0.65, 0.18]];
      snows.forEach(([sx, sy]) => {
        ctx.beginPath();
        ctx.arc(sx*w, sy*h, 2, 0, Math.PI*2);
        ctx.fill();
      });

      // Ice floor
      ctx.fillStyle = '#b0e4ff';
      ctx.fillRect(0, h * 0.7, w, h * 0.3);
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.fillRect(0, h * 0.7, w, h * 0.04);
    },
    platform: { y: 0.72, h: 0.04 },
    platforms: [
      { x: 0.1, y: 0.50, w: 0.2, h: 0.035 },
      { x: 0.7, y: 0.50, w: 0.2, h: 0.035 },
    ],
    color: '#b0d8f0',
    previewColor: 'linear-gradient(180deg, #e0f4ff 60%, #b0e4ff 40%)',
  },
];
