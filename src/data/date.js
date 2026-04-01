export function formatDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}


export function parseDateKey(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function getWeekDates(anchorDate) {
  const selected = new Date(anchorDate)
  selected.setHours(0, 0, 0, 0)
  const day = selected.getDay()
  const mondayOffset = day === 0 ? -6 : 1 - day
  const monday = new Date(selected)
  monday.setDate(selected.getDate() + mondayOffset)

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday)
    date.setDate(monday.getDate() + index)
    return date
  })
}

export function formatMonthLabel(date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(date)
}

export function formatLongDate(dateKey) {
  const date = typeof dateKey === 'string' ? parseDateKey(dateKey) : dateKey
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

export function formatShortDay(date) {
  return new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date)
}

export function isSameDate(a, b) {
  return formatDateKey(a) === formatDateKey(b)
}