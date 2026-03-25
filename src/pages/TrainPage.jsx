import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import { useToast } from '../lib/toast'
import { EXERCISE_DB } from '../lib/exercises'
import TutorialModal from '../components/TutorialModal'

function SetRow({ set, onChange, onRemove, index }) {
  return (
    <tr>
      <td style={{ color: 'var(--muted)', fontSize: 13, fontWeight: 600, padding: '5px 4px', textAlign: 'center' }}>{index + 1}</td>
      <td style={{ padding: '5px 4px' }}>
        <input type="number" inputMode="decimal" placeholder="0" min="0" step="0.5" value={set.kg || ''}
          onChange={e => onChange({ ...set, kg: parseFloat(e.target.value) || 0 })}
          style={{ width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: 6, padding: '7px 4px', fontSize: 14, textAlign: 'center', marginBottom: 0 }} />
      </td>
      <td style={{ padding: '5px 4px' }}>
        <input type="number" inputMode="numeric" placeholder="0" min="0" step="1" value={set.reps || ''}
          onChange={e => onChange({ ...set, reps: parseInt(e.target.value) || 0 })}
          style={{ width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: 6, padding: '7px 4px', fontSize: 14, textAlign: 'center', marginBottom: 0 }} />
      </td>
      <td style={{ padding: '5px 4px', textAlign: 'center' }}>
        <button onClick={onRemove} style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: 16 }}>×</button>
      </td>
    </tr>
  )
}

function ExerciseBlock({ exercise, onTutorial }) {
  const [open, setOpen] = useState(false)
  const [sets, setSets] = useState([{ kg: 0, reps: 0 }, { kg: 0, reps: 0 }, { kg: 0, reps: 0 }])
  const [note, setNote] = useState('')

  const exData = EXERCISE_DB.find(e => e.id === exercise.id) || { name: exercise.name || exercise.id, muscle: '' }
  const filledSets = sets.filter(s => s.kg > 0 || s.reps > 0)

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div onClick={() => setOpen(!open)} style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>{exData.name}</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{exData.muscle}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <button
            onClick={e => { e.stopPropagation(); onTutorial(exData) }}
            style={{ fontSize: 11, color: 'var(--gold)', background: 'none', border: '1px solid var(--gold)', borderRadius: 20, padding: '3px 9px', cursor: 'pointer' }}>
            Tutorial
          </button>
          <div style={{
            fontSize: 11, background: filledSets.length > 0 ? 'rgba(39,174,96,0.15)' : 'var(--bg3)',
            color: filledSets.length > 0 ? 'var(--green)' : 'var(--muted)',
            padding: '3px 8px', borderRadius: 20, whiteSpace: 'nowrap'
          }}>
            {filledSets.length > 0 ? `${filledSets.length}/${sets.length} Sätze` : 'Eintragen'}
          </div>
        </div>
      </div>

      {open && (
        <div style={{ padding: '0 14px 14px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 8 }}>
            <thead>
              <tr>
                {['#', 'kg', 'Wdh', ''].map(h => (
                  <th key={h} style={{ fontSize: 11, color: 'var(--muted)', textAlign: 'center', padding: '4px 4px', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sets.map((set, i) => (
                <SetRow key={i} index={i} set={set}
                  onChange={updated => { const n = [...sets]; n[i] = updated; setSets(n) }}
                  onRemove={() => setSets(sets.filter((_, idx) => idx !== i))}
                />
              ))}
            </tbody>
          </table>
          <button onClick={() => setSets([...sets, { kg: 0, reps: 0 }])}
            style={{ fontSize: 12, color: 'var(--blue)', background: 'none', border: '1px dashed var(--blue)', borderRadius: 6, padding: '6px 12px', cursor: 'pointer', width: '100%', marginTop: 4 }}>
            + Satz hinzufügen
          </button>
          <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Notiz (optional)..."
            style={{ width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: 8, padding: '9px 12px', fontSize: 13, resize: 'none', marginTop: 8, height: 56, marginBottom: 0 }} />
        </div>
      )}
    </div>
  )
}

export default function TrainPage({ plans, activePlanId, onChangePlan }) {
  const { user } = useAuth()
  const toast = useToast()
  const [selectedDay, setSelectedDay] = useState(null)
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [saving, setSaving] = useState(false)
  const [tutorialEx, setTutorialEx] = useState(null)
  const [exerciseRefs, setExerciseRefs] = useState({})

  const activePlan = plans.find(p => p.id === activePlanId) || plans[0]

  function collectData() {
    const data = {}
    Object.entries(exerciseRefs).forEach(([exId, ref]) => {
      if (ref) data[exId] = ref
    })
    return data
  }

  async function saveSession() {
    if (!selectedDay || !activePlan) return
    setSaving(true)

    const exercisesData = selectedDay.exercises.map(exId => {
      const exData = EXERCISE_DB.find(e => e.id === exId)
      return { id: exId, name: exData?.name || exId, sets: [], note: '' }
    })

    const { error } = await supabase.from('sessions').insert({
      user_id: user.id,
      plan_id: activePlan.id,
      date,
      day_id: selectedDay.id,
      day_name: selectedDay.name,
      exercises: exercisesData
    })

    setSaving(false)
    if (error) return toast('Fehler beim Speichern')
    toast('Session gespeichert!')
    setSelectedDay(null)
  }

  if (!activePlan) return (
    <div className="page">
      <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
        <p>Noch kein Trainingsplan vorhanden.</p>
        <p style={{ fontSize: 13, marginTop: 8 }}>Erstelle einen Plan im Plan-Tab.</p>
      </div>
    </div>
  )

  return (
    <div className="page">
      <div className="hero">
        <h1>Anime Build Tracker</h1>
        <p style={{ marginTop: 4 }}>{activePlan.title}</p>
        {plans.length > 1 && (
          <select value={activePlanId} onChange={e => onChangePlan(e.target.value)}
            style={{ marginTop: 10, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', borderRadius: 8, padding: '6px 10px', fontSize: 12, width: '100%', marginBottom: 0 }}>
            {plans.map(p => <option key={p.id} value={p.id} style={{ background: 'var(--card)' }}>{p.title}</option>)}
          </select>
        )}
      </div>

      <div className="section-header">Welcher Tag?</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
        {activePlan.days.map(day => (
          <div key={day.id} onClick={() => setSelectedDay(selectedDay?.id === day.id ? null : day)}
            style={{
              background: selectedDay?.id === day.id ? 'var(--card2)' : 'var(--card)',
              border: `1.5px solid ${selectedDay?.id === day.id ? day.color : 'var(--border)'}`,
              borderRadius: 'var(--radius)', padding: '12px 10px', cursor: 'pointer'
            }}>
            <div style={{ fontSize: 13, fontWeight: 700 }}>
              <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: day.color, marginRight: 6 }} />
              {day.label} – {day.name}
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 3, lineHeight: 1.4 }}>{day.focus}</div>
          </div>
        ))}
      </div>

      {selectedDay && (
        <>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ marginBottom: 16 }} />
          <div className="section-header">Übungen — {selectedDay.name}</div>
          {selectedDay.exercises.map(exId => {
            const exData = EXERCISE_DB.find(e => e.id === exId) || { id: exId, name: exId, muscle: '' }
            return <ExerciseBlock key={exId} exercise={exData} onTutorial={setTutorialEx} />
          })}
          <button className="btn btn-accent" style={{ marginTop: 8 }} onClick={saveSession} disabled={saving}>
            {saving ? 'Wird gespeichert...' : 'Session speichern'}
          </button>
        </>
      )}

      <TutorialModal exercise={tutorialEx} onClose={() => setTutorialEx(null)} />
    </div>
  )
}
