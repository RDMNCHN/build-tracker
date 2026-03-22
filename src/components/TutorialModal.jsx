import { useEffect, useRef } from 'react'
import { getVideoUrl } from '../lib/exercises'

const TIPS = {
  incline_press: ['Bank auf 30–45° — höher trifft mehr Schultern','Ellbogen ca. 45° nach außen, nicht zu weit raus','Explosiv drücken, langsam runter (2–3 Sek)','Obere Brust spüren, nicht die Schultern arbeiten lassen'],
  bench_press: ['Schulterblätter zusammendrücken und in die Bank','Füße fest auf Boden, leichter natürlicher Bogen','Stange zur unteren Brust, Ellbogen 45–75°','Explosiv drücken, kontrolliert runter'],
  lat_pulldown: ['Breit greifen, Brust raus, leicht zurücklehnen','Ellbogen nach unten/hinten führen — nicht Hände','Oben kontrolliert strecken, nicht reißen','Schulterblätter aktiv runterdrücken beim Ziehen'],
  lat_neutral: ['Neutraler Griff (Handflächen zueinander)','Ellbogen nach unten/hinten führen','Untere Lats stärker aktiviert','Brust nach oben strecken beim Runterziehen'],
  cable_row: ['Aufrecht sitzen, Brust raus, kein Rundrücken','Mit Ellbogen ziehen, nicht mit Händen','Schulterblätter fest zusammendrücken am Ende','Langsam nach vorne für volle Dehnung'],
  chest_supported_row: ['Brust liegt auf der Bank — kein Schwingen möglich','Ellbogen nach oben/hinten führen','Schulterblätter zusammendrücken','Volle Bewegung: runter dehnen, oben anspannen'],
  shoulder_press_db: ['Hanteln auf Ohrhöhe, Ellbogen 90°','Gerade nach oben drücken','Nicht ganz durchstrecken — Spannung halten','Langsam und kontrolliert runter'],
  shoulder_press_bb: ['Stange vor dem Kopf — nicht dahinter (Nacken schonen)','Kern anspannen, Rücken nicht überstrecken','Gerade nach oben drücken','Kontrolliert runter bis Kinnhöhe'],
  lateral_raise: ['Leichtes Gewicht — Form schlägt Gewicht','Arme leicht gebeugt, seitlich nach außen','Pinkiefinger leicht nach oben (wie einschenken)','Nur bis Schulterniveau — nicht höher'],
  lateral_raise_cable: ['Kabel tiefste Position','Arm leicht gebeugt, lateral nach oben','Konstante Spannung durch Kabel','Langsam runter'],
  rear_delt: ['Leichtes Gewicht — hintere Schulter oft schwach','Arme leicht gebeugt, nach außen/hinten','Schulterblätter zusammendrücken','Wichtig für Gesundheit und breite Optik'],
  face_pull: ['Kabel auf Augenhöhe','Seil auseinander zur Stirn ziehen','Ellbogen hoch halten','Externe Rotation der Schulter trainieren'],
  bicep_curl: ['Ellbogen bleiben am Körper','Langsam runter (2–3 Sek Exzentrik)','Oben kurz anspannen und leicht drehen','Kein Schwung mit dem Rücken'],
  hammer_curl: ['Daumen zeigt nach oben (neutraler Griff)','Trainiert Brachialis — macht Arm voller','Ellbogen fixiert, kein Schwingen','Langsam runter für volle Dehnung'],
  tricep_pushdown: ['Ellbogen fest an den Seiten — bewegen sich nicht','Nur Unterarm bewegt sich','Unten Trizeps fest anspannen','Langsam kontrolliert zurück'],
  overhead_tri: ['Langen Trizepskopf — macht Arm groß','Ellbogen zeigen nach oben, nicht wandern lassen','Nur Unterarm bewegt sich','Langsam runter, explosiv strecken'],
  squat: ['Füße schulterbreit, Zehen leicht nach außen','Knie in Richtung Zehen (nicht einbrechen)','Tief runter — Oberschenkel parallel zum Boden','Durch Fersen drücken, Kern angespannt'],
  leg_press: ['Füße schulterbreit, mittig auf Platte','Knie nicht vollständig durchstrecken','90° Winkel am tiefsten Punkt','Langsam runter (3 Sek), explosiv drücken'],
  hack_squat: ['Füße schulterbreit oder enger für Quad-Fokus','Tief runter — unter 90° für maximalen Reiz','Rücken flach an Polsterung','Durch Fersen drücken, Knie nicht einbrechen'],
  leg_extension: ['Aufrecht sitzen, Rücken an Polster','Langsam nach oben, oben kurz anspannen','Sehr langsam runter — Exzentrik macht Unterschied','Kein Schwung — saubere Kontrolle'],
  bulgarian: ['Hinterer Fuß auf Bank, vorderer weit vorne','Senkrecht nach unten sinken','Knie bleibt über dem Fuß','Hintere Hüfte dehnen — das ist das Ziel'],
  rdl: ['Leichte Kniebeugung — keine steifen Beine','Hüfte nach hinten schieben, nicht beugen','Rücken gerade die ganze Zeit','Bis Hamstrings spüren, dann Hüfte nach vorne'],
  leg_curl: ['Hüften fest auf Polsterung','Fersen Richtung Gesäß ziehen','Oben anspannen, kurz halten','Langsam strecken — nicht fallen lassen'],
  hip_thrust: ['Schulterblätter auf Bank, Füße flach','Hüfte explosiv nach oben','Oben Gesäß maximal anspannen, halten','Knie nach außen — nicht einbrechen'],
  glute_bridge: ['Auf dem Boden, Füße hüftbreit','Hüfte nach oben drücken','Oben Gesäß fest anspannen','Langsam runter'],
  calf_raise_machine: ['Volle Bewegung: ganz unten dehnen, oben anspannen','Langsam und bewusst — kein Hüpfen','Oben 1–2 Sek halten','Hohes Volumen (15–20 Wdh) gut für Waden'],
  calf_raise_standing: ['Auf einer Stufe stehen für volle Range','Ganz unten dehnen, ganz oben anspannen','Langsam und kontrolliert','Gewicht auf Fußballen, nicht Zehen'],
  plank: ['Körper gerade Linie — Hüfte nicht heben/senken','Bauch aktiv anspannen','Schultern über Ellbogen','Ruhig atmen — gleichmäßig'],
  hanging_leg_raise: ['Fest hängen, kein Schwingen','Knie oder Beine zur Brust','Unten kontrolliert strecken','Für mehr: Beine gestreckt halten'],
  cable_crunch: ['Kniend, Seil hinter Kopf','Bauch zusammenrollen — Hüfte bleibt still','Unten anspannen','Langsam zurück'],
  ab_wheel: ['Knie auf Boden starten','Langsam nach vorne — Bauch kontrolliert dehnen','Rücken nicht durchhängen','Zurück durch Bauch anspannen'],
  pullups: ['Schulterbreiter oder weiter Griff','Brust zur Stange, nicht Kinn','Schulterblätter aktiv runterziehen','Langsam runter für volle Dehnung'],
  deadlift: ['Füße hüftbreit, Stange über Mittelfuß','Hüfte runter, Brust raus, Rücken gerade','Mit Beinen drücken und Hüfte strecken','Kontrolliert runter — nicht fallen lassen'],
}

const DEFAULT_TIPS = ['Saubere Form vor Gewicht', 'Ziel-Muskel bewusst spüren', 'Kontrollierte Bewegung', '1–2 Wdh im Tank lassen']

export default function TutorialModal({ exercise, onClose }) {
  const videoRef = useRef(null)

  useEffect(() => {
    if (exercise && videoRef.current) {
      videoRef.current.load()
      videoRef.current.play().catch(() => {})
    }
  }, [exercise])

  if (!exercise) return null

  const tips = TIPS[exercise.id] || DEFAULT_TIPS
  const videoUrl = exercise.video ? getVideoUrl(exercise.video) : null

  return (
    <div className="modal-overlay open" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-sheet">
        <div className="modal-handle" />
        <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 2 }}>{exercise.name}</div>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 14 }}>{exercise.muscle}</div>

        {videoUrl && (
          <video
            ref={videoRef}
            autoPlay loop muted playsInline
            style={{ width: '100%', maxWidth: 340, display: 'block', margin: '0 auto 16px', borderRadius: 'var(--radius)', background: 'var(--bg3)', minHeight: 180 }}
            onError={e => e.target.style.display = 'none'}
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        )}

        <ul style={{ listStyle: 'none' }}>
          {tips.map((tip, i) => (
            <li key={i} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--bg3)', fontSize: 13, lineHeight: 1.6 }}>
              <div style={{
                background: 'var(--accent)', color: '#fff', fontSize: 11, fontWeight: 700,
                minWidth: 22, height: 22, borderRadius: '50%', display: 'flex',
                alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1
              }}>{i + 1}</div>
              <span>{tip}</span>
            </li>
          ))}
        </ul>

        <button className="btn btn-card" style={{ marginTop: 16 }} onClick={onClose}>Schließen</button>
      </div>
    </div>
  )
}
