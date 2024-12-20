import express from "express";
import {  login, logout, register,getDoctors,getDoctorOwnPlanning ,addUnavailableDay,deleteUnavailableDay,getDoctorUnavailableDays} from "../controllers/userController.js";
import { isAuthenticated ,isAuthorized} from "../middlewares/auth.js";



const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", isAuthenticated, logout);

// Route pour récupérer la liste des médecins, accessible uniquement aux patients
router.get("/doctors", isAuthenticated, getDoctors);
router.get("/doctor/planning", isAuthenticated, isAuthorized("Doctor"), getDoctorOwnPlanning);



/*
// Route pour que les médecins saisissent leurs jours non disponibles
router.post("/doctor/unavailable-days", isAuthenticated, addUnavailableDay);
// Route pour obtenir le planning du médecin connecté (pour le médecin)
router.get("/doctor/planning", isAuthenticated, isAuthorized("Doctor"), getDoctorOwnPlanning);
// Route to mark or unmark a day as unavailable
router.route('/unavailable-days').post(isAuthenticated, addUnavailableDay);
router.route('/update-unavailable-days').put(isAuthenticated, updateUnavailableDays);
// Route pour obtenir les jours non disponibles du médecin connecté*/
router.get("/doctor/unavailable-days", isAuthenticated, getDoctorUnavailableDays);
router.post("/doctor/unavailable-days", isAuthenticated, addUnavailableDay);

router.delete('/doctor/unavailable-days/:dayId', isAuthenticated, deleteUnavailableDay);

export default router;