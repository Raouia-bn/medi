import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PrescriptionCard from './prescriptionCard'; // Assurez-vous que le chemin est correct

const PendingPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fonction pour récupérer les ordonnances en attente
  const fetchPrescriptions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/prescription/pharmacy/prescriptions', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Token d'authentification si nécessaire
        },
      });
      setPrescriptions(response.data.prescriptions);
      setLoading(false);
    } catch (err) {
      setError('Erreur lors de la récupération des ordonnances');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container">
     
      <div className="row">
        {prescriptions.length === 0 ? (
          <p>Aucune ordonnance en attente dans cette zone.</p>
        ) : (
          prescriptions.map((prescription) => (
            <PrescriptionCard key={prescription._id} prescription={prescription} />
          ))
        )}
      </div>
    </div>
  );
};

export default PendingPrescriptions;
