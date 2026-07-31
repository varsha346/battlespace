import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import Navbar from '../../components/Navbar'

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
    const gen2 = [95, 181, 243, 248, 196, 212, 229, 248];
    spriteId = gen2[index - 1];
    pokemon = 'Champion ' + index;
  } else if (cycle > 1) {
    const legendaries = [150, 249, 250, 382, 383, 384, 483, 484];
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

  .mc {
    min-height: 100vh;
    background: #0f1013;
    color: #e2e8f0;
    font-family: 'Plus Jakarta Sans', sans-serif;
    -webkit-font-smoothing: antialiased;
    display: flex;
    flex-direction: column;
  }

  .mc-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px 20px 64px;
    z-index: 1;
  }

  .mc-inner {
    width: 100%;
    max-width: 520px;
    display: flex;
    flex-direction: column;
  }

  .mc-back {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 10px;
    font-family: 'Press Start 2P', cursive;
    color: #a0aec0;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    margin-bottom: 32px;
    transition: color 0.15s;
    text-transform: uppercase;
  }
  .mc-back:hover { color: #ffcb05; }

  .mc-header {
    margin-bottom: 28px;
  }
  .mc-step {
    font-size: 13px;
    font-weight: 800;
    text-transform: uppercase;
    color: #718096;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .mc-step::after {
    content: '';
    flex: 1;
    height: 2px;
    background: #2d3748;
  }
  .mc-title {
    font-family: 'Press Start 2P', cursive;
    font-size: clamp(20px, 6vw, 32px);
    line-height: 1.3;
    color: #fff;
    margin-bottom: 12px;
  }
  .mc-subtitle {
    font-size: 14px;
    color: #a0aec0;
    line-height: 1.5;
  }

  .mc-card {
    background: #171923;
    border: 3px solid #2d3748;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 10px 25px -5px rgba(0,0,0,0.3);
  }

  .mc-section {
    padding: 24px;
    border-bottom: 2px solid #2d3748;
  }
  .mc-section:last-child { border-bottom: none; }

  .mc-label {
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    color: #a0aec0;
    margin-bottom: 12px;
    letter-spacing: 0.05em;
  }

  /* League Banner Display */
  .mc-league-display {
    display: flex;
    align-items: center;
    gap: 16px;
    background: #0f1013;
    border: 2px solid #2d3748;
    padding: 16px;
    border-radius: 12px;
  }

  .mc-league-sprite {
    width: 60px;
    height: 60px;
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.4));
  }

  .mc-league-info {
    flex: 1;
  }

  .mc-league-name {
    font-family: 'Press Start 2P', cursive;
    font-size: 10px;
    color: var(--theme-color, #ffcb05);
    margin-bottom: 4px;
  }

  .mc-league-detail {
    font-size: 13px;
    color: #a0aec0;
    font-weight: 500;
  }

  /* Duration grid */
  .mc-duration-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
  }
  .mc-dur-btn {
    font-family: inherit;
    background: #0f1013;
    border: 2px solid #2d3748;
    border-radius: 8px;
    padding: 12px 6px;
    cursor: pointer;
    transition: all 0.15s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }
  .mc-dur-btn .val {
    font-size: 20px;
    font-weight: 800;
    color: #a0aec0;
    line-height: 1;
  }
  .mc-dur-btn .unit {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    color: #718096;
  }
  .mc-dur-btn:hover { border-color: #ffcb05; }
  .mc-dur-btn:hover .val { color: #fff; }
  .mc-dur-btn.active {
    border-color: var(--theme-color, #ffcb05);
    background: rgba(255, 203, 5, 0.05);
  }
  .mc-dur-btn.active .val { color: var(--theme-color, #ffcb05); }
  .mc-dur-btn.active .unit { color: var(--theme-color, #ffcb05); opacity: 0.8; }

  /* Error box */
  .mc-error {
    background: rgba(255, 60, 60, 0.1);
    border: 2px solid #ff3c3c;
    padding: 14px;
    border-radius: 8px;
    margin-bottom: 16px;
  }
  .mc-error-label {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    color: #ff3c3c;
    margin-bottom: 4px;
  }
  .mc-error-msg {
    font-size: 13px;
    color: #ff8080;
    line-height: 1.5;
  }

  .mc-cta {
    width: 100%;
    font-family: 'Press Start 2P', cursive;
    font-size: 10px;
    color: #0f1013;
    background: #ffcb05;
    border: none;
    padding: 18px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.15s ease;
    box-shadow: 0 4px 0px #c59b00;
  }
  .mc-cta:hover:not(:disabled) { background: #ffe066; transform: translateY(1px); box-shadow: 0 3px 0px #c59b00; }
  .mc-cta:active:not(:disabled) { transform: translateY(4px); box-shadow: none; }
  .mc-cta:disabled { opacity: 0.3; cursor: not-allowed; }

  /* Status Bar */
  .mc-status {
    display: flex;
    align-items: center;
    gap: 12px;
    background: #0f1013;
    border: 2px solid #2d3748;
    padding: 12px 18px;
    border-radius: 8px;
  }
  .mc-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: #ffaa00;
    animation: blink 1.6s ease-in-out infinite;
  }
  .mc-dot.ready { background: #44ffaa; animation: none; box-shadow: 0 0 8px #44ffaa; }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }
  .mc-status-text {
    font-size: 13px;
    font-weight: 600;
    color: #a0aec0;
  }
  .mc-status-text.ready { color: #44ffaa; }

  /* Invite code */
  .mc-code-wrap {
    cursor: pointer;
    user-select: none;
    transition: opacity 0.15s;
    background: #0f1013;
    border: 2px solid #2d3748;
    border-radius: 12px;
    padding: 24px;
    text-align: center;
  }
  .mc-code-wrap:hover { opacity: 0.85; border-color: #ffcb05; }
  .mc-code-display {
    display: flex;
    justify-content: center;
    gap: 6px;
    margin-bottom: 8px;
  }
  .mc-code-char {
    font-family: 'Press Start 2P', cursive;
    font-size: clamp(24px, 5vw, 36px);
    color: #ffcb05;
    text-shadow: 2px 2px 0px #3b4cca;
  }
  .mc-copy-hint {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    color: #718096;
  }

  .mc-meta {
    display: flex;
    border-bottom: 2px solid #2d3748;
    background: #0f1013;
  }
  .mc-meta-item {
    flex: 1;
    padding: 16px 24px;
    border-right: 2px solid #2d3748;
    text-align: center;
  }
  .mc-meta-item:last-child { border-right: none; }
  .mc-meta-key { font-size: 10px; text-transform: uppercase; color: #718096; font-weight: 700; margin-bottom: 4px; }
  .mc-meta-val { font-size: 15px; font-weight: 800; color: #fff; }

  .mc-actions {
    display: flex;
    gap: 12px;
  }
  .mc-btn-ghost {
    flex: 1;
    font-family: 'Press Start 2P', cursive;
    font-size: 8px;
    color: #a0aec0;
    background: transparent;
    border: 2px solid #2d3748;
    padding: 16px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.15s ease;
    text-transform: uppercase;
  }
  .mc-btn-ghost:hover { border-color: #ffcb05; color: #fff; }

  .mc-btn-accent {
    flex: 2;
    font-family: 'Press Start 2P', cursive;
    font-size: 9px;
    color: #0f1013;
    background: #ffcb05;
    border: none;
    padding: 16px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.15s ease;
    box-shadow: 0 4px 0px #c59b00;
    text-transform: uppercase;
  }
  .mc-btn-accent:hover:not(:disabled) { background: #ffe066; transform: translateY(1px); box-shadow: 0 3px 0px #c59b00; }
  .mc-btn-accent:active:not(:disabled) { transform: translateY(4px); box-shadow: none; }
  .mc-btn-accent:disabled { opacity: 0.3; cursor: not-allowed; }

  .mc-toast {
    position: fixed;
    bottom: 28px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 12px;
    padding: 12px 24px;
    border-radius: 8px;
    border-left: 4px solid #ff3c3c;
    background: #171923;
    color: #fff;
    white-space: nowrap;
    z-index: 200;
    box-shadow: 0 10px 15px -3px rgba(0,0,0,0.5);
  }
`

const DURATIONS = ['5', '10', '15', '20', '30', '45', '60']

function InviteCodeDisplay({ code }) {
  if (!code) return null
  return (
    <div className="mc-code-display">
      {code.split('').map((char, i) => (
        <span key={i} className="mc-code-char">{char}</span>
      ))}
    </div>
  )
}

function extractError(err) {
  const d = err?.response?.data
  if (!d) return err?.message || 'Unknown error.'
  if (typeof d === 'string') return d
  if (typeof d === 'object') return d.message || d.error || d.detail || JSON.stringify(d)
  return String(d)
}

export default function MatchCreate() {
  const navigate = useNavigate()

  const [duration, setDuration] = useState('30')
  const [difficulty, setDifficulty] = useState('LEAGUE_1')
  const [league, setLeague] = useState(1)
  const [isCreating, setIsCreating] = useState(false)
  const [createError, setCreateError] = useState(null)
  
  const [match, setMatch] = useState(null)
  const [matchStatus, setMatchStatus] = useState(null)
  const [isStarting, setIsStarting] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = (text, type = 'ok') => {
    setToast({ text, type })
    setTimeout(() => setToast(null), 3200)
  }

  // Load Trainer profile to lock league setting
  useEffect(() => {
    axiosInstance.get(API_PATHS.USER.ME)
      .then((res) => {
        if (res.data?.league) {
          const userLeague = res.data.league
          setLeague(userLeague)
          setDifficulty(`LEAGUE_${userLeague}`)
        }
      })
      .catch(() => {})
  }, [])

  const loadMatchStatus = useCallback(async (code) => {
    if (!code) return
    try {
      const res = await axiosInstance.get(
        `${API_PATHS.MATCH.STATUS}?inviteCode=${encodeURIComponent(code)}`
      )
      setMatchStatus(res?.data || null)
    } catch { /* fail silently */ }
  }, [])

  useEffect(() => {
    if (!match?.inviteCode) { setMatchStatus(null); return }
    loadMatchStatus(match.inviteCode)
    const t = setInterval(() => loadMatchStatus(match.inviteCode), 3000)
    return () => clearInterval(t)
  }, [match?.inviteCode, loadMatchStatus])

  const onCreateMatch = async () => {
    setIsCreating(true)
    setCreateError(null)
    try {
      const payload = { duration: Number(duration), difficulty: difficulty }
      const res = await axiosInstance.post(API_PATHS.MATCH.CREATE, payload)
      const data = res?.data
      if (!data)            { setCreateError('Server returned an empty response.'); return }
      if (!data.inviteCode) { setCreateError(`Missing inviteCode: ${JSON.stringify(data)}`); return }
      setMatch(data)
      showToast('Match created — share the code!')
    } catch (err) {
      const status = err?.response?.status
      const msg = extractError(err)
      setCreateError(status ? `Error ${status}: ${msg}` : `Network error — ${msg}`)
    } finally {
      setIsCreating(false)
    }
  }

  const onStartMatch = async () => {
    setIsStarting(true)
    try {
      await axiosInstance.post(`${API_PATHS.MATCH.START}?inviteCode=${encodeURIComponent(match.inviteCode)}`)
      navigate(`/match/${match.inviteCode}`, { state: { role: 'host' } })
    } catch (err) {
      showToast(extractError(err) || 'Not ready yet.', 'err')
    } finally {
      setIsStarting(false)
    }
  }

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(match.inviteCode)
      showToast('Copied to clipboard')
    } catch {
      showToast('Copy failed.', 'err')
    }
  }

  const isReady       = matchStatus?.status === 'READY'
  const theme         = getLeagueTheme(league);

  return (
    <>
      <style>{css}</style>
      <div className="mc" style={{ '--theme-color': theme.color }}>
        <Navbar onCfSaved={() => showToast('CF handle updated!')} />

        <main className="mc-main">
          <div className="mc-inner">

            <button className="mc-back" onClick={() => navigate('/dashboard')}>
              ← Back to dashboard
            </button>

            {!match ? (
              <>
                <div className="mc-header">
                  <div className="mc-step">Lobby Setup</div>
                  <h1 className="mc-title">Configure<br/>Battle.</h1>
                  <p className="mc-subtitle">// set duration · league matchmaking is locked to your rank</p>
                </div>

                <div className="mc-card">
                  {/* League Display */}
                  <div className="mc-section">
                    <div className="mc-label">Battle Setting</div>
                    <div className="mc-league-display">
                      <img src={theme.spriteUrl} alt={theme.pokemon} className="mc-league-sprite" />
                      <div className="mc-league-info">
                        <div className="mc-league-name">{theme.name}</div>
                        <div className="mc-league-detail">
                          Difficulty partner: {theme.pokemon}
                          <br />
                          Codeforces Rating: {800 + (league - 1) * 100} - {800 + (league - 1) * 100 + 400}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Match Duration */}
                  <div className="mc-section">
                    <div className="mc-label">Match Duration</div>
                    <div className="mc-duration-grid">
                      {DURATIONS.map((d) => (
                        <button
                          key={d}
                          className={`mc-dur-btn ${duration === d ? 'active' : ''}`}
                          onClick={() => setDuration(d)}
                        >
                          <span className="val">{d}</span>
                          <span className="unit">min</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mc-section">
                    {createError && (
                      <div className="mc-error">
                        <div className="mc-error-label">Error</div>
                        <div className="mc-error-msg">{createError}</div>
                      </div>
                    )}
                    <button className="mc-cta" onClick={onCreateMatch} disabled={isCreating}>
                      {isCreating ? 'CREATING…' : `⚔ CREATE ${duration}-MIN LOBBY`}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="mc-header">
                  <div className="mc-step">Lobby Created</div>
                  <h1 className="mc-title">Lobby Open.</h1>
                  <p className="mc-subtitle">// share the code or wait for a random same-league opponent</p>
                </div>

                <div className="mc-card">
                  {/* Status */}
                  <div className="mc-section">
                    <div className="mc-status">
                      <span className={`mc-dot ${isReady ? 'ready' : ''}`} />
                      <span className={`mc-status-text ${isReady ? 'ready' : ''}`}>
                        {isReady ? 'Rival joined — ready to start' : 'Waiting for an opponent in your league…'}
                      </span>
                    </div>
                  </div>

                  {/* Invite code */}
                  <div className="mc-section" style={{ paddingBottom: 20 }}>
                    <div className="mc-label">Battle Invite Code</div>
                    <div className="mc-code-wrap" onClick={copyCode} title="Click to copy">
                      <InviteCodeDisplay code={match.inviteCode} />
                      <div className="mc-copy-hint">Click to copy</div>
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="mc-meta">
                    <div className="mc-meta-item">
                      <div className="mc-meta-key">Tier</div>
                      <div className="mc-meta-val">{theme.name}</div>
                    </div>
                    <div className="mc-meta-item">
                      <div className="mc-meta-key">Duration</div>
                      <div className="mc-meta-val">{duration} min</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mc-section">
                    <div className="mc-actions">
                      <button className="mc-btn-ghost" onClick={copyCode}>Copy Code</button>
                      <button
                        className="mc-btn-ghost"
                        onClick={() => navigate(`/match/${match.inviteCode}`, { state: { role: 'host' } })}
                      >
                        Enter Room
                      </button>
                      <button
                        className="mc-btn-accent"
                        onClick={onStartMatch}
                        disabled={isStarting || !isReady}
                        title={!isReady ? 'Waiting for opponent' : 'Start now'}
                      >
                        {isStarting ? 'Starting…' : '⚔ Start Match'}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

          </div>
        </main>

        {toast && (
          <div className="mc-toast">
            {toast.text}
          </div>
        )}
      </div>
    </>
  )
}