import { Prescription} from '../models/prescriptionSchema.js'; // Assurez-vous que le chemin d'importation est correct
import { Appointment } from '../models/appointmentSchema.js'; // Modèle des rendez-vous

import { User} from '../models/userSchema.js'; // Modèle des utilisateurs (patients, médecins, pharmacies)


export async function createPrescription(req, res) {
  const { patientId, medicationsData } = req.body;
  const doctorId = req.user._id;  // L'ID du médecin extrait du middleware d'authentification
  const appointmentId = req.params.appointmentId;

  // Vérifier que le rendez-vous existe
  const appointment = await Appointment.findOne({ _id: appointmentId, patient: patientId, doctor: doctorId });
  if (!appointment) {
    return res.status(400).json({ message: "Rendez-vous invalide ou accès non autorisé." });
  }

  // Créer les enregistrements de médicaments
  const medications = medicationsData.map(medData => ({
    name: medData.name,
    durations:medData.durations,
    usageInstructions: medData.usageInstructions,
  }));

  // Créer l'ordonnance
  const prescription = new Prescription({
    appointment: appointmentId,
    medications: medications,
  });

  await prescription.save();
  return res.status(201).json({ message: "Ordonnance créée avec succès.", prescription });
}

// Fonction pour récupérer l'ordonnance par ID de rendez-vous(Doctor ou Patient)
export const getPrescriptionByAppointmentId = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const prescription = await Prescription.findOne({ appointment: appointmentId })
    .populate({
      path: 'appointment',
      populate: [
        {
          path: 'patient', // Peupler le patient
          select: 'name phone'   // Sélectionner uniquement le nom du patient
        },
        {
          path: 'doctor',  // Peupler le médecin
          select: 'name address phone specialty'  // Sélectionner le nom et l'adresse du médecin
        }
      ]
    })
      .populate('medications'); // pour obtenir les détails des médicaments

    if (!prescription) {
      return res.status(404).json({ message: "Ordonnance non trouvée pour ce rendez-vous." });
    }

    res.status(200).json({
      success: true,
      prescription,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération de l'ordonnance",
      error: error.message,
    });
  }
};
// Fonction pour modifier une ordonnance
export const updatePrescription = async (req, res) => {
  try {
    const { prescriptionId } = req.params; // ID de l'ordonnance à modifier
    const { medicationsData} = req.body; // Nouveaux médicaments et statut

    // Rechercher l'ordonnance par son ID
    const prescription = await Prescription.findById(prescriptionId)
      .populate('appointment')  // Récupérer les détails du rendez-vous
      .populate('medications'); // Récupérer les détails des médicaments existants

    if (!prescription) {
      return res.status(404).json({ message: "Ordonnance non trouvée." });
    }

    // Vérifier si l'utilisateur est autorisé à modifier l'ordonnance (par exemple, le médecin)
    const doctorId = req.user._id;
    if (prescription.appointment.doctor.toString() !== doctorId.toString()) {
      return res.status(403).json({ message: "Accès non autorisé. Vous ne pouvez pas modifier cette ordonnance." });
    }

    // Mettre à jour les médicaments de l'ordonnance
    if (medicationsData && medicationsData.length > 0) {
      const updatedMedications = medicationsData.map(medData => ({
        name: medData.name,
        durations: medData.durations,
        quantity: medData.quantity,
        usageInstructions: medData.usageInstructions,
      }));
      prescription.medications = updatedMedications;
    }

   
    // Sauvegarder les modifications de l'ordonnance
    await prescription.save();

    // Répondre avec l'ordonnance mise à jour
    res.status(200).json({
      success: true,
      message: "Ordonnance mise à jour avec succès.",
      prescription,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la mise à jour de l'ordonnance",
      error: error.message,
    });
  }
};

// Fonction pour récupérer les ordonnances en attente par zone de pharmacie
export const getPendingPrescriptionsByPharmacyZone = async (req, res) => {
  try {
    const { zone } = req.user; // Assurez-vous que req.user a été défini par le middleware d'authentification

    // Trouver tous les patients dans la zone spécifiée
    const patientsInZone = await User.find({ zone: zone, role: 'Patient' });

    if (patientsInZone.length === 0) {
      return res.status(404).json({ message: "Aucun patient trouvé dans cette zone." });
    }

    const prescriptions = await Prescription.find({
      appointment: {
        $in: await Appointment.find({
          patient: {
            $in: patientsInZone.map(patient => patient._id),
          },
        }).distinct('_id'), // Obtenez uniquement les IDs des rendez-vous
      },
      status: { $in: ["Pending", "Not completed"] }  // Filtrer pour les prescriptions en attente
    })
    .populate({
      path: 'appointment',
      populate: [
        {
          path: 'patient', // Peupler le patient
          select: 'name'   // Sélectionner uniquement le nom du patient
        },
        {
          path: 'doctor',  // Peupler le médecin
          select: 'name address phone'  // Sélectionner le nom et l'adresse du médecin
        }
      ]
    })
    .populate('medications');

    res.status(200).json({
      success: true,
      prescriptions,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des ordonnances en attente",
      error: error.message,
    });
  }
};

// Fonction pour accepter une ordonnance par la pharmacie
export const acceptPrescriptionByPharmacy = async (req, res) => {
  try {
    const pharmacyId = req.user._id; // ID de la pharmacie connectée
    const { prescriptionId } = req.params;

    const updatedPrescription = await Prescription.findByIdAndUpdate(
      prescriptionId,
      {
        $set: { status: "Accepted by pharmacy" },
        $addToSet: { PharmacyAccepted: pharmacyId }, // Ajouter l'ID de pharmacie si non déjà présent
        updatedAt: Date.now(),
      },
      { new: true }
    )
    .populate('appointment')
    .populate('medications');

    if (!updatedPrescription) {
      return res.status(404).json({ message: "Ordonnance non trouvée." });
    }

    res.status(200).json({
      success: true,
      message: "Ordonnance acceptée par la pharmacie.",
      prescription: updatedPrescription,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de l'acceptation de l'ordonnance",
      error: error.message,
    });
  }
};

export const acceptPrescription = async (req, res) => {
  try {
      const { medications } = req.body; // Liste des médicaments à mettre à jour
      const pharmacyId = req.user._id; // ID de la pharmacie
      const { prescriptionId } = req.params; // ID de l'ordonnance

      if (!medications || medications.length === 0) {
          return res.status(400).json({ message: "Aucun médicament fourni." });
      }

      // Récupérer l'ordonnance par ID
      const prescription = await Prescription.findById(prescriptionId);
      if (!prescription) {
          return res.status(404).json({ message: "Ordonnance non trouvée." });
      }

      let totalAmount = 0;

      // Parcourir les médicaments envoyés dans la requête
      for (const update of medications) {
          // Trouver le médicament correspondant par son _id
          const medication = prescription.medications.find(
              (med) => med._id.toString() === update._id
          );
          
          if (!medication) continue; // Si aucun médicament correspondant n'est trouvé, passer au suivant

          // Si le médicament est marqué comme "does not exist"
          if (update.status === "does not exist") {
              medication.refuser = (medication.refuser || 0) + 1;
              if (medication.refuser >= 3) {
                  medication.status = "does not exist";
              }
              continue;
          }

          // Mettre à jour les détails du médicament
          medication.price = update.price || medication.price;
          medication.quantity = update.quantity || medication.quantity;
          medication.name = update.name || medication.name;
          medication.Check = medication.price > 0;

          if (medication.Check) {
              medication.PharmacyAcceptedmedication = pharmacyId;
              totalAmount += medication.price * medication.quantity;
          }
      }

      // Mettre à jour le statut de l'ordonnance
      prescription.prescriptionAmount = totalAmount;
      prescription.status = prescription.medications.every(
          (med) => med.Check || med.status === "does not exist"
      )
          ? "Completed by pharmacy"
          : "Not completed";

      prescription.markModified('medications');
      await prescription.save();

      res.status(200).json({
          success: true,
          message: "Ordonnance mise à jour avec succès.",
          prescription,
      });
  } catch (error) {
      console.error("Erreur lors de la mise à jour de l'ordonnance:", error);
      res.status(500).json({
          message: "Erreur lors de la mise à jour de l'ordonnance.",
          error: error.message,
      });
  }
};





export const getAcceptedPrescriptionsByPharmacy = async (req, res) => {
  try {
    const pharmacyId = req.user._id;

    // Définir les statuts souhaités
    const validStatuses = [
      "Accepted by pharmacy",
      "Not completed",
      "Completed by pharmacy",
      "Accepted by livreur"
    ];

    const prescriptions = await Prescription.find({
      status: { $in: validStatuses }, // Filtrer par statut
      $or: [ // Filtrer selon l'ID de la pharmacie dans PharmacyAccepted ou PharmacyAcceptedmedication
        { PharmacyAccepted: pharmacyId },
        { "medications.PharmacyAcceptedmedication": pharmacyId },
        { "medications.PharmacyAcceptedmedication": { $exists: false } } // Les médicaments sans pharmacie acceptée
      ]
    })
    .populate({
      path: 'medications',
      match: { PharmacyAcceptedmedication: pharmacyId }, // Filtrer les médicaments acceptés par la pharmacie
      select: 'name quantity usageInstructions price', // Sélectionner les champs pertinents
    })
    .populate({
      path: 'appointment',
      populate: [
        {
          path: 'patient', // Peupler le patient
          select: 'name phone'   // Sélectionner uniquement le nom du patient
        },
        {
          path: 'doctor',  // Peupler le médecin
          select: 'name address phone'  // Sélectionner le nom et l'adresse du médecin
        }
      ]
    })
    // Ajouter le peuplement du livreur uniquement si l'état est "Accepted by livreur"
    .populate({
      path: 'livreurAccepted',
      select: 'name phone', // Sélectionner le nom et le téléphone du livreur
      match: { status: 'Accepted by livreur' } // Ne peupler que si l'état est "Accepted by livreur"
    })
    .exec();

    // Réponse avec les ordonnances récupérées
    res.status(200).json({
      success: true,
      prescriptions,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des ordonnances acceptées pour la pharmacie",
      error: error.message,
    });
  }
};



export const getPrescriptionsByLivreurZone = async (req, res) => {
  try {
    const { zone } = req.user; // Assurez-vous que req.user a été défini par le middleware d'authentification

    // Trouver tous les patients dans la zone spécifiée
    const patientsInZone = await User.find({ zone: zone, role: 'Patient' });

    if (patientsInZone.length === 0) {
      return res.status(404).json({ message: "Aucun patient trouvé dans cette zone." });
    }

    const prescriptions = await Prescription.find({
      appointment: {
        $in: await Appointment.find({
          patient: {
            $in: patientsInZone.map(patient => patient._id),
          },
        }).distinct('_id'), // Obtenez uniquement les IDs des rendez-vous
      },
      status: { $in: ["Completed by pharmacy"] }  // Filtrer pour les prescriptions en attente
    })
    .populate('appointment')
    .populate('medications');

    res.status(200).json({
      success: true,
      prescriptions,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des ordonnances en attente",
      error: error.message,
    });
  }
};
// Fonction pour accepter une ordonnance par le livreur
export const acceptPrescriptionByLivreur = async (req, res) => {
  try {
    const livreurId = req.user._id; // ID du livreur connecté
    const {  livreurAmount } = req.body; // Utilisez "livreurAmount" ici
    const { prescriptionId } = req.params;
    // Trouver l'ordonnance par son ID
    const prescription = await Prescription.findById(prescriptionId);

    if (!prescription) {
      return res.status(404).json({ message: "Ordonnance non trouvée." });
    }

    // Mettre à jour les champs de l'ordonnance
    prescription.status = "Accepted by livreur"; // Mettre à jour le statut
    prescription.livreurAccepted = livreurId; // Enregistrer l'ID du livreur
    prescription.livreurAmount = livreurAmount; // Enregistrer le montant du livreur
    prescription.totalAmount = prescription.livreurAmount + prescription.prescriptionAmount; // Calculer le montant total

    // Enregistrer les modifications de l'ordonnance
    await prescription.save();

    res.status(200).json({
      success: true,
      message: "Ordonnance acceptée par le livreur.",
      prescription,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de l'acceptation de l'ordonnance par le livreur",
      error: error.message,
    });
  }
};
// Fonction pour récupérer les ordonnances acceptées par le livreur connecté
export const getAcceptedPrescriptionsByLivreur = async (req, res) => {
  try {
    const livreurId = req.user._id; // ID du livreur connecté

    // Rechercher les ordonnances acceptées par le livreur
    const prescriptions = await Prescription.find({
      livreurAccepted: livreurId,
      status: "Accepted by livreur" // Statut des ordonnances que le livreur a acceptées
    })
    .populate('appointment') // Pour récupérer les détails du rendez-vous
    .populate('medications'); // Pour récupérer les détails des médicaments

    if (!prescriptions || prescriptions.length === 0) {
      return res.status(404).json({ message: "Aucune ordonnance acceptée trouvée pour ce livreur." });
    }

    res.status(200).json({
      success: true,
      prescriptions,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des ordonnances acceptées par le livreur",
      error: error.message,
    });
  }
};
// Fonction pour modifier l'état de l'ordonnance par le livreur
export const updatePrescriptionToDelivered = async (req, res) => {
  try {
    const livreurId = req.user._id; // ID du livreur connecté
    const { prescriptionId } = req.params;

    // Trouver l'ordonnance par son ID
    const prescription = await Prescription.findById(prescriptionId);

    if (!prescription) {
      return res.status(404).json({ message: "Ordonnance non trouvée." });
    }

    // Vérifier que l'ordonnance a été acceptée par le livreur
    if (prescription.livreurAccepted.toString() !== livreurId.toString()) {
      return res.status(403).json({ message: "Accès non autorisé. Vous ne pouvez pas modifier cette ordonnance." });
    }

    // Mettre à jour l'état de l'ordonnance
    prescription.status = "Deliver livreur"; // Mettre à jour le statut
    prescription.dateLivraisonAt = Date.now(); // Enregistrer la date de livraison

    // Enregistrer les modifications de l'ordonnance
    await prescription.save();

    res.status(200).json({
      success: true,
      message: "Ordonnance marquée comme livrée.",
      prescription,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la mise à jour de l'ordonnance.",
      error: error.message,
    });
  }
};
