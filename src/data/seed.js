const STORAGE_KEY = 'thnam_app_data_v4'

const STATUS_ORDER = ['taken', 'taken_late', 'missed', 'upcoming']

const medicineCatalog = [
  {
    id: 'med-metformin',
    name: 'Metformin',
    purpose: 'Blood sugar support',
    dosage: '1 pill',
    doseRemaining: 42,
    targetStock: 60,
    frequency: 'Twice daily',
    scheduleText: 'Before breakfast and before lunch',
    mealPhase: 'Morning and afternoon',
    foodTiming: '15 minutes before meal',
    category: 'tablet',
    imageUrl: null,
    remark: 'Put little water before taking.',
    assignedDate: '2026-05-01',
    startedDate: '2026-05-01',
    durationDays: 45,
    refillDate: '2026-06-10',
    endedDate: null,
  },
  {
    id: 'med-pepto',
    name: 'Pepto Bismol',
    purpose: 'Stomach comfort',
    dosage: '1 cup',
    doseRemaining: 12,
    targetStock: 18,
    frequency: 'Once daily',
    scheduleText: 'Before lunch',
    mealPhase: 'Afternoon',
    foodTiming: '15 minutes before meal',
    category: 'liquid',
    imageUrl: null,
    remark: 'On front table near the water cup.',
    assignedDate: '2026-05-02',
    startedDate: '2026-05-02',
    durationDays: 20,
    refillDate: '2026-05-28',
    endedDate: null,
  },
  {
    id: 'med-stomach-tea',
    name: 'Stomach Tea',
    purpose: 'Digestive support',
    dosage: '1 tablespoon',
    doseRemaining: 8,
    targetStock: 14,
    frequency: 'Once daily',
    scheduleText: 'Before lunch',
    mealPhase: 'Afternoon',
    foodTiming: '15 minutes before meal',
    category: 'powder',
    imageUrl: null,
    remark: 'Mix with a little water only when needed.',
    assignedDate: '2026-05-02',
    startedDate: '2026-05-02',
    durationDays: 20,
    refillDate: '2026-05-26',
    endedDate: null,
  },
  {
    id: 'med-panadol',
    name: 'Panadol',
    purpose: 'Pain relief',
    dosage: '2 pills',
    doseRemaining: 10,
    targetStock: 20,
    frequency: 'Once daily',
    scheduleText: 'After lunch',
    mealPhase: 'Afternoon',
    foodTiming: 'After meal',
    category: 'tablet',
    imageUrl: null,
    remark: 'Take after food.',
    assignedDate: '2026-05-02',
    startedDate: '2026-05-02',
    durationDays: 20,
    refillDate: '2026-05-27',
    endedDate: null,
  },
  {
    id: 'med-tylenol',
    name: 'Tylenol',
    purpose: 'Pain relief',
    dosage: '2 pills',
    doseRemaining: 10,
    targetStock: 20,
    frequency: 'Once daily',
    scheduleText: 'After breakfast and after lunch',
    mealPhase: 'Morning and afternoon',
    foodTiming: 'After meal',
    category: 'capsule',
    imageUrl: null,
    remark: 'Take after eating with water.',
    assignedDate: '2026-05-02',
    startedDate: '2026-05-02',
    durationDays: 20,
    refillDate: '2026-05-27',
    endedDate: null,
  },
  {
    id: 'med-doliprane',
    name: 'Doliprane',
    purpose: 'Pain relief',
    dosage: '1 pill',
    doseRemaining: 7,
    targetStock: 14,
    frequency: 'Once daily',
    scheduleText: 'After dinner',
    mealPhase: 'Evening',
    foodTiming: 'After meal',
    category: 'tablet',
    imageUrl: null,
    remark: 'Check remaining stock before the weekend refill.',
    assignedDate: '2026-05-02',
    startedDate: '2026-05-02',
    durationDays: 20,
    refillDate: '2026-05-25',
    endedDate: null,
  },
  {
    id: 'med-vitamin-c-past',
    name: 'Vitamin C',
    purpose: 'Supplement support',
    dosage: '1 tablet',
    doseRemaining: 0,
    targetStock: 30,
    frequency: 'Once daily',
    scheduleText: 'After breakfast',
    mealPhase: 'Morning',
    foodTiming: 'After meal',
    category: 'supplement',
    imageUrl: null,
    remark: 'Completed course.',
    assignedDate: '2026-03-01',
    startedDate: '2026-03-01',
    durationDays: 30,
    refillDate: '2026-03-28',
    endedDate: '2026-03-30',
  },
]

function formatDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function makeItems(medicationIds, statuses) {
  return medicationIds.map((medicationId, index) => ({
    medicationId,
    status: statuses[index] || 'upcoming',
  }))
}

function makeMealSection(id, title, time, note, phaseConfig) {
  return {
    id,
    title,
    time,
    note,
    phases: [
      {
        id: `${id}-before`,
        title: 'Before meal',
        note: `Before ${title.toLowerCase()} meal`,
        items: makeItems(phaseConfig.before.ids, phaseConfig.before.statuses),
      },
      {
        id: `${id}-after`,
        title: 'After meal',
        note: `After ${title.toLowerCase()} meal`,
        items: makeItems(phaseConfig.after.ids, phaseConfig.after.statuses),
      },
    ],
  }
}

function buildMealPattern(offset) {
  const cycle = ((offset % 4) + 4) % 4
  const pastPatterns = [
    {
      morning: { before: ['taken'], after: ['taken'], },
      afternoon: { before: ['taken', 'taken', 'taken'], after: ['taken', 'taken'], },
      evening: { before: [], after: ['taken'], },
    },
    {
      morning: { before: ['taken_late'], after: ['taken'], },
      afternoon: { before: ['taken', 'missed', 'taken'], after: ['taken_late', 'taken'], },
      evening: { before: [], after: ['missed'], },
    },
    {
      morning: { before: ['missed'], after: ['taken'], },
      afternoon: { before: ['missed', 'missed', 'taken'], after: ['taken', 'missed'], },
      evening: { before: [], after: ['upcoming'], },
    },
    {
      morning: { before: ['taken'], after: ['taken_late'], },
      afternoon: { before: ['taken', 'taken', 'taken'], after: ['missed', 'taken'], },
      evening: { before: [], after: ['taken'], },
    },
  ]

  if (offset < 0) return pastPatterns[cycle]

  return {
    morning: { before: ['upcoming'], after: ['upcoming'] },
    afternoon: { before: ['upcoming', 'upcoming', 'upcoming'], after: ['upcoming', 'upcoming'] },
    evening: { before: [], after: ['upcoming'] },
  }
}

function buildDaySchedule(date, offset) {
  const pattern = buildMealPattern(offset)

  if (offset === 0) {
    pattern.morning.before = ['taken']
    pattern.morning.after = ['taken']
    pattern.afternoon.before = ['upcoming', 'upcoming', 'upcoming']
    pattern.afternoon.after = ['upcoming', 'upcoming']
    pattern.evening.after = ['upcoming']
  }

  return {
    date: formatDateKey(date),
    sections: [
      makeMealSection('morning', 'Morning', '07:00 AM', 'Breakfast routine', {
        before: { ids: ['med-metformin'], statuses: pattern.morning.before },
        after: { ids: ['med-tylenol'], statuses: pattern.morning.after },
      }),
      makeMealSection('afternoon', 'Afternoon', '11:00 AM', 'Lunch routine', {
        before: { ids: ['med-metformin', 'med-pepto', 'med-stomach-tea'], statuses: pattern.afternoon.before },
        after: { ids: ['med-panadol', 'med-tylenol'], statuses: pattern.afternoon.after },
      }),
      makeMealSection('evening', 'Evening', '07:00 PM', 'Dinner routine', {
        before: { ids: [], statuses: [] },
        after: { ids: ['med-doliprane'], statuses: pattern.evening.after },
      }),
    ],
  }
}

function buildPatientRecord() {
  const schedules = {}
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let offset = -30; offset <= 60; offset += 1) {
    const date = new Date(today)
    date.setDate(today.getDate() + offset)
    schedules[formatDateKey(date)] = buildDaySchedule(date, offset)
  }

  return {
    medications: medicineCatalog,
    caregivers: [
      {
        id: 'caregiver-1',
        name: 'Dara Chan',
        relationship: 'Daughter',
        phone: '+855 12 380 510',
        note: 'Checks midday routine and refill dates.',
        assignedDate: '2026-05-01',
        info: 'Available in the afternoon and confirms meal tracking updates every day.',
        avatar: null,
        messages: [
          { id: 'cg1-msg1', text: 'Updated the new dose note for Pepto Bismol and confirmed the lunch setup.' },
          { id: 'cg1-msg2', text: 'Reviewed the afternoon medicines and moved the liquid medicine to the front table.' },
        ],
      },
      {
        id: 'caregiver-2',
        name: 'Narin Keo',
        relationship: 'Nurse',
        phone: '+855 86 240 118',
        note: 'Visits on Wednesday and Saturday.',
        assignedDate: '2026-05-03',
        info: 'Handles stock review, refill notes, and follows up on missed tracking sections.',
        avatar: null,
        messages: [
          { id: 'cg2-msg1', text: 'Adjusted the Doliprane note after the latest stock review.' },
        ],
      },
    ],
    caregiverRequests: [],
    notifications: [
      {
        id: 'notif-1',
        title: 'Dose updated',
        message: 'Dara Chan updated the new dose note for Pepto Bismol from the caregiver side.',
        read: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'notif-2',
        title: 'New medicine added',
        message: 'Narin Keo added a new medicine update record called Stomach Tea for the current routine.',
        read: false,
        createdAt: new Date().toISOString(),
      },
    ],
    schedules,
  }
}

export function buildInitialAppData() {
  return {
    storageKey: STORAGE_KEY,
    users: [
      {
        id: 'patient-1',
        role: 'patient',
        name: 'Tong Sokann',
        email: 'tong@example.com',
        password: 'Patient123',
        age: '68',
        gender: 'Male',
        acId: 'PAT-1001',
        phone: '+855 12 444 882',
        address: 'Phnom Penh',
        avatar: null,
        linkedPatientId: 'patient-1',
      },
      {
        id: 'caregiver-1',
        role: 'caregiver',
        name: 'Dara Chan',
        email: 'dara@example.com',
        password: 'Caregiver123',
        age: null,
        gender: null,
        acId: 'CAR-2001',
        phone: '+855 12 380 510',
        address: 'Phnom Penh',
        avatar: null,
        linkedPatientId: 'patient-1',
      },
    ],
    currentUserId: null,
    patientRecords: {
      'patient-1': buildPatientRecord(),
    },
  }
}

export function cloneSeedRecord() {
  return JSON.parse(JSON.stringify(buildPatientRecord()))
}

export { STATUS_ORDER, STORAGE_KEY }
