import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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
  if (!lvl) lvl = 1;
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

  .rs { 
    min-height: 100vh; 
    background: #0f1013; 
    color: #e2e8f0; 
    font-family: 'Plus Jakarta Sans', sans-serif; 
    -webkit-font-smoothing: antialiased; 
    display: flex; 
    flex-direction: column; 
  }
  .rs-main { 
    flex: 1; 
    display: flex; 
    flex-direction: column; 
    align-items: center; 
    padding: 52px 20px 80px; 
  }
  .rs-inner { 
    width: 100%; 
    max-width: 860px; 
    display: flex; 
    flex-direction: column; 
    gap: 16px; 
  }

  /* ── Loading ── */
  .rs-loading { display:flex; flex-direction:column; align-items:center; gap:16px; padding:100px 0; color:#718096; font-size:13px; letter-spacing:0.1em; }
  .rs-spinner { width:28px; height:28px; border:2px solid #2d3748; border-top-color:#ffcb05; border-radius:50%; animation:rsSpin 0.9s linear infinite; }
  @keyframes rsSpin { to { transform:rotate(360deg); } }

  /* ── Verdict ── */
  .rs-verdict { text-align:center; padding-bottom:16px; }
  .rs-eyebrow { font-size:10px; color:#718096; letter-spacing:0.22em; text-transform:uppercase; margin-bottom:14px; display:inline-flex; align-items:center; gap:10px; font-weight: 700; }
  .rs-eyebrow::before,.rs-eyebrow::after { content:''; display:inline-block; width:32px; height:1px; background:#2d3748; }
  .rs-verdict-main { font-family: 'Press Start 2P', cursive; font-size:18px; line-height:1.6; margin-bottom:12px; }
  .rs-verdict-main .winner { color:#ffcb05; text-shadow: 2px 2px 0px #3b4cca; }
  .rs-verdict-main .draw   { color:#ffaa44; }
  .rs-verdict-sub { font-size:11px; color:#718096; letter-spacing:0.18em; text-transform:uppercase; font-weight:700; }

  /* ── Battle Grid ── */
  .rs-battle {
    display: grid;
    grid-template-columns: 1fr 64px 1fr;
    align-items: stretch;
  }

  /* Player card */
  .rs-pcard {
    background: #171923;
    border: 3px solid #2d3748;
    border-radius: 12px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
  }
  .rs-pcard.win { border-color: var(--theme-color, #ffcb05); box-shadow: 0 8px 16px rgba(0,0,0,0.2); }

  .rs-pcard-head {
    padding: 26px 24px;
    border-bottom: 2px solid #2d3748;
    display: flex; flex-direction: column; gap: 9px;
    position: relative; overflow: hidden;
  }
  .rs-pcard.win .rs-pcard-head { background: rgba(255, 203, 5, 0.05); }
  .rs-pcard.win .rs-pcard-head::after {
    content: ''; position: absolute;
    top: 0; left: 0; right: 0; height: 3px;
    background: var(--theme-color, #ffcb05);
  }

  .rs-result-pill {
    display: inline-block; align-self: flex-start;
    font-size: 9px; letter-spacing:0.18em; text-transform:uppercase;
    padding: 4px 10px; border-radius: 4px; border: 1px solid;
    font-weight: 700;
  }
  .rs-result-pill.win  { color:#ffcb05; border-color:rgba(255,203,5,0.3); background:rgba(255,203,5,0.1); }
  .rs-result-pill.lose { color:#a0aec0; border-color:#2d3748; background:transparent; }
  .rs-result-pill.draw { color:#ffaa44; border-color:rgba(255,170,68,0.3); background:rgba(255,170,68,0.06); }

  .rs-pcard-handle { font-size:20px; font-weight:800; color: #fff; line-height:1.2; word-break:break-all; }
  .rs-you-tag { font-size:9px; color:#ffcb05; letter-spacing:0.16em; text-transform:uppercase; font-weight:700; }

  .rs-score-row { display:flex; align-items:baseline; gap:9px; margin-top:2px; }
  .rs-big-score { font-size:48px; font-weight:800; line-height:1; }
  .rs-big-score.win  { color:#ffcb05; }
  .rs-big-score.lose { color:#4a5568; }
  .rs-big-score.draw { color:#ffaa44; }
  .rs-score-lbl { font-size:11px; color:#718096; letter-spacing:0.16em; text-transform:uppercase; font-weight:700; }

  /* Problem breakdown */
  .rs-pcard-body { flex:1; }
  .rs-pcard-body-head {
    padding: 10px 20px;
    font-size: 10px; color:#718096;
    letter-spacing:0.2em; text-transform:uppercase;
    border-bottom: 2px solid #2d3748;
    background: #0f1013;
    font-weight: 700;
  }

  .rs-prob-row {
    display: flex; align-items: center; gap: 12px;
    padding: 14px 20px;
    border-bottom: 2px solid #2d3748;
    transition: background .12s;
  }
  .rs-prob-row:last-child { border-bottom: none; }
  .rs-prob-row:hover { background: rgba(255,255,255,0.015); }

  .rs-prob-n {
    font-size: 12px; font-weight: 700;
    width: 26px; height: 26px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; border: 2px solid #2d3748;
    color: #4a5568;
  }
  .rs-prob-n.ac   { background: #ffcb05; border-color: #ffcb05; color: #0f1013; }

  .rs-prob-label { flex:1; font-size:13px; color:#a0aec0; }

  .rs-prob-chip {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 10px; letter-spacing:0.1em; text-transform:uppercase;
    padding: 4px 10px; border-radius: 4px; flex-shrink: 0;
    font-weight: 700;
  }
  .rs-prob-chip.ac   { color:#0f1013; background:#ffcb05; }
  .rs-prob-chip.miss { color:#4a5568; background:transparent; border:2px solid #2d3748; }

  .rs-cf-link { font-size:13px; color:#718096; text-decoration:none; transition:color .15s; flex-shrink:0; }
  .rs-cf-link:hover { color:#ffcb05; }

  /* ── VS spine ── */
  .rs-vs-col {
    display: flex; flex-direction: column;
    align-items: center; justify-content: flex-start;
    padding-top: 48px; position: relative;
  }
  .rs-vs-line {
    position: absolute; top: 0; bottom: 0; left: 50%;
    transform: translateX(-50%);
    width: 2px; background: #2d3748; z-index: 0;
  }
  .rs-vs-badge {
    position: relative; z-index: 1;
    font-family: 'Press Start 2P', cursive; font-size: 8px;
    color: #a0aec0; background: #0f1013;
    border: 2px solid #2d3748; border-radius: 6px;
    padding: 8px 10px;
  }

  /* ── Meta strip ── */
  .rs-meta {
    display: grid; grid-template-columns: repeat(3,1fr);
    background: #171923; border: 3px solid #2d3748;
    border-radius: 12px; overflow: hidden;
  }
  .rs-meta-item { padding:15px 20px; border-right:2px solid #2d3748; text-align: center; }
  .rs-meta-item:last-child { border-right:none; }
  .rs-meta-key { font-size:10px; color:#718096; letter-spacing:0.18em; text-transform:uppercase; margin-bottom:5px; font-weight:700; }
  .rs-meta-val { font-size:16px; font-weight:800; color:#fff; }

  /* ── Actions ── */
  .rs-actions { display:grid; grid-template-columns:1fr 2fr; gap:12px; }
  .rs-btn-ghost { font-family: 'Press Start 2P', cursive; font-size: 8px; color:#a0aec0; background:none; border: 2px solid #2d3748; padding:16px; border-radius:8px; cursor:pointer; transition:all .15s; text-transform:uppercase; }
  .rs-btn-ghost:hover { color:#fff; border-color:#718096; }
  .rs-btn-cta { font-family: 'Press Start 2P', cursive; font-size: 9px; color:#0f1013; background:#ffcb05; border:none; padding:16px; border-radius:8px; cursor:pointer; transition:all .15s ease; box-shadow: 0 4px 0 #c59b00; text-transform:uppercase; }
  .rs-btn-cta:hover { background:#ffe066; transform:translateY(1px); box-shadow:0 3px 0 #c59b00; }
  .rs-btn-cta:active { transform:translateY(4px); box-shadow:none; }

  /* ── Trainer Reward Card ── */
  .trainer-reward-card {
    background: #171923;
    border: 3px solid var(--theme-color, #ffcb05);
    border-radius: 16px;
    padding: 28px;
    text-align: center;
    margin-bottom: 24px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.3);
    position: relative;
    overflow: hidden;
  }
  .pokemon-sprite {
    width: 80px;
    height: 80px;
    filter: drop-shadow(0 4px 8px rgba(0,0,0,0.4));
    animation: bounce 2s infinite ease-in-out;
  }
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }

  @media (max-width:640px) {
    .rs-battle { grid-template-columns:1fr; }
    .rs-vs-col { flex-direction:row; padding:0 16px; height:44px; justify-content:flex-start; }
    .rs-vs-line { top:50%; bottom:auto; left:0; right:0; width:100%; height:2px; transform:none; }
    .rs-meta { grid-template-columns:1fr 1fr; }
    .rs-meta-item:nth-child(2) { border-right:none; }
    .rs-meta-item:nth-child(3) { border-top:2px solid #2d3748; border-right:none; grid-column:1/-1; }
    .rs-actions { grid-template-columns:1fr; }
  }
`

function cfUrl(pid) {
  if (!pid) return '#'
  if (pid.startsWith('http')) return pid
  const m = pid.match(/^(\d+)([A-Z].*)$/i)
  if (!m) return `https://codeforces.com/problemset?search=${encodeURIComponent(pid)}`
  return `https://codeforces.com/contest/${m[1]}/problem/${m[2].toUpperCase()}`
}

function isSolved(resultsMap, index) {
  if (resultsMap === null || resultsMap === undefined) return null
  if (Array.isArray(resultsMap)) {
    return resultsMap[index] === 'SOLVED'
  }
  const val = resultsMap[index] ?? resultsMap[String(index)]
  if (val === undefined) return null
  return val === 'SOLVED'
}

function PlayerCard({ handle, isYou, score, results, problems, isWin, isDraw, league }) {
  const pillClass  = isWin ? 'win' : isDraw ? 'draw' : 'lose'
  const scoreClass = isWin ? 'win' : isDraw ? 'draw' : 'lose'
  const theme      = getLeagueTheme(league || 1)

  return (
    <div className={`rs-pcard ${isWin ? 'win' : ''}`} style={{ '--theme-color': theme.color }}>
      <div className="rs-pcard-head">
        <span className={`rs-result-pill ${pillClass}`}>
          {isDraw ? 'draw' : isWin ? 'winner' : 'defeated'}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
          <div>
            <div className="rs-pcard-handle">{handle || '—'}</div>
            {isYou && <div className="rs-you-tag">you</div>}
          </div>
          {handle && (
            <img src={theme.spriteUrl} alt={theme.pokemon} style={{ width: '48px', height: '48px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))' }} />
          )}
        </div>
        <div className="rs-score-row">
          <div className={`rs-big-score ${scoreClass}`}>{score}</div>
          <div className="rs-score-lbl">solved</div>
        </div>
      </div>

      <div className="rs-pcard-body">
        <div className="rs-pcard-body-head">Problems</div>
        {problems.map((pid, i) => {
          const solvedState = isSolved(results, i)
          const ac = solvedState !== null ? solvedState : i < score

          return (
            <div className="rs-prob-row" key={i}>
              <span className={`rs-prob-n ${ac ? 'ac' : ''}`}>{i + 1}</span>
              <span className="rs-prob-label">Problem {i + 1}</span>
              <span className={`rs-prob-chip ${ac ? 'ac' : 'miss'}`}>
                {ac ? '✓ AC' : '—'}
              </span>
              <a className="rs-cf-link" href={cfUrl(pid)} target="_blank" rel="noreferrer">↗</a>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function Results() {
  const { inviteCode } = useParams()
  const navigate = useNavigate()

  const [match, setMatch]       = useState(null)
  const [myHandle, setMyHandle] = useState(null)
  const [userData, setUserData] = useState(null)
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    axiosInstance.get(API_PATHS.USER.ME)
      .then((r) => {
        setMyHandle(r?.data?.cfHandle || null)
        setUserData(r?.data || null)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!inviteCode) return
    axiosInstance
      .get(`${API_PATHS.MATCH.STATUS}?inviteCode=${encodeURIComponent(inviteCode)}`)
      .then((r) => setMatch(r?.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [inviteCode])

  if (loading) return (
    <>
      <style>{css}</style>
      <div className="rs"><Navbar /><main className="rs-main"><div className="rs-loading"><div className="rs-spinner" />Loading results…</div></main></div>
    </>
  )

  if (!match) return (
    <>
      <style>{css}</style>
      <div className="rs"><Navbar /><main className="rs-main"><div className="rs-loading">Match not found.</div></main></div>
    </>
  )

  const s1 = match.score1 ?? 0
  const s2 = match.score2 ?? 0

  const r1 = match.player1Results ?? null
  const r2 = match.player2Results ?? null

  const isDraw  = s1 === s2
  const p1Wins  = !isDraw && s1 > s2
  const p2Wins  = !isDraw && s2 > s1
  const winner  = isDraw ? null : p1Wins ? match.user1 : match.user2
  const problems = match.problems || []

  const durationMs  = match.endTime && match.startTime
    ? new Date(match.endTime).getTime() - new Date(match.startTime).getTime()
    : null
  const durationMin = durationMs ? Math.round(durationMs / 60000) : null

  const isMe = (handle) =>
    !!myHandle && !!handle && handle.toLowerCase() === myHandle.toLowerCase()

  const amIWinner = winner && isMe(winner)
  const amILoser  = winner && !isMe(winner) && (isMe(match.user1) || isMe(match.user2))

  const userTheme = userData ? getLeagueTheme(userData.league || 1) : getLeagueTheme(1);

  return (
    <>
      <style>{css}</style>
      <div className="rs">
        <Navbar />
        <main className="rs-main">
          <div className="rs-inner">

            {/* Battle Verdict */}
            <div className="rs-verdict">
              <div className="rs-eyebrow">battle complete</div>
              <div className="rs-verdict-main">
                {isDraw
                  ? <span className="draw">DRAW GAME</span>
                  : amIWinner
                    ? <span className="winner" style={{ color: '#44ffaa', textShadow: '2px 2px 0px #1e7044' }}>VICTORY!</span>
                    : amILoser
                      ? <span className="winner" style={{ color: '#ff3c3c', textShadow: '2px 2px 0px #601010' }}>DEFEAT...</span>
                      : <><span className="winner">{winner}</span>{' '}WINS</>
                }
              </div>
              <div className="rs-verdict-sub">// arena code {inviteCode} · final scores</div>
            </div>

            {/* Trainer Reward Showcase */}
            {amIWinner && userData && (
              <div className="trainer-reward-card" style={{ '--theme-color': userTheme.color }}>
                <h3 style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '10px', color: '#ffcb05', marginBottom: '16px' }}>BATTLE REWARD</h3>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                  <img src={userTheme.spriteUrl} alt={userTheme.pokemon} className="pokemon-sprite" />
                  <div style={{ fontSize: '28px', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.5))' }}>🎖</div>
                </div>
                <p style={{ fontSize: '15px', color: '#fff', fontWeight: 'bold' }}>
                  Congratulations! You earned a badge in the {userTheme.name}!
                </p>
                
                {/* Render badges */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '16px' }}>
                  {[0, 1, 2, 3, 4].map(idx => {
                    const unlocked = idx < userData.badges;
                    return (
                      <div key={idx} style={{
                        width: '36px', height: '36px', borderRadius: '50%',
                        border: unlocked ? `2.5px solid ${userTheme.color}` : '2px dashed #4a5568',
                        background: unlocked ? `${userTheme.color}22` : 'rgba(0,0,0,0.2)',
                        boxShadow: unlocked ? `0 0 10px ${userTheme.color}66` : 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.3s ease'
                      }}>
                        {unlocked ? (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill={userTheme.color}>
                            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                          </svg>
                        ) : (
                          <span style={{ color: '#4a5568', fontSize: '11px', fontWeight: 'bold' }}>?</span>
                        )}
                      </div>
                    );
                  })}
                </div>
                
                {userData.badges === 0 && (
                  <p style={{ fontSize: '12px', color: '#44ffaa', fontWeight: 'bold', marginTop: '16px', letterSpacing: '0.05em' }}>
                    🎉 LEVEL UP! You unlocked a new League tier! Check your dashboard for your new Pokémon Partner!
                  </p>
                )}
              </div>
            )}

            {amILoser && userData && (
              <div className="trainer-reward-card" style={{ '--theme-color': '#ff3c3c', border: '3px solid #ff3c3c' }}>
                <h3 style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '10px', color: '#ff3c3c', marginBottom: '12px' }}>TRAINING NOTES</h3>
                <p style={{ fontSize: '14px', color: '#a0aec0', lineHeight: '1.6' }}>
                  A tough loss, but every battle is a step forward. Train hard, review your rival's solutions, and challenge again to win your next badge!
                </p>
              </div>
            )}

            <div className="rs-battle">
              <PlayerCard
                handle={match.user1}
                isYou={isMe(match.user1)}
                score={s1}
                results={r1}
                problems={problems}
                isWin={p1Wins}
                isDraw={isDraw}
                league={match.league}
              />

              <div className="rs-vs-col">
                <div className="rs-vs-line" />
                <div className="rs-vs-badge">VS</div>
              </div>

              <PlayerCard
                handle={match.user2}
                isYou={isMe(match.user2)}
                score={s2}
                results={r2}
                problems={problems}
                isWin={p2Wins}
                isDraw={isDraw}
                league={match.league}
              />
            </div>

            <div className="rs-meta">
              <div className="rs-meta-item">
                <div className="rs-meta-key">Duration</div>
                <div className="rs-meta-val">{durationMin !== null ? `${durationMin} min` : '—'}</div>
              </div>
              <div className="rs-meta-item">
                <div className="rs-meta-key">Lobby Tier</div>
                <div className="rs-meta-val" style={{ color: userTheme.color }}>{userTheme.name}</div>
              </div>
              <div className="rs-meta-item">
                <div className="rs-meta-key">Total Problems</div>
                <div className="rs-meta-val">{problems.length}</div>
              </div>
            </div>

            <div className="rs-actions">
              <button className="rs-btn-ghost" onClick={() => navigate('/dashboard')}>
                Lobby
              </button>
              <button className="rs-btn-cta" onClick={() => navigate('/match/create')}>
                New Battle Room
              </button>
            </div>

          </div>
        </main>
      </div>
    </>
  )
}