import { useContext, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axiosInstance from '../utils/axiosInstance'
import { API_PATHS } from '../utils/apiPaths'
import { AuthContext } from '../context/AuthContext'

function decodeToken(token) {
  if (!token) return null
  try {
    const payload = token.split('.')[1]
    if (!payload) return null
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')
    return JSON.parse(atob(padded))
  } catch { return null }
}

const navCss = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;700&family=Press+Start+2P&display=swap');

  .nav { display: flex; align-items: center; justify-content: space-between; padding: 16px 36px; border-bottom: 3px solid #2d3748; background: #171923; position: sticky; top: 0; z-index: 50; }
  .nav-brand { font-family: 'Press Start 2P', cursive; font-size: 11px; color: #fff; text-decoration: none; text-shadow: 1.5px 1.5px 0px #3b4cca; }
  .nav-brand em { color: #ffcb05; font-style: normal; text-shadow: none; }

  .nav-right { display: flex; align-items: center; gap: 10px; }
  .nav-user-pill { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 11px; font-weight: 700; color: #a0aec0; border: 2px solid #2d3748; padding: 6px 14px; border-radius: 6px; background: #1f2330; }

  .nav-btn { font-family: 'Press Start 2P', cursive; font-size: 8px; color: #a0aec0; background: #1f2330; border: 2px solid #2d3748; padding: 8px 14px; border-radius: 6px; cursor: pointer; transition: all .15s ease; text-transform: uppercase; }
  .nav-btn:hover { color: #fff; border-color: #718096; }
  .nav-btn.accent { color: #ffcb05; border-color: #ffcb05; }
  .nav-btn.accent:hover { background: rgba(255, 203, 5, 0.08); border-color: #ffcb05; }
  
  @keyframes historyPulse { 0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 60, 60, 0.3); } 50% { transform: scale(1.02); box-shadow: 0 0 8px 1px rgba(255, 60, 60, 0); } 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 60, 60, 0); } }
  .nav-btn.history { color: #ff3c3c; border-color: #ff3c3c; background: #171923; animation: historyPulse 2.5s infinite; transition: all 0.3s; }
  .nav-btn.history:hover { background: #ff3c3c; color: #fff; animation: none; transform: translateY(-1px); }

  /* ── Edit CF Handle modal ── */
  .nav-overlay { position: fixed; inset: 0; background: rgba(15,16,19,0.92); display: flex; align-items: center; justify-content: center; z-index: 100; backdrop-filter: blur(4px); animation: navFadeIn .15s ease; }
  @keyframes navFadeIn { from{opacity:0}to{opacity:1} }
  .nav-modal { background: #171923; border: 3px solid #2d3748; padding: 36px; width: 100%; max-width: 420px; border-radius: 12px; animation: navSlideUp .2s ease; position: relative; box-shadow: 0 10px 25px rgba(0,0,0,0.4); }
  .nav-modal::after { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #ff3c3c 50%, #ffcb05 50%); border-radius: 12px 12px 0 0; }
  @keyframes navSlideUp { from{transform:translateY(12px);opacity:0}to{transform:translateY(0);opacity:1} }
  .nav-modal-title { font-family: 'Press Start 2P', cursive; font-size: 11px; margin-bottom: 12px; text-transform: uppercase; color: #ffcb05; }
  .nav-modal-sub { font-size: 13px; color: #a0aec0; margin-bottom: 24px; line-height: 1.7; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 500; }
  .nav-modal-field { margin-bottom: 18px; }
  .nav-modal-field label { display: block; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; font-weight: 700; color: #fff; margin-bottom: 8px; }
  .nav-modal-field input { width: 100%; background: #1f2330; border: 2px solid #2d3748; color: #fff; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; padding: 12px 16px; border-radius: 8px; outline: none; transition: border-color .15s; }
  .nav-modal-field input:focus { border-color: #ffcb05; }
  .nav-modal-field input::placeholder { color: #4a5568; }
  .nav-modal-actions { display: flex; gap: 10px; margin-top: 24px; }
  .nav-btn-cancel { font-family: 'Press Start 2P', cursive; font-size: 8px; color: #a0aec0; background: #1f2330; border: 2px solid #2d3748; padding: 12px 20px; border-radius: 8px; cursor: pointer; transition: all .15s; flex: 1; text-transform: uppercase; }
  .nav-btn-cancel:hover { color: #fff; border-color: #718096; }
  .nav-btn-save { font-family: 'Press Start 2P', cursive; font-size: 8px; color: #0f1013; background: #ffcb05; border: none; padding: 12px; border-radius: 8px; cursor: pointer; transition: all .15s; flex: 2; text-transform: uppercase; box-shadow: 0 3px 0 #c59b00; }
  .nav-btn-save:hover:not(:disabled) { background: #ffe066; transform: translateY(1px); box-shadow: 0 2px 0 #c59b00; }
  .nav-btn-save:active:not(:disabled) { transform: translateY(3px); box-shadow: none; }
  .nav-btn-save:disabled { opacity: 0.4; cursor: not-allowed; }

  /* ── Toast ── */
  .nav-toast { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); font-family: 'Press Start 2P', cursive; font-size: 8px; padding: 12px 24px; border-radius: 8px; border-left: 4px solid #ffcb05; background: #171923; color: #ffcb05; white-space: nowrap; z-index: 200; box-shadow: 0 8px 16px rgba(0,0,0,0.3); border: 2px solid #2d3748; border-left: 4px solid #ffcb05; animation: navToastIn .2s ease; }
  .nav-toast.error { border-left-color: #ff3c3c; color: #ff3c3c; }
  @keyframes navToastIn { from{opacity:0;transform:translateX(-50%) translateY(8px)}to{opacity:1;transform:translateX(-50%) translateY(0)} }

  @media (max-width: 580px) {
    .nav { padding: 14px 18px; }
    .nav-user-pill { display: none; }
  }
`

export default function Navbar({ onCfSaved }) {
  const navigate = useNavigate()
  const { logout } = useContext(AuthContext)

  const token = localStorage.getItem('token')
  const claims = useMemo(() => decodeToken(token), [token])
  const userEmail = claims?.sub || 'player'

  const [showCfModal, setShowCfModal] = useState(false)
  const [cfHandle, setCfHandle] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = (text, type = 'ok') => {
    setToast({ text, type })
    setTimeout(() => setToast(null), 3000)
  }

  const onLogout = () => { logout(); navigate('/login', { replace: true }) }

  const openCfModal = async () => {
    // Pre-fill current handle if available
    try {
      const res = await axiosInstance.get(API_PATHS.USER.ME)
      if (res.data?.cfHandle) setCfHandle(res.data.cfHandle)
    } catch { /* ignore */ }
    setShowCfModal(true)
  }

  const onSaveCfHandle = async () => {
    if (!cfHandle.trim()) { showToast('Enter your Codeforces handle.', 'error'); return }
    setIsSaving(true)
    try {
      await axiosInstance.post(API_PATHS.USER.ADD_CF_HANDLE, { cfHandle: cfHandle.trim() })
      showToast('Handle updated!')
      setShowCfModal(false)
      onCfSaved?.()
    } catch (err) {
      const m = err?.response?.data?.message || err?.response?.data || 'Failed to save handle.'
      showToast(typeof m === 'string' ? m : 'Failed.', 'error')
    } finally { setIsSaving(false) }
  }

  return (
    <>
      <style>{navCss}</style>

      <header className="nav">
        <Link to="/dashboard" className="nav-brand">BATTLE<em>_</em>SPACE</Link>
        <div className="nav-right">
          <span className="nav-user-pill">{userEmail}</span>
          <button className="nav-btn history" onClick={() => navigate('/history')} title="View match history">
            History
          </button>
          <button className="nav-btn accent" onClick={openCfModal} title="Edit Codeforces handle">
            CF Handle
          </button>
          <button className="nav-btn" onClick={onLogout}>Logout</button>
        </div>
      </header>

      {/* Edit CF Handle modal */}
      {showCfModal && (
        <div className="nav-overlay" onClick={() => setShowCfModal(false)}>
          <div className="nav-modal" onClick={(e) => e.stopPropagation()}>
            <div className="nav-modal-title">Edit CF Handle</div>
            <div className="nav-modal-sub">
              Update your Codeforces handle. This is used to fetch your problem history.
            </div>
            <div className="nav-modal-field">
              <label>Codeforces Handle</label>
              <input
                type="text"
                placeholder="tourist"
                value={cfHandle}
                autoFocus
                onChange={(e) => setCfHandle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onSaveCfHandle()}
              />
            </div>
            <div className="nav-modal-actions">
              <button className="nav-btn-cancel" onClick={() => setShowCfModal(false)}>Cancel</button>
              <button className="nav-btn-save" onClick={onSaveCfHandle} disabled={isSaving}>
                {isSaving ? 'Saving…' : 'Save Handle'}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={`nav-toast ${toast.type === 'error' ? 'error' : ''}`}>{toast.text}</div>
      )}
    </>
  )
}
