import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import { useToast } from '../lib/toast'
import PlanBuilder from './PlanBuilder'

export default function PlansPage({ plans, activePlanId, onActivate, onPlansChange }) {
  const { user } = useAuth()
  const toast = useToast()
  const [showBuilder, setShowBuilder] = useState(false)

  async function deletePlan(id) {
    if (!confirm('Plan wirklich löschen?')) return
    await supabase.from('plans').delete().eq('id', id)
    onPlansChange(plans.filter(p => p.id !== id))
    toast('Plan gelöscht')
  }

  if (showBuilder) return (
    <PlanBuilder
      onSave={plan => { onPlansChange([...plans, plan]); setShowBuilder(false) }}
      onCancel={() => setShowBuilder(false)}
    />
  )

  return (
    <div className="page">
      <div className="hero">
        <h1>Meine Pläne</h1>
        <p>Verwalte deine Trainingspläne</p>
      </div>

      <button className="btn btn-accent" style={{ marginBottom: 16 }} onClick={() => setShowBuilder(true)}>
        + Neuen Plan erstellen
      </button>

      {plans.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--muted)' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
          <p>Noch keine Pläne erstellt.</p>
        </div>
      )}

      {plans.map(plan => (
        <div key={plan.id} className="card" style={{ border: `1.5px solid ${plan.id === activePlanId ? 'var(--accent)' : 'var(--border)'}` }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700 }}>{plan.title}</div>
              {plan.description && <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{plan.description}</div>}
            </div>
            {plan.id === activePlanId && (
              <span style={{ fontSize: 11, background: 'var(--accent)', color: '#fff', padding: '3px 8px', borderRadius: 20, marginLeft: 8, flexShrink: 0 }}>Aktiv</span>
            )}
          </div>

          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
            {(plan.days || []).map(day => (
              <div key={day.id} style={{
                fontSize: 11, padding: '3px 10px', borderRadius: 20,
                background: day.color + '25', color: day.color, border: `1px solid ${day.color}55`
              }}>{day.name}</div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            {plan.id !== activePlanId && (
              <button className="btn btn-green btn-sm" onClick={() => onActivate(plan.id)}>Aktivieren</button>
            )}
            <button className="btn btn-danger btn-sm" onClick={() => deletePlan(plan.id)}>Löschen</button>
          </div>
        </div>
      ))}
    </div>
  )
}
