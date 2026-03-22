import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import { EXERCISE_DB } from '../lib/exercises'
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

function StatCard({ val, label, color }) {
  return (
    <div style={{ background: 'var(--card)', borderRadius: 'var(--radius)', padding: 14, textAlign: 'center' }}>
      <div style={{ fontSize: 26, fontWeight: 700, color: color || 'var(--gold)' }}>{val}</div>
      <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>{label}</div>
    </div>
  )
}

function LineChart({ labels, data, color, yLabel }) {
  const ref = useRef(null)
  const chartRef = useRef(null)
  useEffect(() => {
    if (!ref.current) return
    if (chartRef.current) chartRef.current.destroy()
    chartRef.current = new Chart(ref.current, {
      type: 'line',
      data: {
        labels,
        datasets: [{ data, borderColor: color, backgroundColor: color + '20', tension: 0.3, fill: true, pointRadius: 5, pointBackgroundColor: color }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: '#8a8fa8', font: { size: 11 }, maxRotation: 45 }, grid: { color: '#2a2f50' } },
          y: { ticks: { color: '#8a8fa8', font: { size: 11 } }, grid: { color: '#2a2f50' }, title: { display: !!yLabel, text: yLabel, color: '#8a8fa8' } }
        }
      }
    })
    return () => chartRef.current?.destroy()
  }, [labels, data, color, yLabel])
  return <canvas ref={ref} height={180} />
}

function BarChart({ labels, data, colors }) {
  const ref = useRef(null)
  const chartRef = useRef(null)
  useEffect(() => {
    if (!ref.current) return
    if (chartRef.current) chartRef.current.destroy()
    chartRef.current = new Chart(ref.current, {
      type: 'bar',
      data: {
        labels,
        datasets: [{ data, backgroundColor: colors, borderColor: colors, borderWidth: 1, borderRadius: 4 }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: '#8a8fa8', font: { size: 11 } }, grid: { color: '#2a2f50' } },
          y: { ticks: { color: '#8a8fa8', font: { size: 11 }, stepSize: 1 }, grid: { color: '#2a2f50' } }
        }
      }
    })
    return () => chartRef.current?.destroy()
  }, [labels, data, colors])
  return <canvas ref={ref} height={180} />
}

function fmt(d) {
  const [y, m, day] = d.split('-')
  return `${day}.${m}.${y.slice(2)}`
}

export default function AnalysePage({ plans }) {
  const { user } = useAuth()
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedEx, setSelectedEx] = useState('')

  useEffect(() => {
    supabase.from('sessions').select('*').eq('user_id', user.id).order('date', { ascending: true })
      .then(({ data }) => { setSessions(data || []); setLoading(false) })
  }, [user.id])

  const now = new Date()
  const thisMonth = sessions.filter(s => s.date?.startsWith(new Date().toISOString().slice(0, 7))).length
  const last7 = new Set(sessions.filter(s => (now - new Date(s.date)) / 86400000 <= 7).map(s => s.date)).size
  const totalSets = sessions.reduce((a, s) => a + (s.exercises?.reduce((b, e) => b + (e.sets?.length || 0), 0) || 0), 0)

  const allExIds = [...new Set(sessions.flatMap(s => s.exercises?.map(e => e.id) || []))]
  const exOptions = allExIds.map(id => EXERCISE_DB.find(e => e.id === id) || { id, name: id })

  const exPoints = sessions.map(s => {
    const ex = s.exercises?.find(e => e.id === selectedEx)
    if (!ex) return null
    const validSets = (ex.sets || []).filter(s => s.kg > 0 || s.reps > 0)
    if (validSets.length === 0) return null
    const maxKg = Math.max(...validSets.map(s => s.kg))
    const totalReps = validSets.reduce((a, s) => a + s.reps, 0)
    return { date: s.date, maxKg, totalReps }
  }).filter(Boolean)

  const dayCounts = {}
  sessions.forEach(s => { dayCounts[s.day_name] = (dayCounts[s.day_name] || 0) + 1 })

  const planColors = {}
  plans.forEach(p => p.days?.forEach(d => { planColors[d.name] = d.color }))

  if (loading) return <div className="page"><div className="spinner" /></div>

  return (
    <div className="page">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
        <StatCard val={sessions.length} label="Sessions gesamt" />
        <StatCard val={thisMonth} label="Diesen Monat" color="var(--blue)" />
        <StatCard val={totalSets} label="Sätze gesamt" color="var(--purple)" />
        <StatCard val={last7} label="Tage letzte Woche" color="var(--green)" />
      </div>

      {exOptions.length > 0 && (
        <>
          <div className="section-header">Übung analysieren</div>
          <select value={selectedEx} onChange={e => setSelectedEx(e.target.value)} style={{ marginBottom: 14 }}>
            <option value="">Übung auswählen...</option>
            {exOptions.map(ex => <option key={ex.id} value={ex.id}>{ex.name}</option>)}
          </select>

          {selectedEx && exPoints.length > 0 && (
            <>
              <div style={{ background: 'var(--card)', borderRadius: 'var(--radius)', padding: 16, marginBottom: 12 }}>
                <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 10, fontWeight: 600 }}>Max. Gewicht pro Session</div>
                <LineChart labels={exPoints.map(p => fmt(p.date))} data={exPoints.map(p => p.maxKg)} color="#e94560" yLabel="kg" />
              </div>
              <div style={{ background: 'var(--card)', borderRadius: 'var(--radius)', padding: 16, marginBottom: 12 }}>
                <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 10, fontWeight: 600 }}>Wiederholungen gesamt</div>
                <LineChart labels={exPoints.map(p => fmt(p.date))} data={exPoints.map(p => p.totalReps)} color="#f5a623" />
              </div>
            </>
          )}

          {selectedEx && exPoints.length === 0 && (
            <p style={{ color: 'var(--muted)', fontSize: 13, textAlign: 'center', padding: 20 }}>Noch keine Daten für diese Übung.</p>
          )}
        </>
      )}

      {Object.keys(dayCounts).length > 0 && (
        <div style={{ background: 'var(--card)', borderRadius: 'var(--radius)', padding: 16, marginBottom: 12 }}>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 10, fontWeight: 600 }}>Sessions pro Tag</div>
          <BarChart
            labels={Object.keys(dayCounts)}
            data={Object.values(dayCounts)}
            colors={Object.keys(dayCounts).map(name => (planColors[name] || '#3d7ebf') + 'bb')}
          />
        </div>
      )}

      {sessions.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--muted)' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📊</div>
          <p>Noch keine Sessions gespeichert.</p>
        </div>
      )}
    </div>
  )
}
