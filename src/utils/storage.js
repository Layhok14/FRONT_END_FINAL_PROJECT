import { buildInitialAppData, cloneSeedRecord, STATUS_ORDER, STORAGE_KEY } from '../data/seed'

function safeParse(value) {
  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}

function parseSectionTime(dateKey, timeLabel) {
  const [clock, dayPeriod] = timeLabel.split(' ')
  const [hoursText, minutesText] = clock.split(':')
  let hours = Number(hoursText)
  const minutes = Number(minutesText)
  if (dayPeriod === 'PM' && hours !== 12) hours += 12
  if (dayPeriod === 'AM' && hours === 12) hours = 0
  const date = new Date(`${dateKey}T00:00:00`)
  date.setHours(hours, minutes, 0, 0)
  return date
}

function flattenScheduleItems(schedule) {
  return (schedule?.sections || []).flatMap((section) =>
    (section.phases || []).flatMap((phase) => phase.items || []),
  )
}

export function initializeAppData() {
  if (typeof window === 'undefined') return buildInitialAppData()

  const existing = safeParse(window.localStorage.getItem(STORAGE_KEY))
  if (existing?.storageKey === STORAGE_KEY) return existing

  const seeded = buildInitialAppData()
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded))
  return seeded
}

export function readAppData() {
  return initializeAppData()
}

export function writeAppData(nextData) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextData))
  return nextData
}

export function getCurrentUser() {
  const data = readAppData()
  return data.users.find((user) => user.id === data.currentUserId) || null
}

export function getPatientForUser(user, data = readAppData()) {
  if (!user) return null
  const patientId = user.role === 'patient' ? user.id : user.linkedPatientId
  return data.users.find((entry) => entry.id === patientId) || null
}

export function getRecordForUser(user, data = readAppData()) {
  const patient = getPatientForUser(user, data)
  return patient ? data.patientRecords[patient.id] : null
}

export function loginUser({ email, password, role }) {
  const data = readAppData()
  const normalizedEmail = email.trim().toLowerCase()
  const matchedUser = data.users.find(
    (user) => user.email.toLowerCase() === normalizedEmail && user.password === password && user.role === role,
  )

  if (!matchedUser) {
    return { ok: false, message: 'Incorrect email, password, or role.' }
  }

  writeAppData({ ...data, currentUserId: matchedUser.id })
  return { ok: true, user: matchedUser }
}

export function resetPasswordByLocalUser({ email, role, newPassword }) {
  const data = readAppData()
  const normalizedEmail = email.trim().toLowerCase()
  const matchedUser = data.users.find((user) => user.email.toLowerCase() === normalizedEmail && user.role === role)

  if (!matchedUser) {
    return { ok: false, message: 'Account was not found in local storage.' }
  }

  const next = {
    ...data,
    currentUserId: null,
    users: data.users.map((user) => (user.id === matchedUser.id ? { ...user, password: newPassword } : user)),
  }

  writeAppData(next)
  return { ok: true, message: 'Password reset. Please sign in again.' }
}

export function logoutUser() {
  const data = readAppData()
  writeAppData({ ...data, currentUserId: null })
}

export function createUser(payload) {
  const data = readAppData()
  const email = payload.email.trim().toLowerCase()

  if (data.users.some((user) => user.email.toLowerCase() === email)) {
    return { ok: false, message: 'This email is already registered.' }
  }

  const idPrefix = payload.role === 'patient' ? 'patient' : 'caregiver'
  const userId = `${idPrefix}-${Date.now()}`
  const acPrefix = payload.role === 'patient' ? 'PAT' : 'CAR'
  const acId = payload.acId?.trim() || `${acPrefix}-${String(Date.now()).slice(-4)}`
  const linkedPatientId = payload.role === 'patient' ? userId : payload.linkedPatientId || data.users.find((user) => user.role === 'patient')?.id || null

  const nextUser = {
    id: userId,
    role: payload.role,
    name: payload.name.trim(),
    email,
    password: payload.password,
    age: payload.age?.trim() || null,
    gender: payload.gender?.trim() || null,
    acId,
    phone: payload.phone?.trim() || null,
    address: payload.address?.trim() || null,
    avatar: null,
    linkedPatientId,
  }

  const nextData = {
    ...data,
    users: [...data.users, nextUser],
    currentUserId: nextUser.id,
    patientRecords: { ...data.patientRecords },
  }

  if (payload.role === 'patient') {
    nextData.patientRecords[userId] = cloneSeedRecord()
  }

  writeAppData(nextData)
  return { ok: true, user: nextUser }
}

export function updateUserProfile(userId, updates) {
  const data = readAppData()
  const next = {
    ...data,
    users: data.users.map((user) => (user.id === userId ? { ...user, ...updates } : user)),
  }
  writeAppData(next)
  return next
}

export function changePassword(userId, currentPassword, nextPassword) {
  const data = readAppData()
  const user = data.users.find((entry) => entry.id === userId)

  if (!user || user.password !== currentPassword) {
    return { ok: false, message: 'Current password is not correct.' }
  }

  updateUserProfile(userId, { password: nextPassword })
  return { ok: true }
}

export function autoUpdateMissedSections(patientId, now = new Date()) {
  const data = readAppData()
  const dateKey = now.toISOString().slice(0, 10)
  const record = data.patientRecords[patientId]
  const daySchedule = record?.schedules?.[dateKey]
  if (!daySchedule) return data

  let changed = false
  const nextSections = daySchedule.sections.map((section) => {
    const sectionTime = parseSectionTime(dateKey, section.time)
    const cutoff = new Date(sectionTime.getTime() + 90 * 60 * 1000)
    if (now <= cutoff) return section

    const nextPhases = (section.phases || []).map((phase) => ({
      ...phase,
      items: (phase.items || []).map((item) => {
        if (item.status === 'upcoming') {
          changed = true
          return { ...item, status: 'missed' }
        }
        return item
      }),
    }))

    return { ...section, phases: nextPhases }
  })

  if (!changed) return data

  const next = {
    ...data,
    patientRecords: {
      ...data.patientRecords,
      [patientId]: {
        ...record,
        schedules: {
          ...record.schedules,
          [dateKey]: { ...daySchedule, sections: nextSections },
        },
      },
    },
  }

  writeAppData(next)
  return next
}

export function updateScheduleItems(patientId, dateKey, sectionId, phaseId, medicationIds, nextStatus) {
  const data = readAppData()
  const record = data.patientRecords[patientId]
  if (!record?.schedules[dateKey]) return data

  const nextSections = record.schedules[dateKey].sections.map((section) => {
    if (section.id !== sectionId) return section
    return {
      ...section,
      phases: (section.phases || []).map((phase) => {
        if (phase.id !== phaseId) return phase
        return {
          ...phase,
          items: (phase.items || []).map((item) => (medicationIds.includes(item.medicationId) ? { ...item, status: nextStatus } : item)),
        }
      }),
    }
  })

  const next = {
    ...data,
    patientRecords: {
      ...data.patientRecords,
      [patientId]: {
        ...record,
        schedules: {
          ...record.schedules,
          [dateKey]: { ...record.schedules[dateKey], sections: nextSections },
        },
      },
    },
  }

  writeAppData(next)
  return next
}

export function getOrCreateSchedule(patientId, dateKey) {
  const data = readAppData()
  return data.patientRecords[patientId]?.schedules?.[dateKey] || null
}

export function summarizeDayStatuses(schedule) {
  const seen = new Set()
  flattenScheduleItems(schedule).forEach((item) => seen.add(item.status))
  return STATUS_ORDER.filter((status) => seen.has(status))
}
