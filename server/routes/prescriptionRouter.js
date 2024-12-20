import express from 'express';
import { createPrescription, getPrescriptionByAppointmentId, updatePrescription,getPendingPrescriptionsByPharmacyZone,updatePrescriptionToDelivered, acceptPrescriptionByPharmacy,getAcceptedPrescriptionsByLivreur, acceptPrescriptionByLivreur,getPrescriptionsByLivreurZone,acceptPrescription, getAcceptedPrescriptionsByPharmacy } from '../controllers/prescriptionController.js';
import { isAuthenticated } from '../middlewares/auth.js'; // Middleware pour vérifier l'authentification

const router = express.Router();

// Route pour créer une prescription
router.post('/appointments/:appointmentId/prescriptions', isAuthenticated, createPrescription);

router.put('/prescriptions/:prescriptionId', isAuthenticated, updatePrescription);

// Route pour récupérer l'ordonnance par ID de rendez-vous
router.get('/appointments/:appointmentId/prescriptions', isAuthenticated, getPrescriptionByAppointmentId);

// Route pour récupérer les prescriptions en attente par zone de pharmacie
router.get('/pharmacy/prescriptions', isAuthenticated, getPendingPrescriptionsByPharmacyZone);

// Route pour accepter une ordonnance par la pharmacie
router.put('/prescriptions/:prescriptionId/accept', isAuthenticated, acceptPrescriptionByPharmacy);

// Route pour accepter une ordonnance avec les détails des médicaments
router.post('/prescriptions/:prescriptionId/accept/details', isAuthenticated, acceptPrescription);

// Route pour récupérer les ordonnances acceptées par la pharmacie
router.get('/prescriptions/accepted', isAuthenticated, getAcceptedPrescriptionsByPharmacy);
router.get('/livreur/prescriptions',  isAuthenticated,getPrescriptionsByLivreurZone);
router.post('/prescriptions/:prescriptionId/accept',isAuthenticated, acceptPrescriptionByLivreur);
router.get('/prescriptions/accepted/livreur', isAuthenticated, getAcceptedPrescriptionsByLivreur);
router.put('/prescriptions/:prescriptionId/deliver', isAuthenticated, updatePrescriptionToDelivered);
export default router;
