import useDashboardContext from './useDashboardContext'
import { getInitials } from '../utils/dashboard'

export default function CaregiversPage() {
  const {
    extraCollections,
    setAddCaregiverOpen,
    setCaregiverMessagesOpen,
    setCaregiverProfileOpen,
  } = useDashboardContext()

  return (
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
}
