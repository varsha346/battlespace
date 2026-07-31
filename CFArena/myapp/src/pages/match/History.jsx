import { useEffect, useState } from 'react'
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

export default function History() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    axiosInstance.get(API_PATHS.USER.ME)
      .then((res) => {
        setUser(res.data)
        return axiosInstance.get(`${API_PATHS.MATCH.HISTORY}/${res.data.cfHandle}`)
      })
      .then((res) => {
        setHistory(res.data)
      })
      .catch((err) => console.error("Failed to fetch history:", err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#0f1013', color: '#e2e8f0', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />
      
      <div style={{ padding: '52px 24px 80px', maxWidth: '800px', margin: '0 auto' }}>
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span style={{ fontSize: '10px', color: '#718096', letterSpacing: '0.2em', fontWeight: 'bold', textTransform: 'uppercase' }}>TRAINER CARD</span>
          <h1 style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '18px', color: '#fff', textShadow: '2px 2px 0px #3b4cca', marginTop: '10px' }}>
            Battle History
          </h1>
        </div>
        
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '60px 0' }}>
            <div style={{ width: '24px', height: '24px', border: '2px solid #2d3748', borderTopColor: '#ffcb05', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ color: '#718096', fontSize: '13px', letterSpacing: '0.1em' }}>Checking battle database...</p>
          </div>
        ) : history.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 24px', border: '3px dashed #2d3748', borderRadius: '12px', background: '#171923' }}>
            <p style={{ color: '#a0aec0', fontSize: '15px', fontWeight: 'bold' }}>You have no completed duels yet.</p>
            <p style={{ color: '#718096', fontSize: '13px', marginTop: '8px' }}>Challenge other trainers or click Quick Match to earn your first badge!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {history.map((match) => {
              const matchLeague = match.league || 1
              const theme = getLeagueTheme(matchLeague)
              const isWinner = match.winnerId === user?.cfHandle
              const isDraw = match.winnerId === 'DRAW'
              
              return (
                <div 
                  key={match.id} 
                  style={{ 
                    border: '3px solid #2d3748', 
                    borderLeft: `5px solid ${isDraw ? '#ffaa44' : isWinner ? '#44ffaa' : '#ff3c3c'}`,
                    padding: '24px', 
                    borderRadius: '12px', 
                    background: '#171923',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase', padding: '4px 8px', borderRadius: '4px', background: `${theme.color}22`, border: `1px solid ${theme.color}44`, color: theme.color }}>
                        {theme.name}
                      </span>
                      <span style={{ fontSize: '11px', color: '#718096', fontWeight: '700' }}>
                        {new Date(match.endTime).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#fff', margin: '4px 0 12px' }}>
                      {match.user1} <span style={{ color: '#4a5568', fontSize: '12px' }}>VS</span> {match.user2}
                    </h3>

                    <div style={{ display: 'flex', gap: '16px', fontSize: '13px', fontWeight: '600' }}>
                      <span style={{ color: '#a0aec0' }}>
                        Score: <span style={{ color: '#fff' }}>{match.score1} - {match.score2}</span>
                      </span>
                      <span style={{ color: isDraw ? '#ffaa44' : isWinner ? '#44ffaa' : '#ff3c3c' }}>
                        {isDraw ? 'DRAW' : isWinner ? 'VICTORY' : 'DEFEAT'}
                      </span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'center', flexShrink: 0 }}>
                    <img 
                      src={theme.spriteUrl} 
                      alt={theme.pokemon} 
                      style={{ width: '56px', height: '56px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} 
                    />
                    <div style={{ fontSize: '9px', color: '#718096', textTransform: 'uppercase', fontWeight: 'bold', marginTop: '4px' }}>
                      {theme.pokemon}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
        
        <button 
          onClick={() => navigate('/dashboard')} 
          style={{ 
            marginTop: '32px', 
            width: '100%',
            fontFamily: "'Press Start 2P', cursive", 
            fontSize: '8px', 
            color: '#a0aec0', 
            background: 'none', 
            border: '2px solid #2d3748', 
            padding: '16px', 
            borderRadius: '8px', 
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => { e.target.style.color = '#fff'; e.target.style.borderColor = '#718096'; }}
          onMouseLeave={(e) => { e.target.style.color = '#a0aec0'; e.target.style.borderColor = '#2d3748'; }}
        >
          Back to Dashboard
        </button>
      </div>
      
      {/* Dynamic spinner animation */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
