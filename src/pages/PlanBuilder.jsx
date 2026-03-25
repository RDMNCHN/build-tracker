import { useState, useMemo } from 'react'
import { EXERCISE_DB, MUSCLE_GROUPS } from '../lib/exercises'
import { useToast } from '../lib/toast'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'

const COLORS = ['#e94560','#f5a623','#9b59b6','#27ae60','#3d7ebf','#e67e22','#1abc9c','#e91e8c']

function ExercisePicker({ selected, onChange }) {
  const [search, setSearch] = useState('')
  const [muscle, setMuscle] = useState('Alle')

  const filtered = useMemo(() => EXERCISE_DB.filter(ex => {
    const matchMuscle = muscle === 'Alle' || ex.muscle === muscle
    const matchSearch = ex.name.toLowerCase().includes(search.toLowerCase())
    return matchMuscle && matchSearch
  }), [search, muscle])

  return (
    <div>
      <input
        type="text" placeholder="Übung suchen..." value={search}
        onChange={e => setSearch(e.target.value)} style={{ marginBottom: 8 }}
      />
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 8, marginBottom: 10 }}>
        {['Alle', ...MUSCLE_GROUPS].map(m => (
          <button key={m} onClick={() => setMuscle(m)} style={{
            whiteSpace: 'nowrap', padding: '5px 12px', borderRadius: 20, border: '1px solid var(--border)',
            background: muscle === m ? 'var(--accent)' : 'var(--card)', color: muscle === m ? '#fff' : 'var(--muted)',
            fontSize: 12, cursor: 'pointer', flexShrink: 0
          }}>{m}</button>
        ))}
      </div>
      <div style={{ maxHeight: 280, overflowY: 'auto' }}>
        {filtered.map(ex => {
          const isSelected = selected.includes(ex.id)
          return (
            <div key={ex.id} onClick={() => onChange(isSelected ? selected.filter(id => id !== ex.id) : [...selected, ex.id])}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 12px', borderRadius: 8, marginBottom: 4,
                background: isSelected ? 'var(--card2)' : 'var(--bg3)',
                border: `1px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`,
                cursor: 'pointer'
              }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{ex.name}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>{ex.muscle}</div>
              </div>
              <div style={{
                width: 22, height: 22, borderRadius: '50%',
                background: isSelected ? 'var(--accent)' : 'var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, color: '#fff', flexShrink: 0
              }}>{isSelected ? '✓' : '+'}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function DayEditor({ day, index, onChange, onRemove }) {
  const [showPicker, setShowPicker] = useState(false)

  const exercises = day.exercises.map(id => EXERCISE_DB.find(e => e.id === id)).filter(Boolean)

  return (
    <div className="card" style={{ border: `1.5px solid ${day.color}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <div style={{ width: 12, height: 12, borderRadius: '50%', background: day.color, flexShrink: 0 }} />
        <input
          type="text" value={day.name} onChange={e => onChange({ ...day, name: e.target.value })}
          placeholder="Tag Name (z.B. Upper A)" style={{ flex: 1, marginBottom: 0, fontSize: 13, padding: '7px 10px' }}
        />
        <button onClick={onRemove} style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: 18, padding: '0 4px' }}>×</button>
      </div>

      <input
        type="text" value={day.focus} onChange={e => onChange({ ...day, focus: e.target.value })}
        placeholder="Fokus (z.B. Brust · Rücken)" style={{ marginBottom: 8, fontSize: 12, padding: '7px 10px' }}
      />

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 8 }}>
        {exercises.map(ex => (
          <div key={ex.id} style={{
            background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 20,
            padding: '3px 10px', fontSize: 11, display: 'flex', alignItems: 'center', gap: 5
          }}>
            {ex.name}
            <span onClick={() => onChange({ ...day, exercises: day.exercises.filter(id => id !== ex.id) })}
              style={{ cursor: 'pointer', color: 'var(--muted)' }}>×</span>
          </div>
        ))}
      </div>

      <button className="btn btn-card btn-sm" onClick={() => setShowPicker(!showPicker)}>
        {showPicker ? 'Fertig' : `+ Übungen (${exercises.length})`}
      </button>

      {showPicker && (
        <div style={{ marginTop: 12 }}>
          <ExercisePicker selected={day.exercises} onChange={exercises => onChange({ ...day, exercises })} />
        </div>
      )}
    </div>
  )
}

export default function PlanBuilder({ onSave, onCancel }) {
  const { user } = useAuth()
  const toast = useToast()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [days, setDays] = useState([
    { id: Date.now(), name: '', focus: '', color: COLORS[0], exercises: [] }
  ])
  const [saving, setSaving] = useState(false)

  function addDay() {
    if (days.length >= 7) return toast('Max. 7 Trainingstage')
    setDays([...days, { id: Date.now(), name: '', focus: '', color: COLORS[days.length % COLORS.length], exercises: [] }])
  }

  function updateDay(idx, updated) {
    const next = [...days]
    next[idx] = updated
    setDays(next)
  }

  async function handleSave() {
    if (!title.trim()) return toast('Fehler: Plan braucht einen Namen')
    if (days.length === 0) return toast('Fehler: Mindestens 1 Tag nötig')
    if (days.some(d => d.exercises.length === 0)) return toast('Fehler: Jeder Tag braucht mindestens eine Übung')

    setSaving(true)
    const plan = {
      user_id: user.id,
      title: title.trim(),
      description: description.trim(),
      days: days.map((d, i) => ({
        id: `day_${i}`, label: `Tag ${i + 1}`, name: d.name || `Tag ${i + 1}`,
        focus: d.focus, color: d.color, exercises: d.exercises
      }))
    }

    const { data, error } = await supabase.from('plans').insert(plan).select().single()
    setSaving(false)
    if (error) return toast('Fehler beim Speichern')
    toast('Plan gespeichert!')
    onSave(data)
  }

  return (
    <div className="page">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button onClick={onCancel} style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: 22, padding: 0 }}>←</button>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>Neuer Trainingsplan</h2>
      </div>

      <div className="section-header">Plan Details</div>
      <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Plan Name (z.B. Push Pull Legs)" />
      <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="Beschreibung (optional)" />

      <div className="section-header" style={{ marginTop: 8 }}>Trainingstage</div>

      {days.map((day, idx) => (
        <DayEditor
          key={day.id} day={day} index={idx}
          onChange={updated => updateDay(idx, updated)}
          onRemove={() => setDays(days.filter((_, i) => i !== idx))}
        />
      ))}

      <button className="btn btn-card" style={{ marginBottom: 10, borderStyle: 'dashed' }} onClick={addDay}>
        + Tag hinzufügen
      </button>

      <button className="btn btn-accent" onClick={handleSave} disabled={saving}>
        {saving ? 'Wird gespeichert...' : 'Plan speichern'}
      </button>
    </div>
  )
}
