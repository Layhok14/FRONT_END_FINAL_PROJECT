import StatusPill from './StatusPill'

export default function MedicationCard({ medication, status, amount, remark, onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex min-h-57.5 flex-col rounded-[22px] border border-line bg-white p-3 text-left transition hover:border-primary hover:shadow-sm"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex h-28 w-full items-center justify-center rounded-[18px] bg-surface-soft">
          {medication.imageUrl ? (
            <img src={medication.imageUrl} alt={medication.name} className="h-full w-full rounded-[18px] object-contain p-2" />
          ) : (
            <div className="text-center text-sm text-text-soft">
              <div className="font-medium text-text-main">{medication.name}</div>
              <div>Medicine image</div>
            </div>
          )}
        </div>
      </div>
      <div className="mb-2 flex items-center justify-between gap-2">
        <h4 className="line-clamp-1 font-medium text-text-main">{medication.name}</h4>
        <StatusPill status={status} compact />
      </div>
      <p className="text-sm text-text-soft">Amount: {amount || medication.dosage}</p>
      <div className="mt-1 min-h-10 text-sm text-text-soft">
        <span>Remark: </span>
        <span className="font-medium text-text-main [display:-webkit-box] overflow-hidden [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
          {remark || medication.remark}
        </span>
      </div>
    </button>
  )
}
