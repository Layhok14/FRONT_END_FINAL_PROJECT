import { useEffect, useMemo, useRef, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import AppNavbar from '../components/AppNavbar'
import CheckoutModal from '../components/CheckoutModal'
import DayCalendar from '../components/DayCalendar'
import MedicationCard from '../components/MedicationCard'
import MedicationDetailModal from '../components/MedicationDetailModal'
import Modal from '../components/Modal'
import StatusPill from '../components/StatusPill'
import {
  autoUpdateMissedSections,
  changePassword,
  getCurrentUser,
  getOrCreateSchedule,
  getPatientForUser,
  getRecordForUser,
  logoutUser,
  readAppData,
  summarizeDayStatuses,
  updateScheduleItems,
  updateUserProfile,
  writeAppData,
} from '../utils/storage'
import { formatDateKey, formatLongDate, parseDateKey } from '../utils/date'

const tabs = ['home', 'medications', 'history', 'caregivers', 'settings']

function getExpectedEndDate(startedDate, durationDays) {
  const date = new Date(`${startedDate}T00:00:00`)
  date.setDate(date.getDate() + Number(durationDays || 0) - 1)
  return date.toISOString().slice(0, 10)
}

function getMealSectionStatus(section) {
  const statuses = (section.phases || []).flatMap((phase) => (phase.items || []).map((item) => item.status))
  if (!statuses.length) return 'upcoming'
  if (statuses.every((status) => status === 'taken')) return 'taken'
  if (statuses.every((status) => status === 'taken' || status === 'taken_late')) return 'taken_late'
  if (statuses.some((status) => status === 'upcoming')) return 'upcoming'
  if (statuses.some((status) => status === 'missed')) return 'missed'
  return 'taken_late'
}

function getOverviewRows(schedule) {
  return schedule?.sections.map((section) => {
    const total = (section.phases || []).flatMap((phase) => phase.items || []).length
    const taken = (section.phases || []).flatMap((phase) => phase.items || []).filter((item) => item.status === 'taken' || item.status === 'taken_late').length
    return {
      id: section.id,
      time: section.time,
      title: section.title,
      status: getMealSectionStatus(section),
      count: total ? `${taken}/${total}` : '0/0',
    }
  }) || []
}

function getCurrentSectionId(schedule, selectedDate, todayDate) {
  if (!schedule) return null
  const isToday = formatDateKey(selectedDate) === formatDateKey(todayDate)
  if (!isToday) return schedule.sections[0]?.id || null
  const nextSection = schedule.sections.find((section) =>
    (section.phases || []).some((phase) => (phase.items || []).some((item) => item.status === 'upcoming')),
  )
  return nextSection?.id || schedule.sections[0]?.id || null
}

function getSectionLabel(selectedDate, todayDate) {
  const selectedKey = formatDateKey(selectedDate)
  const todayKey = formatDateKey(todayDate)
  if (selectedKey === todayKey) return 'Today'
  return formatLongDate(selectedKey)
}



function formatCountdown(targetDate, now) {
  const diff = targetDate.getTime() - now.getTime()
  if (diff <= 0) return null
  const totalSeconds = Math.floor(diff / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return `${hours}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s left`
}

function getSectionDateTime(dateKey, timeLabel) {
  const [time, meridiem] = timeLabel.trim().split(' ')
  const [hourValue, minuteValue] = time.split(':').map(Number)
  let hours = hourValue % 12
  if (meridiem?.toLowerCase() === 'pm') hours += 12
  const date = parseDateKey(dateKey)
  date.setHours(hours, minuteValue || 0, 0, 0)
  return date
}

function ensureRecordCollections(record) {
  return {
    notifications: record.notifications || [],
    caregivers: record.caregivers || [],
    caregiverRequests: record.caregiverRequests || [],
  }
}

function getStatusLabel(status) {
  if (status === 'taken_late') return 'Taken late'
  return status.charAt(0).toUpperCase() + status.slice(1)
}

function getInitials(name) {
  return name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()
}

export default function DashboardPage() {
  const { tab = 'home' } = useParams()
  const navigate = useNavigate()
  const invalidTab = !tabs.includes(tab)
  const [appData, setAppData] = useState(() => readAppData())
  const [selectedDate, setSelectedDate] = useState(() => formatDateKey(new Date()))
  const [selectedSectionId, setSelectedSectionId] = useState(null)
  const [detailMedicationId, setDetailMedicationId] = useState(null)
  const [checkoutTarget, setCheckoutTarget] = useState(null)
  const [settingsMessage, setSettingsMessage] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [historySearch, setHistorySearch] = useState('')
  const [historyTypeFilter, setHistoryTypeFilter] = useState('all')
  const [historyMode, setHistoryMode] = useState('records')
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [recordModalDateKey, setRecordModalDateKey] = useState(null)
  const [caregiverMessagesOpen, setCaregiverMessagesOpen] = useState(null)
  const [caregiverProfileOpen, setCaregiverProfileOpen] = useState(null)
  const [addCaregiverOpen, setAddCaregiverOpen] = useState(false)
  const [settingsModalOpen, setSettingsModalOpen] = useState(false)
  const [profileModalOpen, setProfileModalOpen] = useState(false)
  const [caregiverForm, setCaregiverForm] = useState({ name: '', relationship: '', phone: '', note: '' })
  const [profileForm, setProfileForm] = useState({ name: '', age: '', gender: '', acId: '', phone: '', address: '' })
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [now, setNow] = useState(() => new Date())
  const trackingScrollRef = useRef(null)

  const currentUser = useMemo(() => getCurrentUser(), [appData])
  const patient = useMemo(() => getPatientForUser(currentUser, appData), [currentUser, appData])
  const record = useMemo(() => getRecordForUser(currentUser, appData), [currentUser, appData])
  const todayDate = useMemo(() => {
    const date = new Date()
    date.setHours(0, 0, 0, 0)
    return date
  }, [])

  useEffect(() => {
    if (currentUser) {
      setProfileForm({
        name: currentUser.name || '',
        age: currentUser.age || '',
        gender: currentUser.gender || '',
        acId: currentUser.acId || '',
        phone: currentUser.phone || '',
        address: currentUser.address || '',
      })
    }
  }, [currentUser])

  useEffect(() => {
    if (patient) {
      const next = autoUpdateMissedSections(patient.id)
      setAppData(next)
    }
  }, [patient?.id])

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  if (invalidTab) return <Navigate to="/app/home" replace />
  if (!currentUser || !patient || !record) return <Navigate to="/login" replace />

  const extraCollections = ensureRecordCollections(record)
  const schedule = getOrCreateSchedule(patient.id, selectedDate)
  const medicationsById = Object.fromEntries(record.medications.map((medication) => [medication.id, medication]))
  const currentSectionId = getCurrentSectionId(schedule, parseDateKey(selectedDate), todayDate)
  const selectedSection = schedule?.sections.find((section) => section.id === (selectedSectionId || currentSectionId)) || null
  const detailMedication = record.medications.find((medication) => medication.id === detailMedicationId) || null
  const checkoutSection = schedule?.sections.find((section) => section.id === checkoutTarget?.sectionId) || null
  const checkoutPhase = checkoutSection?.phases?.find((phase) => phase.id === checkoutTarget?.phaseId) || null
  const isSelectedToday = selectedDate === formatDateKey(todayDate)
  const activeMedications = record.medications.filter((medication) => !medication.endedDate)
  const pastMedications = record.medications.filter((medication) => medication.endedDate)
  const filteredActiveMedications = activeMedications.filter((medication) => medication.name.toLowerCase().includes(search.toLowerCase()) && (typeFilter === 'all' || medication.category === typeFilter))
  const filteredPastMedications = pastMedications.filter((medication) => medication.name.toLowerCase().includes(historySearch.toLowerCase()) && (historyTypeFilter === 'all' || medication.category === historyTypeFilter))
  const recordModalEntry = recordModalDateKey ? record.schedules[recordModalDateKey] : null

  useEffect(() => {
    setSelectedSectionId(currentSectionId)
  }, [selectedDate, currentSectionId])

  const refreshData = (nextData = readAppData()) => setAppData(nextData)

  const patchRecord = (mutator) => {
    const data = readAppData()
    const targetRecord = data.patientRecords[patient.id]
    const nextRecord = mutator({
      ...targetRecord,
      notifications: targetRecord.notifications || [],
      caregivers: targetRecord.caregivers || [],
      caregiverRequests: targetRecord.caregiverRequests || [],
    })
    const next = {
      ...data,
      patientRecords: {
        ...data.patientRecords,
        [patient.id]: nextRecord,
      },
    }
    writeAppData(next)
    refreshData(next)
  }

  const handleCheckoutSubmit = (medicationIds, nextStatus) => {
    if (!checkoutTarget || !checkoutSection || !checkoutPhase || !isSelectedToday) return
    const next = updateScheduleItems(patient.id, selectedDate, checkoutTarget.sectionId, checkoutTarget.phaseId, medicationIds, nextStatus)
    refreshData(next)
    setCheckoutTarget(null)
  }

  const saveProfile = (event) => {
    event.preventDefault()
    const next = updateUserProfile(currentUser.id, profileForm)
    refreshData(next)
    setSettingsMessage('Profile saved to local storage.')
  }

  const submitPasswordChange = (event) => {
    event.preventDefault()
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage('New passwords do not match.')
      return
    }
    const result = changePassword(currentUser.id, passwordForm.currentPassword, passwordForm.newPassword)
    setPasswordMessage(result.ok ? 'Password updated successfully.' : result.message)
    if (result.ok) setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    refreshData()
  }

  const handleLogout = () => {
    logoutUser()
    navigate('/login')
  }

  const openNotifications = () => {
    patchRecord((targetRecord) => ({
      ...targetRecord,
      notifications: (targetRecord.notifications || []).map((item) => ({ ...item, read: true })),
    }))
    setNotificationsOpen(true)
  }

  const addCaregiverRequest = (event) => {
    event.preventDefault()
    if (!caregiverForm.name || !caregiverForm.relationship || !caregiverForm.phone) return
    patchRecord((targetRecord) => ({
      ...targetRecord,
      caregiverRequests: [
        {
          id: `request-${Date.now()}`,
          ...caregiverForm,
          status: 'Pending caregiver confirmation',
          requestedAt: new Date().toISOString(),
        },
        ...(targetRecord.caregiverRequests || []),
      ],
      notifications: [
        {
          id: `notif-${Date.now()}`,
          title: 'Caregiver request sent',
          message: `${caregiverForm.name} was invited and is waiting to confirm the caregiver request.`,
          read: false,
          createdAt: new Date().toISOString(),
        },
        ...(targetRecord.notifications || []),
      ],
    }))
    setCaregiverForm({ name: '', relationship: '', phone: '', note: '' })
    setAddCaregiverOpen(false)
  }

  const overviewRows = getOverviewRows(schedule).map((row) => ({
    ...row,
    countdown: isSelectedToday ? formatCountdown(getSectionDateTime(selectedDate, row.time), now) : null,
  }))


  const renderHomeTab = () => (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.95fr)]">
      <section className="rounded-[28px] border border-line bg-white p-5 shadow-[var(--shadow)] sm:p-6">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-semibold text-text-main">Tracking for your selected meal section</h2>
            <p className="mt-1 text-sm text-text-soft">Open a medicine card to view full details, then check out the meal phase you completed today.</p>
            {selectedSection && (
              <div className="mt-4 rounded-[18px] border border-line bg-surface-soft px-4 py-3">
                <div className="text-sm font-semibold text-primary">
                  {getSectionLabel(parseDateKey(selectedDate), todayDate)}, {selectedSection.time}
                  {isSelectedToday ? (() => { const countdown = formatCountdown(getSectionDateTime(selectedDate, selectedSection.time), now); return countdown ? ` (${countdown})` : '' })() : ''}
                </div>
                <div className="mt-1 text-lg font-semibold text-text-main">{selectedSection.title}</div>
                <div className="mt-1 text-sm text-text-soft">{selectedSection.note}</div>
              </div>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {isSelectedToday && selectedSectionId !== currentSectionId && currentSectionId && (
              <button type="button" className="rounded-full border border-primary px-4 py-2 text-sm font-semibold text-primary hover:bg-primary-soft" onClick={() => setSelectedSectionId(currentSectionId)}>
                Return to current section
              </button>
            )}
            {!isSelectedToday && <div className="rounded-full border border-line bg-white px-4 py-2 text-xs font-semibold text-text-soft">Read-only for past and future dates</div>}
          </div>
        </div>

        {selectedSection ? (
          <div className="rounded-[24px] border border-line bg-surface-soft p-4 sm:p-5">
            <div className="relative">
              <div
                ref={trackingScrollRef}
                className="tracking-scroll max-h-[640px] space-y-5 overflow-y-auto pr-3"
              >
                {(selectedSection.phases || []).map((phase) => {
                  const hasTwoColumns = phase.items.length > 1
                  return (
                    <div key={phase.id} className="rounded-[22px] border border-line bg-white p-4">
                      <div className="rounded-[18px] border border-line bg-surface-soft px-4 py-3">
                        <div className="text-sm font-semibold text-primary">{phase.title}</div>
                        <div className="mt-1 text-sm text-text-soft">{phase.note}</div>
                      </div>

                      <div className={`mt-4 grid gap-4 ${hasTwoColumns ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
                        {phase.items.length ? phase.items.map((item) => {
                          const medication = medicationsById[item.medicationId]
                          return medication ? (
                            <MedicationCard
                              key={item.medicationId}
                              medication={medication}
                              status={item.status}
                              amount={medication.dosage}
                              remark={medication.remark}
                              onOpen={() => setDetailMedicationId(item.medicationId)}
                            />
                          ) : null
                        }) : <div className="rounded-[18px] border border-dashed border-line bg-surface-soft px-4 py-8 text-center text-sm text-text-soft">No medicine added for this phase.</div>}
                      </div>

                      <div className="mt-4">
                        <button
                          type="button"
                          disabled={!isSelectedToday || !phase.items.length}
                          className={`rounded-full px-5 py-3 text-sm font-semibold ${isSelectedToday && phase.items.length ? 'bg-primary text-white hover:bg-primary-dark' : 'cursor-not-allowed border border-line bg-surface-soft text-text-soft'}`}
                          onClick={() => isSelectedToday && phase.items.length && setCheckoutTarget({ sectionId: selectedSection.id, phaseId: phase.id })}
                        >
                          Checkout {phase.title.toLowerCase()}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-[24px] border border-line bg-surface-soft p-6 text-text-soft">No data for this date yet.</div>
        )}
      </section>

      <div className="grid gap-6">
        <DayCalendar
          selectedDate={parseDateKey(selectedDate)}
          today={todayDate}
          onChangeDate={(date) => setSelectedDate(formatDateKey(date))}
          onReturnToToday={() => setSelectedDate(formatDateKey(todayDate))}
          getDotsForDate={(dateKey) => {
            const target = record.schedules[dateKey]
            return target ? target.sections.map((section) => getMealSectionStatus(section)) : []
          }}
        />

        <section className="rounded-[28px] border border-line bg-white p-4 shadow-[var(--shadow)] sm:p-5">
          <h3 className="font-display text-lg font-semibold text-text-main">Overview of the Day</h3>
          <p className="mt-1 text-sm text-text-soft">Each row is one meal section. Select a row to update the tracking list on the left side.</p>
          <div className="mt-4 space-y-3">
            {!overviewRows.length && <div className="rounded-[18px] border border-dashed border-line bg-surface-soft px-4 py-6 text-sm text-text-soft">No data for this date yet.</div>}
            {overviewRows.map((row) => {
              const isSelected = row.id === selectedSectionId
              const isCurrent = isSelectedToday && row.id === currentSectionId
              return (
                <button key={row.id} type="button" onClick={() => setSelectedSectionId(row.id)} className={`grid w-full grid-cols-[0.8fr_1fr_0.65fr] items-center gap-3 rounded-[18px] border px-4 py-3 text-left text-sm transition ${isSelected ? 'border-primary bg-primary-soft/70' : 'border-line hover:border-primary/50'}`}>
                  <div>
                    <div className="font-medium text-text-main">{row.time}{row.countdown ? ` (${row.countdown})` : ''}</div>
                    <div className="text-xs text-text-soft">{row.title}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusPill status={row.status} />
                    {isCurrent && <span className="text-[11px] font-semibold text-primary">Current</span>}
                  </div>
                  <div className="text-right font-semibold text-text-main">{row.count}</div>
                </button>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )

  const renderMedicationSection = (title, subtitle, items, past = false) => (
    <section className="rounded-[28px] border border-line bg-white p-5 shadow-[var(--shadow)]">
      <div className="mb-5">
        <h3 className="font-display text-xl font-semibold text-text-main">{title}</h3>
        <p className="mt-1 text-sm text-text-soft">{subtitle}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((medication) => (
          <button key={medication.id} type="button" onClick={() => setDetailMedicationId(medication.id)} className="rounded-[22px] border border-line bg-surface-soft p-4 text-left hover:border-primary">
            <div className="flex h-36 items-center justify-center rounded-[18px] border border-line bg-white">
              {medication.imageUrl ? <img src={medication.imageUrl} alt={medication.name} className="h-full w-full rounded-[18px] object-contain p-3" /> : <div className="text-sm text-text-soft">View image only</div>}
            </div>
            <h4 className="mt-4 font-medium text-text-main">{medication.name}</h4>
            <div className="mt-2 space-y-1 text-sm text-text-soft">
              <div>Per meal: {medication.mealPhase}</div>
              <div>When to take: {medication.foodTiming}</div>
              <div>Dose remaining: {medication.doseRemaining}</div>
              <div>Assigned: {medication.assignedDate}</div>
              <div>{past ? `Ended: ${medication.endedDate}` : `Expected end: ${getExpectedEndDate(medication.startedDate, medication.durationDays)}`}</div>
            </div>
          </button>
        ))}
      </div>
      {!items.length && <div className="rounded-[20px] border border-dashed border-line bg-surface-soft px-4 py-6 text-sm text-text-soft">No medications found.</div>}
    </section>
  )

  const renderMedicationsTab = () => (
    <div className="grid gap-6">
      <section className="rounded-[28px] border border-line bg-white p-5 shadow-[var(--shadow)]">
        <div className="grid gap-4 md:grid-cols-[1fr_220px]">
          <input value={search} onChange={(event) => setSearch(event.target.value)} className="w-full rounded-2xl border border-line px-4 py-3 outline-none focus:border-primary" placeholder="Search medicine name" />
          <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)} className="w-full rounded-2xl border border-line px-4 py-3 outline-none focus:border-primary">
            <option value="all">All medicine types</option>
            {[...new Set(activeMedications.map((medication) => medication.category))].map((category) => <option key={category} value={category}>{category}</option>)}
          </select>
        </div>
      </section>
      {renderMedicationSection('Current medications', 'Current medicines with the same details shown in the home tracking modal.', filteredActiveMedications)}
    </div>
  )

  const renderHistoryTab = () => {
    const historyDates = Object.keys(record.schedules).sort((a, b) => (a < b ? 1 : -1)).slice(0, 16)

    return (
      <div className="grid gap-6">
        <section className="rounded-[28px] border border-line bg-white p-5 shadow-[var(--shadow)]">
          <div className="flex flex-wrap items-center gap-3 rounded-full bg-surface-soft p-1">
            {['records', 'past-medications'].map((mode) => (
              <button key={mode} type="button" onClick={() => setHistoryMode(mode)} className={`rounded-full px-4 py-2 text-sm font-semibold ${historyMode === mode ? 'bg-primary text-white' : 'text-text-soft'}`}>
                {mode === 'records' ? 'Record history' : 'Past medications'}
              </button>
            ))}
          </div>
        </section>

        {historyMode === 'records' ? (
          <section className="rounded-[28px] border border-line bg-white p-5 shadow-[var(--shadow)]">
            <h3 className="font-display text-xl font-semibold text-text-main">Record history</h3>
            <p className="mt-1 text-sm text-text-soft">Open a day to review meal-by-meal tracking details.</p>
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              {historyDates.map((dateKey) => {
                const entry = record.schedules[dateKey]
                const allItems = entry.sections.flatMap((section) => section.phases.flatMap((phase) => phase.items))
                const doneCount = allItems.filter((item) => item.status === 'taken' || item.status === 'taken_late').length
                const totalCount = allItems.length
                return (
                  <button key={dateKey} type="button" onClick={() => setRecordModalDateKey(dateKey)} className="rounded-[22px] border border-line bg-surface-soft p-4 text-left hover:border-primary">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="font-medium text-text-main">{formatLongDate(dateKey)}</div>
                        <div className="mt-1 text-sm text-text-soft">{doneCount} of {totalCount} doses completed.</div>
                      </div>
                      <div className="flex flex-wrap gap-2">{entry.sections.map((section) => <StatusPill key={section.id} status={getMealSectionStatus(section)} compact />)}</div>
                    </div>
                  </button>
                )
              })}
            </div>
          </section>
        ) : (
          <div className="grid gap-6">
            <section className="rounded-[28px] border border-line bg-white p-5 shadow-[var(--shadow)]">
              <div className="grid gap-4 md:grid-cols-[1fr_220px]">
                <input value={historySearch} onChange={(event) => setHistorySearch(event.target.value)} className="w-full rounded-2xl border border-line px-4 py-3 outline-none focus:border-primary" placeholder="Search past medicine name" />
                <select value={historyTypeFilter} onChange={(event) => setHistoryTypeFilter(event.target.value)} className="w-full rounded-2xl border border-line px-4 py-3 outline-none focus:border-primary">
                  <option value="all">All medicine types</option>
                  {[...new Set(pastMedications.map((medication) => medication.category))].map((category) => <option key={category} value={category}>{category}</option>)}
                </select>
              </div>
            </section>
            {renderMedicationSection('Past medications', 'Completed medicines with assigned and end dates.', filteredPastMedications, true)}
          </div>
        )}
      </div>
    )
  }

  const renderCaregiversTab = () => (
    <div className="flex min-h-[calc(100vh-220px)] flex-col gap-6">
      <section className="rounded-[28px] border border-line bg-white p-5 shadow-[var(--shadow)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-xl font-semibold text-text-main">Caregivers</h3>
            <p className="mt-1 text-sm text-text-soft">Use the buttons to open caregiver messages or profile details without turning the whole card into one action.</p>
          </div>
          <button type="button" onClick={() => setAddCaregiverOpen(true)} className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary-dark">Add caregiver</button>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {extraCollections.caregivers.map((caregiver) => (
            <div key={caregiver.id} className="rounded-[22px] border border-line bg-surface-soft p-4">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary-soft text-sm font-semibold text-primary-dark">{getInitials(caregiver.name)}</div>
                <div className="min-w-0 flex-1">
                  <div className="text-lg font-semibold text-text-main">{caregiver.name}</div>
                  <div className="mt-1 text-sm text-text-soft">{caregiver.relationship}</div>
                  <div className="mt-3 text-sm text-text-main">{caregiver.phone}</div>
                  <div className="mt-2 text-sm text-text-soft">{caregiver.note}</div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <button type="button" onClick={() => setCaregiverMessagesOpen(caregiver)} className="rounded-full border border-primary px-4 py-2 text-sm font-semibold text-primary hover:bg-primary-soft">Messages</button>
                <button type="button" onClick={() => setCaregiverProfileOpen(caregiver)} className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-text-main hover:border-primary hover:text-primary">Profile</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {!!extraCollections.caregiverRequests.length && (
        <section className="rounded-[28px] border border-line bg-white p-5 shadow-[var(--shadow)]">
          <h4 className="font-display text-lg font-semibold text-text-main">Pending caregiver requests</h4>
          <div className="mt-4 space-y-3">
            {extraCollections.caregiverRequests.map((request) => (
              <div key={request.id} className="rounded-[20px] border border-line bg-surface-soft px-4 py-4 text-sm">
                <div className="font-semibold text-text-main">{request.name}</div>
                <div className="mt-1 text-text-soft">{request.relationship} • {request.phone}</div>
                <div className="mt-2 text-primary">{request.status}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="mt-auto rounded-[24px] border border-line bg-white px-5 py-4 text-sm text-text-soft shadow-[var(--shadow)]">
        Caregiver information stays visible above the patient-side footer and remains anchored near the bottom of the screen.
      </div>
    </div>
  )

  const renderSettingsTab = () => (
    <div className="grid gap-6 xl:grid-cols-2">
      <section className="rounded-[28px] border border-line bg-white p-5 shadow-[var(--shadow)]">
        <h3 className="font-display text-xl font-semibold text-text-main">Profile access</h3>
        <p className="mt-1 text-sm text-text-soft">Use the patient profile modal to edit identity and contact information.</p>
        <button type="button" className="mt-5 rounded-full bg-primary px-5 py-3 font-semibold text-white" onClick={() => setProfileModalOpen(true)}>Open profile modal</button>
      </section>
      <section className="rounded-[28px] border border-line bg-white p-5 shadow-[var(--shadow)]">
        <h3 className="font-display text-xl font-semibold text-text-main">Settings access</h3>
        <p className="mt-1 text-sm text-text-soft">The settings modal is now separate from the profile modal and handles password and sign-out actions.</p>
        <button type="button" className="mt-5 rounded-full border border-primary px-5 py-3 font-semibold text-primary hover:bg-primary-soft" onClick={() => setSettingsModalOpen(true)}>Open settings modal</button>
      </section>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f7fbfd]">
      <AppNavbar
        currentUser={currentUser}
        notifications={extraCollections.notifications}
        onOpenNotifications={openNotifications}
        onOpenSettings={() => setSettingsModalOpen(true)}
        onOpenProfile={() => setProfileModalOpen(true)}
      />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {tab === 'home' && renderHomeTab()}
        {tab === 'medications' && renderMedicationsTab()}
        {tab === 'history' && renderHistoryTab()}
        {tab === 'caregivers' && renderCaregiversTab()}
        {tab === 'settings' && renderSettingsTab()}
      </main>
      <footer className="border-t border-line bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-5 text-sm text-text-soft sm:px-6 lg:px-8">
          <span>© 2026 Thnam. All rights reserved.</span>
          <div className="flex flex-wrap gap-4">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Accessibility</span>
          </div>
        </div>
      </footer>

      <MedicationDetailModal
        open={Boolean(detailMedication)}
        medication={detailMedication}
        onClose={() => setDetailMedicationId(null)}
        todayStatusText={detailMedicationId ? (() => {
          const todaySchedule = getOrCreateSchedule(patient.id, formatDateKey(todayDate))
          const todayItem = todaySchedule?.sections.flatMap((section) => section.phases.flatMap((phase) => phase.items)).find((item) => item.medicationId === detailMedicationId)
          return todayItem ? getStatusLabel(todayItem.status) : 'Not scheduled'
        })() : 'Not scheduled'}
      />
      <CheckoutModal
        open={Boolean(checkoutPhase)}
        section={checkoutPhase ? { ...checkoutPhase, title: `${checkoutSection?.title || ''} • ${checkoutPhase.title}` } : null}
        medicationsById={medicationsById}
        onClose={() => setCheckoutTarget(null)}
        onSubmit={handleCheckoutSubmit}
      />

      <Modal open={notificationsOpen} onClose={() => setNotificationsOpen(false)} title="Notifications">
        <div className="space-y-3">
          {extraCollections.notifications.length ? extraCollections.notifications.map((item) => (
            <div key={item.id} className="rounded-[20px] border border-line bg-surface-soft p-4">
              <div className="font-semibold text-text-main">{item.title}</div>
              <div className="mt-2 text-sm leading-6 text-text-soft">{item.message}</div>
            </div>
          )) : <div className="rounded-[20px] border border-line bg-surface-soft p-4 text-sm text-text-soft">No caregiver updates yet.</div>}
        </div>
      </Modal>

      <Modal open={Boolean(recordModalEntry)} onClose={() => setRecordModalDateKey(null)} title={recordModalDateKey ? formatLongDate(recordModalDateKey) : 'Record details'}>
        <div className="space-y-4">
          {recordModalEntry?.sections.map((section) => (
            <div key={section.id} className="rounded-[22px] border border-line bg-surface-soft p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-text-main">{section.title}</div>
                  <div className="mt-1 text-sm text-text-soft">{section.time}</div>
                </div>
                <StatusPill status={getMealSectionStatus(section)} />
              </div>
              <div className="mt-4 space-y-3">
                {section.phases.map((phase) => (
                  <div key={phase.id} className="rounded-[18px] border border-line bg-white p-4">
                    <div className="font-medium text-text-main">{phase.title}</div>
                    <div className="mt-1 text-sm text-text-soft">{phase.note}</div>
                    <div className="mt-3 space-y-3">
                      {phase.items.length ? phase.items.map((item) => {
                        const medication = medicationsById[item.medicationId]
                        return (
                          <div key={item.medicationId} className="flex items-center justify-between gap-3 rounded-[16px] border border-line bg-surface-soft px-4 py-3 text-sm">
                            <div>
                              <div className="font-medium text-text-main">{medication?.name}</div>
                              <div className="text-text-soft">{medication?.dosage}</div>
                            </div>
                            <StatusPill status={item.status} />
                          </div>
                        )
                      }) : <div className="text-sm text-text-soft">No medicine in this phase.</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Modal>

      <Modal open={Boolean(caregiverMessagesOpen)} onClose={() => setCaregiverMessagesOpen(null)} title={caregiverMessagesOpen ? `${caregiverMessagesOpen.name} messages` : 'Caregiver messages'}>
        <div className="space-y-3">
          {(caregiverMessagesOpen?.messages || []).map((message) => (
            <div key={message.id} className="rounded-[20px] border border-line bg-surface-soft p-4 text-sm leading-6 text-text-soft">
              {message.text}
            </div>
          ))}
        </div>
      </Modal>

      <Modal open={Boolean(caregiverProfileOpen)} onClose={() => setCaregiverProfileOpen(null)} title={caregiverProfileOpen ? `${caregiverProfileOpen.name} profile` : 'Caregiver profile'}>
        {caregiverProfileOpen && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-soft text-lg font-semibold text-primary-dark">{getInitials(caregiverProfileOpen.name)}</div>
              <div>
                <div className="text-lg font-semibold text-text-main">{caregiverProfileOpen.name}</div>
                <div className="text-sm text-text-soft">{caregiverProfileOpen.relationship}</div>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[18px] border border-line bg-surface-soft p-4 text-sm"><div className="font-semibold text-text-main">Phone</div><div className="mt-2 text-text-soft">{caregiverProfileOpen.phone}</div></div>
              <div className="rounded-[18px] border border-line bg-surface-soft p-4 text-sm"><div className="font-semibold text-text-main">Assigned date</div><div className="mt-2 text-text-soft">{caregiverProfileOpen.assignedDate || 'Not set'}</div></div>
              <div className="rounded-[18px] border border-line bg-surface-soft p-4 text-sm sm:col-span-2"><div className="font-semibold text-text-main">Notes</div><div className="mt-2 text-text-soft">{caregiverProfileOpen.note}</div></div>
              <div className="rounded-[18px] border border-line bg-surface-soft p-4 text-sm sm:col-span-2"><div className="font-semibold text-text-main">More info</div><div className="mt-2 text-text-soft">{caregiverProfileOpen.info}</div></div>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={profileModalOpen} onClose={() => setProfileModalOpen(false)} title="Patient profile">
        <section>
          <h3 className="font-display text-xl font-semibold text-text-main">Edit profile</h3>
          {settingsMessage && <div className="mt-4 rounded-[18px] border border-line bg-surface-soft px-4 py-3 text-sm">{settingsMessage}</div>}
          <form className="mt-5 space-y-4" onSubmit={saveProfile}>
            {['acId', 'name', 'age', 'gender', 'phone', 'address'].map((field) => (
              <label key={field} className="block">
                <span className="mb-2 block text-sm font-medium capitalize text-text-main">{field}</span>
                <input className="w-full rounded-2xl border border-line px-4 py-3 outline-none focus:border-primary" value={profileForm[field]} onChange={(event) => setProfileForm((current) => ({ ...current, [field]: event.target.value }))} />
              </label>
            ))}
            <button type="submit" className="rounded-full bg-primary px-5 py-3 font-semibold text-white">Save changes</button>
          </form>
        </section>
      </Modal>

      <Modal open={settingsModalOpen} onClose={() => setSettingsModalOpen(false)} title="Settings">
        <section>
          <h3 className="font-display text-xl font-semibold text-text-main">Change password</h3>
          {passwordMessage && <div className="mt-4 rounded-[18px] border border-line bg-surface-soft px-4 py-3 text-sm">{passwordMessage}</div>}
          <form className="mt-5 space-y-4" onSubmit={submitPasswordChange}>
            {['currentPassword', 'newPassword', 'confirmPassword'].map((field) => (
              <label key={field} className="block">
                <span className="mb-2 block text-sm font-medium text-text-main">{field}</span>
                <input className="w-full rounded-2xl border border-line px-4 py-3 outline-none focus:border-primary" type="password" value={passwordForm[field]} onChange={(event) => setPasswordForm((current) => ({ ...current, [field]: event.target.value }))} />
              </label>
            ))}
            <div className="flex flex-wrap gap-3">
              <button type="submit" className="rounded-full bg-primary px-5 py-3 font-semibold text-white">Update password</button>
              <button type="button" className="rounded-full border border-line px-5 py-3 font-semibold text-text-main" onClick={handleLogout}>Logout</button>
            </div>
          </form>
        </section>
      </Modal>

      <Modal open={addCaregiverOpen} onClose={() => setAddCaregiverOpen(false)} title="Add caregiver request">
        <form className="space-y-4" onSubmit={addCaregiverRequest}>
          {[
            ['name', 'Name'],
            ['relationship', 'Relationship'],
            ['phone', 'Phone'],
          ].map(([field, label]) => (
            <label key={field} className="block">
              <span className="mb-2 block text-sm font-medium text-text-main">{label}</span>
              <input className="w-full rounded-2xl border border-line px-4 py-3 outline-none focus:border-primary" value={caregiverForm[field]} onChange={(event) => setCaregiverForm((current) => ({ ...current, [field]: event.target.value }))} />
            </label>
          ))}
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-text-main">Note</span>
            <textarea className="min-h-[100px] w-full rounded-2xl border border-line px-4 py-3 outline-none focus:border-primary" value={caregiverForm.note} onChange={(event) => setCaregiverForm((current) => ({ ...current, note: event.target.value }))} />
          </label>
          <div className="rounded-[18px] border border-line bg-surface-soft px-4 py-3 text-sm text-text-soft">After adding, the caregiver still needs to confirm the request before they are fully connected.</div>
          <button type="submit" className="rounded-full bg-primary px-5 py-3 font-semibold text-white">Send request</button>
        </form>
      </Modal>
    </div>
  )
}
