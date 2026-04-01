export default function BrandMark({ compact = false }) {
  return (
    <div className={`flex items-center ${compact ? 'gap-2' : 'gap-3'}`}>
      <img src="/favicon.svg" alt="Thnam logo" className={compact ? 'h-9 w-9' : 'h-11 w-11'} />
      <div>
        <div className="font-display text-lg font-semibold text-text-main">Thnam</div>
        {!compact && <div className="text-sm text-text-soft">Medication care companion</div>}
      </div>
    </div>
  )
}
