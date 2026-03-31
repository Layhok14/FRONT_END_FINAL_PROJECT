import Modal from './Modal'

function getExpectedEndDate(startedDate, durationDays) {
  const date = new Date(`${startedDate}T00:00:00`)
  date.setDate(date.getDate() + Number(durationDays || 0) - 1)
  return date.toISOString().slice(0, 10)
}

function daysRemaining(startedDate, durationDays) {
  const endDate = new Date(`${getExpectedEndDate(startedDate, durationDays)}T00:00:00`)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diff = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  return diff >= 0 ? `${diff + 1} days left` : 'Completed'
}

export default function MedicationDetailModal({ open, medication, onClose, todayStatusText }) {
  if (!medication) return null

  const expectedEndDate = medication.endedDate || getExpectedEndDate(medication.startedDate, medication.durationDays)

  return (
    <Modal open={open} onClose={onClose} title={medication.name} wide>
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="rounded-[26px] border border-line bg-surface-soft p-5">
          <div className="flex h-[240px] items-center justify-center rounded-[22px] border border-line bg-white">
            {medication.imageUrl ? <img src={medication.imageUrl} alt={medication.name} className="h-full w-full rounded-[22px] object-contain p-4" /> : <div className="text-center text-sm text-text-soft">Medicine image from admin side</div>}
          </div>
          <div className="mt-4 rounded-[22px] border border-line bg-white p-4">
            <div className="text-xs font-medium uppercase tracking-[0.08em] text-text-soft">Remark</div>
            <p className="mt-2 text-sm leading-6 text-text-soft">{medication.remark}</p>
          </div>
        </div>

        <div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <Info label="Per meal" value={medication.mealPhase} />
            <Info label="When to take" value={medication.foodTiming} />
            <Info label="Dose remaining" value={`${medication.doseRemaining}`} />
            <Info label="When started" value={medication.startedDate} />
            <Info label="Duration set" value={`${medication.durationDays} days`} />
            <Info label="Expected end date" value={expectedEndDate} />
            <Info label="Duration remaining" value={daysRemaining(medication.startedDate, medication.durationDays)} />
            <Info label="Today status" value={todayStatusText} />
            <Info label="Schedule" value={medication.scheduleText} />
          </div>
        </div>
      </div>
    </Modal>
  )
}

function Info({ label, value }) {
  return (
    <div className="rounded-[20px] border border-line bg-white p-4">
      <div className="text-xs font-medium uppercase tracking-[0.08em] text-text-soft">{label}</div>
      <div className="mt-2 text-sm font-semibold text-text-main">{value}</div>
    </div>
  )
}
