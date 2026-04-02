export default function SettingsPage() {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <section className="rounded-[28px] border border-line bg-white p-5 shadow-[var(--shadow)]">
        <h3 className="font-display text-xl font-semibold text-text-main">Profile access</h3>
        <p className="mt-1 text-sm text-text-soft">Use the patient profile modal to edit identity and contact information.</p>
      </section>
      <section className="rounded-[28px] border border-line bg-white p-5 shadow-[var(--shadow)]">
        <h3 className="font-display text-xl font-semibold text-text-main">Settings access</h3>
        <p className="mt-1 text-sm text-text-soft">The settings modal is now separate from the profile modal and handles password and sign-out actions.</p>
      </section>
    </div>
  )
}
