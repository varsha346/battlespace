import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../utils/axiosInstance'
import { API_PATHS } from '../utils/apiPaths'
import { fetchCFAvatar } from '../utils/cfApi'
import Navbar from '../components/Navbar'

const LEAGUE_THEMES = {
  1: { name: 'Boulder League', pokemon: 'Geodude', color: '#a1a19f', spriteId: 74, badgeName: 'Boulder Badge' },
  2: { name: 'Cascade League', pokemon: 'Starmie', color: '#6890f0', spriteId: 121, badgeName: 'Cascade Badge' },
  3: { name: 'Thunder League', pokemon: 'Pikachu', color: '#f8d030', spriteId: 25, badgeName: 'Thunder Badge' },
  4: { name: 'Rainbow League', pokemon: 'Vileplume', color: '#78c850', spriteId: 45, badgeName: 'Rainbow Badge' },
  5: { name: 'Soul League', pokemon: 'Weezing', color: '#a040a0', spriteId: 110, badgeName: 'Soul Badge' },
  6: { name: 'Marsh League', pokemon: 'Alakazam', color: '#f85888', spriteId: 65, badgeName: 'Marsh Badge' },
  7: { name: 'Volcano League', pokemon: 'Magmar', color: '#f08030', spriteId: 126, badgeName: 'Volcano Badge' },
  8: { name: 'Earth League', pokemon: 'Nidoking', color: '#e0c068', spriteId: 34, badgeName: 'Earth Badge' }
};

const getLeagueTheme = (lvl) => {
  const index = ((lvl - 1) % 8) + 1;
  const base = LEAGUE_THEMES[index] || LEAGUE_THEMES[1];
  const cycle = Math.floor((lvl - 1) / 8);
  const suffix = cycle > 0 ? ` +${cycle}` : '';
  
  let pokemon = base.pokemon;
  let spriteId = base.spriteId;
  if (cycle === 1) {
    const gen2 = [95, 181, 243, 248, 196, 212, 229, 248]; // Steelix, Ampharos, Raikou, Tyranitar, Espeon, Scizor, Houndoom, etc.
    spriteId = gen2[index - 1];
    pokemon = 'Champion ' + index;
  } else if (cycle > 1) {
    const legendaries = [150, 249, 250, 382, 383, 384, 483, 484]; // Mewtwo, Lugia, Kyogre, Groudon, Rayquaza, Dialga, Palkia
    spriteId = legendaries[(index - 1) % legendaries.length];
    pokemon = 'Elite ' + index;
  }
  
  return {
    name: cycle > 0 ? `Elite League ${lvl}` : base.name,
    pokemon: pokemon,
    color: base.color,
    badgeName: `${base.badgeName}${suffix}`,
    spriteUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${spriteId}.png`
  };
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Press+Start+2P&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .db { 
    min-height: 100vh; 
    background: #0f1013; 
    color: #e2e8f0; 
    font-family: 'Plus Jakarta Sans', sans-serif; 
    -webkit-font-smoothing: antialiased; 
    display: flex; 
    flex-direction: column; 
    position: relative;
    overflow-x: hidden;
  }

  /* Retro pokeball background watermark */
  .db::after {
    content: '';
    position: absolute;
    bottom: -150px;
    right: -150px;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(255, 60, 60, 0.03) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  .db-main { 
    flex: 1; 
    display: flex; 
    flex-direction: column; 
    align-items: center; 
    justify-content: flex-start; 
    padding: 40px 24px; 
    z-index: 1;
  }

  .db-hero {
    text-align: center;
    margin-bottom: 40px;
  }

  .db-title { 
    font-family: 'Press Start 2P', cursive; 
    font-size: clamp(18px, 4vw, 28px); 
    font-weight: 400; 
    letter-spacing: 0px; 
    text-align: center; 
    line-height: 1.5; 
    color: #ffcb05;
    text-shadow: 3px 3px 0px #3b4cca;
    margin-bottom: 16px;
  }
  
  .db-subtitle { 
    font-size: 14px; 
    color: #64748b; 
    letter-spacing: 0.1em; 
    text-transform: uppercase;
    font-weight: 700;
  }

  /* Trainer Profile Panel */
  .trainer-card {
    background: #171923;
    border: 3px solid #2d3748;
    border-radius: 16px;
    padding: 32px;
    width: 100%;
    max-width: 640px;
    margin-bottom: 40px;
    box-shadow: 0 10px 25px -5px rgba(0,0,0,0.3);
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    gap: 32px;
  }

  .trainer-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 6px;
    height: 100%;
    background: var(--theme-color, #ff3c3c);
  }

  .trainer-avatar-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .trainer-avatar-wrapper {
    position: relative;
  }

  .trainer-avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border: 4px solid var(--theme-color, #ff3c3c);
    box-shadow: 0 0 20px rgba(0,0,0,0.4);
    object-fit: cover;
  }

  .pokemon-sprite {
    position: absolute;
    bottom: -15px;
    right: -15px;
    width: 64px;
    height: 64px;
    filter: drop-shadow(0 2px 8px rgba(0,0,0,0.5));
    animation: bounce 2s infinite ease-in-out;
  }

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
  }

  .trainer-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .trainer-name {
    font-size: 24px;
    font-weight: 800;
    color: #fff;
  }

  .trainer-handle {
    font-size: 14px;
    color: #a0aec0;
    font-family: monospace;
  }

  .trainer-league-badge {
    display: inline-flex;
    align-items: center;
    align-self: flex-start;
    padding: 6px 14px;
    border-radius: 99px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    font-size: 13px;
    font-weight: 700;
    color: var(--theme-color, #fff);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .badge-case-title {
    font-size: 11px;
    color: #718096;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    font-weight: 700;
    margin-top: 8px;
  }

  .badge-case {
    display: flex;
    gap: 12px;
    margin-top: 6px;
  }

  /* ── Action Cards Grid ── */
  .db-actions { 
    display: grid; 
    grid-template-columns: repeat(2, 1fr);
    gap: 20px; 
    width: 100%; 
    max-width: 640px; 
    margin-bottom: 36px; 
  }

  .db-action-card { 
    border: 3px solid #2d3748; 
    background: #171923; 
    border-radius: 16px;
    padding: 40px 24px; 
    display: flex; 
    flex-direction: column; 
    align-items: center; 
    text-align: center;
    transition: all .25s ease; 
    position: relative; 
    overflow: hidden; 
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  .db-action-card:hover { 
    border-color: var(--theme-color, #ffcb05); 
    transform: translateY(-4px);
    box-shadow: 0 12px 20px -5px rgba(0,0,0,0.3);
  }

  .db-action-icon { 
    font-size: 40px; 
    margin-bottom: 16px; 
    line-height: 1; 
  }
  
  .db-action-label { 
    font-family: 'Press Start 2P', cursive;
    font-size: 14px; 
    font-weight: 400; 
    margin-bottom: 12px; 
    text-transform: uppercase; 
    color: #fff;
  }
  
  .db-action-desc { 
    font-size: 14px; 
    color: #a0aec0; 
    line-height: 1.6; 
    margin-bottom: 28px; 
    flex: 1;
  }

  .db-cta { 
    width: 100%; 
    font-family: 'Press Start 2P', cursive;
    font-size: 10px; 
    color: #0f1013; 
    background: #ffcb05; 
    border: none; 
    padding: 16px; 
    border-radius: 8px; 
    cursor: pointer; 
    transition: all 0.15s ease;
    box-shadow: 0 4px 0px #c59b00;
  }
  
  .db-cta:hover:not(:disabled) { 
    background: #ffe066; 
    transform: translateY(1px);
    box-shadow: 0 3px 0px #c59b00;
  }
  
  .db-cta:active:not(:disabled) {
    transform: translateY(4px);
    box-shadow: none;
  }

  .db-cta:disabled { 
    opacity: 0.4; 
    cursor: not-allowed; 
  }

  .db-cta-ghost { 
    width: 100%; 
    font-family: 'Press Start 2P', cursive;
    font-size: 10px; 
    color: #ffcb05; 
    background: transparent; 
    border: 2px solid #ffcb05; 
    padding: 14px; 
    border-radius: 8px; 
    cursor: pointer; 
    transition: all 0.15s ease;
  }
  
  .db-cta-ghost:hover { 
    background: rgba(255, 203, 5, 0.1); 
  }

  /* ── Modal ── */
  .db-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); display: flex; align-items: center; justify-content: center; z-index: 100; backdrop-filter: blur(4px); animation: fadeIn .15s ease; }
  @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
  .db-modal { background: #171923; border: 3px solid #2d3748; padding: 36px; width: 100%; max-width: 400px; border-radius: 16px; animation: slideUp .2s ease; }
  @keyframes slideUp { from { transform: translateY(12px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  .db-modal-title { font-family: 'Press Start 2P', cursive; font-size: 12px; margin-bottom: 12px; text-transform: uppercase; color: #ffcb05; }
  .db-modal-sub { font-size: 14px; color: #a0aec0; margin-bottom: 24px; line-height: 1.6; }
  .db-modal-field { margin-bottom: 20px; }
  .db-modal-field label { display: block; font-size: 11px; color: #a0aec0; text-transform: uppercase; margin-bottom: 8px; font-weight: 700; }
  .db-modal-field input { width: 100%; background: #0f1013; border: 2px solid #2d3748; color: #fff; font-family: monospace; font-size: 15px; padding: 12px 16px; border-radius: 8px; outline: none; transition: border-color .15s; }
  .db-modal-field input:focus { border-color: #ffcb05; }
  .db-modal-actions { display: flex; gap: 12px; margin-top: 24px; }
  .db-btn-cancel { font-family: 'Press Start 2P', cursive; font-size: 9px; color: #a0aec0; background: none; border: 2px solid #2d3748; padding: 14px 18px; border-radius: 8px; cursor: pointer; transition: all .15s; flex: 1; }
  .db-btn-cancel:hover { color: #fff; border-color: #718096; }

  /* ── Toast ── */
  .db-toast { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); font-size: 12px; padding: 12px 24px; border-radius: 8px; border-left: 4px solid #ffcb05; background: #171923; color: #fff; white-space: nowrap; z-index: 200; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.5); animation: toastIn .2s ease; }
  .db-toast.error { border-left-color: #ff3c3c; }
  @keyframes toastIn { from{opacity:0;transform:translateX(-50%) translateY(8px)}to{opacity:1;transform:translateX(-50%) translateY(0)} }

  @media (max-width: 600px) {
    .db-actions { grid-template-columns: 1fr; }
    .trainer-card { flex-direction: column; text-align: center; }
    .trainer-league-badge { align-self: center; }
    .badge-case { justify-content: center; }
  }
`

export default function Dashboard() {
  const navigate = useNavigate()

  const [modal, setModal] = useState(null)
  const [joinCode, setJoinCode] = useState('')
  const [isJoining, setIsJoining] = useState(false)
  const [toast, setToast] = useState(null)
  const [avatar, setAvatar] = useState(null)

  const [cfHandle, setCfHandle] = useState('')
  const [isSavingCf, setIsSavingCf] = useState(false)

  // League and progression states
  const [league, setLeague] = useState(1)
  const [badges, setBadges] = useState(0)
  const [userName, setUserName] = useState('')
  const [isQueuing, setIsQueuing] = useState(false)

  const showToast = (text, type = 'ok') => {
    setToast({ text, type })
    setTimeout(() => setToast(null), 3200)
  }

  useEffect(() => {
    axiosInstance.get(API_PATHS.USER.ME)
      .then(async (res) => { 
        if (res.data) {
          setUserName(res.data.name || '')
          setLeague(res.data.league || 1)
          setBadges(res.data.badges || 0)
        }
        if (!res.data?.cfHandle) {
          setModal('cf') 
        } else {
          const avUrl = await fetchCFAvatar(res.data.cfHandle)
          if (avUrl) setAvatar(avUrl)
        }
      })
      .catch(() => {})
  }, [])

  const onSaveCfHandle = async () => {
    if (!cfHandle.trim()) { showToast('Enter your Codeforces handle.', 'error'); return }
    setIsSavingCf(true)
    try {
      await axiosInstance.post(API_PATHS.USER.ADD_CF_HANDLE, { cfHandle: cfHandle.trim() })
      showToast("Handle saved. You're all set!")
      
      // Reload profile to get update
      const res = await axiosInstance.get(API_PATHS.USER.ME)
      if (res.data?.cfHandle) {
        const avUrl = await fetchCFAvatar(res.data.cfHandle)
        if (avUrl) setAvatar(avUrl)
      }
      setModal(null)
    } catch (err) {
      const m = err?.response?.data?.message || err?.response?.data || 'Failed to save handle.'
      showToast(typeof m === 'string' ? m : 'Failed.', 'error')
    } finally { setIsSavingCf(false) }
  }

  const onJoinMatch = async () => {
    if (!joinCode.trim()) { showToast('Enter an invite code.', 'error'); return }
    setIsJoining(true)
    try {
      const code = joinCode.trim().toUpperCase()
      const res = await axiosInstance.post(`${API_PATHS.MATCH.JOIN}?inviteCode=${encodeURIComponent(code)}`)
      showToast('Joined! Opening room…')
      setModal(null)
      setTimeout(() => {
        navigate(`/match/${code}`, { state: { role: 'guest', joinedMatch: res?.data || null } })
      }, 1000)
    } catch (err) {
      const m = err?.response?.data?.message || err?.response?.data || 'Could not join.'
      showToast(typeof m === 'string' ? m : 'Failed to join: same league required.', 'error')
    } finally { setIsJoining(false) }
  }

  const onQuickMatch = async () => {
    setIsQueuing(true)
    try {
      showToast('Queuing for a Trainer in your league...')
      const res = await axiosInstance.post('/api/match/join-random')
      const match = res?.data
      if (match) {
        if (match.status === 'READY' || match.user2) {
          showToast('Trainer matched! Entering Arena...')
          setTimeout(() => {
            navigate(`/match/${match.inviteCode}`, { state: { role: 'guest' } })
          }, 1200)
        } else {
          showToast('No active lobby found. Created one in your league!')
          setTimeout(() => {
            navigate(`/match/${match.inviteCode}`, { state: { role: 'host' } })
          }, 1200)
        }
      }
    } catch (err) {
      showToast(err?.response?.data?.message || 'Matchmaking failed.', 'error')
    } finally {
      setIsQueuing(false)
    }
  }

  const theme = getLeagueTheme(league);

  const renderBadgeSlot = (index) => {
    const unlocked = index < badges;
    return (
      <div key={index} className={`badge-slot ${unlocked ? 'unlocked' : ''}`} style={{
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        border: unlocked ? `2.5px solid ${theme.color}` : '2px dashed #4a5568',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        background: unlocked ? `${theme.color}22` : 'rgba(0,0,0,0.2)',
        boxShadow: unlocked ? `0 0 10px ${theme.color}66` : 'none',
        transition: 'all 0.3s ease'
      }}>
        {unlocked ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill={theme.color}>
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
        ) : (
          <span style={{ fontSize: '11px', color: '#4a5568', fontWeight: 'bold' }}>?</span>
        )}
      </div>
    );
  };

  return (
    <>
      <style>{css}</style>
      <div className="db" style={{ '--theme-color': theme.color }}>

        <Navbar onCfSaved={() => showToast('CF handle updated!')} />

        <main className="db-main">
          <div className="db-hero">
            <h1 className="db-title">BATTLE SPACE</h1>
            <p className="db-subtitle">// Challenge, Win Badges, Level Up //</p>
          </div>

          {/* Trainer Card */}
          <div className="trainer-card">
            <div className="trainer-avatar-section">
              <div className="trainer-avatar-wrapper">
                <img 
                  src={avatar || "https://secure.gravatar.com/avatar/00000000000000000000000000000000?d=mp&s=150"} 
                  alt="Trainer Avatar" 
                  className="trainer-avatar" 
                />
                <img 
                  src={theme.spriteUrl} 
                  alt={theme.pokemon} 
                  className="pokemon-sprite" 
                  title={`Your League Partner: ${theme.pokemon}`}
                />
              </div>
            </div>

            <div className="trainer-info">
              <div className="trainer-name">{userName || 'Loading Trainer...'}</div>
              <div className="trainer-handle">Handle: {cfHandle || 'Not Linked'}</div>
              
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
                <span className="trainer-league-badge">
                  {theme.name}
                </span>
                <span className="trainer-league-badge" style={{ background: 'rgba(255, 203, 5, 0.1)', color: '#ffcb05', border: '1px solid rgba(255, 203, 5, 0.2)' }}>
                  Partner: {theme.pokemon}
                </span>
              </div>

              <div className="badge-case-title">Badges won in league ({badges}/5):</div>
              <div className="badge-case">
                {[0, 1, 2, 3, 4].map(renderBadgeSlot)}
              </div>
            </div>
          </div>

          {/* Action Grid */}
          <div className="db-actions">
            <div className="db-action-card">
              <div className="db-action-icon">🎮</div>
              <div className="db-action-label">Quick Match</div>
              <p className="db-action-desc">
                Queues you up with a random available trainer in your league immediately.
              </p>
              <button className="db-cta" onClick={onQuickMatch} disabled={isQueuing}>
                {isQueuing ? 'SEARCHING…' : 'FIND BATTLE'}
              </button>
            </div>

            <div className="db-action-card">
              <div className="db-action-icon">⚔</div>
              <div className="db-action-label">Custom Lobby</div>
              <p className="db-action-desc">
                Creates a custom battle room and gives you an invite code to share with a rival.
              </p>
              <button 
                className="db-cta-ghost" 
                onClick={() => navigate('/match/create')} 
                style={{ width: '100%' }}
              >
                CREATE ROOM
              </button>
            </div>

            <div className="db-action-card" style={{ gridColumn: 'span 2' }}>
              <div className="db-action-icon">📥</div>
              <div className="db-action-label">Join Duel</div>
              <p className="db-action-desc" style={{ marginBottom: '16px' }}>
                Have an invite code from a friend in your league? Enter it to enter the arena.
              </p>
              <button className="db-cta-ghost" onClick={() => setModal('join')} style={{ width: '60%' }}>
                JOIN ROOM
              </button>
            </div>
          </div>
        </main>

        {/* ── CF Handle modal (OAuth first-time) ── */}
        {modal === 'cf' && (
          <div className="db-overlay">
            <div className="db-modal">
              <div className="db-modal-title">One last step</div>
              <div className="db-modal-sub">
                You signed in. Enter your Codeforces handle to link your submissions and load your Pokémon card.
              </div>
              <div className="db-modal-field">
                <label>Codeforces Handle</label>
                <input
                  type="text" placeholder="tourist" value={cfHandle} autoFocus
                  onChange={(e) => setCfHandle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && onSaveCfHandle()}
                />
              </div>
              <div className="db-modal-actions">
                <button className="db-cta" style={{ flex: 1 }} onClick={onSaveCfHandle} disabled={isSavingCf}>
                  {isSavingCf ? 'Saving…' : 'Confirm Handle'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── JOIN modal ── */}
        {modal === 'join' && (
          <div className="db-overlay" onClick={() => setModal(null)}>
            <div className="db-modal" onClick={(e) => e.stopPropagation()}>
              <div className="db-modal-title">Join Match</div>
              <div className="db-modal-sub">Enter the battle invite code shared by your rival. Must be in your league.</div>
              <div className="db-modal-field">
                <label>Invite Code</label>
                <input
                  type="text" placeholder="XK7P2R" value={joinCode} autoFocus
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())} maxLength={10}
                  style={{ fontSize: '22px', letterSpacing: '0.22em', fontWeight: 700, textAlign: 'center' }}
                />
              </div>
              <div className="db-modal-actions">
                <button className="db-btn-cancel" onClick={() => setModal(null)}>Cancel</button>
                <button className="db-cta" style={{ flex: 2 }} onClick={onJoinMatch} disabled={isJoining}>
                  {isJoining ? 'Joining…' : 'Enter Arena'}
                </button>
              </div>
            </div>
          </div>
        )}

        {toast && <div className={`db-toast ${toast.type === 'error' ? 'error' : ''}`}>{toast.text}</div>}
      </div>
    </>
  )
}