export default function MedicationModal({ med, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal">

        <img src={med.image} alt={med.name} className="modal-img"/>

        <h2>{med.name}</h2>
        <p>{med.dosage}</p>
        <p>{med.frequency}</p>

        <button className="take-btn">
          Mark as Taken
        </button>

        <button className="close-btn" onClick={onClose}>
          ✖
        </button>

      </div>
    </div>
  );
}