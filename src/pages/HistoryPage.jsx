import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import { useToast } from '../lib/toast'

function fmt(d) {
  if (!d) return ''
  const [y, m, day] = d.split('-')
  return `${day}.${m}.${y}`
}

export default function HistoryPage({ plans }) {
  const { user } = useAuth()
  const toast = useToast()
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(null)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    const { data } = await supabase.from('sessions').select('*').eq('user_id', user.id).order('date', { ascending: false })
    setSessions(data || [])
    setLoading(false)
  }

  async function deleteSession(id) {
    if (!confirm('Session wirklich löschen?')) return
    await supabase.from('sessions').delete().eq('id', id)
    setSessions(prev => prev.filter(s => s.id !== id))
    toast('Session gelöscht')
  }

  const planColors = {}
  plans.forEach(p => p.days?.forEach(d => { planColors[d.id] = d.color }))

  if (loading) return <div className="page"><div className="spinner" /></div>

  return (
    <div className="page">
      <div className="section-header">Gespeicherte Sessions ({sessions.length})</div>

      {sessions.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--muted)' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
          <p>Noch keine Sessions gespeichert.</p>
        </div>
      )}

      {sessions.map(session => {
        const color = planColors[session.day_id] || '#888'
        const isOpen = open === session.id
        return (
          <div key={session.id} style={{ background: 'var(--card)', borderRadius: 'var(--radius)', marginBottom: 10, overflow: 'hidden', border: '1px solid var(--border)' }}>
            <div onClick={() => setOpen(isOpen ? null : session.id)}
              style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{fmt(session.date)}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                  <span style={{ color, fontWeight: 700 }}>{session.day_name}</span>
                  {session.plan_id && plans.find(p => p.id === session.plan_id) &&
                    <span> · {plans.find(p => p.id === session.plan_id).title}</span>}
                </div>
              </div>
              <span style={{ color: 'var(--muted)', fontSize: 20 }}>{isOpen ? '∨' : '›'}</span>
            </div>

            {isOpen && (
              <div style={{ padding: '0 14px 14px' }}>
                {(session.exercises || []).map(ex => {
                  const validSets = (ex.sets || []).filter(s => s.kg > 0 || s.reps > 0)
                  if (validSets.length === 0) return null
                  const maxKg = Math.max(...validSets.map(s => s.kg))
                  const totalReps = validSets.reduce((a, s) => a + s.reps, 0)
                  return (
                    <div key={ex.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid var(--bg3)', fontSize: 13 }}>
                      <span>{ex.name}</span>
                      <span style={{ color: 'var(--muted)', fontSize: 12 }}>
                        {validSets.length}x · {maxKg > 0 ? maxKg + 'kg' : '–'} · {totalReps} Wdh
                      </span>
                    </div>
                  )
                })}
                <button className="btn btn-danger btn-sm" style={{ marginTop: 12 }} onClick={() => deleteSession(session.id)}>
                  Session löschen
                </button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
