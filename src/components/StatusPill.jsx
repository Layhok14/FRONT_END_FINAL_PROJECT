const labels = {
  taken: 'Taken',
  taken_late: 'Taken late',
  missed: 'Missed',
  upcoming: 'Upcoming',
}

const classes = {
  taken: 'bg-[rgba(63,174,140,0.12)] text-success',
  taken_late: 'bg-[rgba(241,163,61,0.14)] text-warning',
  missed: 'bg-[rgba(222,95,98,0.12)] text-danger',
  upcoming: 'bg-primary-soft text-primary-dark',
}

export default function StatusPill({ status, compact = false }) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${classes[status] || classes.upcoming} ${compact ? 'px-2.5 py-1 text-[11px]' : ''}`}>
      {labels[status] || status}
    </span>
  )
}
