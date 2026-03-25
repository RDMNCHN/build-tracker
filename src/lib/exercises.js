export const MUSCLE_GROUPS = [
  'Brust', 'Rücken', 'Schultern', 'Bizeps', 'Trizeps',
  'Quads', 'Hamstrings', 'Glutes', 'Waden', 'Core'
]

export const EXERCISE_DB = [
  { id: 'incline_press', name: 'Schrägbankdrücken', muscle: 'Brust', video: 'male-barbell-incline-bench-press-front' },
  { id: 'bench_press', name: 'Flachbankdrücken', muscle: 'Brust', video: 'male-barbell-bench-press-front' },
  { id: 'decline_press', name: 'Schrägbankdrücken (negativ)', muscle: 'Brust', video: 'male-barbell-decline-bench-press-front' },
  { id: 'dumbbell_press', name: 'Kurzhantel Bankdrücken', muscle: 'Brust', video: 'male-dumbbell-bench-press-front' },
  { id: 'cable_fly', name: 'Kabel Fly', muscle: 'Brust', video: 'male-cable-chest-fly-front' },
  { id: 'pec_deck', name: 'Pec Deck / Butterfly', muscle: 'Brust', video: 'male-machine-fly-front' },
  { id: 'pushups', name: 'Liegestütze', muscle: 'Brust', video: 'male-push-up-front' },
  { id: 'dips_chest', name: 'Dips (Brust)', muscle: 'Brust', video: 'male-dip-front' },

  { id: 'lat_pulldown', name: 'Latzug weit', muscle: 'Rücken', video: 'male-machine-pulldown-front' },
  { id: 'lat_neutral', name: 'Latzug neutral', muscle: 'Rücken', video: 'male-machine-pulldown-front' },
  { id: 'pullups', name: 'Klimmzüge', muscle: 'Rücken', video: 'male-pull-up-front' },
  { id: 'cable_row', name: 'Kabelrudern sitzend', muscle: 'Rücken', video: 'male-cable-seated-row-front' },
  { id: 'chest_supported_row', name: 'Brustgestütztes Rudern', muscle: 'Rücken', video: 'male-dumbbell-incline-row-front' },
  { id: 'barbell_row', name: 'Langhantel Rudern', muscle: 'Rücken', video: 'male-barbell-bent-over-row-front' },
  { id: 'single_arm_row', name: 'Einarmiges Rudern', muscle: 'Rücken', video: 'male-dumbbell-single-arm-row-front' },
  { id: 'deadlift', name: 'Kreuzheben', muscle: 'Rücken', video: 'male-barbell-deadlift-front' },
  { id: 'rdl', name: 'Rumänisches Kreuzheben', muscle: 'Rücken', video: 'male-barbell-romanian-deadlift-front' },

  { id: 'shoulder_press_db', name: 'Schulterdrücken KH', muscle: 'Schultern', video: 'male-dumbbell-shoulder-press-front' },
  { id: 'shoulder_press_bb', name: 'Schulterdrücken LH', muscle: 'Schultern', video: 'male-barbell-overhead-press-front' },
  { id: 'shoulder_press_machine', name: 'Schulterdrücken Maschine', muscle: 'Schultern', video: 'male-machine-shoulder-press-front' },
  { id: 'lateral_raise', name: 'Seitheben', muscle: 'Schultern', video: 'male-dumbbell-lateral-raise-front' },
  { id: 'lateral_raise_cable', name: 'Seitheben am Kabel', muscle: 'Schultern', video: 'male-cable-lateral-raise-front' },
  { id: 'rear_delt', name: 'Rear Delt Fly', muscle: 'Schultern', video: 'male-cable-reverse-fly-front' },
  { id: 'face_pull', name: 'Face Pull', muscle: 'Schultern', video: 'male-cable-face-pull-front' },
  { id: 'front_raise', name: 'Frontheben', muscle: 'Schultern', video: 'male-dumbbell-front-raise-front' },

  { id: 'bicep_curl', name: 'Bizepscurls KH', muscle: 'Bizeps', video: 'male-dumbbell-bicep-curl-front' },
  { id: 'barbell_curl', name: 'Bizepscurls LH', muscle: 'Bizeps', video: 'male-barbell-bicep-curl-front' },
  { id: 'hammer_curl', name: 'Hammer Curl', muscle: 'Bizeps', video: 'male-dumbbell-hammer-curl-front' },
  { id: 'incline_curl', name: 'Incline Curl', muscle: 'Bizeps', video: 'male-dumbbell-incline-bicep-curl-front' },
  { id: 'cable_curl', name: 'Kabel Curl', muscle: 'Bizeps', video: 'male-cable-bicep-curl-front' },
  { id: 'preacher_curl', name: 'Prediger Curl', muscle: 'Bizeps', video: 'male-machine-preacher-curl-front' },

  { id: 'tricep_pushdown', name: 'Trizeps Pushdown', muscle: 'Trizeps', video: 'male-cable-pushdown-front' },
  { id: 'overhead_tri', name: 'Overhead Trizeps Extension', muscle: 'Trizeps', video: 'male-dumbbell-tricep-overhead-extension-front' },
  { id: 'skullcrusher', name: 'Skullcrusher', muscle: 'Trizeps', video: 'male-barbell-skull-crusher-front' },
  { id: 'dips_tri', name: 'Dips (Trizeps)', muscle: 'Trizeps', video: 'male-dip-front' },
  { id: 'close_grip_bench', name: 'Enges Bankdrücken', muscle: 'Trizeps', video: 'male-barbell-close-grip-bench-press-front' },

  { id: 'squat', name: 'Kniebeuge', muscle: 'Quads', video: 'male-barbell-squat-front' },
  { id: 'leg_press', name: 'Beinpresse', muscle: 'Quads', video: 'male-sled-leg-press-front' },
  { id: 'hack_squat', name: 'Hack Squat', muscle: 'Quads', video: 'male-sled-hack-squat-front' },
  { id: 'leg_extension', name: 'Beinstrecker', muscle: 'Quads', video: 'male-machine-leg-extension-front' },
  { id: 'bulgarian', name: 'Bulgarian Split Squats', muscle: 'Quads', video: 'male-dumbbell-bulgarian-split-squat-front' },
  { id: 'lunges', name: 'Ausfallschritte', muscle: 'Quads', video: 'male-dumbbell-lunge-front' },

  { id: 'rdl_ham', name: 'Rumän. Kreuzheben (Hamstrings)', muscle: 'Hamstrings', video: 'male-barbell-romanian-deadlift-front' },
  { id: 'leg_curl', name: 'Beinbeuger', muscle: 'Hamstrings', video: 'male-machine-leg-curl-front' },
  { id: 'nordic_curl', name: 'Nordic Curl', muscle: 'Hamstrings', video: 'male-nordic-hamstring-curl-front' },

  { id: 'hip_thrust', name: 'Hip Thrust', muscle: 'Glutes', video: 'male-barbell-hip-thrust-front' },
  { id: 'glute_bridge', name: 'Glute Bridge', muscle: 'Glutes', video: 'male-glute-bridge-front' },
  { id: 'cable_kickback', name: 'Kabel Kickback', muscle: 'Glutes', video: 'male-cable-glute-kickback-front' },
  { id: 'sumo_squat', name: 'Sumo Squat', muscle: 'Glutes', video: 'male-barbell-sumo-squat-front' },

  { id: 'calf_raise_machine', name: 'Wadenheben Maschine', muscle: 'Waden', video: 'male-machine-calf-raise-front' },
  { id: 'calf_raise_standing', name: 'Wadenheben stehend', muscle: 'Waden', video: 'male-standing-calf-raise-front' },
  { id: 'calf_raise_seated', name: 'Wadenheben sitzend', muscle: 'Waden', video: 'male-seated-calf-raise-front' },

  { id: 'plank', name: 'Plank', muscle: 'Core', video: 'male-plank-front' },
  { id: 'hanging_leg_raise', name: 'Hanging Leg Raise', muscle: 'Core', video: 'male-hanging-leg-raise-front' },
  { id: 'cable_crunch', name: 'Kabel Crunch', muscle: 'Core', video: 'male-cable-crunch-front' },
  { id: 'ab_wheel', name: 'Ab Wheel Rollout', muscle: 'Core', video: 'male-ab-wheel-rollout-front' },
  { id: 'russian_twist', name: 'Russian Twist', muscle: 'Core', video: 'male-russian-twist-front' },
  { id: 'leg_raise', name: 'Leg Raise', muscle: 'Core', video: 'male-lying-leg-raise-front' },
  { id: 'crunch', name: 'Crunch', muscle: 'Core', video: 'male-crunch-front' },
]

export function getVideoUrl(videoSlug) {
  return `https://media.musclewiki.com/media/uploads/videos/branded/${videoSlug}.mp4`
}

export const DEFAULT_PLAN = {
  title: 'Anime Build',
  description: 'V-Taper · Lean · Recomp',
  days: [
    {
      id: 'upper_a', label: 'Tag 1', name: 'Upper A', color: '#e94560',
      focus: 'Obere Brust · Rücken · Schultern',
      exercises: ['incline_press','lat_pulldown','cable_row','shoulder_press_machine','lateral_raise','cable_fly','bicep_curl','tricep_pushdown']
    },
    {
      id: 'lower_a', label: 'Tag 2', name: 'Lower A', color: '#f5a623',
      focus: 'Beine · Glutes · Core',
      exercises: ['leg_press','rdl','leg_extension','leg_curl','calf_raise_machine','hanging_leg_raise','plank']
    },
    {
      id: 'upper_b', label: 'Tag 3', name: 'Upper B', color: '#9b59b6',
      focus: 'Rücken · Brust · Arme',
      exercises: ['bench_press','cable_row','lat_neutral','rear_delt','lateral_raise','hammer_curl','overhead_tri','pushups']
    },
    {
      id: 'lower_b', label: 'Tag 4', name: 'Lower B', color: '#27ae60',
      focus: 'Beine komplett · Core',
      exercises: ['hack_squat','bulgarian','hip_thrust','leg_curl','calf_raise_machine','cable_crunch','ab_wheel']
    }
  ]
}
