import { useEffect, useMemo, useState } from 'react'
import Modal from './Modal'
import { ChevronLeftIcon, ChevronRightIcon } from './Icons'
import { formatDateKey, formatMonthLabel, formatShortDay, getWeekDates, isSameDate } from '../utils/date'

const dotClassMap = {
  taken: 'bg-success',
  taken_late: 'bg-warning',
  missed: 'bg-danger',
  upcoming: 'bg-primary-dark',
}

function getVisibleDots(date, today, dots, isSelected) {
  const isToday = isSameDate(date, today)
  if (isToday || isSelected) return dots
  if (date > today) return dots.length ? [dots[0]] : []
  return dots
}

export default function DayCalendar({ selectedDate, today, getDotsForDate, onChangeDate, onReturnToToday }) {
  const [weekAnchor, setWeekAnchor] = useState(selectedDate)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [pickerValue, setPickerValue] = useState(formatDateKey(selectedDate))

  useEffect(() => {
    setWeekAnchor(selectedDate)
    setPickerValue(formatDateKey(selectedDate))
  }, [selectedDate])

  const weekDates = useMemo(() => getWeekDates(weekAnchor), [weekAnchor])
  const selectedIsToday = isSameDate(selectedDate, today)

  return (
    <>
      <section className="rounded-[28px] border border-line bg-white p-4 shadow-(--shadow) sm:p-5">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-lg font-semibold text-text-main">Weekly Overview</h3>
            <p className="text-sm text-text-soft">Today shows all 3 meal sections. Other dates stay softer until selected.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-text-soft hover:border-primary hover:text-primary"
              onClick={() => {
                const previous = new Date(weekAnchor)
                previous.setDate(previous.getDate() - 7)
                setWeekAnchor(previous)
              }}
            >
              ←
            </button>
            <button
              type="button"
              className="rounded-full border border-line px-4 py-2 text-sm font-medium text-text-main hover:border-primary hover:text-primary"
              onClick={() => setPickerOpen(true)}
            >
              {formatMonthLabel(weekDates[0])}
            </button>
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-text-soft hover:border-primary hover:text-primary"
              onClick={() => {
                const next = new Date(weekAnchor)
                next.setDate(next.getDate() + 7)
                setWeekAnchor(next)
              }}
            >
              →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
          {weekDates.map((date) => {
            const dateKey = formatDateKey(date)
            const dots = getDotsForDate(dateKey)
            const isSelected = isSameDate(date, selectedDate)
            const isToday = isSameDate(date, today)
            const isFuture = date > today
            const visibleDots = getVisibleDots(date, today, dots, isSelected)

            return (
              <button
                key={dateKey}
                type="button"
                onClick={() => onChangeDate(date)}
                className={`rounded-[20px] border px-2 py-3 text-center transition ${isSelected ? (isToday ? 'border-primary bg-primary text-white shadow-sm' : 'border-primary bg-primary-soft/70 text-primary-dark') : isToday ? 'border-primary bg-primary-soft text-primary-dark shadow-sm' : isFuture ? 'border-line bg-surface-soft/60 text-text-main hover:border-primary/50' : 'border-line bg-surface-soft/70 text-text-main hover:border-primary/50'}`}
              >
                <div className={`text-[11px] font-semibold ${isSelected ? (isToday ? 'text-white/90' : 'text-primary-dark') : 'text-text-soft'}`}>{formatShortDay(date).toUpperCase()}</div>
                <div className={`mt-2 text-xl font-semibold ${!isToday && !isSelected ? 'opacity-70' : ''}`}>{date.getDate()}</div>
                <div className="mt-3 flex min-h-4 items-center justify-center gap-1">
                  {visibleDots.length ? visibleDots.map((status, index) => (
                    <span
                      key={`${status}-${index}`}
                      className={`h-2 w-2 rounded-full ${isSelected ? (isToday ? 'bg-white' : 'bg-primary') : dotClassMap[status]} ${!isToday && !isSelected ? 'opacity-40' : ''}`}
                    />
                  )) : <span className={`text-[10px] ${isSelected ? (isToday ? 'text-white/90' : 'text-primary-dark') : 'text-text-soft'}`}>No data</span>}
                </div>
              </button>
            )
          })}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-4 text-xs text-text-soft">
            <span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-success" />Taken</span>
            <span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-warning" />Taken late</span>
            <span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-danger" />Missed</span>
            <span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-primary-dark" />Upcoming</span>
          </div>
          {!selectedIsToday && (
            <button type="button" className="rounded-full border border-primary px-4 py-2 text-sm font-semibold text-primary hover:bg-primary-soft" onClick={onReturnToToday}>
              Return to today
            </button>
          )}
        </div>
      </section>

      <Modal open={pickerOpen} onClose={() => setPickerOpen(false)} title="Choose a date">
        <div className="space-y-4">
          <p className="text-sm leading-6 text-text-soft">Scroll and pick any date to jump directly to that month and day.</p>
          <input
            type="date"
            value={pickerValue}
            onChange={(event) => setPickerValue(event.target.value)}
            className="w-full rounded-2xl border border-line px-4 py-3 outline-none focus:border-primary"
          />
          <div className="flex justify-end gap-3">
            <button type="button" className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-text-main" onClick={() => setPickerOpen(false)}>
              Cancel
            </button>
            <button
              type="button"
              className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
              onClick={() => {
                if (!pickerValue) return
                const nextDate = new Date(`${pickerValue}T00:00:00`)
                setWeekAnchor(nextDate)
                onChangeDate(nextDate)
                setPickerOpen(false)
              }}
            >
              View date
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}
