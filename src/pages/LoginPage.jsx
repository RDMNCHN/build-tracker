import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useToast } from '../lib/toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignup, setIsSignup] = useState(false)
  const [loading, setLoading] = useState(false)
  const toast = useToast()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    if (isSignup) {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) toast('Fehler: ' + error.message)
      else toast('Account erstellt! Bitte E-Mail bestätigen.')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) toast('Fehler: Falsche E-Mail oder Passwort')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🔥</div>
          <h1 style={{ fontSize: 24, fontWeight: 700 }}>Anime Build</h1>
          <p style={{ color: 'var(--muted)', marginTop: 6, fontSize: 13 }}>Trainings-Tracker</p>
        </div>

        <form onSubmit={handleSubmit}>
          <label style={{ fontSize: 12, color: 'var(--muted)', display: 'block', marginBottom: 4 }}>E-Mail</label>
          <input
            type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="deine@email.de" required
          />
          <label style={{ fontSize: 12, color: 'var(--muted)', display: 'block', marginBottom: 4 }}>Passwort</label>
          <input
            type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="••••••••" required minLength={6}
          />
          <button type="submit" className="btn btn-accent" style={{ marginTop: 8 }} disabled={loading}>
            {loading ? '...' : isSignup ? 'Account erstellen' : 'Einloggen'}
          </button>
        </form>

        <button
          onClick={() => setIsSignup(!isSignup)}
          style={{ width: '100%', marginTop: 14, background: 'none', border: 'none', color: 'var(--muted)', fontSize: 13, cursor: 'pointer', padding: 8 }}
        >
          {isSignup ? 'Schon einen Account? Einloggen' : 'Noch kein Account? Registrieren'}
        </button>
      </div>
    </div>
  )
}
