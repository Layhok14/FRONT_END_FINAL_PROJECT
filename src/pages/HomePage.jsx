import DayCalendar from '../components/DayCalendar'
import MedicationCard from '../components/MedicationCard'
import StatusPill from '../components/StatusPill'
import useDashboardContext from './useDashboardContext'
import {
  formatCountdown,
  formatDateKey,
  getMealSectionStatus,
  getOverviewRows,
  getSectionDateTime,
  getSectionLabel,
  parseDateKey,
} from '../utils/dashboard'

export default function HomePage() {
  const {
    currentSectionId,
    isSelectedToday,
    medicationsById,
    now,
    record,
    schedule,
    selectedDate,
    selectedSection,
    selectedSectionId,
    setCheckoutTarget,
    setDetailMedicationId,
    setSelectedDate,
    setSelectedSectionId,
    todayDate,
    trackingScrollRef,
  } = useDashboardContext()

  const overviewRows = getOverviewRows(schedule).map((row) => ({
    ...row,
    countdown: isSelectedToday ? formatCountdown(getSectionDateTime(selectedDate, row.time), now) : null,
  }))

  return (
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
                  {isSelectedToday ? (() => {
                    const countdown = formatCountdown(getSectionDateTime(selectedDate, selectedSection.time), now)
                    return countdown ? ` (${countdown})` : ''
                  })() : ''}
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
}
