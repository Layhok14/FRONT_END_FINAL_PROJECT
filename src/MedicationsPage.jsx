import MedicationSection from '../components/MedicationSection'
import useDashboardContext from './useDashboardContext'

export default function MedicationsPage() {
  const {
    activeMedications,
    filteredActiveMedications,
    search,
    setDetailMedicationId,
    setSearch,
    setTypeFilter,
    typeFilter,
  } = useDashboardContext()

  return (
    <div className="grid gap-6">
      <section className="rounded-[28px] border border-line bg-white p-5 shadow-[var(--shadow)]">
        <div className="grid gap-4 md:grid-cols-[1fr_220px]">
          <input value={search} onChange={(event) => setSearch(event.target.value)} className="w-full rounded-2xl border border-line px-4 py-3 outline-none focus:border-primary" placeholder="Search medicine name" />
          <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)} className="w-full rounded-2xl border border-line px-4 py-3 outline-none focus:border-primary">
            <option value="all">All medicine types</option>
            {[...new Set(activeMedications.map((medication) => medication.category))].map((category) => <option key={category} value={category}>{category}</option>)}
          </select>
        </div>
      </section>
      <MedicationSection
        title="Current medications"
        subtitle="Current medicines with the same details shown in the home tracking modal."
        items={filteredActiveMedications}
        onOpenMedication={setDetailMedicationId}
      />
    </div>
  )
}
