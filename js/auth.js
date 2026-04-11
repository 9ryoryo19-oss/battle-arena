// ============================================
// BATTLE ARENA - 認証・データ管理（Supabase）
// ============================================

const SUPABASE_URL = 'https://mhoxmehluacprsmepmxu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ob3htZWhsdWFjcHJzbWVwbXh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNTcxMzUsImV4cCI6MjA4OTgzMzEzNX0.0uKM-KW8KhrxKNO-hh1BEhOrmKtMlze-vSMQL-SEWJY';

const Auth = (() => {
  let supabase = null;
  let currentUser = null;
  let currentProfile = null;

  const EXP_TABLE = [0,100,250,450,700,1000,1400,1900,2500,3200,4000];
  const MAX_LEVEL = 10;

  async function init() {
    if (!window.supabase) {
      await loadScript('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js');
    }
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) { currentUser = session.user; await loadProfile(); }
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        currentUser = session.user; await loadProfile(); updateAuthUI();
      } else if (event === 'SIGNED_OUT') {
        currentUser = null; currentProfile = null; updateAuthUI();
      }
    });
    updateAuthUI();
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src; s.onload = resolve; s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  async function signUp(email, password, username) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    if (data.user && data.session) {
      const { error: pErr } = await supabase.from('battle_profiles').insert({
        id: data.user.id, username,
        level: 1, exp: 0, total_wins: 0, total_losses: 0, total_battles: 0,
      });
      if (pErr && pErr.code !== '23505') throw pErr;
    }
    return data;
  }

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }

  async function signOut() { await supabase.auth.signOut(); }

  async function loadProfile() {
    if (!currentUser) return;
    const { data } = await supabase.from('battle_profiles').select('*').eq('id', currentUser.id).single();
    currentProfile = data;
  }

  async function saveBattleResult({ myChar, opponentChar, stage, result, myHpRemaining, mode }) {
    if (!currentUser || !currentProfile) return;
    await supabase.from('battle_records').insert({
      user_id: currentUser.id, my_char: myChar, opponent_char: opponentChar,
      stage, result, my_hp_remaining: myHpRemaining, mode,
    });
    const baseExp = result === 'win' ? 40 : 15;
    const hpBonus = result === 'win' ? Math.floor(myHpRemaining * 0.3) : 0;
    const earnedExp = baseExp + hpBonus;
    const newExp = (currentProfile.exp || 0) + earnedExp;
    const newWins = currentProfile.total_wins + (result === 'win' ? 1 : 0);
    const newLosses = currentProfile.total_losses + (result === 'lose' ? 1 : 0);
    const newBattles = currentProfile.total_battles + 1;
    let newLevel = currentProfile.level;
    let remainExp = newExp;
    while (newLevel < MAX_LEVEL && remainExp >= EXP_TABLE[newLevel]) {
      remainExp -= EXP_TABLE[newLevel]; newLevel++;
    }
    await supabase.from('battle_profiles').update({
      level: newLevel, exp: remainExp,
      total_wins: newWins, total_losses: newLosses, total_battles: newBattles,
      favorite_char: myChar, updated_at: new Date().toISOString(),
    }).eq('id', currentUser.id);
    const leveledUp = newLevel > currentProfile.level;
    currentProfile = { ...currentProfile, level: newLevel, exp: remainExp, total_wins: newWins, total_losses: newLosses, total_battles: newBattles };
    return { earnedExp, leveledUp, newLevel };
  }

  async function getRecentRecords(limit = 10) {
    if (!currentUser) return [];
    const { data } = await supabase.from('battle_records')
      .select('*').eq('user_id', currentUser.id)
      .order('created_at', { ascending: false }).limit(limit);
    return data || [];
  }

  async function getRankings(limit = 20) {
    const { data } = await supabase
      .from('global_rankings')
      .select('*')
      .order('rank', { ascending: true })
      .limit(limit);
    return data || [];
  }

  function getExpToNextLevel(level) {
    return EXP_TABLE[Math.min(level, MAX_LEVEL - 1)] || 0;
  }

  function updateAuthUI() {
    const loggedIn = !!currentUser;
    document.querySelectorAll('.auth-logged-in').forEach(el => el.style.display = loggedIn ? '' : 'none');
    document.querySelectorAll('.auth-logged-out').forEach(el => el.style.display = loggedIn ? 'none' : '');
    if (loggedIn && currentProfile) {
      const set = (id, val) => { const el = document.getElementById(id); if(el) el.textContent = val; };
      set('profile-level', currentProfile.level);
      set('profile-name', currentProfile.username);
      set('profile-wins', currentProfile.total_wins);
      set('profile-battles', currentProfile.total_battles);
      const ratio = currentProfile.exp / getExpToNextLevel(currentProfile.level) * 100;
      const bar = document.getElementById('profile-exp-bar');
      if(bar) bar.style.width = Math.min(ratio,100) + '%';
      const txt = document.getElementById('profile-exp-text');
      if(txt) txt.textContent = `${currentProfile.exp} / ${getExpToNextLevel(currentProfile.level)} EXP`;
    }
  }

  return {
    init, signUp, signIn, signOut,
    saveBattleResult, getRecentRecords, getRankings,
    getUser: () => currentUser,
    getProfile: () => currentProfile,
    getExpToNextLevel,
    isLoggedIn: () => !!currentUser,
    updateAuthUI,
  };
})();
