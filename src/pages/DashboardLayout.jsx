import { useEffect, useMemo, useRef, useState } from 'react'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import AppNavbar from '../components/AppNavbar'
import CheckoutModal from '../components/CheckoutModal'
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
  updateScheduleItems,
  updateUserProfile,
  writeAppData,
} from '../utils/storage'
import {
  ensureRecordCollections,
  formatDateKey,
  formatLongDate,
  getCurrentSectionId,
  getMealSectionStatus,
  getInitials,
  getStatusLabel,
} from '../utils/dashboard'

export default function DashboardLayout() {
  const navigate = useNavigate()
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
  const [historyCalendarMonth, setHistoryCalendarMonth] = useState(() => {
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    return `${year}-${month}`
})
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

  if (!currentUser || !patient || !record) return <Navigate to="/login" replace />

  const extraCollections = ensureRecordCollections(record)
  const schedule = getOrCreateSchedule(patient.id, selectedDate)
  const medicationsById = Object.fromEntries(record.medications.map((medication) => [medication.id, medication]))
  const currentSectionId = getCurrentSectionId(schedule, new Date(`${selectedDate}T00:00:00`), todayDate)
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

  const context = {
    activeMedications,
    currentSectionId,
    extraCollections,
    filteredActiveMedications,
    filteredPastMedications,
    historyMode,
    historyCalendarMonth,
    setHistoryCalendarMonth,
    historySearch,
    historyTypeFilter,
    isSelectedToday,
    medicationsById,
    now,
    pastMedications,
    record,
    schedule,
    search,
    selectedDate,
    selectedSection,
    selectedSectionId,
    setAddCaregiverOpen,
    setCaregiverMessagesOpen,
    setCaregiverProfileOpen,
    setCheckoutTarget,
    setDetailMedicationId,
    setHistoryMode,
    setHistorySearch,
    setHistoryTypeFilter,
    setRecordModalDateKey,
    setSearch,
    setSelectedDate,
    setSelectedSectionId,
    setTypeFilter,
    todayDate,
    trackingScrollRef,
    typeFilter,
  }

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
        <Outlet context={context} />
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
