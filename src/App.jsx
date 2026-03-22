import { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './lib/auth'
import { ToastProvider } from './lib/toast'
import { supabase } from './lib/supabase'
import { DEFAULT_PLAN } from './lib/exercises'
import LoginPage from './pages/LoginPage'
import TrainPage from './pages/TrainPage'
import AnalysePage from './pages/AnalysePage'
import HistoryPage from './pages/HistoryPage'
import PlansPage from './pages/PlansPage'

const TABS = [
  { id: 'train', label: 'Training', icon: '💪' },
  { id: 'analyse', label: 'Analyse', icon: '📊' },
  { id: 'history', label: 'Verlauf', icon: '📋' },
  { id: 'plans', label: 'Pläne', icon: '⚙️' },
]

function AppInner() {
  const { user, loading } = useAuth()
  const [tab, setTab] = useState('train')
  const [plans, setPlans] = useState([])
  const [activePlanId, setActivePlanId] = useState(null)
  const [plansLoading, setPlansLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    loadPlans()
  }, [user])

  async function loadPlans() {
    const { data } = await supabase.from('plans').select('*').eq('user_id', user.id).order('created_at', { ascending: true })
    if (data && data.length > 0) {
      setPlans(data)
      const saved = localStorage.getItem('activePlanId_' + user.id)
      setActivePlanId(saved && data.find(p => p.id === saved) ? saved : data[0].id)
    } else {
      const defaultPlan = { user_id: user.id, title: DEFAULT_PLAN.title, description: DEFAULT_PLAN.description, days: DEFAULT_PLAN.days }
      const { data: created } = await supabase.from('plans').insert(defaultPlan).select().single()
      if (created) { setPlans([created]); setActivePlanId(created.id) }
    }
    setPlansLoading(false)
  }

  function handleActivate(planId) {
    setActivePlanId(planId)
    localStorage.setItem('activePlanId_' + user.id, planId)
  }

  if (loading || plansLoading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner" />
    </div>
  )

  if (!user) return <LoginPage />

  return (
    <div>
      {tab === 'train' && <TrainPage plans={plans} activePlanId={activePlanId} onChangePlan={handleActivate} />}
      {tab === 'analyse' && <AnalysePage plans={plans} />}
      {tab === 'history' && <HistoryPage plans={plans} />}
      {tab === 'plans' && (
        <PlansPage
          plans={plans} activePlanId={activePlanId}
          onActivate={handleActivate}
          onPlansChange={setPlans}
        />
      )}

      <nav className="tab-bar">
        {TABS.map(t => (
          <button key={t.id} className={`tab-btn ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            <span className="tab-icon">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </nav>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppInner />
      </ToastProvider>
    </AuthProvider>
  )
}
