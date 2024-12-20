import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../assets/css/myOrdonnace.css';

const PrescriptionList = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [updatedMedications, setUpdatedMedications] = useState([]);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5000/api/v1/prescription/prescriptions/accepted',
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            },
          }
        );
        setPrescriptions(response.data.prescriptions || []);
      } catch (err) {
        setError('Erreur lors de la récupération des ordonnances.');
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, []);

  const handleEditClick = (prescription) => {
    setSelectedPrescription(prescription);
    setUpdatedMedications(prescription.medications || []);
    setIsEditing(true);
  };

  const handleSaveChanges = async () => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/v1/prescription/prescriptions/${selectedPrescription._id}/accept/details`,
        { medications: updatedMedications },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        }
      );

      setPrescriptions((prev) =>
        prev.map((p) =>
          p._id === selectedPrescription._id ? response.data.prescription : p
        )
      );

      setIsEditing(false);
      setSelectedPrescription(null);
    } catch (err) {
      setError("Erreur lors de l'enregistrement des modifications.");
    }
  };

  const handleMedicationChange = (medicationId, field, value) => {
    const updatedList = updatedMedications.map((med) =>
      med._id === medicationId ? { ...med, [field]: value } : med
    );
    setUpdatedMedications(updatedList);
  };

  const handleAvailabilityToggle = (medicationId) => {
    const updatedList = updatedMedications.map((med) =>
      med._id === medicationId
        ? { ...med, status: med.status === 'exists' ? 'does not exist' : 'exists' }
        : med
    );
    setUpdatedMedications(updatedList);
  };

  const handleRemoveMedication = (medicationId) => {
    const updatedList = updatedMedications.filter((med) => med._id !== medicationId);
    setUpdatedMedications(updatedList);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Accepted by pharmacy':
        return 'badge-primary';
      case 'Not completed':
        return 'badge-warning';
      case 'Completed by pharmacy':
        return 'badge-success';
      default:
        return 'badge-secondary';
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <div className="prescriptions-list">
        {prescriptions.length === 0 ? (
          <p>Aucune ordonnance acceptée trouvée.</p>
        ) : (
          <div className="cardd-container">
            {prescriptions.map((prescription) => (
              <div className="cardd mb-4 shadow-sm" key={prescription._id}>
                <div className="status-info mt-3">
                  <center>
                    <span className={`badge ${getStatusClass(prescription.status)}`}>
                      {prescription.status}
                    </span>
                  </center>
                </div>
                <div className="cardd-body d-flex flex-column">
                  <div className="d-flex justify-content-between mb-3">
                    <div>
                      <h5 className="cardd-title">
                        {prescription.appointment?.patient?.name || 'Nom Patient'}
                      </h5>
                      <p>{prescription.appointment?.patient?.phone || ''}</p>
                    </div>
                    <div className="text-right">
                      <p>
                        <strong>Dr. {prescription.appointment?.doctor?.name}</strong>
                      </p>
                      <p>
                        <strong>Office address: </strong>{' '}
                        {prescription.appointment?.doctor?.address || 'Non spécifiée'}
                      </p>
                    </div>
                  </div>
                  <div className="medicamentss-list mb-3">
                    <h6>Pharmaceuticals</h6>
                    <ul>
                      {prescription.medications.map((med) => (
                        <li key={med._id}>
                          <p><strong>Name:</strong> {med.name}</p>
                          {med.quantity !== 0 && (
                            <p><strong>Quantity:</strong> {med.quantity}</p>
                          )}
                          {med.price !== 0 && (
                            <p><strong>Price:</strong> {med.price} €</p>
                          )}
                          <p><strong>Duration:</strong> {med.durations}</p>
                          <p><strong>Instructions:</strong> {med.usageInstructions}</p>
                          <p>
                            <strong>Status:</strong>{' '}
                            {med.status === 'does not exist' ? (
                              <span className="text-danger">Not available</span>
                            ) : (
                              <span className="text-success">Available</span>
                            )}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {['Not completed', 'Accepted by pharmacy', 'Completed by pharmacy'].includes(
                    prescription.status
                  ) && (
                    <center>
                      <button
                        onClick={() => handleEditClick(prescription)}
                        className="btn btn-blue mt-3"
                      >
                        update
                      </button>
                    </center>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isEditing && selectedPrescription && (
        <div className="mmodal">
          <div className="mmodal-content">
            <h5>Modifier l&apos;ordonnance</h5>
            <ul>
              {updatedMedications.map((med) => (
                <li key={med._id} className="medication-row">
                  <div className="medication-fields">
                    <label>
                      Nom:
                      <input
                        type="text"
                        value={med.name}
                        onChange={(e) =>
                          handleMedicationChange(med._id, 'name', e.target.value)
                        }
                      />
                    </label>
                    <label>
                      Prix:
                      <input
                        type="number"
                        value={med.price}
                        onChange={(e) =>
                          handleMedicationChange(med._id, 'price', e.target.value)
                        }
                      />
                    </label>
                    <label>
                      Quantité:
                      <input
                        type="number"
                        value={med.quantity}
                        onChange={(e) =>
                          handleMedicationChange(med._id, 'quantity', e.target.value)
                        }
                      />
                    </label>
                    <label>
                      Disponible:
                      <input
                        type="checkbox"
                        checked={med.status === 'exists'}
                        onChange={() => handleAvailabilityToggle(med._id)}
                      />
                    </label>

                    <button
                      className="close-btn"
                      onClick={() => handleRemoveMedication(med._id)}
                    >
                      X
                    </button>
                  </div>
                </li>
              ))}
            </ul>   
            <center>
              <button onClick={handleSaveChanges} className="btn btn-successs">
                Sauvegarder
              </button>
            </center>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrescriptionList;
