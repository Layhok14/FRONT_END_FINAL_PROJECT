import MedicationSection from '../components/MedicationSection'
import StatusPill from '../components/StatusPill'
import useDashboardContext from './useDashboardContext'
import { formatLongDate, getMealSectionStatus } from '../utils/dashboard'
import { formatDateKey, formatMonthLabel, formatShortDay } from '../utils/date'

export default function HistoryPage() {
  const {
    filteredPastMedications,
    historyMode,
    historySearch,
    historyTypeFilter,
    historyCalendarMonth,
    pastMedications,
    record,
    setDetailMedicationId,
    setHistoryMode,
    setHistorySearch,
    setHistoryTypeFilter,
    setHistoryCalendarMonth,
    setRecordModalDateKey,
  } = useDashboardContext()

  const getCalendarDays = () => {
    const [year, month] = historyCalendarMonth.split('-').map(Number)
    const firstDay = new Date(year, month - 1, 1)
    const lastDay = new Date(year, month, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    const adjustedStart = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1
    const days = []
    
    for (let i = 0; i < adjustedStart; i++) {
      days.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }
    return days
  }

  const goToPreviousMonth = () => {
    const [year, month] = historyCalendarMonth.split('-').map(Number)
    const prevDate = new Date(year, month - 2, 1)
    const newYear = prevDate.getFullYear()
    const newMonth = String(prevDate.getMonth() + 1).padStart(2, '0')
    setHistoryCalendarMonth(`${newYear}-${newMonth}`)
  }

  const goToNextMonth = () => {
    const [year, month] = historyCalendarMonth.split('-').map(Number)
    const nextDate = new Date(year, month, 1)
    const newYear = nextDate.getFullYear()
    const newMonth = String(nextDate.getMonth() + 1).padStart(2, '0')
    setHistoryCalendarMonth(`${newYear}-${newMonth}`)
  }

  const getDisplayDate = (day) => {
    const [year, month] = historyCalendarMonth.split('-').map(Number)
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  const todayDateKey = formatDateKey(new Date())

  const calendarDays = getCalendarDays()
  const displayDate = new Date(historyCalendarMonth + '-01')

  return (
    <div className="grid gap-6">
      <section className="rounded-[28px] border border-line bg-white p-5 shadow-(--shadow)">
        <div className="flex flex-wrap items-center gap-3 rounded-full bg-surface-soft p-1">
          {['records', 'past-medications'].map((mode) => (
            <button key={mode} type="button" onClick={() => setHistoryMode(mode)} className={`rounded-full px-4 py-2 text-sm font-semibold ${historyMode === mode ? 'bg-primary text-white' : 'text-text-soft'}`}>
              {mode === 'records' ? 'Record history' : 'Past medications'}
            </button>
          ))}
        </div>
      </section>

      {historyMode === 'records' ? (
        <section className="sticky top-0 rounded-[28px] border border-line bg-white p-5 shadow-(--shadow)">
          <div className='flex justify-between items-start'>
            <div className='flex flex-col'>
              <h3 className="font-display text-xl font-semibold text-text-main">Record history</h3>
              <p className="mt-1 text-sm text-text-soft">Open a day to review meal-by-meal tracking details.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={goToPreviousMonth}
                className="rounded-lg border border-line px-3 py-2 text-sm hover:border-primary hover:bg-surface-soft"
              >
                ←
              </button>
              <span className="min-w-40 text-center text-sm font-semibold">{formatMonthLabel(displayDate)}</span>
              <button
                type="button"
                onClick={goToNextMonth}
                className="rounded-lg border border-line px-3 py-2 text-sm hover:border-primary hover:bg-surface-soft"
              >
                →
              </button>
            </div>
          </div>
          <div className="mt-15 grid grid-cols-7 gap-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <div key={day} className="py-2 text-center text-l font-semibold text-text-soft">
                {day}
              </div>
            ))}
            {calendarDays.map((day, index) => {
              const dateKey = day ? getDisplayDate(day) : null
              const hasRecord = dateKey && record.schedules[dateKey]
              const entry = hasRecord ? record.schedules[dateKey] : null
              const allItems = entry ? entry.sections.flatMap((section) => section.phases.flatMap((phase) => phase.items)) : []
              const doneCount = allItems.filter((item) => item.status === 'taken' || item.status === 'taken_late').length
              const totalCount = allItems.length
              const isToday = dateKey === todayDateKey

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => dateKey && setRecordModalDateKey(dateKey)}
                  disabled={!day}
                  className={`aspect-square rounded-lg border-2 p-2 mt-2 text-center transition-all ${
                    !day
                      ? 'border-transparent bg-transparent'
                      : isToday
                        ? 'border-[#5AB8E7] bg-[#5AB8E7]/10 text-text-main'
                        : hasRecord
                          ? 'border-primary bg-primary/5 text-text-main hover:bg-primary/10'
                          : 'border-line text-text-soft hover:border-primary hover:bg-surface-soft'
                  }`}
                >
                  {day && (
                    <div className="flex h-full flex-col items-center justify-start">
                      <div className="text-xl font-medium pt-2 leading-none">{day}</div>
                      {hasRecord && (
                        <div className="mt-2 space-y-1">
                          <div className="text-xs text-text-soft">
                            {doneCount} of {totalCount} doses taken
                          </div>
                          <div className="flex flex-wrap justify-center pt-1 gap-1">
                            {entry.sections.map((section) => (
                              <StatusPill key={section.id} status={getMealSectionStatus(section)} compact />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </section>
      ) : (
        <div className="grid gap-6">
          <section className="rounded-[28px] border border-line bg-white p-5 shadow-(--shadow)">
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
