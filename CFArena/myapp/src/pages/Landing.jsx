import { useEffect, useState } from 'react'

const STEPS = [
  {
    num: '01',
    title: 'Link Trainer Card',
    desc: 'Link your Codeforces handle to load your profile and get assigned your active Pokémon partner.',
  },
  {
    num: '02',
    title: 'Challenge Trainers',
    desc: 'Launch a direct battle invite or enter the quick matchmaking queue to find active trainers in your league.',
  },
  {
    num: '03',
    title: 'Win Badges & Evolve',
    desc: 'Solve curated problems in real-time. The winner gets the badge. Win 5 badges to evolve and ascend to the next league tier!',
  },
]

const FEATURES = [
  { tag: 'Gym Matchmaking',      title: 'Same League Battles',   desc: 'You can only duel trainers in your same league, ensuring a balanced, competitive, and fair matchmaking pool.' },
  { tag: 'Linear Scale',         title: 'Auto Gym Difficulty',   desc: 'Difficulty is automatically set based on the active league rank. Problem ratings scale dynamically from 800 to 3500.' },
  { tag: 'Real-time Duel Feed',  title: 'WebSocket Live Score',  desc: 'Submissions are verified instantly on the backend and broadcasted to both screen overlays in real-time.' },
  { tag: 'Trainer Progression',  title: 'Evolving Partners',     desc: 'Ascend leagues to unlock and evolve partner Pokémon sprites, from Geodude to Pikachu, Starmie, and legendaries.' },
]

export default function Landing() {
  const [navSolid, setNavSolid] = useState(false)

  useEffect(() => {
    const onScroll = () => setNavSolid(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div style={s.root}>
      {/* Dynamic Grid Background */}
      <div style={s.grid} />

      {/* Retro Header Accent */}
      <div style={s.accentBar} />

      {/* NAV */}
      <nav style={{ ...s.nav, background: navSolid ? '#171923f5' : '#171923cc', borderColor: navSolid ? '#ffcb0555' : '#2d3748' }}>
        <a href="/" style={s.logo}>BATTLE<span style={{ color: '#ffcb05' }}>_</span>SPACE</a>
        <div style={s.navLinks}>
          <a href="#how-it-works" style={s.navLink}>Gym Guide</a>
          <a href="#features"     style={s.navLink}>Rules</a>
          <a href="/login"        style={s.btnGhost}>Log in</a>
          <a href="/signup"       style={s.btnPrimary}>Link Card</a>
        </div>
      </nav>

      {/* HERO */}
      <section style={s.hero}>
        <div style={s.heroInner}>
          <p style={s.eyebrow}>
            <span style={s.eyebrowDot} /> Codeforces 1v1 Battle Gyms
          </p>
          <h1 style={s.h1}>
            <span style={{ display: 'block', color: '#ffcb05', textShadow: '4px 4px 0px #3b4cca', marginBottom: '8px' }}>CHALLENGE.</span>
            <span style={{ display: 'block', color: '#fff', textShadow: '3px 3px 0px #4a5568', marginBottom: '8px' }}>WIN BADGES.</span>
            <span style={{ display: 'block', WebkitTextStroke: '2px #ff3c3c', color: 'rgba(255, 60, 60, 0.12)', textShadow: '0 0 16px rgba(255, 60, 60, 0.2)' }}>EVOLVE.</span>
          </h1>
          <p style={s.heroSub}>
            Link your trainer card, challenge rival programmers in real-time, solve Codeforces problems seqentially, and level up through infinite leagues.
          </p>
          <div style={s.heroCta}>
            <a href="/signup" style={s.btnPrimary}>
              Enter the Gym <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", marginLeft: '6px', fontSize: '12px', fontWeight: 'bold' }}>→</span>
            </a>
            <a href="/login" style={s.btnGhost}>Sign in</a>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={s.section} id="how-it-works">
        <div style={s.sectionInner}>
          <p style={s.sectionLabel}>// how it works</p>
          <h2 style={s.sectionTitle}>
            Three steps to{' '}
            <span style={{ color: '#ffcb05', textShadow: '2px 2px 0px #3b4cca' }}>Championship</span>
          </h2>
          <div style={s.stepsGrid}>
            {STEPS.map(step => <StepCard key={step.num} {...step} />)}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={s.section} id="features">
        <div style={s.sectionInner}>
          <p style={s.sectionLabel}>// league guidelines</p>
          <h2 style={s.sectionTitle}>
            Gym Rules &amp;{' '}
            <span style={{ color: '#ff3c3c', textShadow: '2px 2px 0px #601010' }}>Arena</span>{' '}
            Specs
          </h2>
          <div style={s.featuresGrid}>
            {FEATURES.map(f => <FeatureCard key={f.title} {...f} />)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <div style={s.ctaSection}>
        <div style={s.ctaInner}>
          <h2 style={s.ctaH2}>Ready to <span style={{ color: '#ffcb05', textShadow: '2px 2px 0px #3b4cca' }}>Battle?</span></h2>
          <p style={{ color: '#a0aec0', marginBottom: '2.5rem', fontSize: 15, lineHeight: 1.8 }}>
            Create a trainer profile. Link your Codeforces handle. Queue up for matchmaking.
          </p>
          <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center' }}>
            <a href="/signup" style={s.btnPrimary}>
              Create Profile <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", marginLeft: '6px', fontSize: '12px', fontWeight: 'bold' }}>→</span>
            </a>
            <a href="/login"  style={s.btnGhost}>Sign In</a>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={s.footer}>
        <span style={{ fontSize: 12, color: '#718096' }}>
          © 2026 BATTLE_SPACE ·{' '}
          <a href="#" style={{ color: '#718096', textDecoration: 'none' }}>GitHub</a>
          {' · '}
          <a href="#" style={{ color: '#718096', textDecoration: 'none' }}>API</a>
        </span>
        <span style={{ fontSize: 12, color: '#4a5568' }}>Spring Boot · MongoDB · WebSockets · PokéAPI</span>
      </footer>
    </div>
  )
}

function StepCard({ num, title, desc }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      style={{ ...s.step, background: hov ? '#222633' : '#171923', borderColor: hov ? '#ffcb05' : '#2d3748' }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div style={{ ...s.stepNum, color: hov ? '#ffcb05' : '#4a5568', textShadow: hov ? '2px 2px 0px #3b4cca' : 'none' }}>{num}</div>
      <h3 style={s.stepTitle}>{title}</h3>
      <p style={s.stepDesc}>{desc}</p>
      <span style={{ ...s.stepArrow, color: hov ? '#ffcb05' : '#4a5568', transform: hov ? 'translate(3px,-3px)' : 'none' }}>↗</span>
    </div>
  )
}

function FeatureCard({ tag, title, desc }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      style={{ ...s.feature, background: hov ? '#222633' : '#171923', borderLeft: `4px solid ${hov ? '#ffcb05' : 'transparent'}`, borderColor: '#2d3748' }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <p style={{ ...s.featureTag, color: hov ? '#ffcb05' : '#ff3c3c' }}>{tag}</p>
      <h3 style={s.featureTitle}>{title}</h3>
      <p style={s.featureDesc}>{desc}</p>
    </div>
  )
}

/* ─── STYLES ─────────────────────────────────────────────────────────────── */
const s = {
  root: {
    background: '#0f1013',
    color: '#e2e8f0',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 14,
    lineHeight: 1.6,
    overflowX: 'hidden',
    minHeight: '100vh',
    position: 'relative',
  },
  accentBar: {
    height: '6px',
    background: 'linear-gradient(90deg, #ff3c3c 0%, #ff3c3c 50%, #ffcb05 50%, #ffcb05 100%)',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 110,
  },
  grid: {
    position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
    backgroundImage: 'linear-gradient(rgba(255,203,5,0.01) 1px,transparent 1px),linear-gradient(90deg,rgba(255,203,5,0.01) 1px,transparent 1px)',
    backgroundSize: '80px 80px',
  },
  nav: {
    position: 'fixed', top: 6, left: 0, right: 0,
    display: 'flex', alignItems: 'center', justifyEncoding: 'space-between',
    justifyContent: 'space-between',
    padding: '0 2rem', height: 56,
    borderBottom: '2px solid #2d3748',
    backdropFilter: 'blur(12px)',
    zIndex: 100, transition: 'all 0.3s ease',
  },
  logo: {
    fontFamily: "'Press Start 2P', cursive", fontSize: 12,
    color: '#fff', textDecoration: 'none',
    textShadow: '1.5px 1.5px 0px #3b4cca',
  },
  navLinks: { display: 'flex', alignItems: 'center', gap: '1.75rem' },
  navLink: {
    color: '#a0aec0', textDecoration: 'none', fontSize: 12,
    letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700,
    transition: 'color 0.2s',
  },
  btnPrimary: {
    display: 'inline-flex', alignItems: 'center',
    padding: '10px 18px',
    fontFamily: "'Press Start 2P', cursive", fontSize: 8,
    textDecoration: 'none',
    border: 'none', background: '#ffcb05', color: '#0f1013',
    borderRadius: '6px',
    boxShadow: '0 3px 0 #c59b00',
    transition: 'transform 0.1s ease',
  },
  btnGhost: {
    display: 'inline-flex', alignItems: 'center',
    padding: '8px 18px',
    fontFamily: "'Press Start 2P', cursive", fontSize: 8,
    textDecoration: 'none',
    border: '2px solid #ffcb05', background: 'transparent', color: '#ffcb05',
    borderRadius: '6px',
  },
  hero: {
    position: 'relative', minHeight: '100vh',
    display: 'flex', alignItems: 'center',
    padding: '80px 2rem 4rem', zIndex: 1,
  },
  heroInner: {
    maxWidth: 800, margin: '0 auto', width: '100%',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    textAlign: 'center',
  },
  heroSub: {
    fontSize: 16, color: '#a0aec0', lineHeight: 1.85,
    maxWidth: 580, margin: '0 auto 2.5rem', textAlign: 'center',
    fontWeight: 500,
  },
  heroCta: {
    display: 'flex', alignItems: 'center',
    justifyContent: 'center', gap: '1.25rem', flexWrap: 'wrap',
  },
  eyebrow: {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase',
    color: '#ff3c3c', marginBottom: '1.75rem',
    fontWeight: 700,
  },
  eyebrowDot: {
    width: 6, height: 6, background: '#ff3c3c', borderRadius: '50%',
    display: 'inline-block', flexShrink: 0,
    boxShadow: '0 0 8px #ff3c3c',
  },
  h1: {
    fontFamily: "'Press Start 2P', cursive",
    fontSize: 'clamp(22px, 5.5vw, 48px)', lineHeight: 1.5,
    marginBottom: '2rem',
  },
  section: {
    position: 'relative', zIndex: 1, padding: '6rem 2rem',
    borderTop: '2px solid #2d3748',
  },
  sectionInner: { maxWidth: 1140, margin: '0 auto' },
  sectionLabel: {
    fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase',
    color: '#ff3c3c', marginBottom: '0.75rem', fontWeight: 700,
  },
  sectionTitle: {
    fontFamily: "'Press Start 2P', cursive",
    fontSize: 'clamp(14px, 3vw, 24px)', lineHeight: 1.6,
    color: '#fff', marginBottom: '3.5rem',
  },
  stepsGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 16,
  },
  step: {
    padding: '2.5rem 2rem', position: 'relative', overflow: 'hidden',
    transition: 'all 0.25s ease',
    borderRadius: '12px',
    border: '3px solid #2d3748',
  },
  stepNum: {
    fontFamily: "'Press Start 2P', cursive",
    fontSize: 24, lineHeight: 1, marginBottom: '1.5rem',
    transition: 'all 0.25s ease',
  },
  stepTitle: {
    fontSize: 18, color: '#fff', marginBottom: '0.75rem',
    fontWeight: 800,
  },
  stepDesc: { fontSize: 14, color: '#a0aec0', lineHeight: 1.8 },
  stepArrow: {
    position: 'absolute', bottom: '1.25rem', right: '1.25rem',
    fontSize: 18, transition: 'all 0.2s',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  featuresGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 16,
  },
  feature: {
    padding: '2rem',
    transition: 'all 0.25s ease',
    borderRadius: '12px',
    border: '3px solid #2d3748',
  },
  featureTag: {
    fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase',
    marginBottom: '0.75rem', fontStyle: 'normal', fontWeight: 700,
  },
  featureTitle: {
    fontSize: 18, color: '#fff', marginBottom: '0.75rem',
    fontWeight: 800,
  },
  featureDesc: { fontSize: 14, color: '#a0aec0', lineHeight: 1.8 },
  ctaSection: {
    position: 'relative', zIndex: 1, padding: '6rem 2rem',
    borderTop: '2px solid #2d3748', background: '#171923',
  },
  ctaInner: { maxWidth: 700, margin: '0 auto', textAlign: 'center' },
  ctaH2: {
    fontFamily: "'Press Start 2P', cursive",
    fontSize: 'clamp(18px, 4vw, 28px)', lineHeight: 1.5,
    marginBottom: '1.5rem', color: '#fff',
  },
  footer: {
    position: 'relative', zIndex: 1, borderTop: '2px solid #2d3748',
    padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    gap: '1rem', flexWrap: 'wrap', background: '#0f1013',
  },
}