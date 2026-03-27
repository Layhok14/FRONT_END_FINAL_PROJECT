export default function MedicationCard({ med, onClick }) {
  return (
    <div className="med-card" onClick={onClick}>
      <img src={med.image} alt={med.name} />
      <h3>{med.name}</h3>
      <p>{med.dosage}</p>
      <p>{med.frequency}</p>
    </div>
  );
}