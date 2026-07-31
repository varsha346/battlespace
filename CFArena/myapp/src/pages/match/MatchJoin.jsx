import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import Navbar from '../../components/Navbar'

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Press+Start+2P&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .mj { 
    min-height: 100vh; 
    background: #0f1013; 
    color: #e2e8f0; 
    font-family: 'Plus Jakarta Sans', sans-serif; 
    display: flex; 
    flex-direction: column; 
  }
  .mj-main { 
    flex: 1; 
    display: flex; 
    flex-direction: column; 
    align-items: center; 
    justify-content: center; 
    padding: 48px 24px; 
  }
  .mj-step-label { 
    font-size: 10px; 
    color: #ff3c3c; 
    letter-spacing: 0.18em; 
    text-transform: uppercase; 
    margin-bottom: 14px; 
    font-weight: 700;
  }
  .mj-title { 
    font-family: 'Press Start 2P', cursive; 
    font-size: 20px; 
    color: #fff;
    text-shadow: 2px 2px 0px #3b4cca;
    text-align: center; 
    line-height: 1.5; 
    margin-bottom: 8px; 
  }
  .mj-subtitle { 
    font-size: 12px; 
    color: #a0aec0; 
    letter-spacing: 0.08em; 
    text-align: center; 
    margin-bottom: 40px; 
  }
  .mj-card { 
    width: 100%; 
    max-width: 480px; 
    border: 3px solid #2d3748; 
    background: #171923; 
    padding: 44px; 
    border-radius: 12px; 
    position: relative; 
    overflow: hidden; 
    box-shadow: 0 8px 16px rgba(0,0,0,0.3);
  }
  .mj-card::after { 
    content: ''; 
    position: absolute; 
    top: 0; left: 0; right: 0; height: 4px; 
    background: linear-gradient(90deg, #ff3c3c 50%, #ffcb05 50%); 
  }
  .mj-field-label { 
    font-size: 11px; 
    color: #fff; 
    letter-spacing: 0.12em; 
    text-transform: uppercase; 
    margin-bottom: 14px; 
    font-weight: 700;
  }
  .mj-input-wrap { position: relative; margin-bottom: 32px; }
  .mj-input { 
    width: 100%; 
    font-family: 'Press Start 2P', cursive; 
    font-size: 24px; 
    letter-spacing: 0.15em; 
    text-align: center; 
    text-transform: uppercase; 
    background: #1f2330; 
    border: 2px solid #2d3748; 
    color: #ffcb05; 
    padding: 20px 16px; 
    border-radius: 8px; 
    outline: none; 
    transition: border-color .15s; 
  }
  .mj-input::placeholder { color: #2d3748; }
  .mj-input:focus { border-color: #ffcb05; }
  .mj-divider { height: 2px; background: #2d3748; margin-bottom: 32px; }
  
  .mj-cta { 
    width: 100%; 
    font-family: 'Press Start 2P', cursive; 
    font-size: 10px; 
    color: #0f1013; 
    background: #ffcb05; 
    border: none; 
    padding: 18px; 
    border-radius: 8px; 
    cursor: pointer; 
    transition: all .15s ease; 
    text-transform: uppercase;
    box-shadow: 0 4px 0 #c59b00;
  }
  .mj-cta:hover:not(:disabled) { background: #ffe066; transform: translateY(1px); box-shadow: 0 3px 0 #c59b00; }
  .mj-cta:active:not(:disabled) { transform: translateY(4px); box-shadow: none; }
  .mj-cta:disabled { opacity: 0.4; cursor: not-allowed; transform: none; box-shadow: none; }
  
  .mj-error-box { 
    background: rgba(255, 60, 60, 0.08); 
    border: 1px solid rgba(255, 60, 60, 0.2); 
    border-left: 3px solid #ff3c3c; 
    padding: 14px 16px; 
    border-radius: 6px; 
    margin-bottom: 20px; 
    font-size: 12px; 
    color: #ffaaaa; 
    line-height: 1.6; 
  }
  .mj-error-label { font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase; color: #ff3c3c; margin-bottom: 6px; font-weight: 700; }
  
  .mj-back { 
    display: inline-flex; 
    align-items: center; 
    gap: 8px; 
    font-size: 12px; 
    color: #a0aec0; 
    margin-bottom: 32px; 
    transition: color .15s; 
    cursor: pointer; 
    background: none; 
    border: none; 
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-weight: 700;
  }
  .mj-back:hover { color: #fff; }
  
  .mj-toast { 
    position: fixed; 
    bottom: 28px; 
    left: 50%; 
    transform: translateX(-50%); 
    font-family: 'Press Start 2P', cursive;
    font-size: 8px; 
    padding: 12px 24px; 
    border-radius: 8px; 
    border: 2px solid #2d3748;
    border-left: 4px solid #ffcb05; 
    background: #171923; 
    color: #ffcb05; 
    white-space: nowrap; 
    z-index: 200; 
    animation: mjToastIn .2s ease; 
    box-shadow: 0 8px 16px rgba(0,0,0,0.3);
  }
  .mj-toast.error { border-left-color: #ff3c3c; color: #ff3c3c; }
  @keyframes mjToastIn { from{opacity:0;transform:translateX(-50%) translateY(8px)}to{opacity:1;transform:translateX(-50%) translateY(0)} }
`

function extractError(err) {
  const d = err?.response?.data
  if (!d) return err?.message || 'Unknown error.'
  if (typeof d === 'string') return d
  if (typeof d === 'object') return d.message || d.error || d.detail || JSON.stringify(d)
  return String(d)
}

export default function MatchJoin() {
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [isJoining, setIsJoining] = useState(false)
  const [joinError, setJoinError] = useState(null)
  const [toast, setToast] = useState(null)

  const showToast = (text, type = 'ok') => {
    setToast({ text, type })
    setTimeout(() => setToast(null), 3500)
  }

  const onJoin = async () => {
    const trimmed = code.trim().toUpperCase()
    if (trimmed.length < 4) {
      setJoinError('Enter a valid invite code.')
      return
    }
    setIsJoining(true)
    setJoinError(null)
    try {
      await axiosInstance.post(`${API_PATHS.MATCH.JOIN}?inviteCode=${encodeURIComponent(trimmed)}`)
      showToast('Joined! Waiting for host to start…')
      setTimeout(() => navigate(`/match/${trimmed}`, { state: { role: 'guest' } }), 800)
    } catch (err) {
      const status = err?.response?.status
      const msg = extractError(err)
      setJoinError(status ? `Error ${status}: ${msg}` : `Network error — ${msg}`)
    } finally {
      setIsJoining(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') onJoin()
  }

  return (
    <>
      <style>{css}</style>
      <div className="mj">
        <Navbar onCfSaved={() => showToast('CF handle updated!')} />
        <main className="mj-main">
          <button className="mj-back" onClick={() => navigate('/dashboard')}>
            ← Back to dashboard
          </button>

          <div className="mj-step-label">Gym Challenge</div>
          <h1 className="mj-title">Enter Invite Code</h1>
          <p className="mj-subtitle">// paste the invite code your opponent shared</p>

          <div className="mj-card">
            <div className="mj-field-label">Invite Code</div>
            <div className="mj-input-wrap">
              <input
                className="mj-input"
                maxLength={6}
                placeholder="XXXXXX"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                onKeyDown={handleKeyDown}
                autoFocus
              />
            </div>

            <div className="mj-divider" />

            {joinError && (
              <div className="mj-error-box">
                <div className="mj-error-label">Failed to join</div>
                {joinError}
              </div>
            )}

            <button
              className="mj-cta"
              onClick={onJoin}
              disabled={isJoining || code.trim().length < 4}
            >
              {isJoining ? 'Challenging…' : '⚔ Join Gym Duel'}
            </button>
          </div>
        </main>

        {toast && (
          <div className={`mj-toast ${toast.type === 'error' ? 'error' : ''}`}>
            {toast.text}
          </div>
        )}
      </div>
    </>
  )
}