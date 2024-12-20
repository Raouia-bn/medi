
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import { v2 as cloudinary } from "cloudinary";
import { sendToken } from "../utils/jwtToken.js";

import { Appointment } from "../models/appointmentSchema.js"; // Assurez-vous d'importer votre modèle de rendez-vous
import moment from 'moment'; // Assurez-vous d'avoir moment.js installé
export const register = catchAsyncErrors(async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      password,
      zone,
      role,
      specialty,
      experience,
      priceConsultation,
      
      birthday,
      Insurancenumber,
      payment,
      opening,
       vehicle,
       availability,
       coverarea
    } = req.body;

    if (!name || !email || !phone || !address || !password || !role  ) {
      return next(new ErrorHandler("All fileds are required.", 400));
    }
   
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ErrorHandler("Email is already registered.", 400));
    }
    const userData = {
      name,
      email,
      phone,
      address,
      zone,
      password,
      role,
      specialty,
      experience,
      priceConsultation,
      
      birthday,
      Insurancenumber,
      payment,
        opening,
       vehicle,
       availability,
       coverarea
    };
   
    const user = await User.create(userData);
    sendToken(user, 201, res, "User Registered.");
  } catch (error) {
    next(error);
  }
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Email and password are required.", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or password.", 400));
  }

  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password.", 400));
  }

  sendToken(user, 200, res, "User logged in successfully.");
});


export const logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "Logged out successfully.",
    });
});
/**  Fonction pour récupérer la liste des médecins
export const getDoctors = catchAsyncErrors(async (req, res, next) => {
  try {
    if (req.user.role !== "Patient") {
      return res.status(403).json({ message: "Access denied. Only patients can view doctors." });
    }

    const doctors = await User.find({ role: "Doctor" });

    if (!doctors.length) {
      return res.status(404).json({ message: "No doctors found." });
    }

    res.status(200).json({
      success: true,
      doctors,
    });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return res.status(500).json({ message: "Error fetching doctors", error });
  }
});*/

// Function to retrieve the list of doctors with their planning
export const getDoctors = catchAsyncErrors(async (req, res, next) => {
  try {
    if (req.user.role !== "Patient") {
      return res.status(403).json({ message: "Access denied. Only patients can view doctors." });
    }

    const doctors = await User.find({ role: "Doctor" });

    if (!doctors.length) {
      return res.status(404).json({ message: "No doctors found." });
    }

    // Prepare an array to hold the detailed doctor information
    const doctorsWithPlanning = await Promise.all(doctors.map(async (doctor) => {
      // Get the appointments for each doctor
      const appointments = await Appointment.find({ doctor: doctor._id });

      return {
        ...doctor.toObject(), // Convert to plain object and spread the doctor details
        appointments: appointments, // Extract appointment dates
        unavailableDays: doctor.unavailableDays || [], // Include unavailable days
      };
    }));

    res.status(200).json({
      success: true,
      doctors: doctorsWithPlanning,
    });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return res.status(500).json({ message: "Error fetching doctors", error });
  }
});







// Obtenir le planning complet du médecin (rendez-vous + jours non disponibles)
export const getDoctorOwnPlanning = catchAsyncErrors(async (req, res, next) => {
  const doctorId = req.user._id;

  // Vérifier si l'utilisateur est bien un médecin
  const doctor = await User.findById(doctorId);
  if (doctor.role !== "Doctor") {
    return res.status(403).json({ message: "Access denied. Only doctors can access their own planning." });
  }

  // Récupérer les rendez-vous du médecin
  const appointments = await Appointment.find({ doctor: doctorId });

  // Récupérer les jours non disponibles du médecin
  const unavailableDays = doctor.unavailableDays;

  res.status(200).json({
    success: true,
    appointments,
    unavailableDays,
  });
});
// Obtenir le planning d'un médecin spécifique pour les patients
export const getDoctorPlanningForPatients = catchAsyncErrors(async (req, res, next) => {
  const { doctorId } = req.params;

  const doctor = await User.findById(doctorId);
  if (!doctor || doctor.role !== "Doctor") {
    return res.status(404).json({ message: "Doctor not found." });
  }

  // Récupérer les rendez-vous du médecin
  const appointments = await Appointment.find({ doctor: doctorId });

  // Récupérer les jours non disponibles du médecin
  const unavailableDays = doctor.unavailableDays;

  res.status(200).json({
    success: true,
    appointments,
    unavailableDays,
  });
});



/*Récupérer le planning d'un médecin
export const getDoctorSchedule = catchAsyncErrors(async (req, res) => {
  const doctorId = req.params.id;

  try {
    // Récupérer le médecin avec ses jours non disponibles
    const doctor = await User.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found." });
    }

    // Récupérer les rendez-vous réservés du médecin
    const appointments = await Appointment.find({ doctor: doctorId }).select('date');

    // Formater la réponse
    const schedule = {
      unavailableDays: doctor.unavailableDays || [],
      appointments: appointments.map(appointment => appointment.date),
    };

    res.status(200).json(schedule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});*/
export const addUnavailableDay = catchAsyncErrors(async (req, res, next) => {
  const { date,  reason } = req.body;

 
  const doctor = await User.findById(req.user._id);
  if (!doctor || doctor.role !== "Doctor") {
    return next(new ErrorHandler("Accès interdit.", 403));
  }


  // Ajouter le jour non disponible
  doctor.unavailableDays.push({ date,  reason });
  await doctor.save();

  return res.status(200).json({ message: "Jour non disponible ajouté avec succès.", unavailableDays: doctor.unavailableDays });
});

export const getDoctorUnavailableDays = catchAsyncErrors(async (req, res, next) => {
  const doctorId = req.user._id;

  // Vérifier si l'utilisateur est bien un médecin
  const doctor = await User.findById(doctorId);
  if (!doctor || doctor.role !== "Doctor") {
    return res.status(403).json({ message: "Access denied. Only doctors can access their own unavailable days." });
  }

  // Récupérer les jours non disponibles du médecin
  const unavailableDays = doctor.unavailableDays;

  res.status(200).json({
    success: true,
    unavailableDays,
  });
});
export const deleteUnavailableDay = async (req, res) => {
  const { dayId } = req.params;
  const userId = req.user._id; // Assurez-vous d'avoir le bon utilisateur connecté

  try {
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).send("Utilisateur non trouvé.");
      }

      // Supprimez le jour non disponible
      user.unavailableDays = user.unavailableDays.filter(day => day._id.toString() !== dayId);
      await user.save();

      res.status(200).send("Jour non disponible supprimé avec succès.");
  } catch (error) {
      console.error("Erreur lors de la suppression du jour non disponible :", error);
      res.status(500).send("Erreur lors de la suppression du jour non disponible.");
  }
};



