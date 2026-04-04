import Logo from '../assets/icons/Shared/thnam.svg'
export default function BrandMark({ compact = false }) {
  return (
    <div className={`flex items-center ${compact ? 'gap-2' : 'gap-3'}`}>
      <div className={`bg-[#5AB8E7]/10 ${compact ? 'h-10 w-10' : 'h-12 w-12'} rounded-4xl flex justify-center items-center gap-2`}>
        <img src={Logo} className={compact ? 'h-5 w-5' : 'h-9 w-9'} />
      </div>
      <div>
        <span className="font-bold text-black text-2xl">Thnam</span>
        {!compact && <div className="text-sm text-text-soft">Medication care companion</div>}
      </div>
    </div>
  )
}
