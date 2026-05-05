export interface Task {
  id: string
  text: string
  emoji: string
  duration: string
  category: 'body' | 'breath' | 'environment' | 'connection' | 'mind'
}

export const TASKS: Task[] = [
  { id: 't1', text: 'Take 3 slow, deep breaths', emoji: '🌬️', duration: '1 min', category: 'breath' },
  { id: 't2', text: 'Splash cool water on your face', emoji: '💧', duration: '1 min', category: 'body' },
  { id: 't3', text: 'Open the blinds or a window', emoji: '🌤️', duration: '1 min', category: 'environment' },
  { id: 't4', text: 'Drink a full glass of water', emoji: '🥛', duration: '1 min', category: 'body' },
  { id: 't5', text: 'Step outside for 2 minutes', emoji: '🚶', duration: '2 min', category: 'body' },
  { id: 't6', text: 'Stretch your arms above your head', emoji: '🙆', duration: '1 min', category: 'body' },
  { id: 't7', text: 'Text one person "thinking of you"', emoji: '💬', duration: '1 min', category: 'connection' },
  { id: 't8', text: 'Put on one song you like', emoji: '🎵', duration: '3 min', category: 'mind' },
  { id: 't9', text: 'Make your bed (or just straighten the pillow)', emoji: '🛏️', duration: '2 min', category: 'environment' },
  { id: 't10', text: 'Name 3 things you can see right now', emoji: '👁️', duration: '1 min', category: 'mind' },
  { id: 't11', text: 'Eat something small, even a cracker', emoji: '🍞', duration: '2 min', category: 'body' },
  { id: 't12', text: 'Write one word that describes right now', emoji: '✏️', duration: '1 min', category: 'mind' },
  { id: 't13', text: 'Sit by a window for a moment', emoji: '🪟', duration: '2 min', category: 'environment' },
  { id: 't14', text: 'Brush your teeth', emoji: '🪥', duration: '2 min', category: 'body' },
  { id: 't15', text: 'Put on comfortable clothes', emoji: '👕', duration: '2 min', category: 'body' },
]

export interface GroundingExercise {
  id: string
  title: string
  description: string
  emoji: string
  steps: string[]
  duration: string
}

export const GROUNDING: GroundingExercise[] = [
  {
    id: 'g1',
    title: '5-4-3-2-1 Senses',
    description: 'Gently anchor yourself to the present moment',
    emoji: '🌿',
    duration: '3–5 min',
    steps: [
      'Notice 5 things you can SEE around you. Look slowly.',
      'Notice 4 things you can TOUCH. Feel their texture.',
      'Notice 3 things you can HEAR. Even distant sounds.',
      'Notice 2 things you can SMELL. Or imagine a calming scent.',
      'Notice 1 thing you can TASTE. Or take a sip of water.',
    ],
  },
  {
    id: 'g2',
    title: 'Box Breathing',
    description: 'Calm your nervous system with rhythmic breath',
    emoji: '🫁',
    duration: '3 min',
    steps: [
      'Breathe IN slowly for 4 counts.',
      'HOLD gently for 4 counts.',
      'Breathe OUT slowly for 4 counts.',
      'HOLD gently for 4 counts.',
      'Repeat 4–6 times. There\'s no rush.',
    ],
  },
  {
    id: 'g3',
    title: 'Safe Place Visualisation',
    description: 'Visit a calm, safe space in your mind',
    emoji: '🏡',
    duration: '5 min',
    steps: [
      'Close your eyes and take two slow breaths.',
      'Imagine a place where you feel completely safe — real or imagined.',
      'Notice what you see there. Colours, light, shapes.',
      'Notice what you hear. Sounds, silence, nature.',
      'Feel the ground beneath you. You are safe here. Stay as long as you need.',
    ],
  },
]

export const MOOD_OPTIONS: { value: string; label: string; emoji: string; color: string }[] = [
  { value: 'stormy', label: 'Stormy', emoji: '⛈️', color: '#7a8fa6' },
  { value: 'cloudy', label: 'Cloudy', emoji: '☁️', color: '#9a9590' },
  { value: 'foggy', label: 'Foggy / Numb', emoji: '🌫️', color: '#b0a8a0' },
  { value: 'partly-sunny', label: 'Partly okay', emoji: '⛅', color: '#7a9e87' },
  { value: 'sunny', label: 'Lighter today', emoji: '🌤️', color: '#e8a87c' },
]

export interface CrisisLine {
  name: string
  number?: string
  sms?: string
  url?: string
}

// Keyed by ISO 3166-1 alpha-2 country code.
// 'default' is shown when region cannot be determined or has no specific entry.
export const CRISIS_LINES: Record<string, CrisisLine[]> = {
  // United States
  US: [
    { name: '988 Suicide & Crisis Lifeline', number: '988', sms: 'Text 988' },
    { name: 'Crisis Text Line', sms: 'Text HOME to 741741' },
  ],
  // United Kingdom
  GB: [
    { name: 'Samaritans', number: '116 123', sms: 'Text SHOUT to 85258' },
    { name: 'PAPYRUS HOPElineUK (under 35)', number: '0800 068 4141' },
  ],
  // Ireland
  IE: [
    { name: 'Samaritans Ireland', number: '116 123' },
    { name: 'Pieta House', number: '116 123', sms: 'Text HELLO to 51444' },
  ],
  // India
  IN: [
    { name: 'iCall (TISS)', number: '9152987821' },
    { name: 'Vandrevala Foundation', number: '1860-2662-345' },
    { name: 'AASRA', number: '9820466627' },
  ],
  // Australia
  AU: [
    { name: 'Lifeline Australia', number: '13 11 14', sms: 'Text 0477 13 11 14' },
    { name: 'Beyond Blue', number: '1300 22 4636' },
  ],
  // Canada
  CA: [
    { name: 'Talk Suicide Canada', number: '1-833-456-4566', sms: 'Text 45645' },
    { name: 'Crisis Services Canada', number: '1-833-456-4566' },
  ],
  // New Zealand
  NZ: [
    { name: 'Lifeline Aotearoa', number: '0800 543 354' },
    { name: 'Need to Talk?', number: '1737', sms: 'Text 1737' },
  ],
  // Germany
  DE: [
    { name: 'Telefonseelsorge', number: '0800 111 0 111' },
    { name: 'Telefonseelsorge (alt)', number: '0800 111 0 222' },
  ],
  // France
  FR: [
    { name: 'Numéro National Prévention Suicide', number: '3114' },
  ],
  // Netherlands
  NL: [
    { name: '113 Zelfmoordpreventie', number: '113', sms: 'Text 113' },
  ],
  // South Africa
  ZA: [
    { name: 'SADAG Suicide Crisis Line', number: '0800 567 567' },
    { name: 'Lifeline South Africa', number: '0861 322 322' },
  ],
  // Singapore
  SG: [
    { name: 'Samaritans of Singapore (SOS)', number: '1-767' },
    { name: 'IMH Mental Health Helpline', number: '6389 2222' },
  ],
  // Japan
  JP: [
    { name: 'Inochi no Denwa', number: '0120-783-556' },
    { name: 'Yorisoi Hotline', number: '0120-279-338' },
  ],
  // Brazil
  BR: [
    { name: 'CVV — Centro de Valorização da Vida', number: '188' },
  ],
  // Pakistan
  PK: [
    { name: 'Umang Helpline', number: '0317-4288665' },
  ],
  // Nigeria
  NG: [
    { name: 'NEEM Foundation', number: '08062106493' },
  ],
  // Kenya
  KE: [
    { name: 'Befrienders Kenya', number: '0800 723 253' },
  ],
  // Universal fallback
  default: [
    { name: 'Find your local crisis centre (IASP)', url: 'https://www.iasp.info/resources/Crisis_Centres/' },
    { name: 'International Association for Suicide Prevention', url: 'https://www.iasp.info/resources/Crisis_Centres/' },
  ],
}

export const REFRAME_PROMPTS = [
  {
    step: 1,
    question: 'What thought or feeling is weighing on you right now?',
    hint: 'Just describe it simply — no need to explain or justify.',
    placeholder: 'e.g. "I\'m a failure" or "nothing will ever get better"',
  },
  {
    step: 2,
    question: 'What story is this feeling telling you?',
    hint: 'Depression often narrates in absolutes. What is it saying?',
    placeholder: 'e.g. "Everyone is doing better than me"',
  },
  {
    step: 3,
    question: 'Is that story 100% true, all the time, for everyone?',
    hint: 'Look for even one small exception or nuance.',
    placeholder: 'e.g. "Maybe not always..."',
  },
  {
    step: 4,
    question: 'What\'s a kinder, more balanced view you could offer yourself?',
    hint: 'Imagine what you\'d say to a dear friend in this situation.',
    placeholder: 'e.g. "I\'m struggling right now, and that\'s okay. It won\'t always feel this way."',
  },
]
