import { formatDateKey, formatLongDate, parseDateKey } from './date'

export function getExpectedEndDate(startedDate, durationDays) {
  const date = new Date(`${startedDate}T00:00:00`)
  date.setDate(date.getDate() + Number(durationDays || 0) - 1)
  return date.toISOString().slice(0, 10)
}

export function getMealSectionStatus(section) {
  const statuses = (section.phases || []).flatMap((phase) => (phase.items || []).map((item) => item.status))
  if (!statuses.length) return 'upcoming'
  if (statuses.every((status) => status === 'taken')) return 'taken'
  if (statuses.every((status) => status === 'taken' || status === 'taken_late')) return 'taken_late'
  if (statuses.some((status) => status === 'upcoming')) return 'upcoming'
  if (statuses.some((status) => status === 'missed')) return 'missed'
  return 'taken_late'
}

export function getOverviewRows(schedule) {
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

export function getCurrentSectionId(schedule, selectedDate, todayDate) {
  if (!schedule) return null
  const isToday = formatDateKey(selectedDate) === formatDateKey(todayDate)
  if (!isToday) return schedule.sections[0]?.id || null
  const nextSection = schedule.sections.find((section) =>
    (section.phases || []).some((phase) => (phase.items || []).some((item) => item.status === 'upcoming')),
  )
  return nextSection?.id || schedule.sections[0]?.id || null
}

export function getSectionLabel(selectedDate, todayDate) {
  const selectedKey = formatDateKey(selectedDate)
  const todayKey = formatDateKey(todayDate)
  if (selectedKey === todayKey) return 'Today'
  return formatLongDate(selectedKey)
}

export function formatCountdown(targetDate, now) {
  const diff = targetDate.getTime() - now.getTime()
  if (diff <= 0) return null
  const totalSeconds = Math.floor(diff / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return `${hours}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s left`
}

export function getSectionDateTime(dateKey, timeLabel) {
  const [time, meridiem] = timeLabel.trim().split(' ')
  const [hourValue, minuteValue] = time.split(':').map(Number)
  let hours = hourValue % 12
  if (meridiem?.toLowerCase() === 'pm') hours += 12
  const date = parseDateKey(dateKey)
  date.setHours(hours, minuteValue || 0, 0, 0)
  return date
}

export function ensureRecordCollections(record) {
  return {
    notifications: record.notifications || [],
    caregivers: record.caregivers || [],
    caregiverRequests: record.caregiverRequests || [],
  }
}

export function getStatusLabel(status) {
  if (status === 'taken_late') return 'Taken late'
  return status.charAt(0).toUpperCase() + status.slice(1)
}

export function getInitials(name) {
  return name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()
}

export { formatDateKey, formatLongDate, parseDateKey }
