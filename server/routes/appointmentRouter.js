import express from "express";
import {
  bookAppointment,getAppointmentsByDate,completeAppointment,confirmAppointment,cancelAppointment

} from "../controllers/appointmentController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// Route pour réserver un rendez-vous
router.post("/book", isAuthenticated, bookAppointment);
router.get("/appointments", isAuthenticated, getAppointmentsByDate);
// Dans votre fichier de routes
router.put('/appointments/:id/complete',isAuthenticated, completeAppointment);
// Dans votre fichier de routes
router.put('/appointments/:id/confirm', isAuthenticated,confirmAppointment);
router.put('/appointments/:id/cancel', isAuthenticated,cancelAppointment);

export default router;
