import { CloseIcon } from './Icons'

export default function Modal({ open, title, onClose, children, wide = false }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(15,23,42,0.35)] p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className={`w-full overflow-hidden rounded-[28px] border border-line bg-white shadow-[var(--shadow)] ${wide ? 'max-w-5xl' : 'max-w-3xl'}`}>
        <div className="flex items-center justify-between border-b border-line px-5 py-4 sm:px-6">
          <h3 className="font-display text-lg font-semibold text-text-main">{title}</h3>
          <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-text-soft transition hover:border-primary hover:text-primary" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
        <div className="max-h-[80vh] overflow-y-auto p-5 sm:p-6">{children}</div>
      </div>
    </div>
  )
}
