import MedicationSection from '../components/MedicationSection'
import StatusPill from '../components/StatusPill'
import useDashboardContext from './useDashboardContext'
import { formatLongDate, getMealSectionStatus } from '../utils/dashboard'

export default function HistoryPage() {
  const {
    filteredPastMedications,
    historyMode,
    historySearch,
    historyTypeFilter,
    pastMedications,
    record,
    setDetailMedicationId,
    setHistoryMode,
    setHistorySearch,
    setHistoryTypeFilter,
    setRecordModalDateKey,
  } = useDashboardContext()

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
          <MedicationSection
            title="Past medications"
            subtitle="Completed medicines with assigned and end dates."
            items={filteredPastMedications}
            past
            onOpenMedication={setDetailMedicationId}
          />
        </div>
      )}
    </div>
  )
}
