import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import '../../assets/css/ordonnace.css';
import '../../assets/css/DoctorList.css';
import '../../assets/css/planning.css';

const CreatePrescriptionPopup = ({ appointmentId, patientId, onClose }) => {
  const [medications, setMedications] = useState([{ name: '', durations:'',usageInstructions: '' }]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [prescriptionId, setPrescriptionId] = useState(null);
  const [prescription, setPrescription] = useState(null);
  const [showPrintable, setShowPrintable] = useState(false);
  const [showPrescriptionPopup, setShowPrescriptionPopup] = useState(false);  // New state for showing the prescription popup

  // Function to load existing prescription if available
  const loadExistingPrescription = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(
        `http://localhost:5000/api/v1/prescription/appointments/${appointmentId}/prescriptions`, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success && response.data.prescription) {
        const prescriptionData = response.data.prescription;
        setMedications(prescriptionData.medications || []);
        setPrescription(prescriptionData); // Store the full prescription data
        setPrescriptionId(prescriptionData._id);
        setIsEditMode(true);
      }
    } catch (error) {
      console.error("Error loading prescription:", error);
      setStatus("Error loading prescription.");
    }
  };

  useEffect(() => {
    loadExistingPrescription();
  }, [appointmentId]);

  const handleMedicationChange = (index, e) => {
    const { name, value } = e.target;
    const newMedications = [...medications];
    newMedications[index][name] = value;
    setMedications(newMedications);
  };

  const addMedicationField = () => {
    setMedications([...medications, { name: '',durations:'', usageInstructions: '' }]);
  };

  const removeMedicationField = (index) => {
    const newMedications = medications.filter((_, i) => i !== index);
    setMedications(newMedications);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const url = isEditMode 
        ? `http://localhost:5000/api/v1/prescription/prescriptions/${prescriptionId}`
        : `http://localhost:5000/api/v1/prescription/appointments/${appointmentId}/prescriptions`;

      const method = isEditMode ? 'PUT' : 'POST';

      const response = await axios({
        method,
        url,
        data: {
          patientId: patientId,
          medicationsData: medications,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.message === "Ordonnance créée avec succès." || response.data.message === "Ordonnance mise à jour avec succès.") {
        setStatus('Prescription created/updated successfully!');
        onClose(); // Close the popup after success
      } else {
        setStatus('Error: ' + response.data.message);
      }
    } catch (error) {
      setStatus('Error creating/updating prescription: ' + error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const handlePrint = () => {
    const printContent = document.getElementById('printable-prescription').innerHTML;
    const originalContent = document.body.innerHTML;
  
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload(); // Recharge la page pour restaurer l'état initial
  };
  
  const handleShowPrescription = () => {
    if (prescription) {
      setShowPrescriptionPopup(true);  // Open the new popup with prescription details
    } else {
      setStatus('No prescription available to display.');
    }
  };

  return (
    <>
      <div className="popup">
        <div className="popup-content card">
          <button className="close-btn" onClick={onClose}>×</button>
          <h2>{isEditMode ? "Edit Prescription" : "Create Prescription"}</h2>
          <form onSubmit={handleSubmit}>
            {medications.map((med, index) => (
              <div key={index} className="medication-form">
                <div className="medication-row">
                  <input
                     className="form-control"
                    type="text"
                    name="name"
                    value={med.name}
                    placeholder="Medication Name"
                    onChange={(e) => handleMedicationChange(index, e)}
                    required
                  />
                    <input
                     className="form-control"
                    type="text"
                    name="durations"
                    value={med.durations}
                    placeholder="Medication Duration"
                    onChange={(e) => handleMedicationChange(index, e)}
                    required
                  />
                  <input
                     className="form-control"
                    type="text"
                    name="usageInstructions"
                    value={med.usageInstructions}
                    placeholder="Usage Instructions"
                    onChange={(e) => handleMedicationChange(index, e)}
                    required
                  />
                </div>
              </div>
            ))}
            <div className="appointment-actions">
              <button
                type="button"
                className="btn-common btn-ordonnace"
                onClick={addMedicationField}
              >
                Add
              </button>
              <br />
              <button
                type="submit"
                className="btn-comm btn-ordonnace"
                disabled={loading}
              >
                {isEditMode ? 'Update' : 'Create'}
              </button>
               {/* Button to Show Prescription */}
          {prescription && !showPrintable && (
            <button
              type="button"
              className="btn-common btn-ordonnace"
              onClick={handleShowPrescription}
            >
              See
            </button>
          )}
            </div>
          </form>
         
        </div>
      </div>

      {showPrescriptionPopup && prescription && (
  <div className="popup">
    <div className="popup-content prescription-page">
      <button className="close-btn" onClick={() => setShowPrescriptionPopup(false)}>×</button>
      
      {/* Conteneur imprimable */}
      <div id="printable-prescription">
        <div className="prescription-container">
          {/* Header with Doctor Info and Date */}
          <div className="prescription-header">
            <div className="doctor-info">
              <h2>Dr. {prescription.appointment?.doctor?.name || 'Dr. Inconnu'}</h2>
              <h6>Specialty {prescription.appointment?.doctor?.specialty || 'Spécialité non précisée'}</h6>
            </div>
            <div className="date-info">
              <p>{new Date(prescription.createdAt).toLocaleDateString()}</p>
              
            </div>
          </div>

          <div className="patient-info">
            <p><strong>Patient:</strong> {prescription.appointment?.patient?.name || 'Inconnu'}<br />
               <strong>Phone:</strong> {prescription.appointment?.patient?.phone || 'Inconnu'}</p>
          </div>

          {/* Patient Info */}
         
 {/* Logo Section */}
 <div className="logo-section">
            <img src="img/ord.PNG" alt="Logo" className="logo" />
          </div>
          {/* Medications */}
          <div className="medication-list">
            <h3>Pharmaceuticals:</h3>
            <ul>
              {prescription.medications?.map((med, index) => (
                <li key={index}>
                  <strong>{med.name}: </strong> {med.usageInstructions} {med.durations} 
                </li>
              ))}
            </ul>
          </div>

          {/* Footer with Doctor Contact Info */}
          <div className="footer-info">
            <p><strong>Phone:</strong> {prescription.appointment?.doctor?.phone || 'Inconnu'}<br />
            <strong>Office address:</strong> {prescription.appointment?.doctor?.address || 'Adresse non précisée'}</p>
          </div>
        </div>
      </div>

      {/* Print Button */}
      <button className="btn-print" onClick={handlePrint}>Print</button>
    </div>
  </div>
)}

    </>
  );
};

CreatePrescriptionPopup.propTypes = {
  appointmentId: PropTypes.string.isRequired,
  patientId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CreatePrescriptionPopup;