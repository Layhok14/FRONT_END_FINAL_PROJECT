import { getExpectedEndDate } from '../utils/dashboard'

export default function MedicationSection({ title, subtitle, items, past = false, onOpenMedication }) {
  return (
    <section className="rounded-[28px] border border-line bg-white p-5 shadow-[var(--shadow)]">
      <div className="mb-5">
        <h3 className="font-display text-xl font-semibold text-text-main">{title}</h3>
        <p className="mt-1 text-sm text-text-soft">{subtitle}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((medication) => (
          <button key={medication.id} type="button" onClick={() => onOpenMedication(medication.id)} className="rounded-[22px] border border-line bg-surface-soft p-4 text-left hover:border-primary">
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
}
