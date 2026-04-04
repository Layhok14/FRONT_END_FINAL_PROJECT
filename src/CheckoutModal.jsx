import { useEffect, useMemo, useState } from 'react'
import Modal from './Modal'

const statusOptions = [
  { value: 'taken', label: 'Taken' },
  { value: 'taken_late', label: 'Taken Late' },
  { value: 'missed', label: 'Missed' },
]

export default function CheckoutModal({ open, onClose, section, medicationsById, onSubmit }) {
  const allIds = useMemo(() => section?.items.map((item) => item.medicationId) || [], [section])
  const [selectedIds, setSelectedIds] = useState(allIds)
  const [nextStatus, setNextStatus] = useState('taken')

  useEffect(() => {
    setSelectedIds(allIds)
    setNextStatus('taken')
  }, [allIds])

  if (!section) return null

  return (
    <Modal open={open} onClose={onClose} title={`Track medicines • ${section.title}`}>
      <div>
        <p className="text-sm text-text-soft">Click checkout to track the medicines you took for this meal phase.</p>
        <div className="mt-5 space-y-3">
          {section.items.map((item) => {
            const medication = medicationsById[item.medicationId]
            return (
              <label key={item.medicationId} className="flex items-start gap-3 rounded-[20px] border border-line bg-surface-soft p-4">
                <input type="checkbox" className="mt-1" checked={selectedIds.includes(item.medicationId)} onChange={(event) => setSelectedIds((current) => event.target.checked ? [...current, item.medicationId] : current.filter((id) => id !== item.medicationId))} />
                <div>
                  <div className="font-medium text-text-main">{medication.name}</div>
                  <div className="text-sm text-text-soft">{medication.dosage} • {medication.foodTiming}</div>
                </div>
              </label>
            )
          })}
        </div>
        <label className="mt-5 block">
          <span className="mb-2 block text-sm font-medium text-text-main">Update selected medicines to</span>
          <select className="w-full rounded-2xl border border-line px-4 py-3 outline-none focus:border-primary" value={nextStatus} onChange={(event) => setNextStatus(event.target.value)}>
            {statusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </label>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" className="rounded-full border border-line px-5 py-3 font-semibold text-text-main" onClick={onClose}>Cancel</button>
          <button type="button" className="rounded-full bg-primary px-5 py-3 font-semibold text-white disabled:opacity-60" disabled={!selectedIds.length} onClick={() => onSubmit(selectedIds, nextStatus)}>Save</button>
        </div>
      </div>
    </Modal>
  )
}
