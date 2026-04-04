import { useState } from "react";
import MedicationCard from "../../Components/Patient/Medication/MedicationCard";
import MedicationModal from "../../Components/Patient/Medication/MedicationModal";

import "../../Styling/Patient/Medications.css";

export default function Medications() {
  const [selectedMed, setSelectedMed] = useState(null);

  const meds = [
    {
      id: 1,
      name: "Lisinopril",
      dosage: "10mg",
      frequency: "Once Daily",
      image: "/src/assets/images/Synthroid.jpg"
    },
    {
      id: 2,
      name: "Vitamin D3",
      dosage: "5000 IU",
      frequency: "Daily",
      image: "/src/assets/images/tea.jpg"
    }
  ];

  return (
    <>
      <Navbar />

      <div className="med-page">
        <h2>Your Cabinet</h2>

        <div className="med-grid">
          {meds.map((med) => (
            <MedicationCard
              key={med.id}
              med={med}
              onClick={() => setSelectedMed(med)}
            />
          ))}
        </div>
      </div>

      {selectedMed && (
        <MedicationModal
          med={selectedMed}
          onClose={() => setSelectedMed(null)}
        />
      )}
    </>
  );
}