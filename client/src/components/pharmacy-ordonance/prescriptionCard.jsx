import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Pour l'icône
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'; // Icône d'acceptation
import axios from 'axios'; // Pour effectuer la requête PUT
import '../../assets/css/listeOrdonnace.css';

// Fonction pour formater la date
const formatDate = (date) => {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString('en-US', options); // Format anglais
};

// Composant PrescriptionCard
const PrescriptionCard = ({ prescription }) => {
  const [isAccepting, setIsAccepting] = useState(false); // Pour gérer l'état de l'acceptation en cours

  // Fonction pour accepter l'ordonnance
  const acceptPrescription = async (prescriptionId) => {
    try {
      setIsAccepting(true); // L'acceptation est en cours
      
      // Récupérer le token d'authentification depuis le localStorage (ou autre méthode)
      const token = localStorage.getItem('authToken');

      // Si le token n'est pas trouvé, afficher une alerte et arrêter la requête
      if (!token) {
        alert('Vous devez être authentifié pour accepter cette ordonnance.');
        return;
      }

      // Effectuer la requête PUT avec le token dans les en-têtes
      const response = await axios.put(
        `http://localhost:5000/api/v1/prescription/prescriptions/${prescriptionId}/accept`,
        {}, // Corps de la requête vide
        {
          headers: {
            Authorization: `Bearer ${token}`, // Ajouter le token dans les headers
          }
        }
      );

      // Vérifier la réponse du serveur
      if (response.data.success) {
        alert('Ordonnance acceptée avec succès!');
      }
    } catch (error) {
      console.error('Erreur lors de l\'acceptation de l\'ordonnance', error);
      alert('Une erreur est survenue lors de l\'acceptation de l\'ordonnance.');
    } finally {
      setIsAccepting(false); // Fin du processus d'acceptation
    }
  };

  return (
    <div className="col-sm-6 col-md-4 col-lg-4">
      <div className="card mb-4 shadow-sm">
        <div className="card-body d-flex flex-column">
      
          {/* Affichage du statut si "Pending" */}
          {prescription.status === "Pending" && (
            <div className="status-not-completed mt-3" >
              <span className="badge badge-warningg" >Accept the prescription</span>
            </div>
          )}

          {/* Affichage du statut si "Not completed" */}
          {prescription.status === "Not completed" && (
            <div className="status-not-completed mt-3">
              <span className="badge badge-warning">Complete the prescription</span>
            </div>
          )}

          {/* Bouton d'acceptation au-dessus de la liste des médicaments */}
          <div className="d-flex justify-content-center mt-3">
          <FontAwesomeIcon
  icon={faCheckCircle}
  className="btn-accept "
  onClick={() => acceptPrescription(prescription._id)}
  disabled={isAccepting}
/>

          </div>

          {/* Partie droite : Médecin, Adresse, Téléphone et Date */}
          <div className="d-flex flex-column align-items-end mb-3">
            <p><strong>Dr. {prescription.appointment?.doctor?.name || 'Nom Médecin'}</strong></p>
            <p><strong>Office address: </strong>{prescription.appointment?.doctor?.address || 'Adresse Médecin'}</p>
            <p><strong>Phone: </strong>{prescription.appointment?.doctor?.phone || 'Téléphone Médecin'}</p>
            <p>{formatDate(prescription.appointment?.date)}</p>
          </div>

          <div className="d-flex justify-content-start align-items-center mb-3">
            <h5 className="card-title">{prescription.appointment?.patient?.name || 'Nom Patient'}</h5>
          </div>

          {/* Icône d'ordonnance au centre avec une couleur bleu primaire */}
          <div className="text-center mb-3">
          
            <img src="img/ord.PNG" alt="Logo" className="logo" />
       
          </div>

          {/* Liste des médicaments : Chaque élément sous forme de ligne (nom, quantité, usage) */}
          <div className="medicaments-list mb-3">
            <h6>Pharmaceuticals :</h6>
            <ul>
              {prescription.medications
                .filter((med) => !med.Check) // Filtrer les médicaments dont le Check est false
                .map((med) => (
                  <ul key={med._id}>
                    <li><strong></strong> {med.name}</li>
                 
                  </ul>
                ))}
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
};

// Définir les props attendues par PrescriptionCard
PrescriptionCard.propTypes = {
  prescription: PropTypes.object.isRequired,
};

export default PrescriptionCard;
